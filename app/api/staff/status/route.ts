import { NextResponse } from 'next/server';
import { getAuthSessionUser, getCurrentStaff } from '@/lib/staff';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const sessionUser = await getAuthSessionUser();
  if (!sessionUser?.id || !sessionUser.email) {
    return NextResponse.json({ authenticated: false, staff: null }, { status: 401 });
  }

  const staff = await getCurrentStaff();
  return NextResponse.json({
    authenticated: true,
    user: {
      id: sessionUser.id,
      email: sessionUser.email,
      name: sessionUser.name ?? '',
    },
    staff,
  });
}
