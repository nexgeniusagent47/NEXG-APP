// src/lib/telemetry.ts
//
// Client-side network tracing and the event bus every other client analytics
// call goes through.
//
// WHY the fetch wrapper is same-origin only: adding `x-request-id` to a
// cross-origin request turns a simple request into one that needs a CORS
// preflight, so instrumenting a third-party call would break calls that work
// today (the Gemini SDK posts to generativelanguage.googleapis.com). Only
// `/api/*` on this origin is ours to instrument, and that is the traffic the
// server logs can be correlated with.
//
// WHY nothing is buffered before consent: an event queue that fills up and is
// only flushed after a "yes" is still collection without consent. The wrapper
// passes the request straight through untouched until analytics is granted.
//
// WHY sendBeacon: a batch flushed during unload is lost if it goes out as a
// normal fetch — the page is torn down mid-request. `sendBeacon` is handed to the
// browser to deliver after the document is gone. It is not always available (and
// can refuse a payload), so the fetch fallback stays.

import { CONSENT_CHANGED_EVENT, hasConsent } from './consent.ts';

const TELEMETRY_ENDPOINT = '/api/telemetry';
const SESSION_STORAGE_KEY = 'nexg_session_id';

/** Bounded on purpose: a failing endpoint must not turn into unbounded memory. */
const MAX_BUFFERED_EVENTS = 40;
const FLUSH_INTERVAL_MS = 5000;
const FLUSH_THRESHOLD = 15;
const MAX_PROP_KEYS = 20;
const MAX_STRING_LENGTH = 120;

/**
 * Same denylist as the server ingest. The client refuses to read input values in
 * the first place; this is what stops a future caller from passing one in by hand.
 */
const FORBIDDEN_PROP_KEY_RE =
  /(password|passwd|secret|token|authorization|cookie|credit|card|cvv|email|phone|msisdn|address|search|query|value)/i;

export interface TelemetryEvent {
  name: string;
  ts: string;
  page?: string;
  requestId?: string;
  props?: Record<string, unknown>;
}

type Outcome = 'ok' | 'http_error' | 'network_error' | 'aborted';

let nativeFetch: typeof fetch | null =
  typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : null;

let buffer: TelemetryEvent[] = [];
let droppedSinceFlush = 0;
let flushTimer: ReturnType<typeof setInterval> | null = null;
let installed = false;
let reportedVitals = false;

const vitals = new Map<string, number>();

// ------------------------------------------------------------------- session

function readSessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
  } catch {
    // Private-mode storage refuses reads; a fresh id per page is still useful.
  }
  const generated = randomId();
  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, generated);
  } catch {
    /* storage unavailable */
  }
  return generated;
}

function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    /* fall through */
  }
  return `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const sessionId = typeof window === 'undefined' ? '' : readSessionId();

export function getSessionId(): string {
  return sessionId;
}

export function isTelemetryEnabled(): boolean {
  return hasConsent('analytics');
}

// -------------------------------------------------------------------- events

function sanitizeProps(props?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!props) return undefined;
  const out: Record<string, unknown> = {};
  let kept = 0;
  for (const [key, value] of Object.entries(props)) {
    if (kept >= MAX_PROP_KEYS) break;
    if (FORBIDDEN_PROP_KEY_RE.test(key)) continue;
    if (typeof value === 'string') out[key] = value.slice(0, MAX_STRING_LENGTH);
    else if (typeof value === 'number' && Number.isFinite(value)) out[key] = value;
    else if (typeof value === 'boolean' || value === null) out[key] = value;
    kept += 1;
  }
  return Object.keys(out).length ? out : undefined;
}

function enqueue(event: TelemetryEvent): void {
  if (buffer.length >= MAX_BUFFERED_EVENTS) {
    // Drop the oldest: when something is wrong, the newest events describe the
    // state the user is in right now.
    buffer.shift();
    droppedSinceFlush += 1;
  }
  buffer.push(event);
  scheduleFlush();
  if (buffer.length >= FLUSH_THRESHOLD) flush('threshold');
}

/**
 * Record a product event. No-op without analytics consent, and no-op in a
 * non-browser environment, so importing this module can never fail a build.
 */
export function trackEvent(name: string, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!hasConsent('analytics')) return;
  enqueue({
    name,
    ts: new Date().toISOString(),
    page: `${window.location.pathname}${window.location.search}`,
    ...(sanitizeProps(props) ? { props: sanitizeProps(props) } : {}),
  });
}

function scheduleFlush(): void {
  if (flushTimer !== null || typeof window === 'undefined') return;
  flushTimer = setInterval(() => flush('interval'), FLUSH_INTERVAL_MS);
}

type FlushReason = 'interval' | 'threshold' | 'pagehide' | 'manual';

function flush(reason: FlushReason): void {
  if (typeof window === 'undefined') return;
  if (!hasConsent('analytics')) {
    // Consent revoked after events were buffered: they are discarded, not sent.
    buffer = [];
    droppedSinceFlush = 0;
    return;
  }
  if (buffer.length === 0) return;

  const events = buffer;
  buffer = [];
  const dropped = droppedSinceFlush;
  droppedSinceFlush = 0;

  try {
    const payload = JSON.stringify({ sessionId, dropped, events });
    if ((reason === 'pagehide' || reason === 'manual') && typeof navigator.sendBeacon === 'function') {
      // A Blob with a JSON type keeps the request CORS-simple while still being
      // parsed by express.json(); a bare string would arrive as text/plain.
      const queued = navigator.sendBeacon(
        TELEMETRY_ENDPOINT,
        new Blob([payload], { type: 'application/json' })
      );
      if (queued) return;
    }
    void postWithFetch(payload);
  } catch {
    // Telemetry must never surface an error into the app's control flow.
    droppedSinceFlush += events.length;
  }
}

function postWithFetch(payload: string): void {
  if (!nativeFetch) return;
  void nativeFetch(TELEMETRY_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    // Survives a navigation that happens while the request is in flight.
    keepalive: true,
  }).catch(() => {
    /* the endpoint being down is not the user's problem */
  });
}

/** Force a flush. Exported for tests and for a "send now" diagnostic. */
export function flushTelemetry(): void {
  flush('manual');
}

// ------------------------------------------------------------------- wrapping

function sameOriginApiUrl(input: RequestInfo | URL): URL | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input instanceof Request
            ? input.url
            : null;
    if (!raw) return null;
    const url = new URL(raw, window.location.href);
    if (url.origin !== window.location.origin) return null;
    // The telemetry endpoint itself is posted to with the native fetch, so
    // wrapping it would only invite a loop.
    if (url.pathname === TELEMETRY_ENDPOINT) return null;
    return url;
  } catch {
    return null;
  }
}

function correlationHeaders(existing: HeadersInit | undefined): Headers {
  const headers = new Headers(existing ?? undefined);
  if (!headers.has('x-request-id')) headers.set('x-request-id', randomId());
  if (sessionId && !headers.has('x-session-id')) headers.set('x-session-id', sessionId);
  return headers;
}

/**
 * Copy `init` with correlation headers merged.
 *
 * `signal` and every other member are carried over by identity, so the AbortSignal
 * the caller passed in is the same object the browser sees — a copied or rebuilt
 * signal would make apiClient's `AbortError` handling depend on this module.
 */
function withHeaders(
  input: RequestInfo | URL,
  init: RequestInit | undefined
): { request: RequestInfo | URL; init?: RequestInit; requestId: string } {
  const requestId = randomId();
  if (input instanceof Request) {
    const headers = new Headers(input.headers);
    if (!headers.has('x-request-id')) headers.set('x-request-id', requestId);
    if (sessionId && !headers.has('x-session-id')) headers.set('x-session-id', sessionId);
    // Re-wrapping a Request keeps its signal: the constructor inherits the
    // input's signal when the init does not supply one.
    return { request: new Request(input, { headers }), requestId };
  }

  const headers = new Headers(init?.headers ?? undefined);
  if (!headers.has('x-request-id')) headers.set('x-request-id', requestId);
  if (sessionId && !headers.has('x-session-id')) headers.set('x-session-id', sessionId);
  return { request: input, init: { ...(init ?? {}), headers }, requestId };
}

function record(
  url: URL,
  method: string,
  outcome: Outcome,
  durationMs: number,
  extra: Record<string, unknown>
): void {
  trackEvent('api_request', {
    path: url.pathname,
    method,
    outcome,
    durationMs: Math.round(durationMs * 10) / 10,
    ...extra,
  });
}

function installFetchTracing(): void {
  if (installed || typeof window === 'undefined' || !nativeFetch) return;
  installed = true;
  const original = nativeFetch;

  const instrumented = async function instrumentedFetch(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const url = sameOriginApiUrl(input);
    // No consent or not our origin: hand the call through exactly as received.
    if (!url || !hasConsent('analytics')) return original(input, init);

    const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();
    const start = performance.now();

    let outgoing: { request: RequestInfo | URL; init?: RequestInit; requestId: string };
    try {
      outgoing = withHeaders(input, init);
    } catch {
      // A body that cannot be re-wrapped must not become a failed request.
      return original(input, init);
    }

    try {
      const response = await original(outgoing.request, outgoing.init);
      record(url, method, response.ok ? 'ok' : 'http_error', performance.now() - start, {
        status: response.status,
        requestId: outgoing.requestId,
      });
      return response;
    } catch (error) {
      // Abort is control flow in apiClient (fast typing cancels the previous
      // search); reporting it as an error would make a working app look broken.
      const aborted =
        (error as { name?: string } | null)?.name === 'AbortError' ||
        (init?.signal?.aborted ?? false);
      record(url, method, aborted ? 'aborted' : 'network_error', performance.now() - start, {
        requestId: outgoing.requestId,
        ...(aborted ? {} : { error: String((error as Error)?.message ?? error).slice(0, 120) }),
      });
      throw error;
    }
  };

  nativeFetch = instrumented as typeof fetch;
  globalThis.fetch = instrumented as typeof fetch;
}

// --------------------------------------------------------------------- vitals

/**
 * Core Web Vitals, from the browser's own observers.
 *
 * Collected here rather than from a library because the dashboard only needs the
 * latest value per metric, and a dependency for four numbers is not worth the
 * bundle. Absent APIs are skipped silently: a missing PerformanceObserver must
 * not stop the API tracing that shares this module.
 */
function installVitals(): void {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;

  const observe = (type: string, handler: (entries: PerformanceEntryList) => void) => {
    try {
      const observer = new PerformanceObserver((list) => handler(list.getEntries()));
      observer.observe({ type, buffered: true } as PerformanceObserverInit);
    } catch {
      /* this browser does not support the entry type */
    }
  };

  try {
    observe('largest-contentful-paint', (entries) => {
      const last = entries[entries.length - 1];
      if (last) vitals.set('LCP', Math.round(last.startTime));
    });
    observe('layout-shift', (entries) => {
      let cls = vitals.get('CLS') ?? 0;
      for (const entry of entries) {
        const shift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
        // Shifts caused by a click are expected; counting them punishes the user.
        if (!shift.hadRecentInput) cls += shift.value ?? 0;
      }
      vitals.set('CLS', Math.round(cls * 1000) / 1000);
    });
    observe('paint', (entries) => {
      const fcp = entries.find((entry) => entry.name === 'first-contentful-paint');
      if (fcp) vitals.set('FCP', Math.round(fcp.startTime));
    });

    const navigation = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navigation) {
      vitals.set('TTFB', Math.round(navigation.responseStart));
      vitals.set(
        'DOM_READY',
        Math.round(navigation.domContentLoadedEventEnd - navigation.startTime)
      );
    }
  } catch {
    /* vitals are best-effort */
  }
}

function reportVitals(): void {
  if (reportedVitals || vitals.size === 0 || !hasConsent('analytics')) return;
  reportedVitals = true;
  for (const [name, value] of vitals) trackEvent('web_vital', { name, value });
  flush('pagehide');
}

// ------------------------------------------------------------------ lifecycle

function installLifecycle(): void {
  if (typeof window === 'undefined') return;

  // `pagehide` fires on unload and on bfcache entry, which is where a beacon is
  // the only delivery mechanism that survives.
  window.addEventListener('pagehide', () => {
    reportVitals();
    flush('pagehide');
  });
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush('pagehide');
  });
  window.addEventListener(CONSENT_CHANGED_EVENT, () => {
    // Revoking consent discards whatever is buffered rather than sending it.
    if (!hasConsent('analytics')) {
      buffer = [];
      droppedSinceFlush = 0;
    }
  });
}

installFetchTracing();
installVitals();
installLifecycle();
