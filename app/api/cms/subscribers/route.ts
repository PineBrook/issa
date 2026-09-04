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

export async function PATCH(req: Request) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { email, status } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
    if (connectionString) {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(connectionString);
      await sql`
        UPDATE newsletter_subscriptions
        SET status = ${status || 'unsubscribed'},
            unsubscribed_at = CASE WHEN ${status || 'unsubscribed'} = 'unsubscribed' THEN NOW() ELSE unsubscribed_at END,
            updated_at = NOW()
        WHERE email = ${String(email).trim().toLowerCase()}
      `;
    }

    const { recordAuditEvent } = await import('@/lib/audit');
    await recordAuditEvent({
      actorId: String(staff.id),
      actorEmail: staff.email,
      action: 'cms.subscriber_status_update',
      entityType: 'newsletter_subscription',
      entityId: String(email),
      afterState: { status: status || 'unsubscribed' },
      metadata: { updatedBy: staff.fullName },
    });

    return NextResponse.json({ success: true, message: 'Subscriber status updated' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update subscriber' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
    if (connectionString) {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(connectionString);
      await sql`
        DELETE FROM newsletter_subscriptions
        WHERE email = ${String(email).trim().toLowerCase()}
      `;
    }

    const { recordAuditEvent } = await import('@/lib/audit');
    await recordAuditEvent({
      actorId: String(staff.id),
      actorEmail: staff.email,
      action: 'cms.subscriber_delete',
      entityType: 'newsletter_subscription',
      entityId: String(email),
      metadata: { deletedBy: staff.fullName },
    });

    return NextResponse.json({ success: true, message: 'Subscriber removed' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete subscriber' }, { status: 500 });
  }
}
