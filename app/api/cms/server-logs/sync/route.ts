import { NextRequest, NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/staff';
import { syncServerLogs, getServerHealthOverview } from '@/lib/server-logger';

export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const syncedCount = await syncServerLogs();
    const overview = await getServerHealthOverview();

    return NextResponse.json({
      success: true,
      syncedCount,
      overview,
      timestamp: new Date().toISOString(),
      serverTimeIST: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server logs sync failed' }, { status: 500 });
  }
}
