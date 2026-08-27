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

    const events = await getAuditEvents({
      limit,
      offset,
      action,
      entityType,
      actorEmail,
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
