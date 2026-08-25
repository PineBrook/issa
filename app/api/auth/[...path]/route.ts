import { auth } from '@/lib/auth/server';

export const runtime = 'nodejs';
const handler = auth.handler();

type Params = { path: string[] };
const companyDomain = 'pinebrooktechnologies.com';

function isAllowedPath(path: string[]) {
  return ['email-otp/send-verification-otp', 'sign-in/email-otp', 'get-session', 'sign-out'].includes(path.join('/'));
}

function isCompanyEmail(value: unknown) {
  if (typeof value !== 'string' || value !== value.trim().toLowerCase()) return false;
  const parts = value.split('@');
  return parts.length === 2 && Boolean(parts[0]) && parts[1] === companyDomain;
}

async function resolvePath(params: Promise<Params>) {
  const path = await params;
  return { path, allowed: isAllowedPath(path.path) };
}

export async function GET(request: Request, { params }: { params: Promise<Params> }) {
  const result = await resolvePath(params);
  return result.allowed ? handler.GET(request, { params: Promise.resolve(result.path) }) : new Response(null, { status: 404 });
}

export async function POST(request: Request, { params }: { params: Promise<Params> }) {
  const result = await resolvePath(params);
  if (!result.allowed) return new Response(null, { status: 404 });
  const path = result.path.path.join('/');
  if (path === 'email-otp/send-verification-otp' || path === 'sign-in/email-otp') {
    const body = await request.clone().json().catch(() => null) as { email?: unknown; otp?: unknown; type?: unknown } | null;
    if (!isCompanyEmail(body?.email)) {
      return Response.json({ error: 'Only Pinebrook Technologies email addresses are allowed.' }, { status: 403 });
    }
    if (path === 'email-otp/send-verification-otp' && body?.type !== 'sign-in') {
      return Response.json({ error: 'Only sign-in codes are allowed.' }, { status: 400 });
    }
    if (path === 'sign-in/email-otp' &&
      (typeof body?.otp !== 'string' || body.otp.length !== 6 || ![...body.otp].every((digit) => digit >= '0' && digit <= '9'))) {
      return Response.json({ error: 'Enter the six-digit code.' }, { status: 400 });
    }
  }
  return handler.POST(request, { params: Promise.resolve(result.path) });
}
