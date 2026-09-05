import { NextResponse } from 'next/server';
import { deleteMediaAsset } from '@/lib/site-cms';
import { getCurrentStaff } from '@/lib/staff';

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

    await deleteMediaAsset(Number(id), staff);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete media asset' }, { status: 400 });
  }
}
