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

test('audit queue functions buffer events and manage live async sync state', async () => {
  const { recordAuditEventAsync, getAuditQueueStatus, syncAuditEvents } = await import('../lib/audit.ts');

  const initialStatus = getAuditQueueStatus();
  assert.ok(typeof initialStatus.queueLength === 'number', 'queueLength must be number');
  assert.ok(typeof initialStatus.isSyncing === 'boolean', 'isSyncing must be boolean');

  // Queuing an event via live async
  recordAuditEventAsync({
    action: 'test.live_async_action',
    entityType: 'test_entity',
    entityId: 'test-123',
    actorEmail: 'test@issafoundation.co.in',
    metadata: { key: 'live_async_val' },
  });

  // syncAuditEvents should safely execute without crashing even if DATABASE_URL is not set
  const count = await syncAuditEvents();
  assert.ok(typeof count === 'number' && count >= 0, 'syncAuditEvents must return a non-negative number');
});

test('user operations in public forms, careers, and staff modules trigger audit logging', () => {
  // Public forms audit verification
  const publicFormsFile = fs.readFileSync(path.resolve('lib/public-forms.ts'), 'utf8');
  assert.ok(publicFormsFile.includes("recordAuditEventAsync") || publicFormsFile.includes("recordAuditEvent"), 'public-forms must record audit events');
  assert.ok(publicFormsFile.includes("'public.contact_submit'"), 'public-forms must record contact submissions');
  assert.ok(publicFormsFile.includes("'public.newsletter_subscribe'"), 'public-forms must record newsletter subscriptions');

  // Careers audit verification
  const careersFile = fs.readFileSync(path.resolve('lib/careers.ts'), 'utf8');
  assert.ok(careersFile.includes("'public.career_apply'"), 'careers must record application submissions');
  assert.ok(careersFile.includes("'job.create'"), 'careers must record job creations');
  assert.ok(careersFile.includes("'job.update'"), 'careers must record job updates');
  assert.ok(careersFile.includes("'job.archive'"), 'careers must record job archiving');
  assert.ok(careersFile.includes("'job.delete'"), 'careers must record job deletions');
  assert.ok(careersFile.includes("'application.status_update'"), 'careers must record application status updates');

  // Staff audit verification
  const staffFile = fs.readFileSync(path.resolve('lib/staff.ts'), 'utf8');
  assert.ok(staffFile.includes("'staff.role_update'"), 'staff must record role changes');
  assert.ok(staffFile.includes("'staff.status_update'"), 'staff must record status updates');
  assert.ok(staffFile.includes("'staff.user_delete'"), 'staff must record user deletions');

  // Resume download audit verification
  const resumeDownloadRoute = fs.readFileSync(path.resolve('app/api/resumes/[id]/download/route.ts'), 'utf8');
  assert.ok(resumeDownloadRoute.includes("'resume.download'"), 'resume download must be audited');

  // Sync API routes verification
  assert.ok(fs.existsSync(path.resolve('app/api/cms/audit-log/sync/route.ts')), 'audit-log sync route must exist');
  assert.ok(fs.existsSync(path.resolve('app/api/cms/server-logs/sync/route.ts')), 'server-logs sync route must exist');
});
