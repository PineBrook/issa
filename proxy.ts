import { auth } from '@/lib/auth/server';

export const proxy = auth.middleware({ loginUrl: '/login' });

export const config = { matcher: ['/panel/:path*'] };
