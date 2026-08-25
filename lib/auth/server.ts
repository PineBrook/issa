import 'server-only';

import crypto from 'node:crypto';
import { createNeonAuth } from '@neondatabase/auth/next/server';

function resolveCookieSecret(): string {
  const customSecret = process.env.NEON_AUTH_COOKIE_SECRET?.trim();
  if (customSecret && customSecret.length >= 32) {
    return customSecret;
  }
  // Deterministically generate a 64-character SHA-256 secret (satisfies Neon Auth's 32+ char requirement)
  const seed = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY ?? 'neon-auth-cookie-secret-fallback-default-seed';
  return crypto.createHash('sha256').update(`neon-auth:${seed}`).digest('hex');
}

const baseUrl = process.env.NEON_AUTH_BASE_URL?.trim() || 'http://127.0.0.1:1';
const secret = resolveCookieSecret();

export const auth = createNeonAuth({ baseUrl, cookies: { secret }, logLevel: 'silent' });
