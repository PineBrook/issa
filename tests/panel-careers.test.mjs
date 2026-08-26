import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import crypto from 'node:crypto';

const careersLibPath = new URL('../lib/careers.ts', import.meta.url);
const resumeAuthPath = new URL('../lib/resume-auth.ts', import.meta.url);
const staffPanelPath = new URL('../app/panel/staff-panel.tsx', import.meta.url);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateResumeDownloadToken(fileId, secret = 'test-secret', expiresInSeconds = 900) {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = Buffer.from(JSON.stringify({ fileId, exp: expiresAt })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

function verifyResumeDownloadToken(token, secret = 'test-secret') {
  if (!token || typeof token !== 'string') return { valid: false };
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false };
  const [payload, signature] = parts;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  if (signature !== expected) return { valid: false };
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.fileId || typeof data.fileId !== 'number') return { valid: false };
    if (typeof data.exp !== 'number' || Date.now() / 1000 > data.exp) return { valid: false };
    return { valid: true, fileId: data.fileId };
  } catch {
    return { valid: false };
  }
}

test('Job Opening slugify handles complex titles, hindi transliterations, and symbols', () => {
  assert.equal(slugify('Senior Education Expert'), 'senior-education-expert');
  assert.equal(slugify('Healthcare Coordinator (Mobile Camps) - Pauri!'), 'healthcare-coordinator-mobile-camps-pauri');
  assert.equal(slugify('  Program   Operations   Manager  '), 'program-operations-manager');
  assert.equal(slugify('Specialist / Himalayan Outreach & Development'), 'specialist-himalayan-outreach-development');
});

test('Resume download tokens generate correctly and expire when expected', () => {
  const secret = 'issa-super-secret-key-2026';
  const token = generateResumeDownloadToken(42, secret, 3600);
  assert.ok(token.includes('.'));

  const validResult = verifyResumeDownloadToken(token, secret);
  assert.equal(validResult.valid, true);
  assert.equal(validResult.fileId, 42);

  // Expired token test
  const expiredToken = generateResumeDownloadToken(42, secret, -10);
  const expiredResult = verifyResumeDownloadToken(expiredToken, secret);
  assert.equal(expiredResult.valid, false);

  // Tampered token test
  const tamperedToken = token + 'tampered';
  const tamperedResult = verifyResumeDownloadToken(tamperedToken, secret);
  assert.equal(tamperedResult.valid, false);
});

test('lib/careers.ts contains operational methods for job listings and applications', async () => {
  const careersCode = await readFile(careersLibPath, 'utf8');

  // Verify exported panel query & mutation methods
  assert.match(careersCode, /export async function getPanelJobOpenings/);
  assert.match(careersCode, /export async function createJobOpening/);
  assert.match(careersCode, /export async function updateJobOpening/);
  assert.match(careersCode, /export async function deleteJobOpening/);
  assert.match(careersCode, /export async function getPanelCareerApplications/);
  assert.match(careersCode, /export async function updateCareerApplicationStatus/);
  assert.match(careersCode, /export async function getCareerDashboardMetrics/);

  // Verify Role & Validation error guards
  assert.match(careersCode, /export class CareerValidationError/);
  assert.match(careersCode, /export class CareerForbiddenError/);
  assert.match(careersCode, /actorStaff\.role !== 'ADMIN'/);
});

test('StaffPanel component renders operational views for job openings and career applications', async () => {
  const panelCode = await readFile(staffPanelPath, 'utf8');

  // Verify tabs
  assert.match(panelCode, /setCurrentTab\('jobs'\)/);
  assert.match(panelCode, /setCurrentTab\('applications'\)/);
  assert.match(panelCode, /Job Openings/);
  assert.match(panelCode, /Career Applications/);

  // Verify candidate review drawer & controls
  assert.match(panelCode, /Review Candidate Application/i);
  assert.match(panelCode, /handleUpdateApplicationStatus/);
  assert.match(panelCode, /Download Resume/i);
  assert.match(panelCode, /statusBadgeClasses/);
});
