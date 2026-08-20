import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const migrationPath = new URL('../db/migrations/20260820_blog_posts.sql', import.meta.url);

test('blog migration creates five published posts with local media', async () => {
  const migration = await readFile(migrationPath, 'utf8');
  const slugs = [
    'digital-empowerment-in-remote-pauri',
    'reaching-remote-mountain-villages',
    'preparing-young-people-for-work',
    'reclaiming-ancestral-water-bodies',
    'agniveer-physical-training-camp-2026',
  ];
  const media = [
    '/isssa-story-digital-inclusion-v2.png',
    '/isssa-healthcare-program-v2.png',
    '/isssa-entrepreneurship-program-v2.png',
    '/isssa-story-water-v2.png',
    '/isssa-career-program-v2.png',
  ];

  assert.match(migration, /CREATE TABLE IF NOT EXISTS blog_posts/);
  assert.match(migration, /ON CONFLICT \(slug\) DO UPDATE/);
  assert.match(migration, /'2026-08-20T00:00:00\+05:30'/);
  assert.equal(new Set(slugs).size, 5);

  for (const slug of slugs) assert.match(migration, new RegExp(`'${slug}'`));
  for (const asset of media) {
    assert.match(migration, new RegExp(`'${asset}'`));
    await stat(new URL(`../public${asset}`, import.meta.url));
  }
});
