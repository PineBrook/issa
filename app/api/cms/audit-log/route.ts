import { NextRequest, NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/staff';
import { getAuditEvents, recordAuditEvent } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required for audit logs.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const action = searchParams.get('action') || undefined;
    const entityType = searchParams.get('entityType') || undefined;
    const actorEmail = searchParams.get('actorEmail') || undefined;
    const isExport = searchParams.get('export') === 'true';
    const afterId = parseInt(searchParams.get('afterId') || '0', 10);

    const events = await getAuditEvents({
      limit,
      offset,
      action,
      entityType,
      actorEmail,
      afterId: afterId > 0 ? afterId : undefined,
    });

    if (isExport) {
      await recordAuditEvent({
        actorId: String(staff.id),
        actorEmail: staff.email,
        action: 'audit.export',
        entityType: 'audit_log',
        entityId: 'all',
        metadata: { exportedCount: events.length, timestamp: new Date().toISOString() },
      });
    }

    return NextResponse.json({ events });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch audit events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const { syncAuditEvents, getAuditQueueStatus } = await import('@/lib/audit');
    const syncedCount = await syncAuditEvents();
    const status = getAuditQueueStatus();

    return NextResponse.json({
      success: true,
      message: `Audit events synced successfully (${syncedCount} flushed).`,
      syncedCount,
      queueStatus: status,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to sync audit logs' }, { status: 500 });
  }
}
