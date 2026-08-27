import { NextResponse } from 'next/server';
import { getLegalPage, saveLegalPage } from '@/lib/site-cms';
import { getCurrentStaff } from '@/lib/staff';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug') || 'privacy';
  const page = await getLegalPage(slug);
  return NextResponse.json({ page });
}

export async function POST(req: Request) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.slug || !body.title || !body.contentMarkdown) {
      return NextResponse.json({ error: 'Slug, title, and contentMarkdown are required.' }, { status: 400 });
    }

    const saved = await saveLegalPage(body, staff);
    return NextResponse.json({ success: true, page: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save legal page' }, { status: 400 });
  }
}
