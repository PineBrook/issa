import 'server-only';

import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth/server';
import { hasValidSessionLimit, SESSION_LIMIT_COOKIE } from '@/lib/auth/session-limit';

export type StaffRole = 'ADMIN' | 'CONTENT' | 'NO_ACCESS';

export const STAFF_EMAIL_DOMAIN = '@pinebrooktechnologies.com';

export interface StaffProfile {
  id: number;
  firstName: string;
  fullName: string;
  email: string;
  role: StaffRole;
  status: 'active' | 'suspended';
  createdAt?: string;
  lastLoginAt?: string | null;
}

export function isStaffEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(STAFF_EMAIL_DOMAIN);
}

export function normalizeRole(rawRole: unknown): StaffRole {
  const normalized = String(rawRole ?? '').trim().toUpperCase();
  if (normalized === 'ADMIN') return 'ADMIN';
  if (normalized === 'CONTENT') return 'CONTENT';
  return 'NO_ACCESS';
}

function extractFirstName(_fullName: string, email: string): string {
  return email.split('@')[0].split('.')[0];
}

export async function getAuthSessionUser() {
  const cookieStore = await cookies();
  if (!hasValidSessionLimit(cookieStore.get(SESSION_LIMIT_COOKIE)?.value)) return null;

  const { data: session } = await auth.getSession();
  return session?.user ?? null;
}

export async function getCurrentStaff(): Promise<StaffProfile | null> {
  const user = await getAuthSessionUser();
  const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
  if (!user?.id || !user.email || !connectionString) return null;

  const email = user.email.trim().toLowerCase();
  if (!isStaffEmail(email)) return null;

  const sql = neon(connectionString);

  // Check for existing profile in staff_profiles
  const profiles = await sql`
    SELECT id, COALESCE(first_name, SPLIT_PART(full_name, ' ', 1)) AS first_name, full_name, email, role, status, created_at, last_login_at
    FROM staff_profiles
    WHERE email = ${email} OR auth_user_id = ${user.id}
    ORDER BY id ASC
    LIMIT 1
  `;

  if (profiles.length > 0) {
    const p = profiles[0];
    const role = normalizeRole(p.role);
    const fullName = String(p.full_name || user.name || email);
    const firstName = String(p.first_name || extractFirstName(fullName, email));

    if (p.status === 'active') {
      await sql`
        UPDATE staff_profiles
        SET auth_user_id = ${user.id},
            full_name = ${user.name?.trim() || fullName},
            first_name = ${firstName},
            last_login_at = NOW(),
            updated_at = NOW()
        WHERE id = ${p.id}
      `;
    }

    return {
      id: Number(p.id),
      firstName,
      fullName,
      email: String(p.email),
      role,
      status: p.status as 'active' | 'suspended',
      createdAt: p.created_at ? new Date(p.created_at).toISOString() : undefined,
      lastLoginAt: p.last_login_at ? new Date(p.last_login_at).toISOString() : null,
    };
  }

  const fullName = user.name?.trim() || email.split('@')[0];
  const firstName = extractFirstName(fullName, email);
  const inserted = await sql`
    INSERT INTO staff_profiles (auth_user_id, first_name, full_name, email, role, status, last_login_at)
    VALUES (${user.id}, ${firstName}, ${fullName}, ${email}, 'no_access', 'active', NOW())
    RETURNING id, COALESCE(first_name, SPLIT_PART(full_name, ' ', 1)) AS first_name, full_name, email, role, status, created_at, last_login_at
  `;
  const p = inserted[0];
  return {
    id: Number(p.id), firstName: String(p.first_name || firstName), fullName: String(p.full_name),
    email: String(p.email), role: 'NO_ACCESS', status: 'active',
    createdAt: p.created_at ? new Date(p.created_at).toISOString() : undefined,
    lastLoginAt: p.last_login_at ? new Date(p.last_login_at).toISOString() : null,
  };
}

export async function requestStaffAccess(): Promise<{ success: boolean; message: string; profile: StaffProfile | null }> {
  const profile = await getCurrentStaff();
  return profile
    ? { success: true, message: 'Profile created. Waiting for an admin to assign a role.', profile }
    : { success: false, message: `Only ${STAFF_EMAIL_DOMAIN} email addresses are permitted for staff access.`, profile: null };
}

export async function getAllStaffUsers(): Promise<StaffProfile[]> {
  const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
  if (!connectionString) return [];

  const sql = neon(connectionString);
  const rows = await sql`
    SELECT id, COALESCE(first_name, SPLIT_PART(full_name, ' ', 1)) AS first_name, full_name, email, role, status, created_at, last_login_at
    FROM staff_profiles
    WHERE email LIKE '%@pinebrooktechnologies.com'
    ORDER BY created_at DESC, id DESC
  `;

  return rows.map((r) => {
    const fullName = String(r.full_name || '');
    const email = String(r.email || '');
    const firstName = String(r.first_name || extractFirstName(fullName, email));
    return {
      id: Number(r.id),
      firstName,
      fullName,
      email,
      role: normalizeRole(r.role),
      status: r.status as 'active' | 'suspended',
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : undefined,
      lastLoginAt: r.last_login_at ? new Date(r.last_login_at).toISOString() : null,
    };
  });
}

export async function updateStaffUserRole(targetUserId: number, newRole: StaffRole): Promise<{ success: boolean; message: string }> {
  const currentStaff = await getCurrentStaff();
  if (!currentStaff || currentStaff.role !== 'ADMIN') {
    return { success: false, message: 'Unauthorized: Only admins can update user roles.' };
  }

  const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
  if (!connectionString) return { success: false, message: 'Database configuration missing.' };

  const sql = neon(connectionString);
  const roleValue = newRole === 'ADMIN' ? 'ADMIN' : newRole === 'CONTENT' ? 'CONTENT' : 'no_access';

  await sql`
    UPDATE staff_profiles
    SET role = ${roleValue}, updated_at = NOW()
    WHERE id = ${targetUserId} AND email LIKE '%@pinebrooktechnologies.com'
  `;

  return { success: true, message: 'User role updated successfully.' };
}

export async function updateStaffUserStatus(targetUserId: number, newStatus: 'active' | 'suspended'): Promise<{ success: boolean; message: string }> {
  const currentStaff = await getCurrentStaff();
  if (!currentStaff || currentStaff.role !== 'ADMIN') {
    return { success: false, message: 'Unauthorized: Only admins can update user status.' };
  }

  if (currentStaff.id === targetUserId && newStatus === 'suspended') {
    return { success: false, message: 'You cannot suspend your own admin account.' };
  }

  const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
  if (!connectionString) return { success: false, message: 'Database configuration missing.' };

  const sql = neon(connectionString);
  await sql`
    UPDATE staff_profiles
    SET status = ${newStatus}, updated_at = NOW()
    WHERE id = ${targetUserId} AND email LIKE '%@pinebrooktechnologies.com'
  `;

  return { success: true, message: `User status set to ${newStatus}.` };
}

export async function deleteStaffUser(targetUserId: number): Promise<{ success: boolean; message: string }> {
  const currentStaff = await getCurrentStaff();
  if (!currentStaff || currentStaff.role !== 'ADMIN') {
    return { success: false, message: 'Unauthorized: Only admins can remove staff accounts.' };
  }

  if (currentStaff.id === targetUserId) {
    return { success: false, message: 'You cannot delete your own admin account.' };
  }

  const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
  if (!connectionString) return { success: false, message: 'Database configuration missing.' };

  const sql = neon(connectionString);
  await sql`
    DELETE FROM staff_profiles
    WHERE id = ${targetUserId} AND email LIKE '%@pinebrooktechnologies.com'
  `;

  return { success: true, message: 'User request/account removed successfully.' };
}

