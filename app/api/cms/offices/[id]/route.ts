import { NextResponse } from 'next/server';
import { saveOfficeLocation, deleteOfficeLocation } from '@/lib/site-cms';
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

    const body = await req.json();
    const saved = await saveOfficeLocation({ ...body, id: Number(id) }, staff);
    return NextResponse.json({ success: true, office: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update office' }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await deleteOfficeLocation(Number(id), staff);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete office' }, { status: 400 });
  }
}
