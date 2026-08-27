import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
if (!connectionString) throw new Error('DATABASE_URL or DB_CONN_KEY must contain the Neon connection string.');

const sql = neon(connectionString);
const migration = await readFile(new URL('../db/migrations/20260828_complete_site_cms.sql', import.meta.url), 'utf8');
const statements = migration
  .split(/^-- migrate:statement\s*$/m)
  .slice(1)
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}

const tables = await sql`
  SELECT tablename
  FROM pg_tables
  WHERE schemaname = 'public' AND tablename IN ('site_settings', 'hero_slides', 'home_sections', 'impact_content', 'programs_content', 'faqs', 'office_locations', 'media_assets', 'legal_pages')
`;

console.log(`Complete site CMS migration finished successfully. ${tables.length} tables verified.`);
