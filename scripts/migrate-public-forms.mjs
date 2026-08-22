import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
if (!connectionString) throw new Error('DATABASE_URL or DB_CONN_KEY must contain the Neon connection string.');

const migration = await readFile(new URL('../db/migrations/20260822_public_forms.sql', import.meta.url), 'utf8');
const statements = migration.split(/^-- migrate:statement\s*$/m).slice(1).map((statement) => statement.trim()).filter(Boolean);
const sql = neon(connectionString);
for (const statement of statements) await sql.query(statement);

const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = ANY(${['contact_submissions', 'newsletter_subscriptions']})`;
if (tables.length !== 2) throw new Error('The public forms migration did not create both required tables.');
console.log('Public forms migration complete: contact and newsletter tables are available.');
