import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const migrationPath = new URL('../db/migrations/20260822_public_forms.sql', import.meta.url);

test('public forms migration has the required tables, email constraint, and panel indexes', async () => {
  const migration = await readFile(migrationPath, 'utf8');
  assert.match(migration, /CREATE TABLE IF NOT EXISTS contact_submissions/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS newsletter_subscriptions/);
  assert.match(migration, /email TEXT NOT NULL UNIQUE CHECK \(email = LOWER\(email\)\)/);
  assert.match(migration, /CREATE INDEX IF NOT EXISTS contact_submissions_status_created_idx/);
  assert.match(migration, /CREATE INDEX IF NOT EXISTS newsletter_subscriptions_status_created_idx/);
});

test('email normalization is idempotent', () => {
  const normalize = (value) => value.trim().toLowerCase();
  assert.equal(normalize('  Person@Example.COM '), 'person@example.com');
  assert.equal(normalize(normalize('Person@Example.COM')), 'person@example.com');
});
