import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('staff panel enforces RBAC: CONTENT role users cannot see settings, logs, applications, and users', async () => {
  const panel = await readFile(new URL('../app/panel/staff-panel.tsx', import.meta.url), 'utf8');

  // Gated navigation tabs
  assert.match(panel, /\{isAdmin && \(\s*<button[^>]*onClick=\{\(\) => setCurrentTab\('settings'\)\}/);
  assert.match(panel, /\{isAdmin && \(\s*<button[^>]*onClick=\{\(\) => setCurrentTab\('applications'\)\}/);
  assert.match(panel, /\{isAdmin && \(\s*<button[^>]*onClick=\{\(\) => setCurrentTab\('users'\)\}/);
  assert.match(panel, /\{isAdmin && \(\s*<button[^>]*onClick=\{\(\) => setCurrentTab\('audit'\)\}/);

  // Gated tab bodies
  assert.match(panel, /currentTab === 'settings' && isAdmin/);
  assert.match(panel, /currentTab === 'applications' && isAdmin/);
  assert.match(panel, /currentTab === 'users' && isAdmin/);
  assert.match(panel, /currentTab === 'audit' && isAdmin/);

  // Automated tab reset hook if non-admin is on an admin tab
  assert.match(panel, /staff\.role === 'CONTENT' && \(currentTab === 'settings' \|\| currentTab === 'users' \|\| currentTab === 'applications' \|\| currentTab === 'audit'\)/);
  
  // Background polling isolation: refreshUsersList & refreshApplicationsList require isAdmin
  assert.match(panel, /const refreshUsersList = useCallback\(async \(\) => \{\s*if \(!isAdmin\) return;/);
  assert.match(panel, /const refreshApplicationsList = useCallback\(async \(\) => \{\s*if \(!isAdmin\) return;/);
});

test('server page (app/panel/page.tsx) isolates sensitive admin data from CONTENT users', async () => {
  const page = await readFile(new URL('../app/panel/page.tsx', import.meta.url), 'utf8');

  // allUsers only fetched and passed to Admins
  assert.match(page, /isAdmin \? getAllStaffUsers\(\)\.catch\(\(\) => \[\]\) : Promise\.resolve\(\[\]\)/);

  // allApplications only fetched and passed to Admins
  assert.match(page, /isAdmin \? getPanelCareerApplications\(\)\.catch\(\(\) => \[\]\) : Promise\.resolve\(\[\]\)/);

  // siteSettings only fetched and passed to Admins
  assert.match(page, /isAdmin \? getSiteSettings\(\)\.catch\(\(\) => undefined\) : Promise\.resolve\(undefined\)/);

  // auditEvents only fetched and passed to Admins
  assert.match(page, /isAdmin \? getAuditEvents\(\)\.catch\(\(\) => \[\]\) : Promise\.resolve\(\[\]\)/);
});

test('API endpoints enforce ADMIN requirement for settings, users, applications, and audit logs', async () => {
  const usersRoute = await readFile(new URL('../app/api/staff/users/route.ts', import.meta.url), 'utf8');
  assert.match(usersRoute, /if \(!current \|\| current\.role !== 'ADMIN'\)/);

  const settingsRoute = await readFile(new URL('../app/api/cms/settings/route.ts', import.meta.url), 'utf8');
  assert.match(settingsRoute, /if \(!staff \|\| staff\.role !== 'ADMIN'\)/);

  const siteCmsLib = await readFile(new URL('../lib/site-cms.ts', import.meta.url), 'utf8');
  assert.match(siteCmsLib, /if \(!currentStaff \|\| currentStaff\.role !== 'ADMIN'\) \{\s*throw new CmsForbiddenError\(\);/);

  const auditRoute = await readFile(new URL('../app/api/cms/audit-log/route.ts', import.meta.url), 'utf8');
  assert.match(auditRoute, /if \(!staff \|\| staff\.role !== 'ADMIN'\)/);

  const appsRoute = await readFile(new URL('../app/api/careers/applications/route.ts', import.meta.url), 'utf8');
  assert.match(appsRoute, /staff\.role !== 'ADMIN'/);
});
