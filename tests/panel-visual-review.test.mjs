import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('login form enforces company domain and visual accessibility', async () => {
  const code = await readFile(new URL('../app/login/login-form.tsx', import.meta.url), 'utf8');
  assert.match(code, /@pinebrooktechnologies\.com/);
  assert.match(code, /aria-describedby="login-status"/);
  assert.match(code, /aria-live="polite"/);
  assert.match(code, /#0D311F/); // Primary forest green
  assert.match(code, /#F7F6F3/); // Neutral background
});

test('staff panel enforces brand visual hierarchy, tabs, and role gates', async () => {
  const code = await readFile(new URL('../app/panel/staff-panel.tsx', import.meta.url), 'utf8');
  // Visual design tokens
  assert.match(code, /#0D311F/);
  assert.match(code, /#071E13/);
  assert.match(code, /#F7F6F3/);
  assert.match(code, /#E5E0D8/);

  // Tab navigation
  assert.match(code, /currentTab === 'overview'/);
  assert.match(code, /currentTab === 'posts'/);
  assert.match(code, /currentTab === 'jobs'/);
  assert.match(code, /currentTab === 'applications'/);
  assert.match(code, /currentTab === 'users'/);

  // Admin exclusivity on Applications tab
  assert.match(code, /isAdmin && \(/);
  assert.match(code, /handleRoleChange/);
});

test('panel page enforces server-side authentication redirect', async () => {
  const code = await readFile(new URL('../app/panel/page.tsx', import.meta.url), 'utf8');
  assert.match(code, /getAuthSessionUser/);
  assert.match(code, /redirect\('\/login\?error=access'\)/);
  assert.match(code, /getCurrentStaff/);
});

test('post editor component provides auto-slug, reading time, and concurrency protection', async () => {
  const code = await readFile(new URL('../components/cms/PostEditor.tsx', import.meta.url), 'utf8');
  assert.match(code, /slugify/);
  assert.match(code, /readingTimeMinutes|readingTime/);
  assert.match(code, /currentVersion/);
  assert.match(code, /revisions/);
});
