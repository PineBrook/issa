import { NextResponse } from 'next/server';
import { requestStaffAccess } from '@/lib/staff';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const result = await requestStaffAccess();
  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  const { recordAuditEvent } = await import('@/lib/audit');
  await recordAuditEvent({
    actorId: String(result.profile?.id || 'pending'),
    actorEmail: result.profile?.email || 'staff@pinebrooktechnologies.com',
    action: 'staff.access_request',
    entityType: 'staff',
    entityId: String(result.profile?.id || ''),
    metadata: {
      fullName: result.profile?.fullName,
      email: result.profile?.email,
    },
  });

  return NextResponse.json(result);
}
