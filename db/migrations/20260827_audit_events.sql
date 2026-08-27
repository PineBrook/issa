-- 20260827_audit_events.sql
-- Append-only audit log schema for Phase 2 operations

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
);

-- Panel filtering and query indexes
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON audit_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON audit_events (action);
CREATE INDEX IF NOT EXISTS idx_audit_events_entity_type ON audit_events (entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_events_actor_email ON audit_events (actor_email);

-- Initial seed event
INSERT INTO audit_events (actor_id, actor_email, action, entity_type, entity_id, metadata, created_at)
VALUES (
  'system',
  'system@issafoundation.co.in',
  'system.audit_initialized',
  'audit_log',
  '0',
  '{"notes": "Append-only operational audit logging initialized."}'::jsonb,
  NOW()
) ON CONFLICT DO NOTHING;
