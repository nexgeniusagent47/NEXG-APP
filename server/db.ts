// server/db.ts
// PostgreSQL access layer for the NEXG Concierge API.
//
// Design contract:
//   * Postgres is the SOURCE OF TRUTH when DATABASE_URL is set AND reachable.
//   * The seeded JSON cache is a cold-start FALLBACK so the API still serves
//     traffic for a contributor who has not provisioned a database.
//   * The chosen source is reported by /api/health so the state is never
//     ambiguous (this ambiguity was defect D-03).
//
// Uses the CommonJS `pg` build via createRequire because the repo is
// "type": "module" and pg ships no ESM entry point.

import { createRequire } from 'node:module';

import { withSpan } from './tracing.ts';

const require = createRequire(import.meta.url);

type PgPool = {
  query: (text: string, params?: unknown[]) => Promise<{ rows: any[]; rowCount: number | null }>;
  end: () => Promise<void>;
  on: (event: string, handler: (...args: any[]) => void) => void;
};
type PgPoolCtor = new (config: Record<string, unknown>) => PgPool;

let pool: PgPool | null = null;
let pgUnavailableReason: string | null = null;
let initPromise: Promise<boolean> | null = null;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Attempt to establish the connection pool exactly once.
 * Resolves true when the database is usable, false otherwise.
 * Never throws — a missing database must degrade, not crash the API.
 */
export function initDb(): Promise<boolean> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const url = process.env.DATABASE_URL;
    if (!url) {
      pgUnavailableReason = 'DATABASE_URL not set';
      return false;
    }

    let Pool: PgPoolCtor;
    try {
      ({ Pool } = require('pg') as { Pool: PgPoolCtor });
    } catch (err: any) {
      pgUnavailableReason = `pg module unavailable: ${err?.message ?? err}`;
      return false;
    }

    const candidate = new Pool({
      connectionString: url,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });

    // A pool-level error handler is mandatory: without it an idle client
    // error becomes an unhandled 'error' event and kills the process.
    candidate.on('error', (err: any) => {
      console.error('[NEXG db] idle client error:', err?.message ?? err);
    });

    // Retry briefly: on a cold start the container may still be booting.
    const attempts = 5;
    for (let i = 1; i <= attempts; i++) {
      try {
        await withSpan('db.connect', { 'db.system': 'postgresql', 'db.attempt': i }, () =>
          candidate.query('SELECT 1')
        );
        pool = candidate;
        pgUnavailableReason = null;
        console.log('[NEXG db] connected to PostgreSQL');
        return true;
      } catch (err: any) {
        pgUnavailableReason = err?.message ?? String(err);
        if (i < attempts) await sleep(400 * i);
      }
    }

    console.warn(`[NEXG db] unavailable, falling back to JSON cache: ${pgUnavailableReason}`);
    try {
      await candidate.end();
    } catch {
      /* pool was never usable */
    }
    return false;
  })();

  return initPromise;
}

export function isDbReady(): boolean {
  return pool !== null;
}

export function getDbUnavailableReason(): string | null {
  return pgUnavailableReason;
}

/**
 * Run a parameterised query. Throws if the database is not ready — callers
 * must check `isDbReady()` and take the fallback path.
 *
 * `name` is the span name and MUST be a stable label supplied by the repository
 * ("merchants.list"), never the statement: SQL text carries schema detail, and a
 * statement logged for debugging is one step away from a statement logged with
 * its parameter values inlined.
 */
export async function query<T = any>(
  text: string,
  params: unknown[] = [],
  name = 'db.query'
): Promise<T[]> {
  const activePool = pool;
  if (!activePool) throw new Error('database not initialised');

  return withSpan(name, { 'db.system': 'postgresql', 'db.params': params.length }, async (span) => {
    const result = await activePool.query(text, params);
    span.setAttribute('db.rows', result.rowCount ?? result.rows.length);
    return result.rows as T[];
  });
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
