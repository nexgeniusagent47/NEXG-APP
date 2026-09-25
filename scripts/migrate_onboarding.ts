import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required');

  const migrationPath = path.resolve(process.cwd(), 'src/db/migrations/20260925_onboarding_applications.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  const pool = new Pool({ connectionString, max: 1, connectionTimeoutMillis: 5000 });

  try {
    await pool.query(sql);
    console.log('Applied onboarding applications migration.');
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Onboarding migration failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
