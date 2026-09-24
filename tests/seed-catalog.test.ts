// tests/seed-catalog.test.ts
// Validates catalog data integrity, merchant counts, item counts, and schema compliance

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('NEXG Seed Catalog & PostgreSQL Integrity', () => {
  it('should have generated seed_excel.sql with valid transaction markers', () => {
    const sqlPath = path.resolve(process.cwd(), 'src/db/seed_excel.sql');
    expect(fs.existsSync(sqlPath)).toBe(true);
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
    expect(sqlContent).toContain('BEGIN;');
    expect(sqlContent).toContain('INSERT INTO categories');
    expect(sqlContent).toContain('INSERT INTO merchants');
    expect(sqlContent).toContain('COMMIT;');
  });

  it('should seed the complete catalogue in PostgreSQL without a JSON runtime catalogue', () => {
    const sqlPath = path.resolve(process.cwd(), 'src/db/seed_excel.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
    const categories = sqlContent.match(/^INSERT INTO categories /gm) ?? [];
    const merchants = sqlContent.match(/^INSERT INTO merchants /gm) ?? [];
    const items = sqlContent.match(/^INSERT INTO items /gm) ?? [];

    expect(categories).toHaveLength(21);
    expect(merchants).toHaveLength(640);
    expect(items.length).toBeGreaterThan(0);
    expect(fs.existsSync(path.resolve(process.cwd(), 'src/data/seededCatalog.json'))).toBe(false);
  });
});
