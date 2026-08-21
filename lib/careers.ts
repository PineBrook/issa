import 'server-only';

import crypto from 'node:crypto';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';
import type {
  JobOpening,
  CareerApplicationInput,
  ResumeFileInput,
  ApplicationSubmissionState,
  ResumeFile,
} from './careers-types';
import { saveResumeFile, deleteResumeFile, getResumeFile } from './storage';

function getDb() {
  const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
  if (!connectionString) {
    return null;
  }
  return neon(connectionString);
}

interface JobRow {
  id: string | number;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  salary: string | null;
  description: string;
  requirements: unknown;
  status: 'active' | 'closed' | 'draft' | 'archived';
  closing_time: string | Date | null;
  display_order: number;
  created_at: string | Date;
  updated_at: string | Date;
}

function parseRequirements(reqs: unknown): string[] {
  if (Array.isArray(reqs)) {
    return reqs.map((r) => String(r));
  }
  if (typeof reqs === 'string') {
    try {
      const parsed = JSON.parse(reqs);
      if (Array.isArray(parsed)) {
        return parsed.map((r) => String(r));
      }
    } catch {
      return reqs.split('\n').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

function mapJobRow(row: JobRow): JobOpening {
  const reqs = parseRequirements(row.requirements);
  return {
    id: Number(row.id),
    slug: row.slug,
    title: row.title,
    department: row.department,
    dept: row.department,
    location: row.location,
    employmentType: row.employment_type,
    type: row.employment_type,
    salary: row.salary,
    description: row.description,
    desc: row.description,
    requirements: reqs,
    reqs: reqs,
    status: row.status,
    closingTime: row.closing_time ? new Date(row.closing_time).toISOString() : null,
    displayOrder: Number(row.display_order),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function getActiveJobOpenings(): Promise<JobOpening[]> {
  const sql = getDb();
  if (!sql) {
    return [];
  }

  try {
    const rows = await sql`
      SELECT
        id,
        slug,
        title,
        department,
        location,
        employment_type,
        salary,
        description,
        requirements,
        status,
        closing_time,
        display_order,
        created_at,
        updated_at
      FROM job_openings
      WHERE status = 'active'
      ORDER BY display_order ASC, created_at ASC
    `;

    if (!rows || rows.length === 0) {
      return [];
    }

    return (rows as JobRow[]).map(mapJobRow);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err?.code === '42P01') {
      console.warn('job_openings table does not exist yet in database.');
    } else {
      console.error('Failed to fetch active job openings from database:', err?.message || error);
    }
    return [];
  }
}

export async function getJobOpeningBySlug(slug: string): Promise<JobOpening | null> {
  const sql = getDb();
  if (!sql) {
    return null;
  }

  try {
    const rows = await sql`
      SELECT
        id,
        slug,
        title,
        department,
        location,
        employment_type,
        salary,
        description,
        requirements,
        status,
        closing_time,
        display_order,
        created_at,
        updated_at
      FROM job_openings
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return null;
    }

    return mapJobRow(rows[0] as JobRow);
  } catch (error) {
    console.error('Failed to fetch job opening by slug from database:', error);
    return null;
  }
}

// Magic bytes validation for safe resume types
export function validateResumeFileBuffer(
  buffer: Buffer,
  filename: string,
  declaredMimeType?: string
): { valid: boolean; error?: string; extension: string; mimeType: string } {
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

  // Check magic bytes
  let detectedMime = declaredMimeType ?? 'application/octet-stream';

  if (ext === 'pdf') {
    // PDF magic bytes %PDF (0x25, 0x50, 0x44, 0x46)
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
    // DOCX is a zip archive: PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
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
    // DOC compound binary file: 0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1
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

export async function submitCareerApplication(
  input: CareerApplicationInput,
  resume: ResumeFileInput
): Promise<ApplicationSubmissionState> {
  const errors: Record<string, string> = {};

  // Honeypot check for bots
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return {
      success: false,
      message: 'Invalid submission.',
      errors: { honeypot: 'Spam detected.' },
    };
  }

  const fullName = input.fullName?.trim();
  if (!fullName || fullName.length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  } else if (fullName.length > 100) {
    errors.fullName = 'Full name must not exceed 100 characters.';
  }

  const email = input.email?.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  const validExperiences = ['0-1', '1-3', '3-5', '5+'];
  if (!input.experience || !validExperiences.includes(input.experience)) {
    errors.experience = 'Please select a valid experience range.';
  }

  if (!input.consent) {
    errors.consent = 'You must consent to the privacy policy to submit your application.';
  }

  const role = input.role?.trim();
  if (!role) {
    errors.role = 'Please select a target role.';
  }

  // Validate resume
  const resumeValidation = validateResumeFileBuffer(
    resume.buffer,
    resume.originalFilename,
    resume.mimeType
  );
  if (!resumeValidation.valid) {
    errors.resume = resumeValidation.error ?? 'Invalid resume file.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Please resolve the highlighted errors and try again.',
      errors,
    };
  }

  const sql = getDb();
  if (!sql) {
    throw new Error('Database connection is not configured.');
  }

  // Check if role is active opening or general-interest volunteer
  let jobId: number | null = null;
  if (role !== 'volunteer' && role !== 'general-interest') {
    const jobRows = await sql`
      SELECT id, status
      FROM job_openings
      WHERE slug = ${role}
      LIMIT 1
    `;
    if (!jobRows || jobRows.length === 0) {
      return {
        success: false,
        message: 'The selected position is no longer available.',
        errors: { role: 'Position not found or inactive.' },
      };
    }
    if (jobRows[0].status !== 'active') {
      return {
        success: false,
        message: 'This position is closed and no longer accepting applications.',
        errors: { role: 'Position is closed.' },
      };
    }
    jobId = Number(jobRows[0].id);
  }

  // Duplicate submission protection (check same email and role within past 24 hours)
  const existingRows = await sql`
    SELECT id, created_at
    FROM career_applications
    WHERE email = ${email}
      AND role_slug = ${role}
      AND created_at > NOW() - INTERVAL '24 hours'
    LIMIT 1
  `;

  if (existingRows && existingRows.length > 0) {
    return {
      success: false,
      message: 'You have already submitted an application for this position recently. Our team is reviewing your profile.',
      errors: { email: 'Duplicate submission detected within 24 hours.' },
    };
  }

  // Generate private storage key and SHA256 checksum
  const ext = resumeValidation.extension;
  const mimeType = resumeValidation.mimeType;
  const checksum = crypto.createHash('sha256').update(resume.buffer).digest('hex');
  const now = new Date();
  const yearMonth = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  const randomKey = crypto.randomUUID();
  const storageKey = `resumes/${yearMonth}/${randomKey}.${ext}`;

  // Step 1: Upload file to private object storage
  await saveResumeFile(storageKey, resume.buffer, mimeType);

  // Step 2: Transactional database write (application + resume metadata)
  const consentText =
    input.consentText ??
    'I consent to ISSA Foundation collecting and processing my application data and resume for recruitment in accordance with the Privacy Policy.';
  const consentVersion = input.consentVersion ?? '2026-v1';

  try {
    const appRows = await sql`
      INSERT INTO career_applications (
        job_id,
        role_slug,
        full_name,
        email,
        experience_years,
        statement,
        consent_text,
        consent_version,
        consented_at,
        status
      )
      VALUES (
        ${jobId},
        ${role},
        ${fullName},
        ${email},
        ${input.experience},
        ${input.statement?.trim() || null},
        ${consentText},
        ${consentVersion},
        NOW(),
        'new'
      )
      RETURNING id
    `;

    const applicationId = Number(appRows[0].id);

    await sql`
      INSERT INTO resume_files (
        application_id,
        storage_key,
        original_filename,
        mime_type,
        size_bytes,
        checksum_sha256
      )
      VALUES (
        ${applicationId},
        ${storageKey},
        ${resume.originalFilename},
        ${mimeType},
        ${resume.buffer.length},
        ${checksum}
      )
    `;

    return {
      success: true,
      message: 'Application received successfully! Our team will review your qualifications and contact you.',
      applicationId,
    };
  } catch (dbError) {
    // Database write failed: Delete orphaned private file to prevent orphaned storage
    console.error('Database write failed during application submission. Cleaning up uploaded resume:', dbError);
    await deleteResumeFile(storageKey).catch((cleanupErr) => {
      console.error('Failed to cleanup orphaned resume file:', cleanupErr);
    });

    throw new Error('Failed to persist application. Please try again.');
  }
}

export async function getResumeFileRecord(fileId: number): Promise<ResumeFile | null> {
  const sql = getDb();
  if (!sql) {
    return null;
  }

  const rows = await sql`
    SELECT
      id,
      application_id AS "applicationId",
      storage_key AS "storageKey",
      original_filename AS "originalFilename",
      mime_type AS "mimeType",
      size_bytes AS "sizeBytes",
      checksum_sha256 AS "checksumSha256",
      uploaded_at AS "uploadedAt",
      deleted_at AS "deletedAt",
      created_at AS "createdAt"
    FROM resume_files
    WHERE id = ${fileId} AND deleted_at IS NULL
    LIMIT 1
  `;

  if (!rows || rows.length === 0) {
    return null;
  }

  const r = rows[0];
  return {
    id: Number(r.id),
    applicationId: Number(r.applicationId),
    storageKey: String(r.storageKey),
    originalFilename: String(r.originalFilename),
    mimeType: String(r.mimeType),
    sizeBytes: Number(r.sizeBytes),
    checksumSha256: String(r.checksumSha256),
    uploadedAt: new Date(r.uploadedAt).toISOString(),
    deletedAt: r.deletedAt ? new Date(r.deletedAt).toISOString() : null,
    createdAt: new Date(r.createdAt).toISOString(),
  };
}

export async function getResumeFileBytes(storageKey: string): Promise<Buffer | null> {
  const result = await getResumeFile(storageKey);
  return result ? result.buffer : null;
}
