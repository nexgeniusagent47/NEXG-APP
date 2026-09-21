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

  it('should have generated seededCatalog.json with 21 categories and over 600 merchants', () => {
    const jsonPath = path.resolve(process.cwd(), 'src/data/seededCatalog.json');
    expect(fs.existsSync(jsonPath)).toBe(true);
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    expect(data.summary.totalCategories).toBe(21);
    expect(data.summary.totalMerchants).toBe(640);
    expect(data.summary.totalItems).toBeGreaterThan(14000);
    expect(data.categories.length).toBe(21);
  });

  it('should verify all merchants have valid Nairobi areas and ratings', () => {
    const jsonPath = path.resolve(process.cwd(), 'src/data/seededCatalog.json');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    data.merchants.forEach((m: any) => {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.nairobiArea).toBeDefined();
      expect(m.rating).toBeGreaterThanOrEqual(4.0);
      expect(m.rating).toBeLessThanOrEqual(5.0);
      expect(m.heroImage).toMatch(/^https?:\/\//);
    });
  });
});
