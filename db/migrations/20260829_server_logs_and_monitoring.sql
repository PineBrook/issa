-- 20260829_server_logs_and_monitoring.sql
-- Server performance, 4xx/5xx error telemetry, and regional suspension logs

CREATE TABLE IF NOT EXISTS server_logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status_code INT NOT NULL,
  log_type VARCHAR(50) NOT NULL, -- 'ERROR_4XX', 'ERROR_5XX', 'REGIONAL_SUSPENSION', 'HEALTH_HEARTBEAT'
  region VARCHAR(50) NOT NULL DEFAULT 'ap-south-1',
  endpoint VARCHAR(255),
  method VARCHAR(10) DEFAULT 'GET',
  response_time_ms INT DEFAULT 0,
  error_message TEXT,
  client_ip_hash VARCHAR(64),
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_server_logs_timestamp ON server_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_server_logs_status_code ON server_logs (status_code);
CREATE INDEX IF NOT EXISTS idx_server_logs_log_type ON server_logs (log_type);
CREATE INDEX IF NOT EXISTS idx_server_logs_region ON server_logs (region);

-- Initial seed logs demonstrating 15-minute telemetry & regional monitoring
INSERT INTO server_logs (timestamp, status_code, log_type, region, endpoint, method, response_time_ms, error_message, metadata)
VALUES 
(
  NOW() - INTERVAL '45 minutes',
  200,
  'HEALTH_HEARTBEAT',
  'ap-south-1 (Mumbai)',
  '/api/health',
  'GET',
  18,
  NULL,
  '{"dbLatencyMs": 14, "memoryUsageMB": 68, "status": "healthy"}'::jsonb
),
(
  NOW() - INTERVAL '30 minutes',
  200,
  'HEALTH_HEARTBEAT',
  'ap-south-1 (Mumbai)',
  '/api/health',
  'GET',
  22,
  NULL,
  '{"dbLatencyMs": 19, "memoryUsageMB": 72, "status": "healthy"}'::jsonb
),
(
  NOW() - INTERVAL '15 minutes',
  200,
  'HEALTH_HEARTBEAT',
  'ap-south-1 (Mumbai)',
  '/api/health',
  'GET',
  16,
  NULL,
  '{"dbLatencyMs": 12, "memoryUsageMB": 70, "status": "healthy"}'::jsonb
),
(
  NOW() - INTERVAL '5 minutes',
  404,
  'ERROR_4XX',
  'ap-south-1 (Mumbai)',
  '/assets/old-brochure.pdf',
  'GET',
  8,
  'Route or asset not found: /assets/old-brochure.pdf',
  '{"client": "web-crawler", "handled": true}'::jsonb
)
ON CONFLICT DO NOTHING;
