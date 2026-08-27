import { NextResponse } from 'next/server';
import { getOfficeLocations, saveOfficeLocation } from '@/lib/site-cms';
import { getCurrentStaff } from '@/lib/staff';

export async function GET() {
  const offices = await getOfficeLocations();
  return NextResponse.json({ offices });
}

export async function POST(req: Request) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.city || !body.address) {
      return NextResponse.json({ error: 'City and address are required.' }, { status: 400 });
    }

    const saved = await saveOfficeLocation(body, staff);
    return NextResponse.json({ success: true, office: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save office' }, { status: 400 });
  }
}
