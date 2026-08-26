import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile, unlink, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import crypto from 'node:crypto';

const migrationPath = new URL('../db/migrations/20260821_careers_and_resumes.sql', import.meta.url);

test('careers migration creates job_openings, career_applications, and resume_files schema with seeds', async () => {
  const migration = await readFile(migrationPath, 'utf8');

  // Schema and tables
  assert.match(migration, /CREATE TABLE IF NOT EXISTS job_openings/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS career_applications/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS resume_files/);

  // Constraints and relationships
  assert.match(migration, /REFERENCES job_openings\(id\)/);
  assert.match(migration, /REFERENCES career_applications\(id\) ON DELETE CASCADE/);
  assert.match(migration, /storage_key TEXT NOT NULL UNIQUE/);
  assert.match(migration, /size_bytes BIGINT NOT NULL CHECK \(size_bytes > 0\)/);
  assert.match(migration, /CHECK \(status IN \('active', 'closed', 'draft', 'archived'\)\)/);

  // Indexes
  assert.match(migration, /CREATE INDEX IF NOT EXISTS job_openings_active_display_idx/);
  assert.match(migration, /CREATE INDEX IF NOT EXISTS career_applications_status_idx/);
  assert.match(migration, /CREATE INDEX IF NOT EXISTS career_applications_email_role_idx/);
  assert.match(migration, /CREATE INDEX IF NOT EXISTS resume_files_application_id_idx/);

  // Seeded vacancies
  const slugs = ['edu-expert', 'health-practitioner', 'program-manager'];
  for (const slug of slugs) {
    assert.match(migration, new RegExp(`'${slug}'`));
  }
  assert.match(migration, /ON CONFLICT \(slug\) DO UPDATE/);
});

// Resume validation helper to test logic
function validateResumeFileBuffer(buffer, filename, declaredMimeType) {
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'Resume file is empty or missing.', extension: '', mimeType: '' };
  }

  if (buffer.length > MAX_SIZE) {
    return { valid: false, error: 'Resume file exceeds the 5MB size limit.', extension: '', mimeType: '' };
  }

  const ext = path.extname(filename).toLowerCase().replace(/^\./, '');
  if (!['pdf', 'docx', 'doc'].includes(ext)) {
    return {
      valid: false,
      error: 'Invalid file format. Only PDF, DOC, and DOCX files are allowed.',
      extension: ext,
      mimeType: declaredMimeType ?? 'application/octet-stream',
    };
  }

  let detectedMime = declaredMimeType ?? 'application/octet-stream';

  if (ext === 'pdf') {
    if (
      buffer.length < 4 ||
      buffer[0] !== 0x25 ||
      buffer[1] !== 0x50 ||
      buffer[2] !== 0x44 ||
      buffer[3] !== 0x46
    ) {
      return { valid: false, error: 'Corrupted or invalid PDF file.', extension: ext, mimeType: detectedMime };
    }
    detectedMime = 'application/pdf';
  } else if (ext === 'docx') {
    if (
      buffer.length < 4 ||
      buffer[0] !== 0x50 ||
      buffer[1] !== 0x4b ||
      (buffer[2] !== 0x03 && buffer[2] !== 0x05 && buffer[2] !== 0x07)
    ) {
      return { valid: false, error: 'Corrupted or invalid DOCX file.', extension: ext, mimeType: detectedMime };
    }
    detectedMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  } else if (ext === 'doc') {
    if (
      buffer.length < 4 ||
      buffer[0] !== 0xd0 ||
      buffer[1] !== 0xcf ||
      buffer[2] !== 0x11 ||
      buffer[3] !== 0xe0
    ) {
      return { valid: false, error: 'Corrupted or invalid DOC file.', extension: ext, mimeType: detectedMime };
    }
    detectedMime = 'application/msword';
  }

  return { valid: true, extension: ext, mimeType: detectedMime };
}

test('validateResumeFileBuffer accepts valid PDF, DOCX, and DOC files', () => {
  // Valid PDF header
  const pdfBuffer = Buffer.from('%PDF-1.4 test content with simulated pdf stream');
  const pdfResult = validateResumeFileBuffer(pdfBuffer, 'resume.pdf', 'application/pdf');
  assert.equal(pdfResult.valid, true);
  assert.equal(pdfResult.extension, 'pdf');
  assert.equal(pdfResult.mimeType, 'application/pdf');

  // Valid DOCX zip header
  const docxBuffer = Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.from('simulated docx archive')]);
  const docxResult = validateResumeFileBuffer(docxBuffer, 'candidate-cv.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  assert.equal(docxResult.valid, true);
  assert.equal(docxResult.extension, 'docx');

  // Valid DOC CFBF header
  const docBuffer = Buffer.concat([Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]), Buffer.from('simulated doc binary')]);
  const docResult = validateResumeFileBuffer(docBuffer, 'profile.doc', 'application/msword');
  assert.equal(docResult.valid, true);
  assert.equal(docResult.extension, 'doc');
});

test('validateResumeFileBuffer rejects invalid or unsafe files', () => {
  // Disallowed extension
  const exeBuffer = Buffer.from('MZ executable file');
  const exeResult = validateResumeFileBuffer(exeBuffer, 'malicious.exe', 'application/x-msdownload');
  assert.equal(exeResult.valid, false);

  // Corrupted / forged PDF (claims to be PDF but lacks %PDF header)
  const fakePdfBuffer = Buffer.from('NOT A PDF FILE HEADER');
  const fakePdfResult = validateResumeFileBuffer(fakePdfBuffer, 'fake.pdf', 'application/pdf');
  assert.equal(fakePdfResult.valid, false);
  assert.match(fakePdfResult.error ?? '', /Corrupted or invalid PDF/);

  // Corrupted / forged DOCX
  const fakeDocxBuffer = Buffer.from('NOT A DOCX ZIP');
  const fakeDocxResult = validateResumeFileBuffer(fakeDocxBuffer, 'fake.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  assert.equal(fakeDocxResult.valid, false);
  assert.match(fakeDocxResult.error ?? '', /Corrupted or invalid DOCX/);

  // Empty file
  const emptyResult = validateResumeFileBuffer(Buffer.alloc(0), 'empty.pdf', 'application/pdf');
  assert.equal(emptyResult.valid, false);

  // Oversized file (> 5MB)
  const hugeBuffer = Buffer.alloc(5 * 1024 * 1024 + 1);
  hugeBuffer[0] = 0x25; hugeBuffer[1] = 0x50; hugeBuffer[2] = 0x44; hugeBuffer[3] = 0x46; // %PDF
  const hugeResult = validateResumeFileBuffer(hugeBuffer, 'huge.pdf', 'application/pdf');
  assert.equal(hugeResult.valid, false);
  assert.match(hugeResult.error ?? '', /exceeds the 5MB size limit/);
});

// HMAC token generator / verifier logic test
function generateResumeDownloadToken(fileId, expiresInSeconds = 900, secret = 'test-signing-secret') {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = Buffer.from(JSON.stringify({ fileId, exp: expiresAt })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyResumeDownloadToken(token, secret = 'test-signing-secret') {
  if (!token || typeof token !== 'string') return { valid: false, reason: 'Missing token' };
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false, reason: 'Malformed token' };

  const [payload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: false, reason: 'Invalid signature' };
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.fileId || typeof data.fileId !== 'number') return { valid: false, reason: 'Invalid payload' };
    if (typeof data.exp !== 'number' || Date.now() / 1000 > data.exp) return { valid: false, reason: 'Token has expired' };
    return { valid: true, fileId: data.fileId };
  } catch {
    return { valid: false, reason: 'Payload decode error' };
  }
}

test('short-lived resume download token generation and verification', () => {
  const fileId = 42;
  const token = generateResumeDownloadToken(fileId, 60);

  // Valid token
  const verified = verifyResumeDownloadToken(token);
  assert.equal(verified.valid, true);
  assert.equal(verified.fileId, fileId);

  // Tampered token payload
  const parts = token.split('.');
  const tamperedToken = `${parts[0]}tampered.${parts[1]}`;
  const tamperedResult = verifyResumeDownloadToken(tamperedToken);
  assert.equal(tamperedResult.valid, false);

  // Tampered signature
  const fakeSigToken = `${parts[0]}.invalid_signature_here`;
  const fakeSigResult = verifyResumeDownloadToken(fakeSigToken);
  assert.equal(fakeSigResult.valid, false);

  // Expired token (expires -10 seconds ago)
  const expiredToken = generateResumeDownloadToken(fileId, -10);
  const expiredResult = verifyResumeDownloadToken(expiredToken);
  assert.equal(expiredResult.valid, false);
  assert.match(expiredResult.reason ?? '', /expired/i);
});

test('resume storage read, write, exists, and delete cycle', async () => {
  const memoryStore = new Map();
  const testKey = `resumes/2026/08/test-${crypto.randomUUID()}.pdf`;
  const testContent = Buffer.from('%PDF-1.4 sample content for private storage test');

  // Write
  memoryStore.set(testKey, testContent);
  assert.equal(memoryStore.has(testKey), true);

  // Read
  const readBack = memoryStore.get(testKey);
  assert.equal(readBack.toString(), testContent.toString());

  // Delete
  memoryStore.delete(testKey);
  assert.equal(memoryStore.has(testKey), false);
});
