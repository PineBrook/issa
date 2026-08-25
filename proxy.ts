import { auth } from '@/lib/auth/server';
import { hasValidSessionLimit, SESSION_LIMIT_COOKIE } from '@/lib/auth/session-limit';
import { NextResponse, type NextRequest } from 'next/server';

const authProxy = auth.middleware({ loginUrl: '/login' });

export async function proxy(request: NextRequest) {
  const response = await authProxy(request);
  if (response.status >= 300 && response.status < 400) return response;
  if (hasValidSessionLimit(request.cookies.get(SESSION_LIMIT_COOKIE)?.value)) return response;

  const login = new URL('/login?expired=1', request.url);
  const expired = NextResponse.redirect(login);
  expired.cookies.delete(SESSION_LIMIT_COOKIE);
  return expired;
}

export const config = { matcher: ['/panel/:path*'] };
