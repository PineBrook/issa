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
 * In-memory buffer for live async logging and reliable syncing to Postgres DB.
 */
const auditQueue: AuditEventInput[] = [];
let isSyncingAuditEvents = false;

export function getAuditQueueStatus(): { queueLength: number; isSyncing: boolean } {
  return {
    queueLength: auditQueue.length,
    isSyncing: isSyncingAuditEvents,
  };
}

/**
 * Explicitly syncs all pending in-memory audit events to the database.
 * Returns the number of events successfully synchronized to PostgreSQL.
 */
export async function syncAuditEvents(): Promise<number> {
  if (auditQueue.length === 0 || isSyncingAuditEvents) return 0;

  const sql = getDatabaseClient();
  if (!sql) return 0;

  isSyncingAuditEvents = true;
  let syncedCount = 0;

  try {
    while (auditQueue.length > 0) {
      const batch = auditQueue.splice(0, 25);
      for (const item of batch) {
        try {
          const actorId = item.actorId || 'system';
          const actorEmail = item.actorEmail || 'system@issafoundation.co.in';
          const action = item.action;
          const entityType = item.entityType;
          const entityId = item.entityId ? String(item.entityId) : null;
          const correlationId = item.correlationId || null;

          const beforeState = item.beforeState ? JSON.stringify(redactSensitiveData(item.beforeState)) : null;
          const afterState = item.afterState ? JSON.stringify(redactSensitiveData(item.afterState)) : null;
          const metadata = item.metadata ? JSON.stringify(redactSensitiveData(item.metadata)) : null;

          await sql`
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
          `;
          syncedCount++;
        } catch (itemErr) {
          console.error('Failed to sync individual audit event, discarding corrupted event:', itemErr);
        }
      }
    }
  } catch (err) {
    console.error('Audit events synchronization error:', err);
  } finally {
    isSyncingAuditEvents = false;
  }

  return syncedCount;
}

/**
 * Live async trigger: schedules a background sync to DB without blocking caller.
 */
function triggerLiveAsyncSync(): void {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(() => {
      syncAuditEvents().catch((err) => console.error('Live async background sync error:', err));
    });
  } else {
    setTimeout(() => {
      syncAuditEvents().catch((err) => console.error('Live async background sync error:', err));
    }, 10);
  }
}

/**
 * Asynchronously queues an audit event and enables live async syncing to DB.
 * Guaranteed not to block the caller execution thread.
 */
export function recordAuditEventAsync(input: AuditEventInput): void {
  try {
    auditQueue.push(input);
    triggerLiveAsyncSync();
  } catch (err) {
    console.error('Failed to enqueue async audit event:', err);
  }
}

/**
 * Synchronous audit logger that directly awaits DB persistence.
 */
export async function recordAuditEventSync(input: AuditEventInput): Promise<number | null> {
  return recordAuditEvent(input);
}

/**
 * Append-only audit logger with direct persistence and fallback sync queue.
 * Never throws to avoid blocking core user business transactions.
 */
export async function recordAuditEvent(input: AuditEventInput): Promise<number | null> {
  try {
    const sql = getDatabaseClient();
    if (!sql) {
      // Buffer in queue if DB client temporarily not available
      auditQueue.push(input);
      return null;
    }

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

    // Also trigger live sync of any previously buffered items in background
    if (auditQueue.length > 0) {
      triggerLiveAsyncSync();
    }

    return result[0]?.id ? Number(result[0].id) : null;
  } catch (err) {
    console.error('Audit logging failure (buffering into live async queue):', err);
    // On transient DB failure, push to queue so it can be synced later
    auditQueue.push(input);
    triggerLiveAsyncSync();
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
  afterId?: number;
  since?: string;
} = {}): Promise<AuditEventRecord[]> {
  try {
    // Flush any pending queued events before reading to guarantee up-to-date data
    if (auditQueue.length > 0) {
      await syncAuditEvents();
    }

    const sql = getDatabaseClient();
    if (!sql) return [];

    const limit = Math.min(options.limit || 100, 200);
    const offset = Math.max(options.offset || 0, 0);

    let rows;
    if (options.afterId && options.afterId > 0) {
      rows = await sql`
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
        WHERE id > ${options.afterId}
        ORDER BY id DESC
        LIMIT ${limit}
      `;
    } else {
      rows = await sql`
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
        ORDER BY created_at DESC, id DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

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
