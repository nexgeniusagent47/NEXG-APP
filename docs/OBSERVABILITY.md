# Observability

What the NEXG Concierge process records, where every record goes, how long it lives,
and what the consent model allows. Read this before adding a metric, a log line or a
browser event.

Scope: one process (`server/index.ts`) that serves `/api/*` and the built SPA. There is
no collector, no agent sidecar and no telemetry database — everything below is either a
line on stdout or a bounded in-memory window inside that process.

Related: [API.md](./API.md) for the endpoint contracts, [ARCHITECTURE.md](./ARCHITECTURE.md)
for where the layers sit.

---

## 1. The four surfaces

| Surface | Produced by | Consumed by |
| --- | --- | --- |
| **Logs** — one line per request, one per span | `server/logger.ts` | stdout (platform log collector) |
| **Traces** — spans with a W3C trace id | `server/tracing.ts` | stdout + `GET /api/traces` |
| **Metrics** — counters, histograms, per-route stats | `server/observability.ts` | `GET /api/metrics`, `?page=metrics` |
| **Client telemetry** — browser events and vitals | `src/lib/telemetry.ts`, `src/hooks/useAnalytics.ts` | `POST /api/telemetry`, `GET /api/telemetry` |

`server/index.ts` mounts them with three statements:

```ts
app.use(observabilityMiddleware());   // first, before express.json()
// ... existing routes ...
registerObservabilityRoutes(app);     // after express.json(), before the 404 handler
app.get('/api/version', (_req, res) => res.json(versionInfo()));
```

The middleware runs first on purpose: a request whose body fails to parse, or that
matches no route, is still counted and still correlated. It also sets `x-request-id`
and a W3C `traceparent` response header, so a caller can quote an id that appears in
the server's log line for that request.

---

## 2. What is collected

### 2.1 The request line (server, every request)

One JSON (or human-readable, see §6) line when the response settles:

```json
{"timestamp":"2026-09-22T08:14:02.918Z","level":"info","msg":"request completed",
 "requestId":"0f1c…","traceId":"9e5f…","spanId":"6006…","method":"GET",
 "path":"/api/merchants","route":"/api/merchants","status":200,"durationMs":12.4,
 "outcome":"completed","sessionId":"…"}
```

* `route` is the **route pattern** (`/api/merchants/:id`), never the concrete path —
  one series per merchant record is a cardinality leak, not a metric.
* `outcome` is `completed` or `aborted`. A client that hung up is control flow, not a
  server failure, so it is counted separately and never as an error.
* `userId` appears only when something upstream puts it on `res.locals.userId` (or
  `req.user.id`). A user id from a request header is never trusted.
* Static assets and the SPA catch-all are logged at `debug` in one bucket, so
  `LOG_LEVEL=debug` shows them without burying the API lines at `info`.

### 2.2 Spans (server)

Each request opens a root `http.request` span and closes it when the response
settles. Child spans (`fallback.<label>` for a seeded-JSON read, `db.connect` from the
pool) nest automatically because the root span is the ambient one for the request.

A span carries: `name`, `service`, `traceId`, `spanId`, `parentSpanId`, `startedAt`,
`durationMs`, `status` (`unset`/`ok`/`error`), `attributes` (HTTP method, target,
status code, route, outcome, user agent) and `error` when it failed. Failed spans log
at `warn`; healthy spans log at `debug`.

### 2.3 Metrics (server)

Cumulative since process start: request totals, in-flight gauge, requests in the last
60 s, 5xx count, 4xx count, aborted count, error rate, a duration histogram with
Prometheus buckets, p50/p95/p99/max/avg, status-code counts, per-route counts with
avg/p95/max, event-loop-free process memory and RSS, Node version, PID, uptime, DB
connected/configured/fallback-reads, and the client-telemetry rollup.

### 2.4 Browser events (client)

| Event | Emitted when | Props |
| --- | --- | --- |
| `api_request` | a same-origin `/api/*` fetch settles | `path`, `method`, `outcome` (`ok`/`http_error`/`network_error`/`aborted`), `durationMs`, `status`, `requestId` |
| `web_vital` | at unload, from the browser's own observers | `name` (LCP, CLS, FCP, TTFB, DOM_READY), `value` |
| `ui_click` | any click, from one capture-phase document listener | `tag`, `analyticsId`, `text` |
| `page_view` | `trackPageView(page)` | `page` |

**The click descriptor is the only place rendered text is read, and it is deliberately
coarse:** the lower-cased tag name of the clicked element, the nearest
`data-analytics` attribute value when the markup declares one, and at most 40
characters of visible label with whitespace collapsed and e-mail/phone-shaped
substrings masked to `[email]`/`[number]`.

**Nothing typed is ever recorded.** The capture skips any click inside `input`,
`textarea`, `select`, `option` or `[contenteditable]`, so a value, a password field, a
chosen option or a rich-text body cannot enter the descriptor even indirectly.
`src/lib/telemetry.ts` drops any prop whose **key** matches
`password|passwd|secret|token|authorization|cookie|credit|card|cvv|email|phone|msisdn|address|search|query|value`,
and `server/observability.ts` applies the same denylist again on ingest. Strings are
truncated to 120 characters, nested objects are dropped, and at most 20 props are kept.

Cross-origin requests are never instrumented: adding a correlation header to
`generativelanguage.googleapis.com` would turn a working simple request into one that
needs a preflight.

---

## 3. Where it goes

* **Logs and span lines** → `process.stdout` only. Errors go to the same stream as
  everything else, because a split stream reorders unrelated lines when both are
  collected. Human-readable while `NODE_ENV !== 'production'`; JSON in production.
* **Traces** → the same stdout line, plus a bounded ring buffer for `GET /api/traces`.
* **Metrics** → in-process counters; nothing is written to Postgres or to disk.
* **Client events** → `POST /api/telemetry`, stored in a bounded in-memory window for
  `GET /api/telemetry` and the metrics rollup.

A restart discards traces, metrics and ingested client events. That is the intended
trade-off for a single-process dev-facing surface: no schema, no migration, no write
amplification on the request path.

---

## 4. Retention

All windows are fixed-size. An unbounded counter map keyed by path is a memory leak
with a remote trigger.

| Buffer | Bound | Configurable |
| --- | --- | --- |
| Span ring buffer | 250 spans | `TRACE_BUFFER_SIZE` |
| Latency samples (percentiles) | 2048 | no |
| Samples per route (p95) | 256 | no |
| Tracked routes | 64, then a single `other` series | no |
| Requests-per-minute window | 60 s | no |
| Client events kept | 200 (metrics shows the latest 20) | no |
| Distinct client sessions | 200, oldest evicted | no |
| Vitals | latest value per metric name | no |
| Counters / histogram buckets | since process start | no |
| Logs | whatever the platform's log store retains | platform |
| Consent cookie | 180 days | `CONSENT_MAX_AGE_DAYS` |

Nothing here is a system of record. If a number needs to survive a deploy, it belongs
in a real metrics backend behind a scrape of `/api/metrics?format=prometheus`.

---

## 5. Consent model

Implemented in `src/lib/consent.ts`. Consent is stored in the `nexg_consent` cookie
(`Path=/`, `SameSite=Lax`, `Secure` on https, 180-day expiry) rather than
`localStorage`, because it must be readable by server-side and edge surfaces and it
must expire.

Three states, deliberately not a boolean:

| State | Meaning | Banner | Non-essential collection |
| --- | --- | --- | --- |
| `unknown` | never asked | shown | no |
| `granted` | asked, at least one optional category on | hidden | yes, per category |
| `denied` | asked, everything optional off | hidden | no |

Categories: `necessary` (always true — it cannot be switched off), `analytics`,
`marketing`. The record is **versioned** (`CONSENT_VERSION`): a decision made against
an older notice is not an answer to the current question, so a version bump returns
everyone to `unknown` and asks again. Without that, adding a category would silently
opt existing visitors into it.

What `hasConsent('analytics')` gates:

* every `trackEvent()` — it returns without enqueueing;
* the fetch instrumentation — calls pass through completely untouched;
* the click capture — it returns before reading the DOM.

**Nothing is buffered before consent.** There is no queue that fills up and flushes
after a "yes": an event that was not allowed to happen is not remembered. Revoking
consent discards whatever is already buffered rather than sending it, and granting it
mid-session starts collection immediately — `subscribeConsent` keeps the client
modules in step, so no reload is needed.

The banner (`src/components/consent/ConsentBanner.tsx`) is a non-blocking
`role="region"` — not a dialog, and never `aria-modal`, because it neither takes focus
nor disables the page. It offers granular toggles, **Accept all**, **Reject all** and
**Save choices**, and hides itself once a decision is stored. A "Manage cookies"
control remains, and `resetConsent()` returns the state to `unknown` to ask again.

`marketing` currently has no processor behind it. It is asked for and stored so the
choice exists when one is added; nothing reads it today.

---

## 6. Environment variables

| Variable | Default | Effect |
| --- | --- | --- |
| `LOG_LEVEL` | `debug` in development, `info` when `NODE_ENV=production` | Minimum severity written. `debug` includes span lines, fallback reads, static-asset requests and client-ingest counts. `setLogLevel()` can change it at runtime. |
| `NODE_ENV` | unset | `production` switches log lines from human-readable to JSON. |
| `SERVICE_NAME` | `nexg-concierge-api` | `service` field on spans and the metrics snapshot. |
| `TRACE_BUFFER_SIZE` | `250` | Spans kept for `/api/traces`. |
| `GIT_SHA` | local `.git` HEAD, else `unknown` | Commit reported by `/api/version`. Set it at image build time — a container has no `.git`. |
| `BUILT_AT` | `null` | Build timestamp reported by `/api/version`. |
| `PORT` | `3001` | Listen port. |
| `DATABASE_URL` | unset | Postgres source of truth; the metrics snapshot reports only whether it is *configured*, never its value. |
| `TELEMETRY_DISABLED` | — | **Not supported.** No code reads it. The off switch for browser telemetry is consent: a visitor who has not granted `analytics` produces no events, and there is no server-side override that could collect on their behalf. |

---

## 7. Reading `/api/metrics`

JSON by default (`server/observability.ts` → `metricsSnapshot()`):

```bash
curl -s localhost:3001/api/metrics | jq '{
  perMinute: .requests.perMinute,
  errorRate: .requests.errorRate,
  p50: .latencyMs.p50, p95: .latencyMs.p95, p99: .latencyMs.p99,
  db: .db.connected, uptime: .uptimeSeconds }'
```

Notes on the shape:

* `latencyMs.buckets` is an array of **cumulative** Prometheus buckets: `le` is an
  upper bound in milliseconds and `count` is the number of requests at or below it.
  The final entry is `+Inf`. Per-bucket counts are the differences between consecutive
  entries — plotting the raw values produces a curve that only rises.
* `requests.aborted` is separate from `requests.errors`: an aborted request is the
  client's control flow and is excluded from `errorRate`.
* `routes` is sorted slowest-first by p95, and `routes[].route` is a pattern.
* `db.reason` is the scrubbed reason Postgres is unavailable; credentials in it are
  replaced with `[redacted]` and the URL value is never returned.

Prometheus text exposition (version 0.0.4) for a real scrape:

```bash
curl -s 'localhost:3001/api/metrics?format=prometheus'
```

Related endpoints:

| Endpoint | Returns |
| --- | --- |
| `GET /api/traces?limit=50` | `{ count, spans }`, newest first. `limit` is clamped to 1–200. |
| `GET /api/version` | `{ version, gitSha, builtAt, node }` — the running build, for deploy verification. |
| `GET /api/telemetry` | Ingest counters plus the last 50 client events and the latest vitals. |
| `POST /api/telemetry` | Batch ingest: `{ sessionId, dropped, events: [...] }`, at most 50 events per batch, `202 { accepted }`. Requires `express.json()` (already global in `server/index.ts`). |
| `GET /api/health` | Liveness, active data source and real catalogue counts. |

These endpoints are unauthenticated, as is the rest of the API — **do not expose this
API publicly**, and front it with something that restricts `/api/metrics`,
`/api/traces` and `/api/telemetry` before it is reachable from the internet.

---

## 8. The dashboard

`?page=metrics` renders `src/components/observability/MetricsDashboard.tsx`: requests
per minute with a rolling sparkline, p50/p95/p99 and the duration histogram, error
rate, status breakdown, slowest routes by p95, recent traces from `/api/traces`,
runtime/build/data-source facts and the client-telemetry rollup. It polls
`/api/metrics`, `/api/traces`, `/api/health` and `/api/version` every 5 s, has a
**Pause** toggle, and keeps the last good snapshot on screen with a warning strip when
the API stops answering.

It is a developer surface, not customer UI: no route links to it, and it is a lazily
loaded chunk so no customer journey downloads it. Charts are inline SVG and CSS — no
charting dependency.

Numbers shown are the in-memory state of the process the page is talking to. In
development the SPA proxies `/api` to `http://127.0.0.1:3001` (`vite.config.ts`), so
run `node server/index.ts` for the page to have anything to show.

---

## 9. Privacy note

* **No typed input is ever recorded.** Input values, password fields, textareas,
  `contenteditable` bodies and selected options are excluded from the click capture,
  and keys that look like credentials or personal data are dropped on both the client
  and the server before an event is stored.
* **Nothing non-essential fires before consent.** Without `hasConsent('analytics')`
  there is no buffering, no beacon and no correlation header — only the strictly
  necessary traffic the site needs to work.
* Rendered text that reaches telemetry is capped at 40 characters, whitespace-collapsed
  and stripped of e-mail/phone-shaped substrings. It is a label ("Book now", "Spa"),
  not content.
* Browser identity is a random per-tab-session id in `sessionStorage`
  (`nexg_session_id`). There is no fingerprinting, no cross-site id and no persistent
  visitor id; closing the tab ends the session id.
* Server logs carry no request or response bodies. `server/logger.ts` redacts values
  whose key looks like a secret (`authorization`, `cookie`, `password`, `*token`,
  `*secret`, `*apikey`, card fields) at any depth, and truncates long strings.
* The client ingest endpoint re-sanitises everything it stores, so a future caller
  passing `{ email }` to `trackEvent` cannot turn telemetry into a place where personal
  data lands.
