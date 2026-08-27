import { neon } from '@neondatabase/serverless';

export interface AuditEventRecord {
  id: number;
  actorId: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  requestCorrelationId?: string | null;
  beforeState?: Record<string, any> | null;
  afterState?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface AuditEventInput {
  actorId?: string;
  actorEmail?: string;
  action: string;
  entityType: string;
  entityId?: string | number | null;
  correlationId?: string | null;
  beforeState?: Record<string, any> | null;
  afterState?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
}

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'connectionstring',
  'databaseurl',
  'database_url',
  'db_conn',
  'authorization',
  'cookie',
  'filedata',
  'resume',
  'bytea',
];

export function redactSensitiveData(data: any): any {
  if (!data || typeof data !== 'object') {
    if (typeof data === 'string' && (data.startsWith('postgres://') || data.startsWith('postgresql://'))) {
      return '[REDACTED]';
    }
    return data;
  }
  if (Array.isArray(data)) return data.map(redactSensitiveData);

  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const lower = key.toLowerCase();
    if (SENSITIVE_KEYS.some((k) => lower.includes(k))) {
      clean[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = redactSensitiveData(value);
    } else if (typeof value === 'string' && (value.startsWith('postgres://') || value.startsWith('postgresql://'))) {
      clean[key] = '[REDACTED]';
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

function getDatabaseClient() {
  const connectionString = process.env.DATABASE_URL || process.env.DB_CONN_KEY;
  if (!connectionString) return null;
  return neon(connectionString);
}

/**
 * Append-only audit logger.
 * Never throws to avoid blocking core user business transactions.
 */
export async function recordAuditEvent(input: AuditEventInput): Promise<number | null> {
  try {
    const sql = getDatabaseClient();
    if (!sql) return null;

    const actorId = input.actorId || 'system';
    const actorEmail = input.actorEmail || 'system@issafoundation.co.in';
    const action = input.action;
    const entityType = input.entityType;
    const entityId = input.entityId ? String(input.entityId) : null;
    const correlationId = input.correlationId || null;

    const beforeState = input.beforeState ? JSON.stringify(redactSensitiveData(input.beforeState)) : null;
    const afterState = input.afterState ? JSON.stringify(redactSensitiveData(input.afterState)) : null;
    const metadata = input.metadata ? JSON.stringify(redactSensitiveData(input.metadata)) : null;

    const result = await sql`
      INSERT INTO audit_events (
        actor_id,
        actor_email,
        action,
        entity_type,
        entity_id,
        request_correlation_id,
        before_state,
        after_state,
        metadata,
        created_at
      )
      VALUES (
        ${actorId},
        ${actorEmail},
        ${action},
        ${entityType},
        ${entityId},
        ${correlationId},
        ${beforeState}::jsonb,
        ${afterState}::jsonb,
        ${metadata}::jsonb,
        NOW()
      )
      RETURNING id
    `;

    return result[0]?.id ? Number(result[0].id) : null;
  } catch (err) {
    console.error('Audit logging failure (non-blocking):', err);
    return null;
  }
}

export async function getAuditEvents(options: {
  limit?: number;
  offset?: number;
  action?: string;
  entityType?: string;
  actorEmail?: string;
  search?: string;
} = {}): Promise<AuditEventRecord[]> {
  try {
    const sql = getDatabaseClient();
    if (!sql) return [];

    const limit = Math.min(options.limit || 100, 200);
    const offset = Math.max(options.offset || 0, 0);

    const rows = await sql`
      SELECT 
        id,
        actor_id AS "actorId",
        actor_email AS "actorEmail",
        action,
        entity_type AS "entityType",
        entity_id AS "entityId",
        request_correlation_id AS "requestCorrelationId",
        before_state AS "beforeState",
        after_state AS "afterState",
        metadata,
        created_at AS "createdAt"
      FROM audit_events
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return rows.map((r: any) => ({
      id: Number(r.id),
      actorId: r.actorId || '',
      actorEmail: r.actorEmail || '',
      action: r.action || '',
      entityType: r.entityType || '',
      entityId: r.entityId || null,
      requestCorrelationId: r.requestCorrelationId || null,
      beforeState: r.beforeState || null,
      afterState: r.afterState || null,
      metadata: r.metadata || null,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    }));
  } catch (err) {
    console.error('Failed to query audit logs:', err);
    return [];
  }
}
