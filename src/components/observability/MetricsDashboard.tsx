// src/components/observability/MetricsDashboard.tsx
//
// The dev-facing operations surface, reachable at `?page=metrics`.
//
// WHY the snapshot types are redeclared here instead of imported from
// server/observability.ts: that module imports `node:crypto` and `node:async_hooks`,
// so importing it from a browser bundle would either fail the build or pull a Node
// shim into the client. The shapes below mirror the JSON the endpoint returns, and a
// field the server renames shows up here as a blank panel rather than as a crash.
//
// WHY there is no charting dependency: everything on this page is a bar, a sparkline
// or a stacked strip — an inline SVG and a `width` percentage express all three. A
// chart library would be the single largest dependency in the bundle to draw that.
//
// WHY it renders with the `.onboarding-theme` token scope: this page is inside the
// app's tree, but the scope is what makes one set of neutral-scale utilities correct
// in both themes (see src/index.css), and the two new observability surfaces should
// not disagree about how a dark panel looks.
//
// WHY the API is allowed to be absent: the server is a separate process that is often
// simply not running while the SPA is being worked on. Every panel is written to
// survive a null snapshot. A failed poll clears readiness so an old green database
// status cannot remain on screen after the API reports an outage.

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Activity,
  Cookie,
  Gauge,
  Pause,
  Play,
  RefreshCw,
  ServerCrash,
  Timer,
  TriangleAlert,
} from 'lucide-react';

const REFRESH_MS = 5000;
/** Five minutes of history at the refresh cadence; the API only reports the current minute. */
const MAX_HISTORY = 60;

// ------------------------------------------------------------------- api shapes

interface LatencyBucket {
  le: number | string;
  count: number;
}

interface ClientVital {
  value: number;
  at: string;
}

interface MetricsSnapshot {
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
    buckets: LatencyBucket[];
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
  };
  client: {
    sessions: number;
    eventsReceived: number;
    eventsDropped: number;
    vitals: Record<string, ClientVital>;
    recentEvents: Array<{ name: string; ts: string; page?: string }>;
  };
  traces: { buffered: number; recent: TraceSpan[] };
}

interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  service: string;
  startedAt: string;
  durationMs: number;
  status: 'unset' | 'ok' | 'error';
  attributes: Record<string, unknown>;
  error?: string;
}

interface VersionInfo {
  version: string;
  gitSha: string;
  builtAt: string | null;
  node: string;
}

interface Health {
  status: 'ok';
  source: 'postgres';
  postgresConnected?: boolean;
  totalCategories?: number;
  totalSubcategories?: number;
  totalMerchants?: number;
  totalItems?: number;
}

async function getJson<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(path, { headers: { Accept: 'application/json' }, signal });
  if (!response.ok) throw new Error(`${path} responded ${response.status}`);
  return (await response.json()) as T;
}

// ----------------------------------------------------------------- formatting

function formatMs(ms: number): string {
  if (!Number.isFinite(ms)) return '—';
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** exponent).toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function formatUptime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${Math.floor(seconds % 60)}s`;
  return `${Math.floor(seconds)}s`;
}

function formatPercent(rate: number): string {
  return Number.isFinite(rate) ? `${(rate * 100).toFixed(2)}%` : '—';
}

function formatClock(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleTimeString();
}

// ------------------------------------------------------------------- charts

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) {
    return (
      <p className="text-xs text-slate-600">
        Collecting samples. The line appears after the second poll.
      </p>
    );
  }
  const width = 160;
  const height = 36;
  const max = Math.max(1, ...values);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - 1 - (value / max) * (height - 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-9 w-full text-[#E5B65F]"
      role="img"
      aria-label={`Requests per minute over the last ${values.length} polls, latest ${values[values.length - 1]}`}
    >
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

/**
 * The API publishes cumulative Prometheus buckets (`le` = "at most this many ms"), so
 * the bars are drawn from the DIFFERENCE between consecutive buckets. Plotting the
 * cumulative values would produce a curve that only ever rises, which reads as a
 * latency trend when it is really a running total.
 */
function LatencyHistogram({ buckets }: { buckets: LatencyBucket[] }) {
  const deltas = buckets.map((bucket, index) => ({
    le: bucket.le,
    count: Math.max(0, bucket.count - (index > 0 ? buckets[index - 1].count : 0)),
  }));
  const finite = deltas.filter((bucket) => typeof bucket.le === 'number');
  const max = Math.max(1, ...deltas.map((bucket) => bucket.count));

  if (!deltas.length) return <p className="text-xs text-slate-600">No samples yet.</p>;

  return (
    <div>
      <svg
        viewBox={`0 0 ${deltas.length * 10} 40`}
        preserveAspectRatio="none"
        className="h-24 w-full text-[#E5B65F]"
        role="img"
        aria-label={`Request duration histogram, tallest bucket ${max} requests`}
      >
        {deltas.map((bucket, index) => {
          const barHeight = (bucket.count / max) * 40;
          return (
            <rect
              key={`${bucket.le}`}
              x={index * 10 + 0.6}
              y={40 - barHeight}
              width={8.8}
              height={barHeight}
              fill="currentColor"
            />
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-slate-600">
        <span>{finite.length ? `≤ ${finite[0].le} ms` : ''}</span>
        <span>{finite.length ? `≤ ${finite[finite.length - 1].le} ms` : ''}</span>
        <span>+∞</span>
      </div>
    </div>
  );
}

function PercentileBar({ label, value, max }: { label: string; value: number; max: number }) {
  const width = max > 0 ? Math.min(100, Math.max(2, (value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 shrink-0 text-xs font-medium text-slate-600">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
        {/* A dynamic width cannot be a Tailwind class; an inline style is the only
            way to express a value that changes every poll. */}
        <div className="h-full rounded-full bg-[#E5B65F]" style={{ width: `${width}%` }} />
      </div>
      <span className="w-16 shrink-0 text-right text-xs tabular-nums text-slate-700">
        {formatMs(value)}
      </span>
    </div>
  );
}

/** Colour families here keep their meaning in both themes — see the note in src/index.css. */
const STATUS_CLASSES: Array<{ label: string; bar: string; dot: string; test: (s: number) => boolean }> = [
  { label: '2xx', bar: 'bg-emerald-500', dot: 'bg-emerald-500', test: (s) => s < 300 },
  { label: '3xx', bar: 'bg-sky-500', dot: 'bg-sky-500', test: (s) => s >= 300 && s < 400 },
  { label: '4xx', bar: 'bg-amber-500', dot: 'bg-amber-500', test: (s) => s >= 400 && s < 500 },
  { label: '5xx', bar: 'bg-red-500', dot: 'bg-red-500', test: (s) => s >= 500 },
];

function StatusBreakdown({ statuses }: { statuses: Array<{ status: number; count: number }> }) {
  const total = statuses.reduce((sum, entry) => sum + entry.count, 0);
  const grouped = STATUS_CLASSES.map((group) => ({
    ...group,
    count: statuses
      .filter((entry) => group.test(entry.status))
      .reduce((sum, entry) => sum + entry.count, 0),
  }));

  if (!total) return <p className="text-xs text-slate-600">No responses recorded yet.</p>;

  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-slate-200" role="img" aria-label={`Status breakdown across ${total} responses`}>
        {grouped
          .filter((group) => group.count > 0)
          .map((group) => (
            <div
              key={group.label}
              className={group.bar}
              style={{ width: `${(group.count / total) * 100}%` }}
            />
          ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
        {grouped.map((group) => (
          <li key={group.label} className="flex items-center gap-2 text-xs text-slate-600">
            <span className={`h-2 w-2 rounded-full ${group.dot}`} aria-hidden="true" />
            <span className="font-medium text-slate-700">{group.label}</span>
            <span className="tabular-nums">{group.count}</span>
          </li>
        ))}
      </ul>
      {statuses.length > 0 && (
        <p className="mt-2 text-[11px] text-slate-600">
          Exact codes:{' '}
          {statuses.map((entry) => `${entry.status}×${entry.count}`).join(', ')}
        </p>
      )}
    </div>
  );
}

// -------------------------------------------------------------------- panels

function Card({
  title,
  icon,
  children,
  className = '',
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      /* `min-w-0` is load-bearing, and it is why this page used to be wider than every phone.
         A grid item's `min-width` defaults to `auto`, which resolves to its MIN-CONTENT size.
         This card contains a five-column table whose min-content is 422px, so the grid item
         refused to go below that, the grid's `scrollWidth` came out at 456px inside a 358px
         column, and the whole document was pushed to 473px in a 390px viewport - measured.
         The table already sits in an `overflow-x-auto` wrapper, so it was the grid item's
         intrinsic minimum, not the table's, that escaped.

         Setting it here rather than on each of the six grid containers fixes every grid in the
         file at once, and it is the correct place: a card is a grid item wherever it is used. */
      className={`min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
      aria-label={title}
    >
      <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
        {icon}
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'warn' | 'bad';
}) {
  const toneClass =
    tone === 'bad' ? 'text-red-500' : tone === 'warn' ? 'text-amber-500' : 'text-slate-900';
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-slate-600">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${toneClass}`}>{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-slate-600">{hint}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-1.5 last:border-0">
      <span className="text-xs text-slate-600">{label}</span>
      <span className="text-right text-xs font-medium tabular-nums text-slate-800">{value}</span>
    </div>
  );
}

function TraceList({ spans }: { spans: TraceSpan[] }) {
  if (!spans.length) {
    return <p className="text-xs text-slate-600">No spans buffered yet.</p>;
  }
  const slowest = Math.max(1, ...spans.map((span) => span.durationMs));
  return (
    <ul className="space-y-1.5">
      {spans.map((span) => (
        <li key={span.spanId} className="flex items-center gap-3 text-xs">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              span.status === 'error' ? 'bg-red-500' : span.status === 'ok' ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
            aria-hidden="true"
          />
          <span className="w-40 shrink-0 truncate font-medium text-slate-700" title={span.name}>
            {span.name}
          </span>
          <span className="hidden w-20 shrink-0 font-mono text-[10px] text-slate-600 sm:inline">
            {span.traceId.slice(0, 8)}
          </span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
            <span
              className="block h-full rounded-full bg-[#E5B65F]"
              style={{ width: `${Math.max(2, (span.durationMs / slowest) * 100)}%` }}
            />
          </span>
          <span className="w-16 shrink-0 text-right tabular-nums text-slate-700">
            {formatMs(span.durationMs)}
          </span>
          <span className="hidden w-16 shrink-0 text-right text-slate-600 md:inline">
            {formatClock(span.startedAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Declares its own prop type so the vitals record stays typed where it is read. */
function VitalChips({ vitals }: { vitals: Record<string, ClientVital> }) {
  const entries = Object.entries(vitals ?? {});
  if (!entries.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {entries.map(([name, vital]) => (
        <span
          key={name}
          className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-600"
        >
          {name} <span className="tabular-nums text-slate-800">{vital.value}</span>
        </span>
      ))}
    </div>
  );
}

function RouteTable({ routes }: { routes: MetricsSnapshot['routes'] }) {
  if (!routes.length) return <p className="text-xs text-slate-600">No routes recorded yet.</p>;
  const slowest = Math.max(1, ...routes.map((route) => route.p95Ms));
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-slate-600">
            <th scope="col" className="pb-2 pr-3 font-medium">Route</th>
            <th scope="col" className="pb-2 pr-3 text-right font-medium">Requests</th>
            <th scope="col" className="pb-2 pr-3 text-right font-medium">Errors</th>
            <th scope="col" className="pb-2 pr-3 font-medium">p95</th>
            <th scope="col" className="pb-2 text-right font-medium">Max</th>
          </tr>
        </thead>
        <tbody>
          {routes.slice(0, 12).map((route) => (
            <tr key={`${route.method} ${route.route}`} className="border-t border-slate-200">
              <td className="py-1.5 pr-3">
                <span className="font-mono text-[11px] text-slate-800">{route.route}</span>
                <span className="ml-2 text-[10px] text-slate-600">{route.method}</span>
              </td>
              <td className="py-1.5 pr-3 text-right tabular-nums text-slate-700">{route.count}</td>
              <td
                className={`py-1.5 pr-3 text-right tabular-nums ${
                  route.errors > 0 ? 'text-red-500' : 'text-slate-600'
                }`}
              >
                {route.errors + route.clientErrors}
                {route.aborted > 0 && (
                  <span className="text-slate-600"> ({route.aborted} aborted)</span>
                )}
              </td>
              <td className="py-1.5 pr-3">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                    <span
                      className="block h-full rounded-full bg-[#E5B65F]"
                      style={{ width: `${Math.max(2, (route.p95Ms / slowest) * 100)}%` }}
                    />
                  </span>
                  <span className="tabular-nums text-slate-700">{formatMs(route.p95Ms)}</span>
                </span>
              </td>
              <td className="py-1.5 text-right tabular-nums text-slate-700">
                {formatMs(route.maxMs)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// -------------------------------------------------------------------- page

export default function MetricsDashboard() {
  const [snapshot, setSnapshot] = useState<MetricsSnapshot | null>(null);
  const [spans, setSpans] = useState<TraceSpan[]>([]);
  const [health, setHealth] = useState<Health | null>(null);
  const [version, setVersion] = useState<VersionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const inFlight = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    // One request per endpoint per tick: a slow poll is cancelled by the next one
    // rather than allowed to land out of order on top of fresher numbers.
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    try {
      const [nextSnapshot, nextTraces, nextHealth, nextVersion] = await Promise.all([
        getJson<MetricsSnapshot>('/api/metrics', controller.signal),
        getJson<{ count: number; spans: TraceSpan[] }>('/api/traces?limit=20', controller.signal),
        getJson<Health>('/api/health', controller.signal),
        getJson<VersionInfo>('/api/version', controller.signal),
      ]);
      setSnapshot(nextSnapshot);
      setSpans(nextTraces.spans ?? []);
      setHealth(nextHealth);
      setVersion(nextVersion);
      setUpdatedAt(new Date().toISOString());
      setError(null);
      setHistory((previous) =>
        [...previous, nextSnapshot.requests.perMinute].slice(-MAX_HISTORY)
      );
    } catch (err) {
      // An abort is this component cancelling its own request (pause, unmount, or the
      // next tick arriving first). Reporting it would paint a failure the user caused
      // on purpose.
      if ((err as { name?: string } | null)?.name === 'AbortError') return;
      setHealth(null);
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    if (paused) return;
    void load();
    const timer = setInterval(() => void load(), REFRESH_MS);
    return () => {
      clearInterval(timer);
      inFlight.current?.abort();
    };
  }, [paused, load]);

  const requests = snapshot?.requests;
  const latency = snapshot?.latencyMs;
  const errorRate = requests?.errorRate ?? 0;

  return (
    // `pt-28` (112px) rather than `py-8`, because the site header is FIXED and is 107px
    // tall at this breakpoint. `<main>` in App.tsx carries only `flex-grow`, so a page
    // that does not clear the header itself renders underneath it: the "Service metrics"
    // heading was clipped in half in the browser.
    //
    // The bottom stays at 32px; only the top needs the offset. Pages with no top padding
    // are unaffected, which is deliberate — this is a local fix rather than a change to
    // the shared wrapper, because eleven components already compensate for the header
    // individually and altering the wrapper would shift all of them at once.
    <div className="onboarding-theme min-h-screen bg-slate-50 px-4 pt-28 pb-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
              <Gauge className="h-5 w-5 text-[#B88728]" aria-hidden="true" />
              Service metrics
            </h1>
            <p className="mt-1 text-xs text-slate-600">
              Developer surface, not part of the customer product. Source: this process's
              in-memory counters and span buffer.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-600">
              {paused ? 'Paused' : 'Auto-refresh 5s'} · updated {formatClock(updatedAt)}
            </span>
            <button
              type="button"
              onClick={() => void load()}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Refresh
            </button>
            <button
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused((previous) => !previous)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              {paused ? (
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {paused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </header>

        {error && (
          <div
            role="status"
            className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-xs text-slate-800"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
            <span>
              <span className="font-semibold">Metrics API unreachable.</span> {error}
              {snapshot ? ' Showing the last successful poll.' : ' Start it with `node server/index.ts`.'}
            </span>
          </div>
        )}

        {!snapshot ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
            <ServerCrash className="h-8 w-8 text-slate-400" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-800">No metrics available</p>
            <p className="max-w-md text-xs text-slate-600">
              The dashboard polls <code className="font-mono">/api/metrics</code>,{' '}
              <code className="font-mono">/api/traces</code>,{' '}
              <code className="font-mono">/api/health</code> and{' '}
              <code className="font-mono">/api/version</code> every few seconds and will fill in as
              soon as the API answers.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card title="Requests / minute" icon={<Activity className="h-3.5 w-3.5" aria-hidden="true" />}>
                <Stat
                  label="Last 60s"
                  value={String(requests?.perMinute ?? 0)}
                  hint={`${requests?.total ?? 0} total · ${requests?.perMinuteLifetime ?? 0}/min lifetime`}
                />
                <div className="mt-2">
                  <Sparkline values={history} />
                </div>
              </Card>

              <Card title="Latency" icon={<Timer className="h-3.5 w-3.5" aria-hidden="true" />}>
                <div className="space-y-1.5">
                  <PercentileBar label="p50" value={latency?.p50 ?? 0} max={latency?.max ?? 0} />
                  <PercentileBar label="p95" value={latency?.p95 ?? 0} max={latency?.max ?? 0} />
                  <PercentileBar label="p99" value={latency?.p99 ?? 0} max={latency?.max ?? 0} />
                </div>
                <p className="mt-2 text-[11px] text-slate-600">
                  max {formatMs(latency?.max ?? 0)} · avg {formatMs(latency?.avg ?? 0)} ·{' '}
                  {latency?.samples ?? 0} samples
                </p>
              </Card>

              <Card title="Errors">
                <Stat
                  label="5xx error rate"
                  value={formatPercent(errorRate)}
                  hint={`${requests?.errors ?? 0} server · ${requests?.clientErrors ?? 0} client · ${requests?.aborted ?? 0} aborted`}
                  tone={errorRate > 0.01 ? 'bad' : 'default'}
                />
                <p className="mt-2 text-[11px] text-slate-600">
                  Errors are responses with status ≥ 500. An aborted request is client control flow
                  and is never counted as one.
                </p>
              </Card>

              <Card title="Traffic">
                <Stat
                  label="In flight"
                  value={String(requests?.inFlight ?? 0)}
                  hint={`uptime ${formatUptime(snapshot.uptimeSeconds)}`}
                />
                <p className="mt-2 text-[11px] text-slate-600">
                  {snapshot.traces.buffered} spans buffered · {snapshot.client.eventsReceived} client
                  events received
                </p>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card title="Duration histogram">
                <LatencyHistogram buckets={latency?.buckets ?? []} />
                <p className="mt-2 text-[11px] text-slate-600">
                  Bars are per-bucket counts derived from the API's cumulative Prometheus buckets.
                </p>
              </Card>

              <Card title="Status breakdown">
                <StatusBreakdown statuses={snapshot.statuses} />
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card title="Slowest routes (by p95)">
                <RouteTable routes={snapshot.routes} />
              </Card>

              <Card title="Runtime, build and data source">
                <div className="grid gap-x-6 sm:grid-cols-2">
                  <div>
                    <Row
                      label="API version"
                      value={version ? `${version.version} (${version.gitSha})` : '—'}
                    />
                    <Row label="Built at" value={version?.builtAt ?? 'unknown'} />
                    <Row label="Node" value={snapshot.process.nodeVersion} />
                    <Row label="PID" value={String(snapshot.process.pid)} />
                    <Row label="RSS" value={formatBytes(snapshot.process.rssBytes)} />
                    <Row
                      label="Heap"
                      value={`${formatBytes(snapshot.process.heapUsedBytes)} / ${formatBytes(
                        snapshot.process.heapTotalBytes
                      )}`}
                    />
                  </div>
                  <div>
                    <Row label="Health" value={health?.status ?? '—'} />
                    <Row
                      label="Data source"
                      value={
                        <span
                          className={
                            health?.source === 'postgres' ? 'text-emerald-700' : 'text-amber-500'
                          }
                        >
                          {health?.source ?? '—'}
                        </span>
                      }
                    />
                    <Row label="Merchants" value={String(health?.totalMerchants ?? '—')} />
                    <Row label="Items" value={String(health?.totalItems ?? '—')} />
                    <Row
                      label="Service"
                      value={<span className="font-mono text-[11px]">{snapshot.service}</span>}
                    />
                  </div>
                </div>
                {!snapshot.db.connected && snapshot.db.reason && (
                  <p className="mt-2 rounded-lg bg-slate-100 px-2 py-1.5 text-[11px] text-slate-600">
                    Postgres unavailable: {snapshot.db.reason}
                  </p>
                )}
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card title="Recent traces (/api/traces)" className="lg:col-span-2">
                <TraceList spans={spans} />
              </Card>

              <Card title="Client telemetry" icon={<Cookie className="h-3.5 w-3.5" aria-hidden="true" />}>
                <Row label="Sessions" value={String(snapshot.client.sessions)} />
                <Row label="Events accepted" value={String(snapshot.client.eventsReceived)} />
                <Row label="Events dropped" value={String(snapshot.client.eventsDropped)} />
                <VitalChips vitals={snapshot.client.vitals} />
                <p className="mt-2 text-[11px] text-slate-600">
                  Browser events arrive only from visitors who granted analytics consent.
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
