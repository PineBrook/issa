import 'server-only';

import crypto from 'node:crypto';

function getSigningSecret(): string {
  return (
    process.env.RESUME_SIGNING_SECRET ??
    process.env.AUTH_SECRET ??
    process.env.DATABASE_URL ??
    'issa-default-secure-resume-signing-secret-2026'
  );
}

export function generateResumeDownloadToken(fileId: number, expiresInSeconds: number = 900): string {
  const secret = getSigningSecret();
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = Buffer.from(JSON.stringify({ fileId, exp: expiresAt })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url');

  return `${payload}.${signature}`;
}

export function verifyResumeDownloadToken(token: string): { valid: boolean; fileId?: number; reason?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'Missing token' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Malformed token structure' };
  }

  const [payload, signature] = parts;
  const secret = getSigningSecret();
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: false, reason: 'Invalid token signature' };
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.fileId || typeof data.fileId !== 'number') {
      return { valid: false, reason: 'Invalid token payload' };
    }
    if (typeof data.exp !== 'number' || Date.now() / 1000 > data.exp) {
      return { valid: false, reason: 'Token has expired' };
    }
    return { valid: true, fileId: data.fileId };
  } catch {
    return { valid: false, reason: 'Failed to decode token payload' };
  }
}
