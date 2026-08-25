import { NextRequest, NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/staff';
import {
  transitionPostStatus,
  CmsForbiddenError,
  CmsValidationError,
  CmsConcurrencyConflictError,
} from '@/lib/cms';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized: Staff login required' }, { status: 403 });
    }

    const { id } = await context.params;
    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const body = await req.json();
    const { action, expectedVersion, scheduledAt, summary } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    if (expectedVersion === undefined || isNaN(Number(expectedVersion))) {
      return NextResponse.json({ error: 'expectedVersion is required for concurrency control' }, { status: 400 });
    }

    const post = await transitionPostStatus(
      postId,
      Number(expectedVersion),
      action,
      { scheduledAt, summary },
      staff,
    );

    return NextResponse.json({ post });
  } catch (err: any) {
    if (err instanceof CmsForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof CmsConcurrencyConflictError) {
      return NextResponse.json({ error: err.message, conflict: true }, { status: 409 });
    }
    if (err instanceof CmsValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to update post status' }, { status: 500 });
  }
}
