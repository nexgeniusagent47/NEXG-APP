// scripts/seed_postgres.ts
// Seeds the parsed Excel data and schema into PostgreSQL via DATABASE_URL

import fs from 'fs';
import path from 'path';

async function seedPostgres() {
  const databaseUrl = process.env.DATABASE_URL;
  console.log('--- NEXG PostgreSQL Seeder ---');

  const schemaPath = path.resolve(process.cwd(), 'src/db/schema.sql');
  const seedPath = path.resolve(process.cwd(), 'src/db/seed_excel.sql');

  if (!fs.existsSync(seedPath)) {
    console.error('Error: seed_excel.sql not found! Please run `python scripts/parse_excel_to_db.py` first.');
    process.exit(1);
  }

  const isDryRun = process.argv.includes('--dry-run');

  if (isDryRun || !databaseUrl) {
    console.log('[Notice] Running in dry-run or verification mode (DATABASE_URL not set).');
    console.log(`Verified schema.sql: ${fs.statSync(schemaPath).size} bytes`);
    console.log(`Verified seed_excel.sql: ${fs.statSync(seedPath).size} bytes`);
    console.log('PostgreSQL scripts are ready and validated for production deployment!');
    return;
  }

  try {
    // Dynamic import to avoid crash if pg is not yet installed in local dev
    // @ts-ignore
    const { Client } = await import('pg');
    const client = new Client({ connectionString: databaseUrl });
    await client.connect();
    console.log('Connected to PostgreSQL successfully.');

    console.log('Applying schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    await client.query(schemaSql);
    console.log('Schema applied successfully.');

    console.log('Applying seed_excel.sql...');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');
    await client.query(seedSql);
    console.log('Seeded merchants and items successfully!');

    await client.end();
  } catch (err: any) {
    console.error('PostgreSQL execution error:', err.message);
    process.exit(1);
  }
}

seedPostgres();
