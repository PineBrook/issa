import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
if (!connectionString) {
  throw new Error('DATABASE_URL or DB_CONN_KEY must be set');
}

const sql = neon(connectionString);

console.log('Checking database connection and tables...');

await sql`
  CREATE TABLE IF NOT EXISTS audit_events (
    id SERIAL PRIMARY KEY,
    actor_id VARCHAR(255) NOT NULL DEFAULT 'system',
    actor_email VARCHAR(255) NOT NULL DEFAULT 'system',
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    request_correlation_id VARCHAR(255),
    before_state JSONB,
    after_state JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;
await sql`CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON audit_events (created_at DESC)`;
await sql`CREATE INDEX IF NOT EXISTS idx_audit_events_action ON audit_events (action)`;
await sql`CREATE INDEX IF NOT EXISTS idx_audit_events_entity_type ON audit_events (entity_type)`;
await sql`CREATE INDEX IF NOT EXISTS idx_audit_events_actor_email ON audit_events (actor_email)`;

await sql`
  CREATE TABLE IF NOT EXISTS server_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status_code INT NOT NULL,
    log_type VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL DEFAULT 'ap-south-1',
    endpoint VARCHAR(255),
    method VARCHAR(10) DEFAULT 'GET',
    response_time_ms INT DEFAULT 0,
    error_message TEXT,
    client_ip_hash VARCHAR(64),
    metadata JSONB
  )
`;
await sql`CREATE INDEX IF NOT EXISTS idx_server_logs_timestamp ON server_logs (timestamp DESC)`;
await sql`CREATE INDEX IF NOT EXISTS idx_server_logs_status_code ON server_logs (status_code)`;
await sql`CREATE INDEX IF NOT EXISTS idx_server_logs_log_type ON server_logs (log_type)`;
await sql`CREATE INDEX IF NOT EXISTS idx_server_logs_region ON server_logs (region)`;

const aCount = await sql`SELECT count(*) FROM audit_events`;
const sCount = await sql`SELECT count(*) FROM server_logs`;

console.log(`Tables verified. audit_events count: ${aCount[0].count}, server_logs count: ${sCount[0].count}`);
