import { auth } from '@/lib/auth/server';
import { createSessionLimit, SESSION_LIMIT_COOKIE, SESSION_LIMIT_SECONDS } from '@/lib/auth/session-limit';

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
  try {
    const result = await resolvePath(params);
    return result.allowed ? handler.GET(request, { params: Promise.resolve(result.path) }) : new Response(null, { status: 404 });
  } catch (err: any) {
    console.error('[auth-route] GET error:', err);
    return Response.json({ error: err.message || 'Authentication service temporarily unavailable' }, { status: 503 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<Params> }) {
  try {
    const result = await resolvePath(params);
    if (!result.allowed) return new Response(null, { status: 404 });
    const path = result.path.path.join('/');

    // Read body text once so the stream is never disturbed or consumed twice
    const rawBody = await request.text().catch(() => '');
    let body: { email?: unknown; otp?: unknown; type?: unknown } | null = null;
    if (rawBody) {
      try {
        body = JSON.parse(rawBody);
      } catch {}
    }

    if (path === 'email-otp/send-verification-otp' || path === 'sign-in/email-otp') {
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

    const proxyRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: rawBody ? rawBody : undefined,
    });

    const response = await handler.POST(proxyRequest, { params: Promise.resolve(result.path) });

    if (path === 'email-otp/send-verification-otp' && response.ok) {
      try {
        const userEmail = typeof body?.email === 'string' ? body.email : 'staff@pinebrooktechnologies.com';
        const { recordAuditEvent } = await import('@/lib/audit');
        await recordAuditEvent({
          actorId: userEmail,
          actorEmail: userEmail,
          action: 'auth.otp_requested',
          entityType: 'auth_session',
          entityId: userEmail,
          metadata: { path, timestamp: new Date().toISOString() },
        });
      } catch (auditErr) {
        console.warn('OTP request audit non-blocking error:', auditErr);
      }
    }

    if (path === 'sign-out' && response.ok) {
      try {
        const { recordAuditEvent } = await import('@/lib/audit');
        await recordAuditEvent({
          actorId: 'staff',
          actorEmail: 'staff@pinebrooktechnologies.com',
          action: 'auth.sign_out',
          entityType: 'auth_session',
          metadata: { path, timestamp: new Date().toISOString() },
        });
      } catch (auditErr) {
        console.warn('Sign-out audit non-blocking error:', auditErr);
      }
    }

    if (path !== 'sign-in/email-otp' || !response.ok) return response;

    const userEmail = typeof body?.email === 'string' ? body.email : 'staff@pinebrooktechnologies.com';

    try {
      const { recordAuditEvent } = await import('@/lib/audit');
      await recordAuditEvent({
        actorId: userEmail,
        actorEmail: userEmail,
        action: 'auth.login_success',
        entityType: 'auth_session',
        entityId: userEmail,
        metadata: { path, timestamp: new Date().toISOString() },
      });
    } catch (auditErr) {
      console.warn('Login success audit non-blocking error:', auditErr);
    }

    const limited = new Response(response.body, response);
    limited.headers.append(
      'Set-Cookie',
      `${SESSION_LIMIT_COOKIE}=${createSessionLimit()}; Max-Age=${SESSION_LIMIT_SECONDS}; Path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
    );
    return limited;
  } catch (err: any) {
    console.error('[auth-route] POST error:', err);
    try {
      const { logServerIssue } = await import('@/lib/server-logger');
      await logServerIssue({
        statusCode: 503,
        logType: 'ERROR_5XX',
        endpoint: '/api/auth/email-otp',
        errorMessage: err.message || 'Authentication service temporarily unavailable',
        metadata: { error: String(err), stack: err.stack },
      });
    } catch {}
    return Response.json({ error: err.message || 'Authentication service temporarily unavailable' }, { status: 503 });
  }
}
