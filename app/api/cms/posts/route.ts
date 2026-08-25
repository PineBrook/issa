import { NextRequest, NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/staff';
import {
  getPanelBlogPosts,
  createBlogPost,
  CmsForbiddenError,
  CmsValidationError,
} from '@/lib/cms';

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

    const posts = await getPanelBlogPosts({ status, search });
    return NextResponse.json({ posts });
  } catch (err: any) {
    if (err instanceof CmsForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: err.message || 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized: Staff login required' }, { status: 403 });
    }

    const body = await req.json();
    const post = await createBlogPost(body, staff);
    return NextResponse.json({ post }, { status: 201 });
  } catch (err: any) {
    if (err instanceof CmsForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof CmsValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to create blog post' }, { status: 500 });
  }
}
