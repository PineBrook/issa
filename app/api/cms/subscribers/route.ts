import { NextResponse } from 'next/server';
import { getNewsletterSubscribers } from '@/lib/site-cms';
import { getCurrentStaff } from '@/lib/staff';

export async function GET() {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const subscribers = await getNewsletterSubscribers();
    return NextResponse.json({ subscribers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch subscribers' }, { status: 400 });
  }
}
