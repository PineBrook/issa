import 'server-only';

import crypto from 'node:crypto';
import { createNeonAuth } from '@neondatabase/auth/next/server';

function deriveNeonAuthBaseUrl(dbUrl?: string): string | null {
  if (!dbUrl) return null;
  try {
    const parsed = new URL(dbUrl);
    const host = parsed.hostname;
    const dbName = parsed.pathname.replace(/^\//, '') || 'neondb';
    const match = host.match(/^(ep-[a-z0-9-]+?)(?:-pooler)?\.([a-z0-9-]+\.[a-z0-9-]+\.[a-z0-9-]+\.aws\.neon\.tech)$/);
    if (match) {
      const endpointId = match[1];
      const regionDomain = match[2];
      return `https://${endpointId}.neonauth.${regionDomain}/${dbName}/auth`;
    }
    const parts = host.split('.');
    if (parts.length >= 4 && parts[0].startsWith('ep-')) {
      const endpointId = parts[0].replace(/-pooler$/, '');
      const rest = parts.slice(1).join('.');
      return `https://${endpointId}.neonauth.${rest}/${dbName}/auth`;
    }
  } catch {}
  return null;
}

function resolveCookieSecret(): string {
  const customSecret = process.env.NEON_AUTH_COOKIE_SECRET?.trim();
  if (customSecret && customSecret.length >= 32) {
    return customSecret;
  }
  // Deterministically generate a 64-character SHA-256 secret (satisfies Neon Auth's 32+ char requirement)
  const seed = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY ?? process.env.POSTGRES_URL ?? 'neon-auth-cookie-secret-fallback-default-seed';
  return crypto.createHash('sha256').update(`neon-auth:${seed}`).digest('hex');
}

function resolveBaseUrl(): string {
  const customUrl = process.env.NEON_AUTH_BASE_URL?.trim();
  if (customUrl) return customUrl;

  const dbUrl = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY ?? process.env.POSTGRES_URL;
  const derived = deriveNeonAuthBaseUrl(dbUrl);
  if (derived) return derived;

  return 'https://ep-falling-cell-b3uyu248.neonauth.c-4.ap-southeast-1.aws.neon.tech/neondb/auth';
}

const baseUrl = resolveBaseUrl();
const secret = resolveCookieSecret();

export const auth = createNeonAuth({ baseUrl, cookies: { secret }, logLevel: 'silent' });
