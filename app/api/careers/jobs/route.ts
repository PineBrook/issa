import { NextRequest, NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/staff';
import {
  getPanelJobOpenings,
  createJobOpening,
  CareerForbiddenError,
  CareerValidationError,
} from '@/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized: Staff login required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const jobs = await getPanelJobOpenings({ status, search });
    return NextResponse.json({ jobs });
  } catch (err: any) {
    if (err instanceof CareerForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: err.message || 'Failed to fetch job openings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized: Staff privileges required' }, { status: 403 });
    }

    const body = await req.json();
    const job = await createJobOpening(body, staff);
    return NextResponse.json({ job }, { status: 201 });
  } catch (err: any) {
    if (err instanceof CareerForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof CareerValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to create job opening' }, { status: 500 });
  }
}
