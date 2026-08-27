import { NextResponse } from 'next/server';
import { getFaqs, saveFaq } from '@/lib/site-cms';
import { getCurrentStaff } from '@/lib/staff';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get('category') || undefined;
  const faqs = await getFaqs(category);
  return NextResponse.json({ faqs });
}

export async function POST(req: Request) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.question || !body.answer) {
      return NextResponse.json({ error: 'Question and answer are required.' }, { status: 400 });
    }

    const saved = await saveFaq(body, staff);
    return NextResponse.json({ success: true, faq: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save FAQ' }, { status: 400 });
  }
}
