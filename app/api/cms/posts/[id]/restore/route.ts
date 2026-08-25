import { NextRequest, NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/staff';
import {
  restoreBlogPostRevision,
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
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required to restore revisions' }, { status: 403 });
    }

    const { id } = await context.params;
    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const body = await req.json();
    const { revisionId, expectedVersion } = body;

    if (!revisionId || isNaN(Number(revisionId))) {
      return NextResponse.json({ error: 'revisionId is required' }, { status: 400 });
    }

    if (expectedVersion === undefined || isNaN(Number(expectedVersion))) {
      return NextResponse.json({ error: 'expectedVersion is required for concurrency control' }, { status: 400 });
    }

    const post = await restoreBlogPostRevision(
      postId,
      Number(revisionId),
      Number(expectedVersion),
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
    return NextResponse.json({ error: err.message || 'Failed to restore revision' }, { status: 500 });
  }
}
