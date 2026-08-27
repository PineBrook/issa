import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { logServerIssue, getServerHealthOverview } from '../lib/server-logger.ts';

test('server logs migration creates server_logs table with indexes', () => {
  const migrationPath = path.resolve('db/migrations/20260829_server_logs_and_monitoring.sql');
  assert.ok(fs.existsSync(migrationPath), 'migration file must exist');

  const sql = fs.readFileSync(migrationPath, 'utf8');
  assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS server_logs'), 'must create server_logs table');
  assert.ok(sql.includes('status_code INT NOT NULL'), 'must have status_code column');
  assert.ok(sql.includes('log_type VARCHAR(50) NOT NULL'), 'must have log_type column');
  assert.ok(sql.includes('region VARCHAR(50)'), 'must have region column');
  assert.ok(sql.includes('idx_server_logs_status_code'), 'must index status_code');
  assert.ok(sql.includes('idx_server_logs_timestamp'), 'must index timestamp');
});

test('server health overview structure provides 24h health and connection statuses', async () => {
  const overview = await getServerHealthOverview();
  assert.ok(overview, 'must return an overview object');
  assert.ok(['healthy', 'degraded', 'critical'].includes(overview.status), 'must have valid status');
  assert.ok(typeof overview.dbLatencyMs === 'number', 'dbLatencyMs must be a number');
  assert.ok(typeof overview.error4xxCount === 'number', 'error4xxCount must be a number');
  assert.ok(typeof overview.error5xxCount === 'number', 'error5xxCount must be a number');
  assert.ok(Array.isArray(overview.regions), 'regions must be an array');
  assert.ok(overview.regions.length >= 1, 'must monitor active database connection');
});
