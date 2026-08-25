import { NextResponse } from 'next/server';
import { getAllStaffUsers, updateStaffUserRole, getCurrentStaff, type StaffRole } from '@/lib/staff';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const current = await getCurrentStaff();
  if (!current || (current.role !== 'ADMIN' && current.role !== 'CONTENT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const users = await getAllStaffUsers();
  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const current = await getCurrentStaff();
  if (!current || current.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { userId, role } = body as { userId: number; role: StaffRole };

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });
    }

    const result = await updateStaffUserRole(Number(userId), role);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
