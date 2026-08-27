import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { redactSensitiveData } from '../lib/audit.ts';

test('audit migration creates append-only audit_events schema and indexes', () => {
  const migrationPath = path.resolve('db/migrations/20260827_audit_events.sql');
  assert.ok(fs.existsSync(migrationPath), '20260827_audit_events.sql must exist');

  const sql = fs.readFileSync(migrationPath, 'utf8');
  assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS audit_events'), 'must create audit_events table');
  assert.ok(sql.includes('actor_id'), 'must have actor_id column');
  assert.ok(sql.includes('actor_email'), 'must have actor_email column');
  assert.ok(sql.includes('action'), 'must have action column');
  assert.ok(sql.includes('entity_type'), 'must have entity_type column');
  assert.ok(sql.includes('before_state'), 'must have before_state column');
  assert.ok(sql.includes('after_state'), 'must have after_state column');
  assert.ok(sql.includes('metadata'), 'must have metadata column');
  assert.ok(sql.includes('created_at'), 'must have created_at column');
  assert.ok(sql.includes('idx_audit_events_created_at'), 'must index created_at');
});

test('redactSensitiveData redacts passwords, tokens, connection strings, and secrets', () => {
  const sensitivePayload = {
    email: 'yashvardhan.singh@pinebrooktechnologies.com',
    password: 'SuperSecretPassword123!',
    apiToken: 'secret_live_tok_98234789',
    databaseUrl: 'postgresql://user:pass@host/db',
    nested: {
      clientSecret: 'secret-xyz',
      safeField: 'Operational note',
    },
    list: [
      { authToken: 'bearer 12345', name: 'Admin' },
    ],
  };

  const redacted = redactSensitiveData(sensitivePayload);
  assert.equal(redacted.email, 'yashvardhan.singh@pinebrooktechnologies.com');
  assert.equal(redacted.password, '[REDACTED]');
  assert.equal(redacted.apiToken, '[REDACTED]');
  assert.equal(redacted.databaseUrl, '[REDACTED]');
  assert.equal(redacted.nested.clientSecret, '[REDACTED]');
  assert.equal(redacted.nested.safeField, 'Operational note');
  assert.equal(redacted.list[0].authToken, '[REDACTED]');
  assert.equal(redacted.list[0].name, 'Admin');
});
