import 'server-only';

import { neon } from '@neondatabase/serverless';

function getDb() {
  const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
  if (!connectionString) {
    return null;
  }
  return neon(connectionString);
}

// In-memory buffer fallback for tests running without database credentials
const memoryStore = new Map<string, Buffer>();

function parseBuffer(raw: unknown): Buffer | null {
  if (!raw) return null;
  if (Buffer.isBuffer(raw)) return raw;
  if (raw instanceof Uint8Array) return Buffer.from(raw);
  if (typeof raw === 'string') {
    if (raw.startsWith('\\x')) {
      return Buffer.from(raw.slice(2), 'hex');
    }
    return Buffer.from(raw, 'base64');
  }
  return Buffer.from(raw as ArrayBuffer);
}

export async function saveResumeFile(
  storageKey: string,
  data: Buffer,
  _contentType?: string
): Promise<void> {
  const sql = getDb();
  if (sql) {
    try {
      await sql`
        UPDATE resume_files
        SET file_data = ${data}
        WHERE storage_key = ${storageKey}
      `;
      return;
    } catch {
      // If table/connection not ready, save in memory store
    }
  }
  memoryStore.set(storageKey, data);
}

export async function getResumeFile(
  storageKey: string
): Promise<{ buffer: Buffer } | null> {
  const sql = getDb();
  if (sql) {
    try {
      const rows = await sql`
        SELECT file_data
        FROM resume_files
        WHERE storage_key = ${storageKey}
          AND deleted_at IS NULL
        LIMIT 1
      `;
      if (rows && rows.length > 0 && rows[0].file_data) {
        const buf = parseBuffer(rows[0].file_data);
        if (buf) return { buffer: buf };
      }
    } catch {
      // Fall through to memory store
    }
  }

  const mem = memoryStore.get(storageKey);
  if (mem) {
    return { buffer: mem };
  }
  return null;
}

export async function deleteResumeFile(storageKey: string): Promise<void> {
  const sql = getDb();
  if (sql) {
    try {
      await sql`
        UPDATE resume_files
        SET file_data = NULL, deleted_at = NOW()
        WHERE storage_key = ${storageKey}
      `;
    } catch {
      // Ignore cleanup error
    }
  }
  memoryStore.delete(storageKey);
}

export async function resumeFileExists(storageKey: string): Promise<boolean> {
  const sql = getDb();
  if (sql) {
    try {
      const rows = await sql`
        SELECT id
        FROM resume_files
        WHERE storage_key = ${storageKey}
          AND file_data IS NOT NULL
          AND deleted_at IS NULL
        LIMIT 1
      `;
      if (rows && rows.length > 0) return true;
    } catch {
      // Fallback
    }
  }
  return memoryStore.has(storageKey);
}
