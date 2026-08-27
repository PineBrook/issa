import { NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/site-cms';
import { getCurrentStaff } from '@/lib/staff';

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function POST(req: Request) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required for settings' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await updateSiteSettings(body, staff);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update settings' }, { status: 400 });
  }
}
