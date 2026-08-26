import { NextRequest, NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/staff';
import {
  updateJobOpening,
  deleteJobOpening,
  CareerForbiddenError,
  CareerValidationError,
} from '@/lib/careers';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const params = await context.params;
    const jobId = parseInt(params.id, 10);
    if (isNaN(jobId) || jobId <= 0) {
      return NextResponse.json({ error: 'Invalid job opening ID.' }, { status: 400 });
    }

    const body = await req.json();
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

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const params = await context.params;
    const jobId = parseInt(params.id, 10);
    if (isNaN(jobId) || jobId <= 0) {
      return NextResponse.json({ error: 'Invalid job opening ID.' }, { status: 400 });
    }

    const result = await deleteJobOpening(jobId, staff);
    return NextResponse.json(result);
  } catch (err: any) {
    if (err instanceof CareerForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: err.message || 'Failed to delete/archive job opening' }, { status: 500 });
  }
}
