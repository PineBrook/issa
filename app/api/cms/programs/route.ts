import { NextResponse } from 'next/server';
import { getProgramsContent, saveProgramContent } from '@/lib/site-cms';
import { getCurrentStaff } from '@/lib/staff';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug') || undefined;
  const programs = await getProgramsContent(slug);
  return NextResponse.json({ programs });
}

export async function POST(req: Request) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.slug || !body.title) {
      return NextResponse.json({ error: 'Slug and title are required.' }, { status: 400 });
    }

    const saved = await saveProgramContent(body, staff);
    return NextResponse.json({ success: true, program: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save program content' }, { status: 400 });
  }
}
