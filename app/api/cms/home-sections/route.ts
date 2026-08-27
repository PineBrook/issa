import { NextResponse } from 'next/server';
import { getHomeSections, updateHomeSection } from '@/lib/site-cms';
import { getCurrentStaff } from '@/lib/staff';

export async function GET() {
  const sections = await getHomeSections();
  return NextResponse.json({ sections });
}

export async function POST(req: Request) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { sectionKey, data } = await req.json();
    if (!sectionKey || !['stats', 'philosophy', 'strategic_interventions', 'collaborate'].includes(sectionKey)) {
      return NextResponse.json({ error: 'Invalid sectionKey' }, { status: 400 });
    }

    await updateHomeSection(sectionKey, data, staff);
    const updated = await getHomeSections();
    return NextResponse.json({ success: true, sections: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update section' }, { status: 400 });
  }
}
