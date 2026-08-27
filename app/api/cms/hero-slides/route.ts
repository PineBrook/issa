import { NextResponse } from 'next/server';
import { getHeroSlides, saveHeroSlide } from '@/lib/site-cms';
import { getCurrentStaff } from '@/lib/staff';

export async function GET() {
  const slides = await getHeroSlides(true);
  return NextResponse.json({ slides });
}

export async function POST(req: Request) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const saved = await saveHeroSlide(body, staff);
    return NextResponse.json({ success: true, slide: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save slide' }, { status: 400 });
  }
}
