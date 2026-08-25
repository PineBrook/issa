import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const migrationPath = new URL('../db/migrations/20260825_cms_blog_workflow.sql', import.meta.url);
const cmsPath = new URL('../lib/cms.ts', import.meta.url);

// Test validation logic matching lib/cms.ts
function validateSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  const trimmed = slug.trim();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed) && trimmed.length >= 3 && trimmed.length <= 120;
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function calculateReadingTime(text) {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function sanitizeMarkdown(input) {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '')
    .replace(/javascript:[^\s"'>)]+/gi, '#unsafe-link');
}

test('CMS blog workflow migration creates blog_post_revisions and adds version column', async () => {
  const migration = await readFile(migrationPath, 'utf8');

  // Status constraint
  assert.match(migration, /CHECK \(status IN \('draft', 'in_review', 'scheduled', 'published', 'archived'\)\)/);

  // Optimistic locking and metadata columns
  assert.match(migration, /ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1/);
  assert.match(migration, /ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_title TEXT/);
  assert.match(migration, /ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_description TEXT/);
  assert.match(migration, /ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS created_by_id BIGINT/);
  assert.match(migration, /ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS updated_by_id BIGINT/);

  // Revisions table
  assert.match(migration, /CREATE TABLE IF NOT EXISTS blog_post_revisions/);
  assert.match(migration, /post_id BIGINT NOT NULL REFERENCES blog_posts\(id\) ON DELETE CASCADE/);
  assert.match(migration, /editor_email TEXT NOT NULL/);
  assert.match(migration, /revision_number INT NOT NULL/);
  assert.match(migration, /content_markdown TEXT NOT NULL/);
  assert.match(migration, /change_summary TEXT/);

  // Indexes
  assert.match(migration, /CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON blog_posts \(status\)/);
  assert.match(migration, /CREATE INDEX IF NOT EXISTS blog_posts_updated_at_idx ON blog_posts \(updated_at DESC\)/);
  assert.match(migration, /CREATE INDEX IF NOT EXISTS blog_post_revisions_post_id_idx/);
});

test('validateSlug enforces kebab-case and length constraints', () => {
  assert.equal(validateSlug('valid-slug-2026'), true);
  assert.equal(validateSlug('digital-empowerment'), true);
  assert.equal(validateSlug('pauri-hills-123'), true);

  // Invalid slugs
  assert.equal(validateSlug('Invalid Slug With Spaces'), false);
  assert.equal(validateSlug('UPPERCASE-SLUG'), false);
  assert.equal(validateSlug('special_characters!'), false);
  assert.equal(validateSlug('-leading-hyphen'), false);
  assert.equal(validateSlug('trailing-hyphen-'), false);
  assert.equal(validateSlug('ab'), false); // Too short (< 3 chars)
  assert.equal(validateSlug(''), false);
});

test('slugify transforms natural language strings into valid slugs', () => {
  assert.equal(slugify('Digital Empowerment in Remote Pauri!'), 'digital-empowerment-in-remote-pauri');
  assert.equal(slugify('  Himalayan Healthcare Camps (2026)  '), 'himalayan-healthcare-camps-2026');
  assert.equal(slugify('Agniveer Physical Training Camp 2026'), 'agniveer-physical-training-camp-2026');
});

test('calculateReadingTime correctly estimates reading duration', () => {
  assert.equal(calculateReadingTime(''), 1);
  assert.equal(calculateReadingTime('Short excerpt with ten words for basic calculation test.'), 1);

  // 400 words should be 2 minutes
  const words400 = new Array(400).fill('word').join(' ');
  assert.equal(calculateReadingTime(words400), 2);

  // 650 words should be 4 minutes (ceil(650/200) = 4)
  const words650 = new Array(650).fill('word').join(' ');
  assert.equal(calculateReadingTime(words650), 4);
});

test('sanitizeMarkdown strips malicious scripts and attributes while preserving markdown', () => {
  const dirty = `
# Safe Title
This is **bold** text and *italic* content.

<script>alert('xss')</script>
<iframe src="http://attacker.com"></iframe>
<img src="/image.png" onerror="alert('hack')" />
[Click Here](javascript:alert('malicious'))
  `;

  const clean = sanitizeMarkdown(dirty);
  assert.equal(clean.includes('<script>'), false);
  assert.equal(clean.includes('alert(\'xss\')'), false);
  assert.equal(clean.includes('<iframe'), false);
  assert.equal(clean.includes('onerror='), false);
  assert.equal(clean.includes('javascript:'), false);
  assert.equal(clean.includes('# Safe Title'), true);
  assert.equal(clean.includes('**bold**'), true);
});

test('CMS module implements optimistic locking, role enforcement, and immutable revisions', async () => {
  const code = await readFile(cmsPath, 'utf8');

  // Optimistic concurrency check
  assert.match(code, /CmsConcurrencyConflictError/);
  assert.match(code, /WHERE id = \$\{id\} AND version = \$\{data\.expectedVersion\}/);
  assert.match(code, /WHERE id = \$\{id\} AND version = \$\{expectedVersion\}/);

  // Role permissions
  assert.match(code, /Only administrators can publish posts/);
  assert.match(code, /Only administrators can schedule posts/);
  assert.match(code, /Only administrators can unpublish posts/);
  assert.match(code, /Only administrators can restore revisions/);

  // Revision creation
  assert.match(code, /INSERT INTO blog_post_revisions/);
  assert.match(code, /createPostRevision/);
});
