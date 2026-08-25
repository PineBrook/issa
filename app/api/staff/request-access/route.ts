import { NextResponse } from 'next/server';
import { requestStaffAccess } from '@/lib/staff';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const result = await requestStaffAccess();
  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}
