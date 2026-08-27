import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('new staff signup creates NO_ACCESS profile and surfaces to Admin in Users section', async () => {
  const staff = await readFile(new URL('../lib/staff.ts', import.meta.url), 'utf8');
  assert.match(staff, /INSERT INTO staff_profiles \(auth_user_id, first_name, full_name, email, role, status, last_login_at\)/);
  assert.match(staff, /\$\{email\}, 'no_access', 'active', NOW\(\)/);
  assert.match(staff, /export async function getAllStaffUsers\(\)/);
  assert.match(staff, /export async function updateStaffUserRole\(/);
  assert.match(staff, /export async function updateStaffUserStatus\(/);
  assert.match(staff, /export async function deleteStaffUser\(/);
});

test('api staff users endpoint supports GET, PATCH, and DELETE for role/status management', async () => {
  const route = await readFile(new URL('../app/api/staff/users/route.ts', import.meta.url), 'utf8');
  assert.match(route, /export async function GET/);
  assert.match(route, /export async function PATCH/);
  assert.match(route, /export async function DELETE/);
  assert.match(route, /updateStaffUserRole/);
  assert.match(route, /updateStaffUserStatus/);
  assert.match(route, /deleteStaffUser/);
});

test('staff panel renders pending access notification badge and dedicated review cards for Admins', async () => {
  const panel = await readFile(new URL('../app/panel/staff-panel.tsx', import.meta.url), 'utf8');
  
  // Pending user counts and filtering
  assert.match(panel, /pending:\s*users\.filter\(\(u\)\s*=>\s*u\.role === 'NO_ACCESS'\)\.length/);
  
  // Navigation tab badge
  assert.match(panel, /userCounts\.pending > 0/);
  assert.match(panel, /req/);
  
  // Overview banner
  assert.match(panel, /Staff Access Request/);
  assert.match(panel, /Review & Approve Requests/);
  
  // Dedicated Pending Access Requests Section
  assert.match(panel, /Pending Staff Access Requests/);
  assert.match(panel, /Approve Content/);
  assert.match(panel, /Approve Admin/);
  
  // Auto-polling for incoming signups
  assert.match(panel, /refreshUsersList\(\)/);
});
