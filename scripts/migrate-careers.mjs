import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;

if (!connectionString) {
  throw new Error('DATABASE_URL or DB_CONN_KEY must contain the Neon connection string.');
}

const migration = await readFile(new URL('../db/migrations/20260821_careers_and_resumes.sql', import.meta.url), 'utf8');
const statements = migration
  .split(/^-- migrate:statement\s*$/m)
  .slice(1)
  .map((statement) => statement.trim())
  .filter(Boolean);

const sql = neon(connectionString);

for (const statement of statements) {
  await sql.query(statement);
}

const expectedSlugs = ['edu-expert', 'health-practitioner', 'program-manager'];
const jobs = await sql`
  SELECT slug, title, status
  FROM job_openings
  WHERE slug = ANY(${expectedSlugs})
  ORDER BY display_order ASC
`;

if (jobs.length !== expectedSlugs.length || jobs.some((job) => job.status !== 'active')) {
  throw new Error('The careers migration did not create every expected active job opening.');
}

console.log(`Careers migration complete: ${jobs.length} active job openings available in job_openings.`);
