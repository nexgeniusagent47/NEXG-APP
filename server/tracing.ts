// server/tracing.ts
// A ~200-line in-process tracer.
//
// WHY not OpenTelemetry: the OTel SDK plus an exporter is several megabytes and a
// batch of background machinery to run in the same process that serves the SPA.
// This deployment is one process with one data source; what it needs is a
// traceId that appears on the request line AND on the DB line, plus enough recent
// spans to answer "why was that request slow". Spans are emitted as structured
// logs (so they land in whatever collects logs) and kept in a bounded ring buffer
// for /api/traces (so a human can read them without a collector).
//
// WHY bounded: an unbounded span buffer is a memory leak that only shows up in
// production, which is where it hurts most. The oldest span is dropped instead.

import { AsyncLocalStorage } from 'node:async_hooks';
import { randomBytes } from 'node:crypto';
import { logger, runWithLogContext } from './logger.ts';

export type SpanStatus = 'unset' | 'ok' | 'error';

export type SpanAttributes = Record<string, unknown>;

export interface SpanContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
}

export interface SpanRecord extends SpanContext {
  name: string;
  service: string;
  startedAt: string;
  durationMs: number;
  status: SpanStatus;
  attributes: SpanAttributes;
  error?: string;
}

const SERVICE_NAME = process.env.SERVICE_NAME ?? 'nexg-concierge-api';

/** 16 bytes / 8 bytes, the W3C trace-context widths. */
export function newTraceId(): string {
  return randomBytes(16).toString('hex');
}

export function newSpanId(): string {
  return randomBytes(8).toString('hex');
}

const TRACE_ID_RE = /^[0-9a-f]{32}$/;
const SPAN_ID_RE = /^[0-9a-f]{16}$/;
const TRACEPARENT_RE = /^([0-9a-f]{2})-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/i;

export function isValidTraceId(value: unknown): value is string {
  // The all-zero id is explicitly invalid in W3C trace-context; accepting it would
  // merge every such request into one trace.
  return typeof value === 'string' && TRACE_ID_RE.test(value) && value !== '0'.repeat(32);
}

export function isValidSpanId(value: unknown): value is string {
  return typeof value === 'string' && SPAN_ID_RE.test(value) && value !== '0'.repeat(16);
}

/**
 * Parse a W3C `traceparent`, ignoring anything malformed.
 *
 * A caller-supplied trace id is adopted rather than re-generated so a trace spans
 * this service and whatever called it. `version` other than 00 is rejected
 * because the field layout past 00 is not defined for us to trust.
 */
export function parseTraceparent(header: string | undefined | null): SpanContext | null {
  if (!header) return null;
  const match = TRACEPARENT_RE.exec(header.trim());
  if (!match) return null;
  const [, version, traceId, parentSpanId] = match;
  if (version !== '00') return null;
  if (!isValidTraceId(traceId) || !isValidSpanId(parentSpanId)) return null;
  return { traceId: traceId.toLowerCase(), spanId: newSpanId(), parentSpanId };
}

export function formatTraceparent(traceId: string, spanId: string, sampled = true): string {
  return `00-${traceId}-${spanId}-${sampled ? '01' : '00'}`;
}

const SPAN_BUFFER_MAX = Number(process.env.TRACE_BUFFER_SIZE ?? 250) || 250;
const spanBuffer: SpanRecord[] = [];

function remember(record: SpanRecord): void {
  spanBuffer.push(record);
  if (spanBuffer.length > SPAN_BUFFER_MAX) spanBuffer.splice(0, spanBuffer.length - SPAN_BUFFER_MAX);
}

/** Newest first, copies so a reader cannot mutate buffered state. */
export function recentSpans(limit = 50): SpanRecord[] {
  const size = Math.max(0, Math.min(limit, spanBuffer.length));
  return spanBuffer
    .slice(spanBuffer.length - size)
    .reverse()
    .map((span) => ({ ...span, attributes: { ...span.attributes } }));
}

export function clearSpans(): void {
  spanBuffer.length = 0;
}

export class Span {
  readonly traceId: string;
  readonly spanId: string;
  readonly parentSpanId?: string;
  readonly name: string;
  readonly attributes: SpanAttributes;
  readonly startedAt: Date;
  private readonly startMark: number;
  private ended = false;
  private record?: SpanRecord;
  private status: SpanStatus = 'unset';
  private error?: string;

  constructor(name: string, attributes: SpanAttributes = {}, context?: Partial<SpanContext>) {
    this.name = name;
    this.traceId = context?.traceId ?? newTraceId();
    this.spanId = newSpanId();
    this.parentSpanId = context?.parentSpanId;
    this.attributes = { ...attributes };
    this.startedAt = new Date();
    this.startMark = performance.now();
  }

  setAttribute(key: string, value: unknown): this {
    if (this.ended) return this;
    this.attributes[key] = value;
    return this;
  }

  setAttributes(attributes: SpanAttributes): this {
    for (const [key, value] of Object.entries(attributes)) this.setAttribute(key, value);
    return this;
  }

  /** A child inherits the trace and this span as its parent. */
  child(name: string, attributes: SpanAttributes = {}): Span {
    return startSpan(name, attributes, { traceId: this.traceId, parentSpanId: this.spanId });
  }

  setStatus(status: Exclude<SpanStatus, 'unset'>, error?: unknown): this {
    if (this.ended) return this;
    this.status = status;
    // The first failure is the informative one; later frames only add retry noise.
    if (status === 'error' && this.error === undefined && error !== undefined) {
      this.error = error instanceof Error ? error.message : String(error);
    }
    return this;
  }

  end(attributes?: SpanAttributes): SpanRecord {
    if (attributes) this.setAttributes(attributes);
    if (!this.ended) {
      this.ended = true;
      const record: SpanRecord = {
        traceId: this.traceId,
        spanId: this.spanId,
        parentSpanId: this.parentSpanId,
        name: this.name,
        service: SERVICE_NAME,
        startedAt: this.startedAt.toISOString(),
        durationMs: Math.round((performance.now() - this.startMark) * 100) / 100,
        status: this.status,
        attributes: { ...this.attributes },
      };
      if (this.error !== undefined) record.error = this.error;
      this.record = record;
      finish(record);
    }
    // Ending twice returns the first result: a double `end()` in a cleanup path
    // must not produce a second, zero-duration span that looks like real traffic.
    return this.record as SpanRecord;
  }
}

function finish(record: SpanRecord): void {
  remember(record);
  // Failed spans log at warn so they survive a production LOG_LEVEL=info; a
  // healthy span is debug, because one line per DB query at info level would bury
  // the request line it belongs to.
  const spanLogger = logger.child({
    traceId: record.traceId,
    spanId: record.spanId,
    ...(record.parentSpanId ? { parentSpanId: record.parentSpanId } : {}),
  });
  const fields = {
    span: record.name,
    durationMs: record.durationMs,
    // Named `spanStatus` rather than `status`: `status` on a log line is the HTTP
    // status code, and one field must not mean two things.
    spanStatus: record.status,
    ...(record.error ? { error: record.error } : {}),
    attributes: record.attributes,
  };
  if (record.status === 'error') spanLogger.warn('span', fields);
  else spanLogger.debug('span', fields);
}

const spanStore = new AsyncLocalStorage<Span>();

export function currentSpan(): Span | undefined {
  return spanStore.getStore();
}

export function currentTraceId(): string | undefined {
  return spanStore.getStore()?.traceId;
}

export function currentSpanId(): string | undefined {
  return spanStore.getStore()?.spanId;
}

/**
 * Make `span` current for the duration of `fn` without ending it.
 *
 * The HTTP middleware needs this: it starts the request span, hands control to
 * Express, and only ends the span when the response finishes — long after `next()`
 * returned synchronously.
 */
export function runWithSpan<T>(span: Span, fn: () => T): T {
  return spanStore.run(span, fn);
}

/**
 * Start a span. Without an explicit context it nests under the span that is
 * currently running, which is what makes "HTTP request" -> "DB query" a tree
 * without passing anything between the two.
 */
export function startSpan(
  name: string,
  attributes: SpanAttributes = {},
  context?: Partial<SpanContext>
): Span {
  const parent = spanStore.getStore();
  return new Span(name, attributes, {
    traceId: context?.traceId ?? parent?.traceId,
    parentSpanId: context?.parentSpanId ?? parent?.spanId,
  });
}

/**
 * Run `fn` inside a span and end it with the outcome.
 *
 * The span is current for everything `fn` awaits, so a repository function that
 * starts its own spans nests correctly with no signature change — and the log
 * context gains `spanId`, so a log line emitted inside a span can be tied to it.
 */
export async function withSpan<T>(
  name: string,
  attributes: SpanAttributes,
  fn: (span: Span) => T | Promise<T>
): Promise<T> {
  const span = startSpan(name, attributes);
  return spanStore.run(span, async () => {
    try {
      const result = await runWithLogContext({ spanId: span.spanId, traceId: span.traceId }, () =>
        fn(span)
      );
      span.setStatus('ok');
      return result;
    } catch (error) {
      span.setStatus('error', error);
      throw error;
    } finally {
      span.end();
    }
  });
}

/** Synchronous variant, for the JSON fallback reader where nothing awaits. */
export function withSpanSync<T>(name: string, attributes: SpanAttributes, fn: (span: Span) => T): T {
  const span = startSpan(name, attributes);
  return spanStore.run(span, () => {
    try {
      const result = fn(span);
      span.setStatus('ok');
      return result;
    } catch (error) {
      span.setStatus('error', error);
      throw error;
    } finally {
      span.end();
    }
  });
}
