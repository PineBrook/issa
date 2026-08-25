import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
if (!connectionString) throw new Error('DATABASE_URL or DB_CONN_KEY must contain the Neon connection string.');

const migrationFiles = [
  '../db/migrations/20260824_staff_profiles.sql',
  '../db/migrations/20260825_staff_access_requests.sql',
];

const sql = neon(connectionString);

for (const file of migrationFiles) {
  const migration = await readFile(new URL(file, import.meta.url), 'utf8');
  const statements = migration.split(/^-- migrate:statement\s*$/m).slice(1).map((statement) => statement.trim()).filter(Boolean);
  for (const statement of statements) await sql.query(statement);
}

const tables = await sql`
  SELECT tablename
  FROM pg_tables
  WHERE schemaname = 'public' AND tablename IN ('staff_profiles', 'staff_email_access')
`;
if (tables.length !== 2) throw new Error('The staff auth migration did not create both staff tables.');
console.log('Staff auth migration complete: pre-provision ADMIN and CONTENT profiles before inviting staff.');
