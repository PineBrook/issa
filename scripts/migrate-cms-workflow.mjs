import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
if (!connectionString) throw new Error('DATABASE_URL or DB_CONN_KEY must contain the Neon connection string.');

const sql = neon(connectionString);
const migration = await readFile(new URL('../db/migrations/20260825_cms_blog_workflow.sql', import.meta.url), 'utf8');
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
  WHERE schemaname = 'public' AND tablename = 'blog_post_revisions'
`;

if (tables.length !== 1) {
  throw new Error('The CMS workflow migration did not create the blog_post_revisions table.');
}

console.log('CMS blog workflow migration complete: blog_post_revisions, optimistic locking, and workflow status constraints are active.');
