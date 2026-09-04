import 'server-only';

import { neon } from '@neondatabase/serverless';
import { getCurrentStaff, type StaffProfile } from '@/lib/staff';
import type { BlogPost, BlogPostRevision, BlogStatus } from '@/lib/blog-types';

const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
if (!connectionString) {
  throw new Error('DATABASE_URL or DB_CONN_KEY must contain the Neon connection string.');
}

const sql = neon(connectionString);

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
});

export class CmsValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CmsValidationError';
  }
}

export class CmsConcurrencyConflictError extends Error {
  constructor(message = 'This post was modified by another editor. Please refresh to load the latest changes.') {
    super(message);
    this.name = 'CmsConcurrencyConflictError';
  }
}

export class CmsForbiddenError extends Error {
  constructor(message = 'Unauthorized: Insufficient permissions for this action.') {
    super(message);
    this.name = 'CmsForbiddenError';
  }
}

/**
 * Validates slug format: lowercase letters, numbers, and hyphens only.
 */
export function validateSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  const trimmed = slug.trim();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed) && trimmed.length >= 3 && trimmed.length <= 120;
}

/**
 * Slugifies a title string.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Calculates estimated reading time in minutes (approx 200 words/min).
 */
export function calculateReadingTime(text: string): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Sanitizes markdown content to strip dangerous HTML tags and scripts.
 */
export function sanitizeMarkdown(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '')
    .replace(/javascript:[^\s"'>)]+/gi, '#unsafe-link');
}

/**
 * Validates post metadata and fields.
 */
export function validatePostInput(data: {
  slug?: string;
  title?: string;
  subtitle?: string;
  category?: string;
  excerpt?: string;
  content?: string;
  coverImagePath?: string;
  authorName?: string;
  readingTimeMinutes?: number;
}) {
  if (!data.title || data.title.trim().length === 0) {
    throw new CmsValidationError('Title is required.');
  }
  if (!data.slug || !validateSlug(data.slug)) {
    throw new CmsValidationError('Slug must contain only lowercase letters, numbers, and hyphens (3-120 chars).');
  }
  if (!data.category || data.category.trim().length === 0) {
    throw new CmsValidationError('Category is required.');
  }
  if (!data.excerpt || data.excerpt.trim().length === 0) {
    throw new CmsValidationError('Excerpt is required.');
  }
  if (!data.content || data.content.trim().length === 0) {
    throw new CmsValidationError('Content is required.');
  }
  if (!data.coverImagePath || !data.coverImagePath.trim().startsWith('/')) {
    throw new CmsValidationError('Cover image must be a valid relative path starting with "/".');
  }
  if (!data.authorName || data.authorName.trim().length === 0) {
    throw new CmsValidationError('Author name is required.');
  }
}

/**
 * Formats database row into BlogPost entity.
 */
function mapBlogRow(row: any): BlogPost {
  const publishedAtDate = row.published_at ? new Date(row.published_at) : null;
  const createdAtDate = row.created_at ? new Date(row.created_at) : new Date();
  const updatedAtDate = row.updated_at ? new Date(row.updated_at) : new Date();

  return {
    id: Number(row.id),
    slug: String(row.slug),
    category: String(row.category),
    title: String(row.title),
    subtitle: String(row.subtitle || ''),
    excerpt: String(row.excerpt),
    content: String(row.content_markdown),
    coverImagePath: String(row.cover_image_path),
    authorName: String(row.author_name),
    readingTimeMinutes: Number(row.reading_time_minutes || 1),
    status: (row.status || 'draft') as BlogStatus,
    publishedAt: publishedAtDate ? publishedAtDate.toISOString() : null,
    displayDate: publishedAtDate ? dateFormatter.format(publishedAtDate) : 'Unpublished',
    createdAt: createdAtDate.toISOString(),
    updatedAt: updatedAtDate.toISOString(),
    version: Number(row.version || 1),
    seoTitle: row.seo_title ? String(row.seo_title) : null,
    seoDescription: row.seo_description ? String(row.seo_description) : null,
    createdById: row.created_by_id ? Number(row.created_by_id) : null,
    updatedById: row.updated_by_id ? Number(row.updated_by_id) : null,
  };
}

/**
 * Formats revision row into BlogPostRevision entity.
 */
function mapRevisionRow(row: any): BlogPostRevision {
  return {
    id: Number(row.id),
    postId: Number(row.post_id),
    editorId: row.editor_id ? Number(row.editor_id) : null,
    editorEmail: String(row.editor_email || ''),
    revisionNumber: Number(row.revision_number),
    title: String(row.title),
    subtitle: String(row.subtitle || ''),
    category: String(row.category),
    excerpt: String(row.excerpt),
    content: String(row.content_markdown),
    coverImagePath: String(row.cover_image_path),
    authorName: String(row.author_name),
    readingTimeMinutes: Number(row.reading_time_minutes || 1),
    status: (row.status || 'draft') as BlogStatus,
    seoTitle: row.seo_title ? String(row.seo_title) : null,
    seoDescription: row.seo_description ? String(row.seo_description) : null,
    changeSummary: row.change_summary ? String(row.change_summary) : null,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

/**
 * Fetch all blog posts for panel overview with filters.
 */
export async function getPanelBlogPosts(filters?: {
  status?: string;
  search?: string;
}): Promise<BlogPost[]> {
  const staff = await getCurrentStaff();
  if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const statusFilter = filters?.status && filters.status !== 'all' ? filters.status : null;
  const search = filters?.search?.trim() ? `%${filters.search.trim().toLowerCase()}%` : null;

  let rows;
  if (statusFilter && search) {
    rows = await sql`
      SELECT *
      FROM blog_posts
      WHERE status = ${statusFilter}
        AND (LOWER(title) LIKE ${search} OR LOWER(slug) LIKE ${search} OR LOWER(category) LIKE ${search})
      ORDER BY updated_at DESC, id DESC
    `;
  } else if (statusFilter) {
    rows = await sql`
      SELECT *
      FROM blog_posts
      WHERE status = ${statusFilter}
      ORDER BY updated_at DESC, id DESC
    `;
  } else if (search) {
    rows = await sql`
      SELECT *
      FROM blog_posts
      WHERE LOWER(title) LIKE ${search} OR LOWER(slug) LIKE ${search} OR LOWER(category) LIKE ${search}
      ORDER BY updated_at DESC, id DESC
    `;
  } else {
    rows = await sql`
      SELECT *
      FROM blog_posts
      ORDER BY updated_at DESC, id DESC
    `;
  }

  return rows.map(mapBlogRow);
}

/**
 * Get a single post by ID with authorization check.
 */
export async function getPanelBlogPostById(id: number): Promise<BlogPost | null> {
  const staff = await getCurrentStaff();
  if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const rows = await sql`
    SELECT *
    FROM blog_posts
    WHERE id = ${id}
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  return mapBlogRow(rows[0]);
}

/**
 * Get a post by slug for authenticated staff preview.
 */
export async function getPanelBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const staff = await getCurrentStaff();
  if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const rows = await sql`
    SELECT *
    FROM blog_posts
    WHERE slug = ${slug}
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  return mapBlogRow(rows[0]);
}

/**
 * Create a new blog post.
 */
export async function createBlogPost(
  data: {
    slug: string;
    title: string;
    subtitle?: string;
    category: string;
    excerpt: string;
    content: string;
    coverImagePath: string;
    authorName: string;
    readingTimeMinutes?: number;
    status?: BlogStatus;
    seoTitle?: string;
    seoDescription?: string;
    publishNow?: boolean;
    scheduledAt?: string;
  },
  staff?: StaffProfile | null,
): Promise<BlogPost> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  validatePostInput(data);

  // Check slug uniqueness
  const existing = await sql`
    SELECT id FROM blog_posts WHERE slug = ${data.slug.trim()} LIMIT 1
  `;
  if (existing.length > 0) {
    throw new CmsValidationError(`Slug "${data.slug}" is already in use. Please choose a unique slug.`);
  }

  const sanitizedContent = sanitizeMarkdown(data.content);
  const readingTime = data.readingTimeMinutes && data.readingTimeMinutes > 0
    ? data.readingTimeMinutes
    : calculateReadingTime(sanitizedContent);

  // Determine initial status based on role and request
  let targetStatus: BlogStatus = 'draft';
  let targetPublishedAt: Date | null = null;

  if (data.status === 'in_review') {
    targetStatus = 'in_review';
  } else if (data.publishNow || data.status === 'published') {
    if (currentStaff.role !== 'ADMIN') {
      throw new CmsForbiddenError('Only administrators can publish posts. Content staff can submit drafts for review.');
    }
    targetStatus = 'published';
    targetPublishedAt = new Date();
  } else if (data.scheduledAt || data.status === 'scheduled') {
    if (currentStaff.role !== 'ADMIN') {
      throw new CmsForbiddenError('Only administrators can schedule posts.');
    }
    if (!data.scheduledAt) {
      throw new CmsValidationError('Scheduled publication requires a valid future date.');
    }
    const scheduledDate = new Date(data.scheduledAt);
    if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
      throw new CmsValidationError('Scheduled publication date must be in the future.');
    }
    targetStatus = 'scheduled';
    targetPublishedAt = scheduledDate;
  }

  const rows = await sql`
    INSERT INTO blog_posts (
      slug, category, title, subtitle, excerpt, content_markdown,
      cover_image_path, author_name, reading_time_minutes, status,
      published_at, version, seo_title, seo_description, created_by_id, updated_by_id
    ) VALUES (
      ${data.slug.trim()},
      ${data.category.trim()},
      ${data.title.trim()},
      ${(data.subtitle || '').trim()},
      ${data.excerpt.trim()},
      ${sanitizedContent},
      ${data.coverImagePath.trim()},
      ${data.authorName.trim()},
      ${readingTime},
      ${targetStatus},
      ${targetPublishedAt ? targetPublishedAt.toISOString() : null},
      1,
      ${data.seoTitle?.trim() || null},
      ${data.seoDescription?.trim() || null},
      ${currentStaff.id},
      ${currentStaff.id}
    )
    RETURNING *
  `;

  const createdPost = mapBlogRow(rows[0]);

  // If published or scheduled right away, create initial revision
  if (targetStatus === 'published' || targetStatus === 'scheduled') {
    await createPostRevision(
      createdPost.id!,
      1,
      createdPost,
      currentStaff,
      targetStatus === 'published' ? 'Initial Publication' : `Scheduled for ${targetPublishedAt?.toISOString()}`,
    );
  }

  const { recordAuditEvent } = await import('@/lib/audit');
  await recordAuditEvent({
    actorId: String(currentStaff.id),
    actorEmail: currentStaff.email,
    action: targetStatus === 'published' ? 'blog.publish' : targetStatus === 'scheduled' ? 'blog.schedule' : 'blog.create',
    entityType: 'blog_post',
    entityId: String(createdPost.id),
    afterState: { title: createdPost.title, slug: createdPost.slug, status: createdPost.status },
    metadata: { authorName: createdPost.authorName },
  });

  return createdPost;
}

/**
 * Update an existing blog post with optimistic concurrency control.
 */
export async function updateBlogPost(
  id: number,
  data: {
    expectedVersion: number;
    slug?: string;
    title?: string;
    subtitle?: string;
    category?: string;
    excerpt?: string;
    content?: string;
    coverImagePath?: string;
    authorName?: string;
    readingTimeMinutes?: number;
    status?: BlogStatus;
    seoTitle?: string;
    seoDescription?: string;
  },
  staff?: StaffProfile | null,
): Promise<BlogPost> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  // Fetch current state
  const currentRows = await sql`
    SELECT * FROM blog_posts WHERE id = ${id} LIMIT 1
  `;
  if (currentRows.length === 0) {
    throw new CmsValidationError('Blog post not found.');
  }

  const current = currentRows[0];

  // Optimistic concurrency check
  if (Number(current.version) !== Number(data.expectedVersion)) {
    throw new CmsConcurrencyConflictError(
      `Conflict detected: This post was modified by another editor (current version ${current.version}, your version ${data.expectedVersion}). Please refresh before saving.`,
    );
  }

  // Slug check
  const newSlug = data.slug ? data.slug.trim() : current.slug;
  if (data.slug && !validateSlug(newSlug)) {
    throw new CmsValidationError('Slug must contain only lowercase letters, numbers, and hyphens (3-120 chars).');
  }

  if (newSlug !== current.slug) {
    const slugCheck = await sql`
      SELECT id FROM blog_posts WHERE slug = ${newSlug} AND id != ${id} LIMIT 1
    `;
    if (slugCheck.length > 0) {
      throw new CmsValidationError(`Slug "${newSlug}" is already in use by another post.`);
    }
  }

  const title = data.title !== undefined ? data.title.trim() : current.title;
  const subtitle = data.subtitle !== undefined ? data.subtitle.trim() : current.subtitle;
  const category = data.category !== undefined ? data.category.trim() : current.category;
  const excerpt = data.excerpt !== undefined ? data.excerpt.trim() : current.excerpt;
  const content = data.content !== undefined ? sanitizeMarkdown(data.content) : current.content_markdown;
  const coverImagePath = data.coverImagePath !== undefined ? data.coverImagePath.trim() : current.cover_image_path;
  const authorName = data.authorName !== undefined ? data.authorName.trim() : current.author_name;
  const readingTime = data.readingTimeMinutes && data.readingTimeMinutes > 0
    ? data.readingTimeMinutes
    : calculateReadingTime(content);

  validatePostInput({
    slug: newSlug,
    title,
    subtitle,
    category,
    excerpt,
    content,
    coverImagePath,
    authorName,
    readingTimeMinutes: readingTime,
  });

  // Permission check for status changes
  let nextStatus = current.status;
  if (data.status && data.status !== current.status) {
    if (currentStaff.role === 'CONTENT') {
      if (data.status !== 'draft' && data.status !== 'in_review') {
        throw new CmsForbiddenError('Content staff may only set status to Draft or In Review.');
      }
    }
    nextStatus = data.status;
  }

  const nextVersion = Number(current.version) + 1;

  const updateRows = await sql`
    UPDATE blog_posts
    SET
      slug = ${newSlug},
      title = ${title},
      subtitle = ${subtitle},
      category = ${category},
      excerpt = ${excerpt},
      content_markdown = ${content},
      cover_image_path = ${coverImagePath},
      author_name = ${authorName},
      reading_time_minutes = ${readingTime},
      status = ${nextStatus},
      seo_title = ${data.seoTitle !== undefined ? data.seoTitle?.trim() || null : current.seo_title},
      seo_description = ${data.seoDescription !== undefined ? data.seoDescription?.trim() || null : current.seo_description},
      updated_by_id = ${currentStaff.id},
      version = ${nextVersion},
      updated_at = NOW()
    WHERE id = ${id} AND version = ${data.expectedVersion}
    RETURNING *
  `;

  if (updateRows.length === 0) {
    throw new CmsConcurrencyConflictError();
  }

  const updatedPost = mapBlogRow(updateRows[0]);

  const { recordAuditEvent } = await import('@/lib/audit');
  await recordAuditEvent({
    actorId: String(currentStaff.id),
    actorEmail: currentStaff.email,
    action: 'blog.update',
    entityType: 'blog_post',
    entityId: String(id),
    afterState: { title: updatedPost.title, slug: updatedPost.slug, status: updatedPost.status, version: updatedPost.version },
    metadata: { authorName: updatedPost.authorName },
  });

  return updatedPost;
}

/**
 * Change status of a post (review, publish, unpublish, schedule, archive).
 */
export async function transitionPostStatus(
  id: number,
  expectedVersion: number,
  action: 'submit_review' | 'publish' | 'unpublish' | 'schedule' | 'archive',
  options?: {
    scheduledAt?: string;
    summary?: string;
  },
  staff?: StaffProfile | null,
): Promise<BlogPost> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const currentRows = await sql`
    SELECT * FROM blog_posts WHERE id = ${id} LIMIT 1
  `;
  if (currentRows.length === 0) {
    throw new CmsValidationError('Blog post not found.');
  }

  const current = currentRows[0];
  if (Number(current.version) !== Number(expectedVersion)) {
    throw new CmsConcurrencyConflictError();
  }

  let newStatus: BlogStatus = current.status;
  let newPublishedAt: string | null = current.published_at ? new Date(current.published_at).toISOString() : null;
  let revisionReason = options?.summary || '';

  switch (action) {
    case 'submit_review':
      newStatus = 'in_review';
      revisionReason = revisionReason || 'Submitted for editorial review';
      break;

    case 'publish':
      if (currentStaff.role !== 'ADMIN') {
        throw new CmsForbiddenError('Only administrators can publish posts.');
      }
      newStatus = 'published';
      newPublishedAt = new Date().toISOString();
      revisionReason = revisionReason || 'Published to live site';
      break;

    case 'unpublish':
      if (currentStaff.role !== 'ADMIN') {
        throw new CmsForbiddenError('Only administrators can unpublish posts.');
      }
      newStatus = 'draft';
      revisionReason = revisionReason || 'Unpublished and reverted to draft';
      break;

    case 'schedule':
      if (currentStaff.role !== 'ADMIN') {
        throw new CmsForbiddenError('Only administrators can schedule posts.');
      }
      if (!options?.scheduledAt) {
        throw new CmsValidationError('Scheduled publication requires a future timestamp.');
      }
      const schedDate = new Date(options.scheduledAt);
      if (isNaN(schedDate.getTime()) || schedDate <= new Date()) {
        throw new CmsValidationError('Scheduled publication date must be in the future.');
      }
      newStatus = 'scheduled';
      newPublishedAt = schedDate.toISOString();
      revisionReason = revisionReason || `Scheduled for publication on ${schedDate.toISOString()}`;
      break;

    case 'archive':
      if (currentStaff.role !== 'ADMIN') {
        throw new CmsForbiddenError('Only administrators can archive posts.');
      }
      newStatus = 'archived';
      revisionReason = revisionReason || 'Archived';
      break;

    default:
      throw new CmsValidationError('Invalid status transition requested.');
  }

  const nextVersion = Number(current.version) + 1;

  const updatedRows = await sql`
    UPDATE blog_posts
    SET
      status = ${newStatus},
      published_at = ${newPublishedAt},
      version = ${nextVersion},
      updated_by_id = ${currentStaff.id},
      updated_at = NOW()
    WHERE id = ${id} AND version = ${expectedVersion}
    RETURNING *
  `;

  if (updatedRows.length === 0) {
    throw new CmsConcurrencyConflictError();
  }

  const updatedPost = mapBlogRow(updatedRows[0]);

  // Create immutable revision record on significant status changes
  if (['publish', 'schedule', 'unpublish', 'archive'].includes(action)) {
    const revisionNumber = await getNextRevisionNumber(id);
    await createPostRevision(id, revisionNumber, updatedPost, currentStaff, revisionReason);
  }

  const { recordAuditEvent } = await import('@/lib/audit');
  await recordAuditEvent({
    actorId: String(currentStaff.id),
    actorEmail: currentStaff.email,
    action: `blog.${action}`,
    entityType: 'blog_post',
    entityId: String(id),
    afterState: { status: updatedPost.status, version: updatedPost.version },
    metadata: { action, summary: options?.summary },
  });

  return updatedPost;
}

/**
 * Get the next revision sequence number for a post.
 */
async function getNextRevisionNumber(postId: number): Promise<number> {
  const rows = await sql`
    SELECT COALESCE(MAX(revision_number), 0) + 1 AS next_rev
    FROM blog_post_revisions
    WHERE post_id = ${postId}
  `;
  return Number(rows[0].next_rev);
}

/**
 * Insert an immutable revision record.
 */
async function createPostRevision(
  postId: number,
  revisionNumber: number,
  post: BlogPost,
  editor: StaffProfile,
  changeSummary: string,
): Promise<void> {
  await sql`
    INSERT INTO blog_post_revisions (
      post_id, editor_id, editor_email, revision_number,
      title, subtitle, category, excerpt, content_markdown,
      cover_image_path, author_name, reading_time_minutes,
      status, seo_title, seo_description, change_summary
    ) VALUES (
      ${postId},
      ${editor.id},
      ${editor.email},
      ${revisionNumber},
      ${post.title},
      ${post.subtitle},
      ${post.category},
      ${post.excerpt},
      ${post.content},
      ${post.coverImagePath},
      ${post.authorName},
      ${post.readingTimeMinutes},
      ${post.status || 'draft'},
      ${post.seoTitle || null},
      ${post.seoDescription || null},
      ${changeSummary}
    )
  `;
}

/**
 * Get all immutable revisions for a post.
 */
export async function getBlogPostRevisions(postId: number): Promise<BlogPostRevision[]> {
  const staff = await getCurrentStaff();
  if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const rows = await sql`
    SELECT *
    FROM blog_post_revisions
    WHERE post_id = ${postId}
    ORDER BY revision_number DESC
  `;

  return rows.map(mapRevisionRow);
}

/**
 * Restore a post from a previous revision (Admin only).
 */
export async function restoreBlogPostRevision(
  postId: number,
  revisionId: number,
  expectedVersion: number,
  staff?: StaffProfile | null,
): Promise<BlogPost> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || currentStaff.role !== 'ADMIN') {
    throw new CmsForbiddenError('Only administrators can restore revisions.');
  }

  // Fetch target revision
  const revRows = await sql`
    SELECT *
    FROM blog_post_revisions
    WHERE id = ${revisionId} AND post_id = ${postId}
    LIMIT 1
  `;
  if (revRows.length === 0) {
    throw new CmsValidationError('Revision not found.');
  }

  const rev = revRows[0];

  // Optimistic concurrency check
  const postRows = await sql`
    SELECT version FROM blog_posts WHERE id = ${postId} LIMIT 1
  `;
  if (postRows.length === 0) {
    throw new CmsValidationError('Blog post not found.');
  }
  if (Number(postRows[0].version) !== Number(expectedVersion)) {
    throw new CmsConcurrencyConflictError();
  }

  const nextVersion = Number(postRows[0].version) + 1;

  const updateRows = await sql`
    UPDATE blog_posts
    SET
      title = ${rev.title},
      subtitle = ${rev.subtitle},
      category = ${rev.category},
      excerpt = ${rev.excerpt},
      content_markdown = ${rev.content_markdown},
      cover_image_path = ${rev.cover_image_path},
      author_name = ${rev.author_name},
      reading_time_minutes = ${rev.reading_time_minutes},
      seo_title = ${rev.seo_title},
      seo_description = ${rev.seo_description},
      version = ${nextVersion},
      updated_by_id = ${currentStaff.id},
      updated_at = NOW()
    WHERE id = ${postId} AND version = ${expectedVersion}
    RETURNING *
  `;

  if (updateRows.length === 0) {
    throw new CmsConcurrencyConflictError();
  }

  const restoredPost = mapBlogRow(updateRows[0]);
  const nextRevNum = await getNextRevisionNumber(postId);
  await createPostRevision(
    postId,
    nextRevNum,
    restoredPost,
    currentStaff,
    `Restored from revision #${rev.revision_number} (${dateFormatter.format(new Date(rev.created_at))})`,
  );

  const { recordAuditEvent } = await import('@/lib/audit');
  await recordAuditEvent({
    actorId: String(currentStaff.id),
    actorEmail: currentStaff.email,
    action: 'blog.restore',
    entityType: 'blog_post',
    entityId: String(postId),
    afterState: { title: restoredPost.title, version: restoredPost.version },
    metadata: { restoredRevisionId: revisionId },
  });

  return restoredPost;
}
