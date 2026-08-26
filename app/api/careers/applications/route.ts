import { NextRequest, NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/staff';
import {
  getPanelCareerApplications,
  CareerForbiddenError,
  CareerValidationError,
} from '@/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required to view applications' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const role = searchParams.get('role') || undefined;
    const search = searchParams.get('search') || undefined;
    const jobIdStr = searchParams.get('jobId');
    const jobId = jobIdStr ? parseInt(jobIdStr, 10) : undefined;

    const applications = await getPanelCareerApplications({
      status,
      role,
      search,
      jobId,
    });

    return NextResponse.json({ applications });
  } catch (err: any) {
    if (err instanceof CareerForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: err.message || 'Failed to fetch career applications' },
      { status: 500 }
    );
  }
}
