import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('staff profile migration permits only ADMIN and CONTENT roles', async () => {
  const migration = await readFile(new URL('../db/migrations/20260824_staff_profiles.sql', import.meta.url), 'utf8');
  assert.match(migration, /CREATE TABLE IF NOT EXISTS staff_profiles/);
  assert.match(migration, /email TEXT NOT NULL UNIQUE CHECK \(email = LOWER\(email\) AND email LIKE '%@pinebrooktechnologies\.com'\)/);
  assert.match(migration, /role TEXT NOT NULL CHECK \(role IN \('ADMIN', 'CONTENT'\)\)/);
  assert.match(migration, /status TEXT NOT NULL DEFAULT 'active' CHECK \(status IN \('active', 'suspended'\)\)/);
  assert.match(migration, /auth_user_id TEXT UNIQUE/);
  assert.match(migration, /CREATE TYPE staff_role_access_name AS ENUM \('admin', 'content'\)/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS staff_email_access/);
  assert.match(migration, /role_access_name staff_role_access_name NOT NULL/);
});

test('staff access requests migration adds no_access to enum and updates role check', async () => {
  const migration = await readFile(new URL('../db/migrations/20260825_staff_access_requests.sql', import.meta.url), 'utf8');
  assert.match(migration, /ALTER TYPE staff_role_access_name ADD VALUE IF NOT EXISTS 'no_access'/);
  assert.match(migration, /CREATE TYPE staff_role_type AS ENUM \('no_access', 'admin', 'content'\)/);
  assert.match(migration, /ALTER TABLE staff_profiles ADD CONSTRAINT staff_profiles_role_check/);
  assert.match(migration, /CHECK \(role IN \('NO_ACCESS', 'ADMIN', 'CONTENT', 'no_access', 'admin', 'content'\)\)/);
  assert.match(migration, /CHECK \(email = LOWER\(email\) AND email LIKE '%@pinebrooktechnologies\.com'\)/);
});

test('new staff profiles start with no access and derive first name without a regex', async () => {
  const staff = await readFile(new URL('../lib/staff.ts', import.meta.url), 'utf8');
  assert.match(staff, /return email\.split\('@'\)\[0\]\.split\('\.'\)\[0\];/);
  assert.match(staff, /\$\{email\}, 'no_access', 'active', NOW\(\)/);
});

test('auth proxy permits only company email OTP sign-in', async () => {
  const route = await readFile(new URL('../app/api/auth/[...path]/route.ts', import.meta.url), 'utf8');
  assert.match(route, /email-otp\/send-verification-otp/);
  assert.match(route, /sign-in\/email-otp/);
  assert.match(route, /parts\.length === 2 && Boolean\(parts\[0\]\) && parts\[1\] === companyDomain/);
  assert.doesNotMatch(route, /sign-in\/magic-link|magic-link\/verify/);
});

test('auth server derives Neon Auth base URL from database URL when env var is absent', async () => {
  const server = await readFile(new URL('../lib/auth/server.ts', import.meta.url), 'utf8');
  assert.match(server, /deriveNeonAuthBaseUrl/);
  assert.match(server, /resolveBaseUrl/);
  assert.match(server, /ep-falling-cell-b3uyu248/);
});
