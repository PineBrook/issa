import 'server-only';

import crypto from 'node:crypto';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';
import type {
  JobOpening,
  PanelJobOpening,
  JobOpeningInput,
  CareerApplicationInput,
  ResumeFileInput,
  ApplicationSubmissionState,
  ResumeFile,
  PanelCareerApplication,
  CareerApplicationStatus,
  CareerMetrics,
  JobStatus,
} from './careers-types';
import { saveResumeFile, deleteResumeFile, getResumeFile } from './storage';
import { generateResumeDownloadToken } from './resume-auth';
import type { StaffProfile } from './staff';

export class CareerValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CareerValidationError';
  }
}

export class CareerForbiddenError extends Error {
  constructor(message = 'Unauthorized: Insufficient permissions for career management.') {
    super(message);
    this.name = 'CareerForbiddenError';
  }
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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
    return reqs.map((r) => String(r)).filter((r) => r.trim().length > 0);
  }
  if (typeof reqs === 'string') {
    try {
      const parsed = JSON.parse(reqs);
      if (Array.isArray(parsed)) {
        return parsed.map((r) => String(r)).filter((r) => r.trim().length > 0);
      }
    } catch {
      return reqs
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
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
        checksum_sha256,
        file_data
      )
      VALUES (
        ${applicationId},
        ${storageKey},
        ${resume.originalFilename},
        ${mimeType},
        ${resume.buffer.length},
        ${checksum},
        ${resume.buffer}
      )
    `;

    const { recordAuditEvent } = await import('@/lib/audit');
    await recordAuditEvent({
      actorId: 'applicant',
      actorEmail: email,
      action: 'public.career_apply',
      entityType: 'career_application',
      entityId: String(applicationId),
      metadata: {
        fullName,
        role,
        experience: input.experience,
        resumeFilename: resume.originalFilename,
        resumeSize: resume.buffer.length,
      },
    });

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

// ---------------------------------------------------------------------------
// PANEL OPERATIONS: JOB LISTING MANAGEMENT
// ---------------------------------------------------------------------------

export async function getPanelJobOpenings(filters?: {
  status?: string;
  search?: string;
}): Promise<PanelJobOpening[]> {
  const sql = getDb();
  if (!sql) {
    return [];
  }

  try {
    const rows = await sql`
      SELECT
        j.id,
        j.slug,
        j.title,
        j.department,
        j.location,
        j.employment_type,
        j.salary,
        j.description,
        j.requirements,
        j.status,
        j.closing_time,
        j.display_order,
        j.created_at,
        j.updated_at,
        COUNT(ca.id)::int AS application_count
      FROM job_openings j
      LEFT JOIN career_applications ca ON ca.job_id = j.id
      GROUP BY j.id
      ORDER BY j.display_order ASC, j.created_at DESC
    `;

    let mapped: PanelJobOpening[] = (rows as (JobRow & { application_count: number })[]).map(
      (r) => ({
        ...mapJobRow(r),
        applicationCount: Number(r.application_count || 0),
      })
    );

    if (filters?.status && filters.status !== 'all') {
      mapped = mapped.filter((j) => j.status === filters.status);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      mapped = mapped.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.department.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.slug.toLowerCase().includes(q)
      );
    }

    return mapped;
  } catch (error) {
    console.error('Failed to fetch panel job openings:', error);
    return [];
  }
}

export async function createJobOpening(
  input: JobOpeningInput,
  actorStaff: StaffProfile
): Promise<JobOpening> {
  if (!actorStaff || (actorStaff.role !== 'ADMIN' && actorStaff.role !== 'CONTENT')) {
    throw new CareerForbiddenError('Unauthorized: Insufficient permissions to create job openings.');
  }

  const title = input.title?.trim();
  if (!title || title.length < 3) {
    throw new CareerValidationError('Job title must be at least 3 characters long.');
  }

  const department = input.department?.trim();
  if (!department) {
    throw new CareerValidationError('Department is required.');
  }

  const location = input.location?.trim();
  if (!location) {
    throw new CareerValidationError('Location is required.');
  }

  const employmentType = input.employmentType?.trim() || 'Full-time (On-site)';
  const description = input.description?.trim();
  if (!description || description.length < 10) {
    throw new CareerValidationError('Description must be at least 10 characters long.');
  }

  let baseSlug = input.slug?.trim() ? slugify(input.slug.trim()) : slugify(title);
  if (!baseSlug || baseSlug.length < 2) {
    baseSlug = `job-${Date.now().toString(36)}`;
  }

  const reqs = parseRequirements(input.requirements);
  const status: JobStatus = input.status ?? 'active';
  const displayOrder = typeof input.displayOrder === 'number' ? input.displayOrder : 10;
  const salary = input.salary?.trim() || null;
  const closingTime = input.closingTime
    ? (!isNaN(new Date(input.closingTime).getTime()) ? new Date(input.closingTime).toISOString() : null)
    : null;

  const sql = getDb();
  if (!sql) {
    throw new Error('Database connection unavailable.');
  }

  // Ensure slug uniqueness by appending suffix if collision exists
  let slug = baseSlug;
  const existing = await sql`SELECT id FROM job_openings WHERE slug = ${slug} LIMIT 1`;
  if (existing && existing.length > 0) {
    slug = `${baseSlug}-${Date.now().toString(36)}`;
    const secondCheck = await sql`SELECT id FROM job_openings WHERE slug = ${slug} LIMIT 1`;
    if (secondCheck && secondCheck.length > 0) {
      slug = `${baseSlug}-${crypto.randomBytes(3).toString('hex')}`;
    }
  }

  const rows = await sql`
    INSERT INTO job_openings (
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
    )
    VALUES (
      ${slug},
      ${title},
      ${department},
      ${location},
      ${employmentType},
      ${salary},
      ${description},
      ${JSON.stringify(reqs)}::jsonb,
      ${status},
      ${closingTime},
      ${displayOrder},
      NOW(),
      NOW()
    )
    RETURNING
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
  `;

  const createdJob = mapJobRow(rows[0] as JobRow);

  const { recordAuditEvent } = await import('@/lib/audit');
  await recordAuditEvent({
    actorId: String(actorStaff.id),
    actorEmail: actorStaff.email,
    action: 'job.create',
    entityType: 'job_opening',
    entityId: String(createdJob.id),
    afterState: {
      title: createdJob.title,
      slug: createdJob.slug,
      department: createdJob.department,
      status: createdJob.status,
    },
    metadata: { createdBy: actorStaff.fullName },
  });

  return createdJob;
}

export async function updateJobOpening(
  id: number,
  input: Partial<JobOpeningInput>,
  actorStaff: StaffProfile
): Promise<JobOpening> {
  if (!actorStaff || (actorStaff.role !== 'ADMIN' && actorStaff.role !== 'CONTENT')) {
    throw new CareerForbiddenError('Unauthorized: Insufficient permissions to update job openings.');
  }

  const sql = getDb();
  if (!sql) {
    throw new Error('Database connection unavailable.');
  }

  const existingRows = await sql`
    SELECT id, slug, title, department, location, employment_type, salary, description, requirements, status, closing_time, display_order, created_at, updated_at
    FROM job_openings
    WHERE id = ${id}
    LIMIT 1
  `;

  if (!existingRows || existingRows.length === 0) {
    throw new CareerValidationError('Job opening not found.');
  }

  const current = existingRows[0] as JobRow;

  let newSlug = current.slug;
  if (input.slug !== undefined && input.slug.trim()) {
    newSlug = slugify(input.slug.trim());
    if (newSlug !== current.slug) {
      const slugCheck = await sql`SELECT id FROM job_openings WHERE slug = ${newSlug} AND id != ${id} LIMIT 1`;
      if (slugCheck && slugCheck.length > 0) {
        throw new CareerValidationError(`A job opening with slug "${newSlug}" already exists.`);
      }
    }
  }

  const newTitle = input.title !== undefined ? input.title.trim() : current.title;
  const newDepartment = input.department !== undefined ? input.department.trim() : current.department;
  const newLocation = input.location !== undefined ? input.location.trim() : current.location;
  const newEmploymentType = input.employmentType !== undefined ? input.employmentType.trim() : current.employment_type;
  const newSalary = input.salary !== undefined ? (input.salary ? input.salary.trim() : null) : current.salary;
  const newDescription = input.description !== undefined ? input.description.trim() : current.description;
  const newReqs = input.requirements !== undefined ? parseRequirements(input.requirements) : parseRequirements(current.requirements);
  const newStatus = input.status !== undefined ? input.status : current.status;
  const newDisplayOrder = input.displayOrder !== undefined ? input.displayOrder : current.display_order;

  let newClosingTime: string | null = null;
  if (input.closingTime !== undefined) {
    if (input.closingTime) {
      const parsedDate = new Date(input.closingTime);
      newClosingTime = !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : null;
    } else {
      newClosingTime = null;
    }
  } else {
    newClosingTime = current.closing_time ? new Date(current.closing_time).toISOString() : null;
  }

  const updatedRows = await sql`
    UPDATE job_openings
    SET
      slug = ${newSlug},
      title = ${newTitle},
      department = ${newDepartment},
      location = ${newLocation},
      employment_type = ${newEmploymentType},
      salary = ${newSalary},
      description = ${newDescription},
      requirements = ${JSON.stringify(newReqs)}::jsonb,
      status = ${newStatus},
      closing_time = ${newClosingTime},
      display_order = ${newDisplayOrder},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING
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
  `;

  const updatedJob = mapJobRow(updatedRows[0] as JobRow);

  const { recordAuditEvent } = await import('@/lib/audit');
  await recordAuditEvent({
    actorId: String(actorStaff.id),
    actorEmail: actorStaff.email,
    action: 'job.update',
    entityType: 'job_opening',
    entityId: String(updatedJob.id),
    afterState: {
      title: updatedJob.title,
      slug: updatedJob.slug,
      department: updatedJob.department,
      status: updatedJob.status,
    },
    metadata: { updatedBy: actorStaff.fullName },
  });

  return updatedJob;
}

export async function archiveJobOpening(
  id: number,
  actorStaff: StaffProfile
): Promise<JobOpening> {
  if (!actorStaff || (actorStaff.role !== 'ADMIN' && actorStaff.role !== 'CONTENT')) {
    throw new CareerForbiddenError('Unauthorized: Insufficient permissions to archive job opening.');
  }

  const sql = getDb();
  if (!sql) {
    throw new Error('Database connection unavailable.');
  }

  const rows = await sql`
    UPDATE job_openings
    SET status = 'archived', updated_at = NOW()
    WHERE id = ${id}
    RETURNING
      id, slug, title, department, location, employment_type, salary,
      description, requirements, status, closing_time, display_order,
      created_at, updated_at
  `;

  if (!rows || rows.length === 0) {
    throw new CareerValidationError('Job opening not found.');
  }

  const archivedJob = mapJobRow(rows[0] as JobRow);

  const { recordAuditEvent } = await import('@/lib/audit');
  await recordAuditEvent({
    actorId: String(actorStaff.id),
    actorEmail: actorStaff.email,
    action: 'job.archive',
    entityType: 'job_opening',
    entityId: String(archivedJob.id),
    afterState: { status: 'archived', title: archivedJob.title },
    metadata: { archivedBy: actorStaff.fullName },
  });

  return archivedJob;
}

export async function deleteJobOpening(
  id: number,
  actorStaff: StaffProfile
): Promise<{ success: boolean; action: 'deleted' | 'archived' }> {
  if (!actorStaff || (actorStaff.role !== 'ADMIN' && actorStaff.role !== 'CONTENT')) {
    throw new CareerForbiddenError('Unauthorized: Insufficient permissions to delete or archive job openings.');
  }

  const sql = getDb();
  if (!sql) {
    throw new Error('Database connection unavailable.');
  }

  // Check if applications exist for this job
  const appCount = await sql`
    SELECT COUNT(id)::int AS count FROM career_applications WHERE job_id = ${id}
  `;

  const hasApps = Number(appCount[0]?.count || 0) > 0;

  const { recordAuditEvent } = await import('@/lib/audit');

  if (hasApps) {
    // If applications are attached, archive instead of deleting to preserve referral history
    await sql`
      UPDATE job_openings
      SET status = 'archived', updated_at = NOW()
      WHERE id = ${id}
    `;
    await recordAuditEvent({
      actorId: String(actorStaff.id),
      actorEmail: actorStaff.email,
      action: 'job.archive',
      entityType: 'job_opening',
      entityId: String(id),
      metadata: { deletedBy: actorStaff.fullName, convertedToArchive: true },
    });
    return { success: true, action: 'archived' };
  } else {
    await sql`DELETE FROM job_openings WHERE id = ${id}`;
    await recordAuditEvent({
      actorId: String(actorStaff.id),
      actorEmail: actorStaff.email,
      action: 'job.delete',
      entityType: 'job_opening',
      entityId: String(id),
      metadata: { deletedBy: actorStaff.fullName },
    });
    return { success: true, action: 'deleted' };
  }
}

// ---------------------------------------------------------------------------
// PANEL OPERATIONS: CAREER APPLICATIONS MANAGEMENT
// ---------------------------------------------------------------------------

export async function getPanelCareerApplications(filters?: {
  status?: string;
  jobId?: number;
  role?: string;
  search?: string;
}): Promise<PanelCareerApplication[]> {
  const sql = getDb();
  if (!sql) {
    return [];
  }

  try {
    const rows = await sql`
      SELECT
        ca.id,
        ca.job_id,
        ca.role_slug,
        ca.full_name,
        ca.email,
        ca.phone,
        ca.experience_years,
        ca.statement,
        ca.consent_text,
        ca.consent_version,
        ca.consented_at,
        ca.status,
        ca.assigned_to,
        ca.created_at,
        ca.updated_at,
        jo.title AS job_title,
        jo.department AS job_department,
        rf.id AS resume_id,
        rf.storage_key AS resume_storage_key,
        rf.original_filename AS resume_filename,
        rf.mime_type AS resume_mime_type,
        rf.size_bytes AS resume_size_bytes,
        rf.checksum_sha256 AS resume_checksum,
        rf.uploaded_at AS resume_uploaded_at
      FROM career_applications ca
      LEFT JOIN job_openings jo ON jo.id = ca.job_id
      LEFT JOIN resume_files rf ON rf.application_id = ca.id AND rf.deleted_at IS NULL
      ORDER BY ca.created_at DESC
    `;

    let mapped: PanelCareerApplication[] = (rows as any[]).map((r) => {
      const resumeId = r.resume_id ? Number(r.resume_id) : null;
      let resumeInfo: PanelCareerApplication['resume'] = null;
      if (resumeId) {
        const token = generateResumeDownloadToken(resumeId, 7200);
        resumeInfo = {
          id: resumeId,
          storageKey: String(r.resume_storage_key),
          originalFilename: String(r.resume_filename),
          mimeType: String(r.resume_mime_type),
          sizeBytes: Number(r.resume_size_bytes),
          checksumSha256: String(r.resume_checksum),
          uploadedAt: new Date(r.resume_uploaded_at).toISOString(),
          downloadUrl: `/api/resumes/${resumeId}/download?token=${token}`,
        };
      }

      return {
        id: Number(r.id),
        jobId: r.job_id ? Number(r.job_id) : null,
        roleSlug: String(r.role_slug),
        fullName: String(r.full_name),
        email: String(r.email),
        phone: r.phone ? String(r.phone) : null,
        experienceYears: String(r.experience_years),
        statement: r.statement ? String(r.statement) : null,
        consentText: String(r.consent_text),
        consentVersion: String(r.consent_version),
        consentedAt: new Date(r.consented_at).toISOString(),
        status: r.status as CareerApplicationStatus,
        assignedTo: r.assigned_to ? String(r.assigned_to) : null,
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
        jobTitle: r.job_title ? String(r.job_title) : (r.role_slug === 'volunteer' ? 'General Volunteer' : r.role_slug),
        jobDepartment: r.job_department ? String(r.job_department) : 'Outreach & Operations',
        resume: resumeInfo,
      };
    });

    if (filters?.status && filters.status !== 'all') {
      mapped = mapped.filter((a) => a.status === filters.status);
    }

    if (filters?.jobId) {
      mapped = mapped.filter((a) => a.jobId === filters.jobId);
    }

    if (filters?.role && filters.role !== 'all') {
      mapped = mapped.filter((a) => a.roleSlug === filters.role);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      mapped = mapped.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          (a.jobTitle && a.jobTitle.toLowerCase().includes(q)) ||
          a.roleSlug.toLowerCase().includes(q) ||
          (a.assignedTo && a.assignedTo.toLowerCase().includes(q))
      );
    }

    return mapped;
  } catch (error) {
    console.error('Failed to fetch panel career applications:', error);
    return [];
  }
}

export async function updateCareerApplicationStatus(
  id: number,
  status: CareerApplicationStatus,
  assignedTo?: string | null,
  actorStaff?: StaffProfile
): Promise<PanelCareerApplication> {
  if (actorStaff && actorStaff.role !== 'ADMIN') {
    throw new CareerForbiddenError('Only administrators can update career application statuses.');
  }

  const validStatuses: CareerApplicationStatus[] = [
    'new',
    'under_review',
    'interview_scheduled',
    'rejected',
    'hired',
    'archived',
  ];

  if (!validStatuses.includes(status)) {
    throw new CareerValidationError(`Invalid application status "${status}".`);
  }

  const sql = getDb();
  if (!sql) {
    throw new Error('Database connection unavailable.');
  }

  const updateResult = await sql`
    UPDATE career_applications
    SET
      status = ${status},
      assigned_to = ${assignedTo !== undefined ? (assignedTo ? assignedTo.trim() : null) : null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id
  `;

  if (!updateResult || updateResult.length === 0) {
    throw new CareerValidationError('Application not found.');
  }

  const apps = await getPanelCareerApplications();
  const updated = apps.find((a) => a.id === id);
  if (!updated) {
    throw new CareerValidationError('Application not found after update.');
  }

  const { recordAuditEvent } = await import('@/lib/audit');
  await recordAuditEvent({
    actorId: actorStaff ? String(actorStaff.id) : 'system',
    actorEmail: actorStaff ? actorStaff.email : 'system@issafoundation.co.in',
    action: 'application.status_update',
    entityType: 'career_application',
    entityId: String(id),
    afterState: { status, assignedTo: assignedTo || null },
    metadata: {
      updatedBy: actorStaff?.fullName || 'system',
      candidateName: updated.fullName,
      role: updated.roleSlug,
    },
  });

  return updated;
}

export async function getCareerDashboardMetrics(): Promise<CareerMetrics> {
  const sql = getDb();
  if (!sql) {
    return {
      totalActiveJobs: 0,
      totalJobs: 0,
      totalApplications: 0,
      newApplications: 0,
      underReviewApplications: 0,
    };
  }

  try {
    const [jobStats, appStats] = await Promise.all([
      sql`
        SELECT
          COUNT(id)::int AS total_jobs,
          COUNT(id) FILTER (WHERE status = 'active')::int AS active_jobs
        FROM job_openings
      `,
      sql`
        SELECT
          COUNT(id)::int AS total_apps,
          COUNT(id) FILTER (WHERE status = 'new')::int AS new_apps,
          COUNT(id) FILTER (WHERE status = 'under_review')::int AS under_review_apps
        FROM career_applications
      `,
    ]);

    return {
      totalJobs: Number(jobStats[0]?.total_jobs || 0),
      totalActiveJobs: Number(jobStats[0]?.active_jobs || 0),
      totalApplications: Number(appStats[0]?.total_apps || 0),
      newApplications: Number(appStats[0]?.new_apps || 0),
      underReviewApplications: Number(appStats[0]?.under_review_apps || 0),
    };
  } catch (err) {
    console.error('Failed to get career dashboard metrics:', err);
    return {
      totalActiveJobs: 0,
      totalJobs: 0,
      totalApplications: 0,
      newApplications: 0,
      underReviewApplications: 0,
    };
  }
}
