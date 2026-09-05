import { NextRequest, NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/staff';
import {
  getPanelBlogPostById,
  updateBlogPost,
  getBlogPostRevisions,
  CmsForbiddenError,
  CmsValidationError,
  CmsConcurrencyConflictError,
} from '@/lib/cms';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
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

    const post = await getPanelBlogPostById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const revisions = await getBlogPostRevisions(postId);
    return NextResponse.json({ post, revisions });
  } catch (err: any) {
    if (err instanceof CmsForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: err.message || 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PUT(
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
    if (body.expectedVersion === undefined || isNaN(Number(body.expectedVersion))) {
      return NextResponse.json({ error: 'expectedVersion is required for concurrency control' }, { status: 400 });
    }

    const post = await updateBlogPost(
      postId,
      {
        ...body,
        expectedVersion: Number(body.expectedVersion),
      },
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
    return NextResponse.json({ error: err.message || 'Failed to update blog post' }, { status: 500 });
  }
}
