import crypto from 'node:crypto';
import { authCookieSecret } from './server';

export const SESSION_LIMIT_COOKIE = 'issa_session_limit';
export const SESSION_LIMIT_SECONDS = 12 * 60 * 60;

export function createSessionLimit() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_LIMIT_SECONDS;
  const signature = crypto.createHmac('sha256', authCookieSecret).update(String(expiresAt)).digest('base64url');
  return `${expiresAt}.${signature}`;
}

export function hasValidSessionLimit(value?: string) {
  const [expiresAt, signature] = value?.split('.') ?? [];
  if (!expiresAt || !signature || !/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now() / 1000) return false;

  const expected = crypto.createHmac('sha256', authCookieSecret).update(expiresAt).digest('base64url');
  return signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
