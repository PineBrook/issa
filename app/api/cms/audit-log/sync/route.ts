import { NextRequest, NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/staff';
import { syncAuditEvents, getAuditQueueStatus } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const syncedCount = await syncAuditEvents();
    const queueStatus = getAuditQueueStatus();

    return NextResponse.json({
      success: true,
      syncedCount,
      queueStatus,
      timestamp: new Date().toISOString(),
      serverTimeIST: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Audit sync failed' }, { status: 500 });
  }
}

export async function GET(_request: NextRequest) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const queueStatus = getAuditQueueStatus();
    return NextResponse.json({
      status: 'ready',
      queueStatus,
      liveAsyncEnabled: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to check sync status' }, { status: 500 });
  }
}
