import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;

if (!connectionString) {
  throw new Error('DATABASE_URL or DB_CONN_KEY must contain the Neon connection string.');
}

const migration = await readFile(new URL('../db/migrations/20260826_resume_files_neon_storage.sql', import.meta.url), 'utf8');
const statements = migration
  .split(/^-- migrate:statement\s*$/m)
  .slice(1)
  .map((statement) => statement.trim())
  .filter(Boolean);

const sql = neon(connectionString);

for (const statement of statements) {
  await sql.query(statement);
}

const columns = await sql`
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_name = 'resume_files' AND column_name = 'file_data'
`;

if (columns.length === 0) {
  throw new Error('Migration failed: file_data column does not exist on resume_files.');
}

console.log('Resume files Neon storage migration complete: file_data column is active on resume_files.');
