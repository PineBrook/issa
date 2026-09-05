import { NextRequest, NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/staff';
import {
  updateJobOpening,
  deleteJobOpening,
  archiveJobOpening,
  CareerForbiddenError,
  CareerValidationError,
} from '@/lib/careers';

export const dynamic = 'force-dynamic';

async function handleJobUpdate(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized: Staff privileges required' }, { status: 403 });
    }

    const params = await context.params;
    const jobId = parseInt(params.id, 10);
    if (isNaN(jobId) || jobId <= 0) {
      return NextResponse.json({ error: 'Invalid job opening ID.' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'archive') {
      const archived = await archiveJobOpening(jobId, staff);
      return NextResponse.json({ success: true, action: 'archived', job: archived });
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    if (body.action === 'archive' || body.status === 'archived') {
      const archived = await archiveJobOpening(jobId, staff);
      return NextResponse.json({ success: true, action: 'archived', job: archived });
    }

    const updated = await updateJobOpening(jobId, body, staff);
    return NextResponse.json({ job: updated });
  } catch (err: any) {
    if (err instanceof CareerForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof CareerValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to update job opening' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleJobUpdate(req, context);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleJobUpdate(req, context);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized: Staff privileges required' }, { status: 403 });
    }

    const params = await context.params;
    const jobId = parseInt(params.id, 10);
    if (isNaN(jobId) || jobId <= 0) {
      return NextResponse.json({ error: 'Invalid job opening ID.' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'archive') {
      const archived = await archiveJobOpening(jobId, staff);
      return NextResponse.json({ success: true, action: 'archived', job: archived });
    }

    const result = await deleteJobOpening(jobId, staff);
    return NextResponse.json(result);
  } catch (err: any) {
    if (err instanceof CareerForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof CareerValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to delete/archive job opening' }, { status: 500 });
  }
}
