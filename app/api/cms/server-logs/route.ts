import { NextRequest, NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/staff';
import { getServerLogs, getServerHealthOverview, record15MinHealthTelemetry } from '@/lib/server-logger';
import { recordAuditEvent } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required for server logs.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const logType = searchParams.get('logType') || undefined;
    const region = searchParams.get('region') || undefined;

    const [logs, overview] = await Promise.all([
      getServerLogs({ limit, offset, logType, region }),
      getServerHealthOverview(),
    ]);

    return NextResponse.json({ logs, overview });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch server logs' }, { status: 500 });
  }
}

export async function POST(_request: NextRequest) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const entry = await record15MinHealthTelemetry();
    await recordAuditEvent({
      actorId: String(staff.id),
      actorEmail: staff.email,
      action: 'server.health_telemetry_run',
      entityType: 'server_monitoring',
      entityId: 'heartbeat_15min',
      metadata: { triggeredManually: true, timestamp: new Date().toISOString() },
    });

    const overview = await getServerHealthOverview();
    return NextResponse.json({ success: true, entry, overview });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to record server telemetry' }, { status: 500 });
  }
}
