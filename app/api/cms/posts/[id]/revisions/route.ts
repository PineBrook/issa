import { NextRequest, NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/staff';
import { getBlogPostRevisions, CmsForbiddenError } from '@/lib/cms';

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

    const revisions = await getBlogPostRevisions(postId);
    return NextResponse.json({ revisions });
  } catch (err: any) {
    if (err instanceof CmsForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: err.message || 'Failed to fetch revisions' }, { status: 500 });
  }
}
