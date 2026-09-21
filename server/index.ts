// server/index.ts
// NEXG Concierge Express Backend with PostgreSQL connectivity & seeded JSON fallback

import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Load the seeded JSON cache for instant low-latency serving or fallback
const seedCatalogPath = path.resolve(process.cwd(), 'src/data/seededCatalog.json');
let seededCatalog: any = null;

try {
  if (fs.existsSync(seedCatalogPath)) {
    const rawData = fs.readFileSync(seedCatalogPath, 'utf-8');
    seededCatalog = JSON.parse(rawData);
    console.log(`[NEXG Server] Seeded catalog loaded: ${seededCatalog?.summary?.totalMerchants} merchants, ${seededCatalog?.summary?.totalItems} items`);
  }
} catch (err: any) {
  console.warn('[NEXG Server] Notice: seededCatalog.json could not be loaded:', err.message);
}

// 1. Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    postgresConfigured: !!process.env.DATABASE_URL,
    catalogSource: seededCatalog ? 'seeded_json_cache' : 'none',
    totalMerchants: seededCatalog?.summary?.totalMerchants || 0,
    totalItems: seededCatalog?.summary?.totalItems || 0,
  });
});

// 2. Categories
app.get('/api/categories', (req: Request, res: Response) => {
  if (!seededCatalog) {
    return res.status(503).json({ error: 'Catalog data unavailable' });
  }
  res.json({
    categories: seededCatalog.categories || [],
  });
});

// 3. Merchants
app.get('/api/merchants', (req: Request, res: Response) => {
  if (!seededCatalog) {
    return res.status(503).json({ error: 'Catalog data unavailable' });
  }

  const { category, subcategory, area, search, limit = '50', offset = '0' } = req.query;

  let results = seededCatalog.merchants || [];

  if (category) {
    const catStr = String(category).toLowerCase();
    results = results.filter(
      (m: any) =>
        m.categoryId?.toLowerCase() === catStr ||
        m.category?.toLowerCase() === catStr
    );
  }

  if (subcategory) {
    const subStr = String(subcategory).toLowerCase();
    results = results.filter(
      (m: any) =>
        m.subcategoryId?.toLowerCase() === subStr ||
        m.subcategory?.toLowerCase() === subStr
    );
  }

  if (area && area !== 'all') {
    const areaStr = String(area).toLowerCase();
    results = results.filter(
      (m: any) => m.nairobiArea?.toLowerCase() === areaStr
    );
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (m: any) =>
        m.name?.toLowerCase().includes(q) ||
        m.subcategory?.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q)
    );
  }

  const start = parseInt(String(offset), 10) || 0;
  const count = parseInt(String(limit), 10) || 50;

  res.json({
    total: results.length,
    offset: start,
    limit: count,
    merchants: results.slice(start, start + count),
  });
});

// 4. Merchant Detail
app.get('/api/merchants/:id', (req: Request, res: Response) => {
  if (!seededCatalog) {
    return res.status(503).json({ error: 'Catalog data unavailable' });
  }

  const { id } = req.params;
  const merchant = (seededCatalog.merchants || []).find(
    (m: any) => m.id === id || m.slug === id
  );

  if (!merchant) {
    return res.status(404).json({ error: 'Merchant not found' });
  }

  res.json(merchant);
});

// Start Server if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[NEXG Server] Listening on http://localhost:${PORT}`);
  });
}

export default app;
