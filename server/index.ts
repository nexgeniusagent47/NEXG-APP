// server/index.ts
// NEXG Concierge API.
//
// Data strategy (see docs/PLAN-v1.md):
//   1. PostgreSQL  — source of truth when DATABASE_URL is set and reachable
//   2. JSON cache  — cold-start fallback so the API always serves traffic
//
// The active source is reported by /api/health, and the counts it reports are
// derived from the SAME collection the list endpoints serve. Previously health
// advertised the JSON `summary` block (640 merchants) while /api/merchants
// served the much smaller `merchants` array (120) — defect D-03.

import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { initDb, isDbReady, getDbUnavailableReason, closeDb } from './db.ts';
import * as repo from './repository.ts';
import { registerAuthRoutes } from './auth/routes.ts';
import { observabilityMiddleware, registerObservabilityRoutes } from './observability.ts';
import { versionInfo } from './version.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

// Observability is mounted ahead of everything else, including the body parser and
// the CORS handler. Mounting it after `express.json()` would drop every request the
// parser rejects from the counts, and mounting it after CORS would drop every
// preflight — the two categories of traffic that are hardest to reason about from
// application logs alone.
app.use(observabilityMiddleware());

app.use(express.json({ limit: '1mb' }));

// CORS. Only the methods that actually exist are advertised (defect D-08).
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ---------------------------------------------------------------- fallback data

const seedCatalogPath = path.resolve(REPO_ROOT, 'src/data/seededCatalog.json');
let seededCatalog: any = null;

try {
  if (fs.existsSync(seedCatalogPath)) {
    seededCatalog = JSON.parse(fs.readFileSync(seedCatalogPath, 'utf-8'));
  }
} catch (err: any) {
  console.warn('[NEXG] seededCatalog.json unreadable:', err?.message ?? err);
}

/** Counts derived from the collection actually served, never from a summary. */
function fallbackCounts() {
  const merchants: any[] = seededCatalog?.merchants ?? [];
  return {
    totalCategories: (seededCatalog?.categories ?? []).length,
    totalSubcategories: (seededCatalog?.categories ?? []).reduce(
      (sum: number, c: any) => sum + (c.subcategories?.length ?? 0),
      0
    ),
    totalMerchants: merchants.length,
    totalItems: merchants.reduce((sum, m) => sum + (m.items?.length ?? 0), 0),
  };
}

async function activeCounts() {
  if (isDbReady()) {
    try {
      return await repo.getCounts();
    } catch (err: any) {
      console.error('[NEXG] count query failed, using fallback:', err?.message ?? err);
    }
  }
  return fallbackCounts();
}

// -------------------------------------------------------------------- helpers

/** Clamp pagination input so arbitrary values cannot reach the database (D-09). */
function parsePaging(rawLimit: unknown, rawOffset: unknown, defaultLimit = 50, maxLimit = 200) {
  const limit = Number.parseInt(String(rawLimit ?? ''), 10);
  const offset = Number.parseInt(String(rawOffset ?? ''), 10);
  return {
    limit: Number.isFinite(limit) ? Math.min(Math.max(limit, 1), maxLimit) : defaultLimit,
    offset: Number.isFinite(offset) ? Math.max(offset, 0) : 0,
  };
}

function requireDbOrFallback(res: Response): boolean {
  if (isDbReady()) return true;
  if (!seededCatalog) {
    res.status(503).json({
      error: 'Catalogue unavailable',
      detail: getDbUnavailableReason() ?? 'no data source configured',
    });
    return false;
  }
  return false;
}

// ------------------------------------------------- observability + version
// Registered after `express.json()` because /api/telemetry reads the browser's event
// batch from the request body, and before the static/404 handlers below so these
// paths are never answered by the SPA catch-all.
registerObservabilityRoutes(app);

// Identity of the running build. Flat `versionInfo()` rather than a wrapper: every
// field is already named for what it is, and a deploy check reads this instead of
// scraping a log line.
app.get('/api/version', (_req: Request, res: Response) => {
  res.json(versionInfo());
});

// --------------------------------------------------------------------- routes

// 1. Health — reports the ACTIVE source and its real counts.
app.get('/api/health', async (_req: Request, res: Response) => {
  const counts = await activeCounts();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    source: isDbReady() ? 'postgres' : 'seeded_json_fallback',
    postgresConfigured: Boolean(process.env.DATABASE_URL),
    postgresConnected: isDbReady(),
    postgresError: isDbReady() ? null : getDbUnavailableReason(),
    ...counts,
  });
});

// 2. Categories (21, with nested subcategories).
app.get('/api/categories', async (_req: Request, res: Response) => {
  if (isDbReady()) {
    try {
      return res.json({ categories: await repo.listCategories() });
    } catch (err: any) {
      console.error('[NEXG] /api/categories failed:', err?.message ?? err);
    }
  }
  requireDbOrFallback(res);
  res.json({ categories: seededCatalog?.categories ?? [] });
});

// 3. Merchants, paginated + filtered.
app.get('/api/merchants', async (req: Request, res: Response) => {
  const { limit, offset } = parsePaging(req.query.limit, req.query.offset);

  if (isDbReady()) {
    try {
      const result = await repo.listMerchants({
        category: req.query.category ? String(req.query.category) : undefined,
        subcategory: req.query.subcategory ? String(req.query.subcategory) : undefined,
        area: req.query.area ? String(req.query.area) : undefined,
        search: req.query.search ? String(req.query.search) : undefined,
        sort: req.query.sort ? String(req.query.sort) : undefined,
        limit,
        offset,
      });
      return res.json({ total: result.total, offset, limit, merchants: result.merchants });
    } catch (err: any) {
      console.error('[NEXG] /api/merchants failed:', err?.message ?? err);
    }
  }

  if (!requireDbOrFallback(res)) {
    let results: any[] = seededCatalog?.merchants ?? [];
    const { category, subcategory, area, search } = req.query;

    if (category) {
      const c = String(category).toLowerCase();
      results = results.filter(
        (m) => m.categoryId?.toLowerCase() === c || m.category?.toLowerCase() === c
      );
    }
    if (subcategory) {
      const s = String(subcategory).toLowerCase();
      results = results.filter(
        (m) => m.subcategoryId?.toLowerCase() === s || m.subcategory?.toLowerCase() === s
      );
    }
    if (area && area !== 'all') {
      const a = String(area).toLowerCase();
      results = results.filter((m) => m.nairobiArea?.toLowerCase() === a);
    }
    if (search) {
      const q = String(search).toLowerCase();
      results = results.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.subcategory?.toLowerCase().includes(q) ||
          m.category?.toLowerCase().includes(q)
      );
    }

    res.json({
      total: results.length,
      offset,
      limit,
      merchants: results.slice(offset, offset + limit),
      source: 'seeded_json_fallback',
    });
  }
});

// 4. Merchant detail (accepts id or slug).
app.get('/api/merchants/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isDbReady()) {
    try {
      const merchant = await repo.getMerchant(id);
      if (!merchant) return res.status(404).json({ error: 'Merchant not found' });
      return res.json(merchant);
    } catch (err: any) {
      console.error('[NEXG] /api/merchants/:id failed:', err?.message ?? err);
    }
  }

  if (!requireDbOrFallback(res)) {
    const merchant = (seededCatalog?.merchants ?? []).find(
      (m: any) => m.id === id || m.slug === id
    );
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });
    res.json(merchant);
  }
});

// 5. Search across merchants and items.
app.get('/api/search', async (req: Request, res: Response) => {
  const q = String(req.query.q ?? '').trim();
  if (!q) return res.status(400).json({ error: 'Query parameter "q" is required' });

  const { limit } = parsePaging(req.query.limit, 0, 20, 50);

  if (isDbReady()) {
    try {
      return res.json({ query: q, ...(await repo.search(q, limit)) });
    } catch (err: any) {
      console.error('[NEXG] /api/search failed:', err?.message ?? err);
    }
  }

  if (!requireDbOrFallback(res)) {
    const needle = q.toLowerCase();
    const merchants = (seededCatalog?.merchants ?? []).filter(
      (m: any) =>
        m.name?.toLowerCase().includes(needle) ||
        m.category?.toLowerCase().includes(needle) ||
        m.subcategory?.toLowerCase().includes(needle)
    );
    res.json({ query: q, merchants: merchants.slice(0, limit), items: [] });
  }
});

// 6. Neighbourhoods, for filter UI.
app.get('/api/areas', async (_req: Request, res: Response) => {
  if (isDbReady()) {
    try {
      return res.json({ areas: await repo.listAreas() });
    } catch (err: any) {
      console.error('[NEXG] /api/areas failed:', err?.message ?? err);
    }
  }
  const areas = Array.from(
    new Set((seededCatalog?.merchants ?? []).map((m: any) => m.nairobiArea).filter(Boolean))
  ).sort();
  res.json({ areas });
});

// ------------------------------------------------------------------- auth
// Mounted before the static handler below, so /api/auth/* can never be answered by
// the SPA fallback. registerAuthRoutes calls assertAuthConfigured() internally, which
// fails the BOOT when AUTH_SECRET is missing rather than failing the first login.
registerAuthRoutes(app);

// ------------------------------------------------------------ static + errors

// Serve the built SPA when it exists, so `npm run build && npm run server`
// produces a single deployable process.
const distDir = path.resolve(REPO_ROOT, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^(?!\/api\/).*/, (_req: Request, res: Response) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[NEXG] unhandled error:', err);
  // A body the parser rejects is the caller's fault and body-parser already labels it
  // (status 400). Answering 500 would mislead the caller AND put a permanent floor
  // under the error rate /api/metrics reports, which separates 4xx from 5xx on purpose.
  // 4xx errors are only reachable now that /api/telemetry accepts POST.
  const status = Number(err?.status ?? err?.statusCode);
  if (Number.isInteger(status) && status >= 400 && status < 500) {
    // The parser's message can quote the payload; it is logged above, not echoed.
    res.status(status).json({ error: 'Bad request' });
    return;
  }
  res.status(500).json({ error: 'Internal server error' });
});

// -------------------------------------------------------------------- startup

/** Start listening. Returns the http.Server so tests can close it. */
export async function start() {
  await initDb();
  return app.listen(PORT, () => {
    const source = isDbReady() ? 'PostgreSQL' : 'seeded JSON fallback';
    console.log(`[NEXG] API listening on http://localhost:${PORT} (source: ${source})`);
  });
}

export { app, closeDb };

// Only auto-start when executed directly, never on import (defect D-07).
const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (invokedDirectly) {
  start().catch((err) => {
    console.error('[NEXG] failed to start:', err);
    process.exit(1);
  });

  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.on(signal, async () => {
      console.log(`\n[NEXG] ${signal} received, shutting down`);
      await closeDb();
      process.exit(0);
    });
  }
}
