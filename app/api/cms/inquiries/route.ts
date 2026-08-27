import { NextResponse } from 'next/server';
import { getContactSubmissions } from '@/lib/site-cms';
import { getCurrentStaff } from '@/lib/staff';

export async function GET(req: Request) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get('status') || undefined;
    const search = url.searchParams.get('search') || undefined;

    const inquiries = await getContactSubmissions({ status, search });
    return NextResponse.json({ inquiries });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch inquiries' }, { status: 400 });
  }
}
