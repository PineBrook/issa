import { auth } from '@/lib/auth/server';

export const runtime = 'nodejs';
const handler = auth.handler();

type Params = { path: string[] };

function isAllowedPath(path: string[]) {
  return ['sign-in/magic-link', 'magic-link/verify', 'get-session', 'sign-out'].includes(path.join('/'));
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
  if (result.path.path.join('/') === 'sign-in/magic-link') {
    const body = await request.clone().json().catch(() => null) as { email?: unknown } | null;
    if (typeof body?.email !== 'string' || !body.email.trim().toLowerCase().endsWith('@pinebrooktechnologies.com')) {
      return Response.json({ error: 'Only Pinebrook Technologies email addresses are allowed.' }, { status: 403 });
    }
  }
  return handler.POST(request, { params: Promise.resolve(result.path) });
}
