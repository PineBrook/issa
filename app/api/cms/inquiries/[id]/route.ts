import { NextResponse } from 'next/server';
import { updateContactSubmissionStatus } from '@/lib/site-cms';
import { getCurrentStaff } from '@/lib/staff';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { status } = await req.json();
    if (!status || !['new', 'in_progress', 'resolved', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await updateContactSubmissionStatus(Number(id), status, staff);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update inquiry status' }, { status: 400 });
  }
}
