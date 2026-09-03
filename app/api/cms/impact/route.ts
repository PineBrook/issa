import { NextResponse } from 'next/server';
import { getImpactContent, updateImpactSection } from '@/lib/site-cms';
import { getCurrentStaff } from '@/lib/staff';

export async function GET() {
  const impact = await getImpactContent();
  return NextResponse.json({ impact });
}

export async function POST(req: Request) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { sectionKey, data } = await req.json();
    if (!sectionKey || !['hero', 'metrics', 'milestones', 'highlights'].includes(sectionKey)) {
      return NextResponse.json({ error: 'Invalid sectionKey' }, { status: 400 });
    }

    await updateImpactSection(sectionKey, data, staff);
    const updated = await getImpactContent();
    return NextResponse.json({ success: true, impact: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update impact content' }, { status: 400 });
  }
}
