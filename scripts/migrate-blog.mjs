import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DB_CONN_KEY;

if (!connectionString) {
  throw new Error('DB_CONN_KEY must contain the Neon connection string.');
}

const migration = await readFile(new URL('../db/migrations/20260820_blog_posts.sql', import.meta.url), 'utf8');
const statements = migration
  .split(/^-- migrate:statement\s*$/m)
  .slice(1)
  .map((statement) => statement.trim())
  .filter(Boolean);

const sql = neon(connectionString);

for (const statement of statements) {
  await sql.query(statement);
}

const expectedSlugs = [
  'digital-empowerment-in-remote-pauri',
  'reaching-remote-mountain-villages',
  'preparing-young-people-for-work',
  'reclaiming-ancestral-water-bodies',
  'agniveer-physical-training-camp-2026',
];
const posts = await sql`
  SELECT slug, cover_image_path
  FROM blog_posts
  WHERE slug = ANY(${expectedSlugs})
  ORDER BY slug
`;

if (posts.length !== expectedSlugs.length || posts.some((post) => !post.cover_image_path)) {
  throw new Error('The blog migration did not create every expected post with media.');
}

console.log(`Blog migration complete: ${posts.length} expected posts available in blog_posts.`);
