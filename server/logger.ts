// server/logger.ts
// The one place a log line is produced.
//
// WHY hand-rolled instead of pino/winston: the operational requirement is JSON on
// stdout plus request-scoped bindings, which is a few dozen lines. A logging
// dependency would add its own redaction allow-list, its own serializers and a
// second way to write a line, and this app has exactly one process and one stream
// to keep ordered.
//
// WHY AsyncLocalStorage rather than a logger argument: the correlation ids are
// decided by the HTTP middleware but needed by the repository layer two calls
// down. Threading a logger through every function would change signatures that
// have nothing to do with logging, and a missed parameter fails silently — an
// async context cannot be forgotten at a call site.
//
// WHY everything goes to stdout, including errors: a split stdout/stderr stream
// reorders unrelated lines when both are collected, so a stack trace and the
// request line that caused it can arrive in either order. One stream, one line
// per event, is what makes the sequence readable.

import { AsyncLocalStorage } from 'node:async_hooks';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_WEIGHT: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function parseLevel(raw: string | undefined): LogLevel {
  const candidate = (raw ?? '').trim().toLowerCase();
  if (candidate === 'debug' || candidate === 'info' || candidate === 'warn' || candidate === 'error') {
    return candidate;
  }
  // Development defaults to debug so a contributor sees spans and fallback paths
  // without setting anything; production defaults to info, because debug logs on
  // a busy instance cost more in storage than they return in signal.
  return IS_PRODUCTION ? 'info' : 'debug';
}

let threshold = LEVEL_WEIGHT[parseLevel(process.env.LOG_LEVEL)];

export function setLogLevel(level: LogLevel): void {
  threshold = LEVEL_WEIGHT[level];
}

export function getLogLevel(): LogLevel {
  return (Object.keys(LEVEL_WEIGHT) as LogLevel[]).find((l) => LEVEL_WEIGHT[l] === threshold) ?? 'info';
}

/**
 * The fields a request-scoped logger carries.
 *
 * `requestId` and `traceId` are the two correlation axes: requestId is per HTTP
 * request, traceId is shared by every span of one logical operation, including
 * spans that outlive the request that started them.
 */
export interface LogBindings {
  requestId?: string;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  method?: string;
  path?: string;
  route?: string;
  status?: number;
  durationMs?: number;
  userId?: string;
  sessionId?: string;
  [key: string]: unknown;
}

const REDACTED = '[redacted]';

/**
 * Key names whose value never reaches the log, at any depth.
 *
 * Matched on a normalised key (case, dashes and underscores removed) with suffix
 * rules, because the same secret arrives as `authorization`, `Authorization`,
 * `x-api-key`, `access_token` or `dbPassword` depending on which layer produced
 * it. A fixed list of five spellings would have to be extended every time an
 * integration is added; the suffix rule holds for names nobody has written yet.
 */
const SECRET_KEYS = new Set([
  'authorization',
  'proxyauthorization',
  'cookie',
  'setcookie',
  'password',
  'passwd',
  'token',
  'secret',
  'apikey',
  'privatekey',
  'sessionsecret',
  'creditcard',
  'cardnumber',
  'cvv',
]);

function isSecretKey(key: string): boolean {
  const k = key.toLowerCase().replace(/[^a-z0-9]/g, '');
  return (
    SECRET_KEYS.has(k) ||
    k.endsWith('token') ||
    k.endsWith('password') ||
    k.endsWith('secret') ||
    k.endsWith('apikey')
  );
}

const MAX_DEPTH = 6;
const MAX_STRING = 2000;
const MAX_ARRAY = 50;
const MAX_KEYS = 60;

/** A single 5 MB log line is worse than no log line: it is dropped by the shipper. */
function truncate(value: string): string {
  if (value.length <= MAX_STRING) return value;
  return `${value.slice(0, MAX_STRING)}…(+${value.length - MAX_STRING} chars)`;
}

function sanitizeError(error: Error, depth: number, seen: WeakSet<object>): Record<string, unknown> {
  const out: Record<string, unknown> = {
    name: error.name,
    message: truncate(error.message),
  };
  const code = (error as any).code;
  if (code !== undefined) out.code = sanitizeValue(code, depth + 1, seen);
  // Six frames is enough to locate the throw site; the full stack of a
  // recursively-wrapped error is mostly framework frames.
  if (error.stack) out.stack = truncate(error.stack.split('\n').slice(0, 8).join('\n'));
  const cause = (error as any).cause;
  if (cause !== undefined && depth < MAX_DEPTH) out.cause = sanitizeValue(cause, depth + 1, seen);
  return out;
}

/** Recursive, cycle-safe, secret-aware conversion to JSON-safe values. */
function sanitizeValue(value: unknown, depth: number, seen: WeakSet<object>): unknown {
  if (value === null || value === undefined) return value;

  switch (typeof value) {
    case 'string':
      return truncate(value);
    case 'number':
      return Number.isFinite(value) ? value : String(value);
    case 'boolean':
      return value;
    case 'bigint':
      return String(value);
    case 'function':
      return '[function]';
    case 'symbol':
      return String(value);
    default:
      break;
  }

  const object = value as object;

  if (object instanceof Date) return object.toISOString();
  if (object instanceof Error) return sanitizeError(object, depth, seen);
  if (ArrayBuffer.isView(object) || object instanceof ArrayBuffer) {
    return `[binary ${(object as any).byteLength ?? 0} bytes]`;
  }
  if (depth >= MAX_DEPTH) return '[depth limit]';
  if (seen.has(object)) return '[circular]';
  seen.add(object);

  if (Array.isArray(object)) {
    const items = object.slice(0, MAX_ARRAY).map((v) => sanitizeValue(v, depth + 1, seen));
    if (object.length > MAX_ARRAY) items.push(`…(+${object.length - MAX_ARRAY} items)`);
    return items;
  }

  if (object instanceof Map) {
    const out: Record<string, unknown> = {};
    let n = 0;
    for (const [k, v] of object) {
      if (n++ >= MAX_KEYS) break;
      const key = String(k);
      out[key] = isSecretKey(key) ? REDACTED : sanitizeValue(v, depth + 1, seen);
    }
    return out;
  }

  if (object instanceof Set) {
    return Array.from(object)
      .slice(0, MAX_ARRAY)
      .map((v) => sanitizeValue(v, depth + 1, seen));
  }

  const out: Record<string, unknown> = {};
  const entries = Object.entries(object as Record<string, unknown>);
  for (const [key, v] of entries.slice(0, MAX_KEYS)) {
    out[key] = isSecretKey(key) ? REDACTED : sanitizeValue(v, depth + 1, seen);
  }
  if (entries.length > MAX_KEYS) out['…'] = `+${entries.length - MAX_KEYS} keys`;
  return out;
}

/** Exported so a caller can assert what a payload will look like before logging it. */
export function redact(value: unknown): unknown {
  return sanitizeValue(value, 0, new WeakSet());
}

const contextStore = new AsyncLocalStorage<LogBindings>();

/**
 * Run `fn` with bindings visible to every logger call inside it, including calls
 * that cross an `await`. Nested calls merge, so a span can add `spanId` without
 * dropping the request's `requestId`.
 */
export function runWithLogContext<T>(bindings: LogBindings, fn: () => T): T {
  return contextStore.run({ ...contextStore.getStore(), ...bindings }, fn);
}

export function getLogContext(): LogBindings | undefined {
  return contextStore.getStore();
}

// Reserved so a stray field named `level` cannot produce a line whose severity
// disagrees with the level it was emitted at.
const RESERVED = new Set(['timestamp', 'level', 'msg', 'message']);

export class Logger {
  constructor(private readonly bindings: LogBindings = {}) {}

  /** A logger that always carries `bindings`, without mutating this one. */
  child(bindings: LogBindings): Logger {
    return new Logger({ ...this.bindings, ...bindings });
  }

  debug(message: string, fields?: LogBindings): void {
    this.emit('debug', message, fields);
  }

  info(message: string, fields?: LogBindings): void {
    this.emit('info', message, fields);
  }

  warn(message: string, fields?: LogBindings): void {
    this.emit('warn', message, fields);
  }

  error(message: string, fields?: LogBindings): void {
    this.emit('error', message, fields);
  }

  private emit(level: LogLevel, message: string, fields?: LogBindings): void {
    if (LEVEL_WEIGHT[level] < threshold) return;

    // Precedence: explicit call-site fields beat the logger's own bindings, which
    // beat the ambient context. The narrowest scope knows the most.
    const merged = sanitizeValue(
      { ...contextStore.getStore(), ...this.bindings, ...(fields ?? {}) },
      0,
      new WeakSet()
    ) as Record<string, unknown>;

    const entry: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level,
      msg: message,
    };
    for (const [key, value] of Object.entries(merged)) {
      if (RESERVED.has(key) || value === undefined) continue;
      entry[key] = value;
    }

    const line = IS_PRODUCTION ? JSON.stringify(entry) : formatHuman(entry);
    // One write per line: a line assembled from several writes can interleave with
    // another request's line under concurrency.
    process.stdout.write(`${line}\n`);
  }
}

const PRIMARY_FIELDS = [
  'requestId',
  'traceId',
  'spanId',
  'parentSpanId',
  'method',
  'route',
  'path',
  'status',
  'durationMs',
  'userId',
  'sessionId',
];

const LEVEL_COLOUR: Record<LogLevel, string> = {
  debug: '\u001b[2m',
  info: '\u001b[36m',
  warn: '\u001b[33m',
  error: '\u001b[31m',
};

function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    return /[\s"=]/.test(value) ? JSON.stringify(value) : value;
  }
  return value === null ? 'null' : JSON.stringify(value);
}

/**
 * Development rendering.
 *
 * Correlation ids first because they are what a human greps for, then the HTTP
 * summary, then application fields — the order a person reads a line in when
 * something is broken.
 */
function formatHuman(entry: Record<string, unknown>): string {
  const { timestamp, level, msg } = entry as { timestamp: string; level: LogLevel; msg: string };
  const rest = { ...entry };
  delete rest.timestamp;
  delete rest.level;
  delete rest.msg;

  const parts: string[] = [];
  const push = (key: string) => {
    if (rest[key] === undefined) return;
    parts.push(`${key}=${formatValue(rest[key])}`);
    delete rest[key];
  };
  for (const key of PRIMARY_FIELDS) push(key);
  for (const key of Object.keys(rest)) push(key);

  const colour = process.stdout.isTTY ? LEVEL_COLOUR[level] : '';
  const reset = process.stdout.isTTY ? '\u001b[0m' : '';
  const label = level.toUpperCase().padEnd(5);
  const suffix = parts.length ? `  ${parts.join(' ')}` : '';
  return `\u001b[2m${timestamp}\u001b[0m ${colour}${label}${reset} ${msg}${suffix}`;
}

/** The process-wide logger. Request-scoped loggers come from `.child()`. */
export const logger = new Logger();
