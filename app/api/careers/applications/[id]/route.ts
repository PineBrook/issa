import { NextRequest, NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/staff';
import {
  updateCareerApplicationStatus,
  CareerForbiddenError,
  CareerValidationError,
} from '@/lib/careers';
import type { CareerApplicationStatus } from '@/lib/careers-types';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required to update application' },
        { status: 403 }
      );
    }

    const params = await context.params;
    const applicationId = parseInt(params.id, 10);
    if (isNaN(applicationId) || applicationId <= 0) {
      return NextResponse.json({ error: 'Invalid application ID.' }, { status: 400 });
    }

    const body = await req.json();
    const status = body.status as CareerApplicationStatus;
    const assignedTo = body.assignedTo;

    if (!status) {
      return NextResponse.json({ error: 'Status is required.' }, { status: 400 });
    }

    const updated = await updateCareerApplicationStatus(
      applicationId,
      status,
      assignedTo,
      staff
    );

    return NextResponse.json({ application: updated });
  } catch (err: any) {
    if (err instanceof CareerForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof CareerValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || 'Failed to update application' },
      { status: 500 }
    );
  }
}
