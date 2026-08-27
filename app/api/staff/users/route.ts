import { NextResponse } from 'next/server';
import {
  getAllStaffUsers,
  updateStaffUserRole,
  updateStaffUserStatus,
  deleteStaffUser,
  getCurrentStaff,
  type StaffRole,
} from '@/lib/staff';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const current = await getCurrentStaff();
  if (!current || current.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
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
    const { userId, role, status } = body as {
      userId: number;
      role?: StaffRole;
      status?: 'active' | 'suspended';
    };

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (role) {
      const result = await updateStaffUserRole(Number(userId), role);
      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }
    }

    if (status) {
      const result = await updateStaffUserStatus(Number(userId), status);
      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }
    }

    const updatedUsers = await getAllStaffUsers();
    return NextResponse.json({ success: true, message: 'User updated successfully', users: updatedUsers });
  } catch {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const current = await getCurrentStaff();
  if (!current || current.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get('userId'));

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const result = await deleteStaffUser(userId);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const updatedUsers = await getAllStaffUsers();
    return NextResponse.json({ success: true, message: result.message, users: updatedUsers });
  } catch {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
