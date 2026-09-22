// server/observability.ts
// Request logging, correlation ids, metrics and the two dev-facing read
// endpoints (/api/metrics, /api/traces) plus client-telemetry ingestion
// (/api/telemetry).
//
// Integration is three lines in server/index.ts; see
// docs/OBSERVABILITY-INTEGRATION.md for the exact snippet. Nothing in this file
// touches an existing route or its response, so the API contract is unchanged.
//
// WHY metrics are JSON by default: the in-repo dashboard reads them straight from
// the browser, and a Prometheus text payload would need a parser on the client to
// render one bar chart. `?format=prometheus` serves the same snapshot as the
// text exposition format for a real scrape, so both consumers are served from one
// accounting path — the numbers cannot disagree between the two.
//
// WHY the aggregates are bounded: this is a dev-facing endpoint inside the API
// process, so every buffer here is a fixed-size window (routes capped, latency
// samples capped, client events capped). An unbounded counter map keyed by path
// is a memory leak with a remote trigger: any caller can mint new keys.

import { randomUUID } from 'node:crypto';
import type { Express, NextFunction, Request, Response } from 'express';

import { getDbUnavailableReason, isDbReady } from './db.ts';
import { logger, runWithLogContext, type LogBindings } from './logger.ts';
import {
  formatTraceparent,
  newTraceId,
  parseTraceparent,
  recentSpans,
  runWithSpan,
  startSpan,
  isValidTraceId,
} from './tracing.ts';

// --------------------------------------------------------------------- state

const processStartedAt = Date.now();

/** Prometheus-style cumulative buckets, in milliseconds. */
const DURATION_BUCKETS_MS = [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
const LATENCY_WINDOW = 2048;
const ROUTE_SAMPLE_WINDOW = 256;
const REQUESTS_PER_MINUTE_WINDOW_MS = 60_000;
const MAX_TRACKED_ROUTES = 64;
const CLIENT_EVENT_WINDOW = 200;
const MAX_EVENTS_PER_BATCH = 50;
const MAX_PROPS_KEYS = 20;
const MAX_STRING_LENGTH = 120;

interface RouteStat {
  method: string;
  route: string;
  count: number;
  errors: number;
  clientErrors: number;
  aborted: number;
  totalMs: number;
  maxMs: number;
  samples: number[];
}

const routeStats = new Map<string, RouteStat>();
const statusCounts = new Map<number, number>();
const latencySamples: number[] = [];
const durationBuckets = new Array<number>(DURATION_BUCKETS_MS.length).fill(0);
const requestTimes: number[] = [];

let totalRequests = 0;
let totalErrors = 0;
let totalClientErrors = 0;
let totalAborted = 0;
let inFlight = 0;
let durationSumMs = 0;
let durationMaxMs = 0;
let fallbackReads = 0;

export interface ClientEvent {
  name: string;
  ts: string;
  receivedAt: string;
  sessionId?: string;
  page?: string;
  requestId?: string;
  props?: Record<string, unknown>;
}

const clientEvents: ClientEvent[] = [];
const clientSessions = new Map<string, number>();
const clientVitals = new Map<string, { value: number; at: string; event: string }>();
let clientEventsReceived = 0;
let clientEventsDropped = 0;

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function percentile(sortedAscending: number[], p: number): number {
  if (sortedAscending.length === 0) return 0;
  const index = (sortedAscending.length - 1) * p;
  const low = Math.floor(index);
  const high = Math.ceil(index);
  if (low === high) return round(sortedAscending[low]);
  const interpolated =
    sortedAscending[low] + (sortedAscending[high] - sortedAscending[low]) * (index - low);
  return round(interpolated);
}

function recordDuration(route: RouteStat, durationMs: number): void {
  totalRequests += 1;
  durationSumMs += durationMs;
  durationMaxMs = Math.max(durationMaxMs, durationMs);

  for (let i = 0; i < DURATION_BUCKETS_MS.length; i++) {
    if (durationMs <= DURATION_BUCKETS_MS[i]) durationBuckets[i] += 1;
  }

  latencySamples.push(durationMs);
  if (latencySamples.length > LATENCY_WINDOW) {
    latencySamples.splice(0, latencySamples.length - LATENCY_WINDOW);
  }

  route.count += 1;
  route.totalMs += durationMs;
  route.maxMs = Math.max(route.maxMs, durationMs);
  route.samples.push(durationMs);
  if (route.samples.length > ROUTE_SAMPLE_WINDOW) {
    route.samples.splice(0, route.samples.length - ROUTE_SAMPLE_WINDOW);
  }

  const now = Date.now();
  requestTimes.push(now);
  const cutoff = now - REQUESTS_PER_MINUTE_WINDOW_MS;
  while (requestTimes.length > 0 && requestTimes[0] < cutoff) requestTimes.shift();
}

/**
 * The metric key for a request.
 *
 * Matched routes use the ROUTE PATTERN (`/api/merchants/:id`), never the concrete
 * path: `/api/merchants/<uuid>` per merchant would add one time series per
 * record. The fallbacks below are the same reasoning applied to the two cases
 * with no pattern — an unknown /api path keeps one segment of signal, and static
 * assets collapse into a single bucket.
 */
function routeLabel(req: Request): string {
  const pattern = (req as any).route?.path as string | undefined;
  if (typeof pattern === 'string' && pattern.length > 0) {
    return `${req.baseUrl ?? ''}${pattern}`;
  }
  const path = req.path ?? '/';
  if (path.startsWith('/api/')) {
    const segment = path.split('/')[2] ?? '';
    return segment ? `/api/${segment}/*` : '/api/*';
  }
  return '<static-or-spa>';
}

function routeStatFor(method: string, route: string): RouteStat {
  const key = `${method} ${route}`;
  let stat = routeStats.get(key);
  if (!stat) {
    if (routeStats.size >= MAX_TRACKED_ROUTES) {
      // Bounded cardinality beats completeness on an in-process dev surface.
      stat = routeStats.get(`${method} other`) ?? {
        method,
        route: 'other',
        count: 0,
        errors: 0,
        clientErrors: 0,
        aborted: 0,
        totalMs: 0,
        maxMs: 0,
        samples: [],
      };
      routeStats.set(`${method} other`, stat);
      return stat;
    }
    stat = {
      method,
      route,
      count: 0,
      errors: 0,
      clientErrors: 0,
      aborted: 0,
      totalMs: 0,
      maxMs: 0,
      samples: [],
    };
    routeStats.set(key, stat);
  }
  return stat;
}

// --------------------------------------------------------------- identifiers

/** Correlation ids accept only a narrow alphabet: they end up in logs and headers. */
function sanitizeCorrelationId(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!/^[A-Za-z0-9._:-]{1,128}$/.test(trimmed)) return null;
  return trimmed;
}

function resolveUserId(req: Request, res: Response): string | undefined {
  // Deliberately NOT read from a request header: a client-supplied identity in a
  // log line is an attribution the server cannot verify. Set `res.locals.userId`
  // (or `req.user.id`) from whatever authenticates the request.
  const fromLocals = (res.locals as Record<string, unknown>)?.userId;
  if (typeof fromLocals === 'string' && fromLocals) return fromLocals;
  const fromRequest = (req as any).user?.id;
  return typeof fromRequest === 'string' && fromRequest ? fromRequest : undefined;
}

// ------------------------------------------------------------------ middleware

export interface ObservabilityOptions {
  /** Prefix for app-owned routes whose logs should never be filtered as assets. */
  apiPrefix?: string;
}

/**
 * One line per request at completion, plus a root span, plus the counters
 * /api/metrics reports.
 *
 * Mount BEFORE the routes so a request that never matches one is still timed,
 * counted and correlated.
 */
export function observabilityMiddleware(options: ObservabilityOptions = {}) {
  const apiPrefix = options.apiPrefix ?? '/api/';

  return function observability(req: Request, res: Response, next: NextFunction): void {
    const startMark = performance.now();
    const path = (req.originalUrl ?? req.url ?? '').split('?')[0];

    const inboundTrace = parseTraceparent(req.headers.traceparent as string | undefined);
    const inboundRequestId = sanitizeCorrelationId(req.headers['x-request-id']);
    // A caller that already speaks W3C keeps its trace id; a caller that only has
    // a request id reuses it as the trace id when it is the right shape, so one
    // header is enough to correlate both.
    const requestId = inboundRequestId ?? randomUUID();
    const traceId =
      inboundTrace?.traceId ?? (isValidTraceId(requestId) ? requestId : newTraceId());

    const span = startSpan(
      'http.request',
      {
        'http.method': req.method,
        'http.target': path,
        'http.user_agent': (req.headers['user-agent'] as string | undefined) ?? undefined,
      },
      { traceId, parentSpanId: inboundTrace?.parentSpanId }
    );

    res.setHeader('x-request-id', requestId);
    res.setHeader('traceparent', formatTraceparent(traceId, span.spanId));
    span.setAttribute('http.request_id', requestId);

    inFlight += 1;

    const baseBindings: LogBindings = {
      requestId,
      traceId,
      spanId: span.spanId,
      method: req.method,
      path,
    };
    const requestLogger = logger.child(baseBindings);

    let settled = false;

    const finalise = (outcome: 'completed' | 'aborted'): void => {
      if (settled) return;
      settled = true;
      inFlight = Math.max(0, inFlight - 1);

      const durationMs = round(performance.now() - startMark);
      const status = res.statusCode;
      const route = routeLabel(req);
      const stat = routeStatFor(req.method, route);
      const sessionId = sanitizeCorrelationId(req.headers['x-session-id']) ?? undefined;
      const userId = resolveUserId(req, res);

      recordDuration(stat, durationMs);
      statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);

      if (outcome === 'aborted') {
        totalAborted += 1;
        stat.aborted += 1;
        // A client that hung up is not a server failure: it is control flow, and
        // counting it as an error would put a permanent floor under the error rate.
        span.setAttribute('http.aborted', true);
        span.setStatus('ok');
      } else if (status >= 500) {
        totalErrors += 1;
        stat.errors += 1;
        span.setStatus('error', `HTTP ${status}`);
      } else {
        if (status >= 400) {
          totalClientErrors += 1;
          stat.clientErrors += 1;
        }
        span.setStatus('ok');
      }

      span.setAttributes({
        'http.status_code': status,
        'http.route': route,
        'http.outcome': outcome,
        ...(sessionId ? { 'session.id': sessionId } : {}),
        ...(userId ? { 'enduser.id': userId } : {}),
      });
      span.end();

      const fields: LogBindings = {
        ...baseBindings,
        route,
        status,
        durationMs,
        outcome,
        ...(sessionId ? { sessionId } : {}),
        ...(userId ? { userId } : {}),
      };

      // Static assets and the SPA catch-all are one bucket and thousands of lines
      // on a real deployment; they keep the same fields but at debug, so
      // LOG_LEVEL=debug still shows every request.
      if (route === '<static-or-spa>' || !path.startsWith(apiPrefix)) {
        requestLogger.debug('request completed', fields);
      } else {
        requestLogger.info('request completed', fields);
      }
    };

    res.on('finish', () => finalise('completed'));
    res.on('close', () => {
      if (!res.writableEnded) finalise('aborted');
    });

    // The span stays current for everything downstream — that is what makes the DB
    // span a child of this request without either layer importing the other.
    runWithLogContext(baseBindings, () => runWithSpan(span, next));
  };
}

/**
 * Wrap the seeded-JSON read path.
 *
 * The fallback is a first-class serving mode in this app (it is what /api/health
 * reports when Postgres is absent), so it gets a span and a counter of its own
 * rather than being invisible next to the Postgres path.
 */
export async function withFallbackSpan<T>(label: string, read: () => T | Promise<T>): Promise<T> {
  fallbackReads += 1;
  const span = startSpan(`fallback.${label}`, { 'data.source': 'seeded_json_fallback' });
  try {
    const result = await read();
    span.setStatus('ok');
    return result;
  } catch (error) {
    span.setStatus('error', error);
    throw error;
  } finally {
    span.end();
  }
}

// ------------------------------------------------------------------- snapshot

export interface MetricsSnapshot {
  generatedAt: string;
  service: string;
  uptimeSeconds: number;
  requests: {
    total: number;
    inFlight: number;
    perMinute: number;
    perMinuteLifetime: number;
    errors: number;
    clientErrors: number;
    aborted: number;
    errorRate: number;
  };
  latencyMs: {
    p50: number;
    p95: number;
    p99: number;
    max: number;
    avg: number;
    samples: number;
    buckets: Array<{ le: number | '+Inf'; count: number }>;
  };
  statuses: Array<{ status: number; count: number }>;
  routes: Array<{
    method: string;
    route: string;
    count: number;
    errors: number;
    clientErrors: number;
    aborted: number;
    avgMs: number;
    p95Ms: number;
    maxMs: number;
  }>;
  process: {
    rssBytes: number;
    heapUsedBytes: number;
    heapTotalBytes: number;
    externalBytes: number;
    nodeVersion: string;
    pid: number;
  };
  db: {
    connected: boolean;
    configured: boolean;
    reason: string | null;
    fallbackReads: number;
  };
  client: {
    sessions: number;
    eventsReceived: number;
    eventsDropped: number;
    vitals: Record<string, { value: number; at: string }>;
    recentEvents: ClientEvent[];
  };
  traces: {
    buffered: number;
    recent: ReturnType<typeof recentSpans>;
  };
}

/**
 * Postgres error strings can embed the connection URL or a driver parameter line.
 * The reason is useful ("DATABASE_URL not set" vs "ECONNREFUSED"), so it is
 * scrubbed rather than dropped — and the env VALUE is never echoed either way.
 */
function safeDbReason(): string | null {
  const reason = getDbUnavailableReason();
  if (!reason) return null;
  return reason
    .replace(/\/\/[^@\s/]*@/g, '//[redacted]@')
    .replace(/(password|pwd)=\S+/gi, '$1=[redacted]')
    .slice(0, 200);
}

export function metricsSnapshot(): MetricsSnapshot {
  const sorted = [...latencySamples].sort((a, b) => a - b);
  const uptimeSeconds = (Date.now() - processStartedAt) / 1000;
  const memory = process.memoryUsage();
  const now = Date.now();
  const perMinute = requestTimes.filter((t) => t >= now - REQUESTS_PER_MINUTE_WINDOW_MS).length;

  const routes = [...routeStats.values()]
    .map((stat) => {
      const routeSorted = [...stat.samples].sort((a, b) => a - b);
      return {
        method: stat.method,
        route: stat.route,
        count: stat.count,
        errors: stat.errors,
        clientErrors: stat.clientErrors,
        aborted: stat.aborted,
        avgMs: stat.count ? round(stat.totalMs / stat.count) : 0,
        p95Ms: percentile(routeSorted, 0.95),
        maxMs: round(stat.maxMs),
      };
    })
    // Slowest first: the dashboard's "slowest routes" panel is the reason this list
    // exists, and the client should not have to re-sort a live feed.
    .sort((a, b) => b.p95Ms - a.p95Ms);

  return {
    generatedAt: new Date().toISOString(),
    service: process.env.SERVICE_NAME ?? 'nexg-concierge-api',
    uptimeSeconds: round(uptimeSeconds, 1),
    requests: {
      total: totalRequests,
      inFlight,
      perMinute,
      perMinuteLifetime: uptimeSeconds > 0 ? round((totalRequests / uptimeSeconds) * 60, 2) : 0,
      errors: totalErrors,
      clientErrors: totalClientErrors,
      aborted: totalAborted,
      errorRate: totalRequests ? round(totalErrors / totalRequests, 4) : 0,
    },
    latencyMs: {
      p50: percentile(sorted, 0.5),
      p95: percentile(sorted, 0.95),
      p99: percentile(sorted, 0.99),
      max: round(durationMaxMs),
      avg: totalRequests ? round(durationSumMs / totalRequests) : 0,
      samples: latencySamples.length,
      buckets: [
        ...DURATION_BUCKETS_MS.map((le, i) => ({
          le: le as number | '+Inf',
          count: durationBuckets[i],
        })),
        { le: '+Inf' as const, count: totalRequests },
      ],
    },
    statuses: [...statusCounts.entries()]
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => a.status - b.status),
    routes,
    process: {
      rssBytes: memory.rss,
      heapUsedBytes: memory.heapUsed,
      heapTotalBytes: memory.heapTotal,
      externalBytes: memory.external,
      nodeVersion: process.version,
      pid: process.pid,
    },
    db: {
      connected: isDbReady(),
      // A boolean, never the value: DATABASE_URL must not be observable through an
      // unauthenticated endpoint.
      configured: Boolean(process.env.DATABASE_URL),
      reason: isDbReady() ? null : safeDbReason(),
      fallbackReads,
    },
    client: {
      sessions: clientSessions.size,
      eventsReceived: clientEventsReceived,
      eventsDropped: clientEventsDropped,
      vitals: Object.fromEntries(
        [...clientVitals.entries()].map(([name, vital]) => [name, { value: vital.value, at: vital.at }])
      ),
      recentEvents: clientEvents.slice(-20).reverse(),
    },
    traces: {
      buffered: recentSpans(Number.MAX_SAFE_INTEGER).length,
      recent: recentSpans(20),
    },
  };
}

/** Prometheus text exposition (version 0.0.4). */
export function formatPrometheus(snapshot: MetricsSnapshot): string {
  const lines: string[] = [];
  const escapeLabel = (value: string) => value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  const metric = (name: string, help: string, type: string) => {
    lines.push(`# HELP ${name} ${help}`, `# TYPE ${name} ${type}`);
  };

  metric('nexg_http_requests_total', 'HTTP requests by method and route pattern.', 'counter');
  for (const stat of routeStats.values()) {
    lines.push(
      `nexg_http_requests_total{method="${escapeLabel(stat.method)}",route="${escapeLabel(
        stat.route
      )}"} ${stat.count}`
    );
  }

  metric('nexg_http_responses_total', 'HTTP responses by status code.', 'counter');
  for (const { status, count } of snapshot.statuses) {
    lines.push(`nexg_http_responses_total{status="${status}"} ${count}`);
  }

  metric('nexg_http_request_duration_ms', 'Request duration in milliseconds.', 'histogram');
  for (const bucket of snapshot.latencyMs.buckets) {
    lines.push(`nexg_http_request_duration_ms_bucket{le="${bucket.le}"} ${bucket.count}`);
  }
  lines.push(`nexg_http_request_duration_ms_sum ${round(durationSumMs, 3)}`);
  lines.push(`nexg_http_request_duration_ms_count ${totalRequests}`);
  for (const quantile of [
    ['0.5', snapshot.latencyMs.p50],
    ['0.95', snapshot.latencyMs.p95],
    ['0.99', snapshot.latencyMs.p99],
  ] as const) {
    lines.push(`nexg_http_request_duration_ms{quantile="${quantile[0]}"} ${quantile[1]}`);
  }

  metric('nexg_http_errors_total', 'Responses with status >= 500.', 'counter');
  lines.push(`nexg_http_errors_total ${snapshot.requests.errors}`);
  metric('nexg_http_client_errors_total', 'Responses with status 400-499.', 'counter');
  lines.push(`nexg_http_client_errors_total ${snapshot.requests.clientErrors}`);
  metric('nexg_http_aborted_total', 'Requests abandoned by the client.', 'counter');
  lines.push(`nexg_http_aborted_total ${snapshot.requests.aborted}`);
  metric('nexg_http_error_rate', 'Errors divided by total requests.', 'gauge');
  lines.push(`nexg_http_error_rate ${snapshot.requests.errorRate}`);
  metric('nexg_http_requests_in_flight', 'Requests currently being handled.', 'gauge');
  lines.push(`nexg_http_requests_in_flight ${snapshot.requests.inFlight}`);

  metric('nexg_process_uptime_seconds', 'Process uptime in seconds.', 'gauge');
  lines.push(`nexg_process_uptime_seconds ${snapshot.uptimeSeconds}`);
  metric('nexg_process_resident_memory_bytes', 'Resident set size.', 'gauge');
  lines.push(`nexg_process_resident_memory_bytes ${snapshot.process.rssBytes}`);
  metric('nexg_process_heap_used_bytes', 'V8 heap in use.', 'gauge');
  lines.push(`nexg_process_heap_used_bytes ${snapshot.process.heapUsedBytes}`);

  metric('nexg_db_connected', 'Whether the Postgres pool is ready (1) or the JSON fallback is serving (0).', 'gauge');
  lines.push(`nexg_db_connected ${snapshot.db.connected ? 1 : 0}`);
  metric('nexg_db_configured', 'Whether DATABASE_URL is present. The value itself is never exported.', 'gauge');
  lines.push(`nexg_db_configured ${snapshot.db.configured ? 1 : 0}`);
  metric('nexg_json_fallback_reads_total', 'Reads served from the seeded JSON fallback.', 'counter');
  lines.push(`nexg_json_fallback_reads_total ${snapshot.db.fallbackReads}`);

  metric('nexg_client_events_total', 'Browser telemetry events accepted.', 'counter');
  lines.push(`nexg_client_events_total ${snapshot.client.eventsReceived}`);
  metric('nexg_client_sessions', 'Distinct browser sessions seen.', 'gauge');
  lines.push(`nexg_client_sessions ${snapshot.client.sessions}`);
  for (const [name, vital] of Object.entries(snapshot.client.vitals)) {
    metric(`nexg_client_vital_${name.toLowerCase()}`, `Latest reported ${name} client vital.`, 'gauge');
    lines.push(`nexg_client_vital_${name.toLowerCase()} ${vital.value}`);
  }

  return `${lines.join('\n')}\n`;
}

// ------------------------------------------------------------------- handlers

export function metricsHandler(req: Request, res: Response): void {
  const snapshot = metricsSnapshot();
  if (String(req.query.format ?? '') === 'prometheus') {
    res.type('text/plain; version=0.0.4; charset=utf-8').send(formatPrometheus(snapshot));
    return;
  }
  res.json(snapshot);
}

export function tracesHandler(req: Request, res: Response): void {
  const requested = Number.parseInt(String(req.query.limit ?? '50'), 10);
  const limit = Number.isFinite(requested) ? Math.min(Math.max(requested, 1), 200) : 50;
  const spans = recentSpans(limit);
  res.json({ count: spans.length, spans });
}

// ----------------------------------------------------------- client ingestion

const EVENT_NAME_RE = /^[A-Za-z0-9_.:-]{1,64}$/;
/**
 * Fields the server refuses to store from a browser payload.
 *
 * The client already declines to read input values, so this is the second line:
 * a future caller that passes `{ email }` or `{ password }` to trackEvent must not
 * be able to turn the telemetry endpoint into a place where personal data lands.
 */
const FORBIDDEN_PROP_KEY_RE = /(password|passwd|secret|token|authorization|cookie|credit|card|cvv|email|phone|msisdn|address|search|query)/i;

function sanitizeProps(raw: unknown): Record<string, unknown> | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const out: Record<string, unknown> = {};
  let kept = 0;
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (kept >= MAX_PROPS_KEYS) break;
    if (FORBIDDEN_PROP_KEY_RE.test(key)) continue;
    if (typeof value === 'string') {
      out[key] = value.slice(0, MAX_STRING_LENGTH);
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      out[key] = value;
    } else if (typeof value === 'boolean' || value === null) {
      out[key] = value;
    }
    // Nested objects are dropped rather than walked: the event shape is flat by
    // contract, and a nested payload is the easiest way to smuggle one in.
    kept += 1;
  }
  return Object.keys(out).length ? out : undefined;
}

export function telemetryHandler(req: Request, res: Response): void {
  if (req.method === 'GET') {
    res.json({
      sessions: clientSessions.size,
      eventsReceived: clientEventsReceived,
      eventsDropped: clientEventsDropped,
      vitals: Object.fromEntries(clientVitals),
      events: clientEvents.slice(-50).reverse(),
    });
    return;
  }

  const body = (req.body ?? {}) as { sessionId?: unknown; events?: unknown };
  const sessionId = sanitizeCorrelationId(body.sessionId);
  const incoming = Array.isArray(body.events) ? body.events.slice(0, MAX_EVENTS_PER_BATCH) : [];

  let accepted = 0;
  for (const candidate of incoming) {
    if (!candidate || typeof candidate !== 'object') continue;
    const event = candidate as Record<string, unknown>;
    const name = typeof event.name === 'string' ? event.name : '';
    if (!EVENT_NAME_RE.test(name)) continue;

    const stored: ClientEvent = {
      name,
      ts: typeof event.ts === 'string' ? event.ts.slice(0, 40) : new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      ...(sessionId ? { sessionId } : {}),
      ...(typeof event.page === 'string' ? { page: event.page.slice(0, 120) } : {}),
      ...(typeof event.requestId === 'string' && sanitizeCorrelationId(event.requestId)
        ? { requestId: sanitizeCorrelationId(event.requestId) as string }
        : {}),
      ...(sanitizeProps(event.props) ? { props: sanitizeProps(event.props) } : {}),
    };

    clientEvents.push(stored);
    if (clientEvents.length > CLIENT_EVENT_WINDOW) clientEvents.shift();
    clientEventsReceived += 1;
    accepted += 1;

    if (sessionId) {
      clientSessions.delete(sessionId);
      clientSessions.set(sessionId, Date.now());
      if (clientSessions.size > 200) {
        const oldest = clientSessions.keys().next().value;
        if (oldest !== undefined) clientSessions.delete(oldest);
      }
    }

    const vital = stored.props?.vital ?? stored.props?.name;
    const value = stored.props?.value;
    if (name === 'web_vital' && typeof vital === 'string' && typeof value === 'number') {
      clientVitals.set(vital, { value, at: stored.receivedAt, event: name });
    }
  }

  clientEventsDropped += Math.max(0, (Array.isArray(body.events) ? body.events.length : 0) - accepted);

  // Bodies are logged as COUNTS only: the payload is browser behaviour and can be
  // large, and one line per event would drown the request line it belongs to.
  logger.debug('client telemetry', { accepted, offered: Array.isArray(body.events) ? body.events.length : 0, sessionId });
  res.status(202).json({ accepted });
}

// ------------------------------------------------------------------- mounting

/**
 * Mount the read endpoints.
 *
 * Called AFTER `express.json()` and BEFORE the 404 handler. These paths are new,
 * so no existing response changes shape.
 */
export function registerObservabilityRoutes(app: Express): void {
  app.get('/api/metrics', metricsHandler);
  app.get('/api/traces', tracesHandler);
  app.get('/api/telemetry', telemetryHandler);
  app.post('/api/telemetry', telemetryHandler);
  logger.info('observability routes registered', {
    routes: ['/api/metrics', '/api/traces', '/api/telemetry'],
  });
}
