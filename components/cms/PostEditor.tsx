'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BlurImage from '@/components/BlurImage';
import type { BlogPost, BlogPostRevision, BlogStatus } from '@/lib/blog-types';
import type { StaffProfile } from '@/lib/staff';
import {
  ArrowLeft,
  Eye,
  Save,
  Send,
  CheckCircle,
  Calendar,
  History,
  AlertTriangle,
  RotateCcw,
  Archive,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface PostEditorProps {
  initialPost?: BlogPost | null;
  initialRevisions?: BlogPostRevision[];
  currentUser: StaffProfile;
  isNew?: boolean;
}

const PRESET_IMAGES = [
  { label: 'Digital Inclusion (Classroom)', path: '/isssa-story-digital-inclusion-v2.png' },
  { label: 'Healthcare Program (Camp)', path: '/isssa-healthcare-program-v2.png' },
  { label: 'Entrepreneurship & Skills', path: '/isssa-entrepreneurship-program-v2.png' },
  { label: 'Water Resources & Ecology', path: '/isssa-story-water-v2.png' },
  { label: 'Education Program (School)', path: '/isssa-education-program-v2.png' },
  { label: 'Community Dispatch', path: '/isssa-community-dispatch-v2.png' },
  { label: 'Local Ownership & Youth', path: '/isssa-local-ownership-v2.png' },
];

const CATEGORIES = [
  'Education',
  'Healthcare',
  'Skills',
  'Communities',
  'Career & Opportunities',
  'Environment',
];

export default function PostEditor({
  initialPost,
  initialRevisions = [],
  currentUser,
  isNew = false,
}: PostEditorProps) {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState(initialPost?.title || '');
  const [subtitle, setSubtitle] = useState(initialPost?.subtitle || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [category, setCategory] = useState(initialPost?.category || CATEGORIES[0]);
  const [authorName, setAuthorName] = useState(initialPost?.authorName || currentUser.fullName || 'ISSA Foundation');
  const [readingTime, setReadingTime] = useState<number>(initialPost?.readingTimeMinutes || 3);
  const [coverImagePath, setCoverImagePath] = useState(initialPost?.coverImagePath || PRESET_IMAGES[0].path);
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialPost?.seoDescription || '');

  // Concurrency and Status State
  const [currentVersion, setCurrentVersion] = useState<number>(initialPost?.version || 1);
  const [status, setStatus] = useState<BlogStatus>(initialPost?.status || 'draft');
  const [revisions, setRevisions] = useState<BlogPostRevision[]>(initialRevisions);
  const [postId, setPostId] = useState<number | undefined>(initialPost?.id);

  // UI state
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'split'>('split');
  const [showRevisionsDrawer, setShowRevisionsDrawer] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState('');

  const isAdmin = currentUser.role === 'ADMIN';

  // Mark dirty on changes
  const handleFieldChange = () => {
    if (!isDirty) setIsDirty(true);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Auto-slugify title if slug not manually customized
  const handleTitleChange = (val: string) => {
    setTitle(val);
    handleFieldChange();
    if (isNew || !slug || slug === slugify(title)) {
      setSlug(slugify(val));
    }
  };

  // Auto calculate reading time based on markdown
  const handleContentChange = (val: string) => {
    setContent(val);
    handleFieldChange();
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    const est = Math.max(1, Math.ceil(words / 200));
    setReadingTime(est);
  };

  // Prompt before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  // Refresh latest post state from server (useful on conflict)
  const refreshPost = useCallback(async () => {
    if (!postId) return;
    try {
      const res = await fetch(`/api/cms/posts/${postId}`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data.post) {
        setTitle(data.post.title);
        setSubtitle(data.post.subtitle || '');
        setSlug(data.post.slug);
        setCategory(data.post.category);
        setAuthorName(data.post.authorName);
        setReadingTime(data.post.readingTimeMinutes);
        setCoverImagePath(data.post.coverImagePath);
        setExcerpt(data.post.excerpt);
        setContent(data.post.content);
        setSeoTitle(data.post.seoTitle || '');
        setSeoDescription(data.post.seoDescription || '');
        setCurrentVersion(data.post.version);
        setStatus(data.post.status);
        setIsDirty(false);
        setConflictError(null);
      }
      if (data.revisions) {
        setRevisions(data.revisions);
      }
    } catch {
      // ignore
    }
  }, [postId]);

  // Save / Update Handler
  async function handleSave(options?: { targetStatus?: BlogStatus; publishNow?: boolean; scheduledAt?: string }) {
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    setConflictError(null);

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      slug: slug.trim(),
      category: category.trim(),
      authorName: authorName.trim(),
      readingTimeMinutes: Number(readingTime),
      coverImagePath: coverImagePath.trim(),
      excerpt: excerpt.trim(),
      content: content,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
      status: options?.targetStatus || status,
      expectedVersion: currentVersion,
      publishNow: options?.publishNow,
      scheduledAt: options?.scheduledAt,
    };

    try {
      if (isNew) {
        const res = await fetch('/api/cms/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || 'Failed to create post');
          return;
        }
        setIsDirty(false);
        setSuccessMsg('Post created successfully!');
        router.push(`/panel/posts/${data.post.id}`);
      } else {
        const res = await fetch(`/api/cms/posts/${postId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.status === 409) {
          setConflictError(data.error || 'Conflict: Another editor has updated this post. Please refresh.');
          return;
        }
        if (!res.ok) {
          setErrorMsg(data.error || 'Failed to save changes');
          return;
        }
        setCurrentVersion(data.post.version);
        setStatus(data.post.status);
        setIsDirty(false);
        setSuccessMsg('Post saved successfully!');
        // Refresh revisions
        fetchRevisions();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  }

  // Status Transitions (Submit review, Publish, Unpublish, Schedule, Archive)
  async function handleStatusTransition(action: 'submit_review' | 'publish' | 'unpublish' | 'schedule' | 'archive', extra?: { scheduledAt?: string }) {
    if (!postId) return;
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    setConflictError(null);

    try {
      const res = await fetch(`/api/cms/posts/${postId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          expectedVersion: currentVersion,
          scheduledAt: extra?.scheduledAt,
        }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setConflictError(data.error || 'Conflict: Another editor has updated this post.');
        return;
      }
      if (!res.ok) {
        setErrorMsg(data.error || `Failed to perform action: ${action}`);
        return;
      }

      setCurrentVersion(data.post.version);
      setStatus(data.post.status);
      setIsDirty(false);
      setShowScheduleModal(false);
      setSuccessMsg(`Status updated to ${data.post.status.replace('_', ' ')}!`);
      fetchRevisions();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while updating status.');
    } finally {
      setIsSaving(false);
    }
  }

  // Restore Revision Handler
  async function handleRestoreRevision(revision: BlogPostRevision) {
    if (!postId || !isAdmin) return;
    if (!confirm(`Are you sure you want to restore revision #${revision.revisionNumber}? Any unsaved edits will be replaced.`)) {
      return;
    }

    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/cms/posts/${postId}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          revisionId: revision.id,
          expectedVersion: currentVersion,
        }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setConflictError(data.error || 'Conflict: Post version mismatch.');
        return;
      }
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to restore revision.');
        return;
      }

      setTitle(data.post.title);
      setSubtitle(data.post.subtitle || '');
      setCategory(data.post.category);
      setAuthorName(data.post.authorName);
      setReadingTime(data.post.readingTimeMinutes);
      setCoverImagePath(data.post.coverImagePath);
      setExcerpt(data.post.excerpt);
      setContent(data.post.content);
      setSeoTitle(data.post.seoTitle || '');
      setSeoDescription(data.post.seoDescription || '');
      setCurrentVersion(data.post.version);
      setStatus(data.post.status);
      setIsDirty(false);
      setShowRevisionsDrawer(false);
      setSuccessMsg(`Successfully restored revision #${revision.revisionNumber}!`);
      fetchRevisions();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to restore revision.');
    } finally {
      setIsSaving(false);
    }
  }

  async function fetchRevisions() {
    if (!postId) return;
    try {
      const res = await fetch(`/api/cms/posts/${postId}/revisions`);
      if (res.ok) {
        const data = await res.json();
        if (data.revisions) setRevisions(data.revisions);
      }
    } catch {
      // ignore
    }
  }

  // Toolbar action helpers
  function insertMarkdown(before: string, after = '') {
    const textarea = document.getElementById('post-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'text';
    const replacement = `${before}${selectedText}${after}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    handleFieldChange();
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 10);
  }

  const statusBadgeClasses: Record<string, string> = {
    draft: 'bg-amber-100 text-amber-800 border-amber-300',
    in_review: 'bg-blue-100 text-blue-800 border-blue-300',
    scheduled: 'bg-purple-100 text-purple-800 border-purple-300',
    published: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    archived: 'bg-neutral-200 text-neutral-700 border-neutral-300',
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#071E13]">
      {/* Top Header & Actions Bar */}
      <header className="sticky top-0 z-40 border-b border-[#E5E0D8] bg-white px-6 py-3.5 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/panel"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Panel
            </Link>

            <div>
              <h1 className="text-lg font-semibold text-[#071E13]">
                {isNew ? 'Create New Blog Post' : `Editing: ${title || 'Untitled Post'}`}
              </h1>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>Role: <strong className="text-[#0D311F]">{currentUser.role}</strong></span>
                {!isNew && (
                  <>
                    <span>&bull;</span>
                    <span>Version: <strong>{currentVersion}</strong></span>
                    <span>&bull;</span>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.2 text-[10px] font-bold uppercase ${statusBadgeClasses[status]}`}>
                      {status.replace('_', ' ')}
                    </span>
                  </>
                )}
                {isDirty && (
                  <span className="text-amber-700 font-medium">&bull; Unsaved changes</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {!isNew && postId && (
              <>
                <Link
                  href={`/panel/posts/${postId}/preview`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview <ExternalLink className="h-3 w-3 opacity-60" />
                </Link>

                <button
                  type="button"
                  onClick={() => setShowRevisionsDrawer(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition cursor-pointer"
                >
                  <History className="h-3.5 w-3.5" /> Revisions ({revisions.length})
                </button>
              </>
            )}

            {/* Save Draft */}
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave({ targetStatus: 'draft' })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#071E13] hover:bg-[#F7F6F3] transition cursor-pointer disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" /> Save Draft
            </button>

            {/* Submit for Review (Content & Admin) */}
            <button
              type="button"
              disabled={isSaving}
              onClick={() => isNew ? handleSave({ targetStatus: 'in_review' }) : handleStatusTransition('submit_review')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8B94C] px-3.5 py-1.5 text-xs font-semibold text-[#071E13] hover:bg-[#DCAB3D] transition cursor-pointer disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" /> Submit for Review
            </button>

            {/* Admin-only Publishing Controls */}
            {isAdmin && (
              <>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => isNew ? handleSave({ publishNow: true }) : handleStatusTransition('publish')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D311F] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#17452F] transition cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Publish Now
                </button>

                {!isNew && (
                  <>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => setShowScheduleModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-purple-300 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-900 hover:bg-purple-100 transition cursor-pointer disabled:opacity-50"
                    >
                      <Calendar className="h-3.5 w-3.5" /> Schedule...
                    </button>

                    {status === 'published' && (
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleStatusTransition('unpublish')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition cursor-pointer disabled:opacity-50"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Unpublish
                      </button>
                    )}

                    {status !== 'archived' && (
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleStatusTransition('archive')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 transition cursor-pointer disabled:opacity-50"
                      >
                        <Archive className="h-3.5 w-3.5" /> Archive
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Notifications & Conflict Alert */}
      <div className="mx-auto max-w-7xl px-6 pt-4 space-y-3">
        {conflictError && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">Concurrent Edit Conflict Detected</p>
                <p className="text-xs text-red-800">{conflictError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={refreshPost}
              className="rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-800 transition cursor-pointer"
            >
              Refresh and Reload Latest
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
            ✓ {successMsg}
          </div>
        )}
      </div>

      {/* Main Editor Form */}
      <main className="mx-auto max-w-7xl px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content & Live Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Core Fields */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Post Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Digital empowerment in remote Pauri"
                className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFCFB] px-4 py-2.5 text-base font-serif font-bold text-[#071E13] outline-none transition focus:border-[#0D311F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Subtitle / Hook
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => { setSubtitle(e.target.value); handleFieldChange(); }}
                placeholder="e.g. Bringing computer education to over 350 rural students."
                className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFCFB] px-4 py-2 text-sm text-[#071E13] outline-none transition focus:border-[#0D311F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Excerpt / Summary *
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => { setExcerpt(e.target.value); handleFieldChange(); }}
                placeholder="A brief 1-2 sentence overview for cards and meta descriptions..."
                className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFCFB] px-4 py-2 text-sm text-[#071E13] outline-none transition focus:border-[#0D311F]"
              />
            </div>
          </div>

          {/* Markdown Content & Editor */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-white shadow-sm overflow-hidden">
            {/* Editor Header & Tabs */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#E5E0D8] bg-[#FAF9F7] px-6 py-3 gap-2">
              <div className="flex items-center gap-1 bg-neutral-200/60 p-1 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`rounded px-2.5 py-1 transition cursor-pointer ${activeTab === 'write' ? 'bg-white text-[#071E13] shadow-xs' : 'text-neutral-600'}`}
                >
                  Write Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('split')}
                  className={`rounded px-2.5 py-1 transition cursor-pointer ${activeTab === 'split' ? 'bg-white text-[#071E13] shadow-xs' : 'text-neutral-600'}`}
                >
                  Split View
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`rounded px-2.5 py-1 transition cursor-pointer ${activeTab === 'preview' ? 'bg-white text-[#071E13] shadow-xs' : 'text-neutral-600'}`}
                >
                  Preview
                </button>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  title="Bold"
                  onClick={() => insertMarkdown('**', '**')}
                  className="rounded border border-neutral-300 bg-white px-2 py-1 font-bold hover:bg-neutral-100 cursor-pointer"
                >
                  B
                </button>
                <button
                  type="button"
                  title="Italic"
                  onClick={() => insertMarkdown('*', '*')}
                  className="rounded border border-neutral-300 bg-white px-2 py-1 italic hover:bg-neutral-100 cursor-pointer"
                >
                  I
                </button>
                <button
                  type="button"
                  title="Heading 2"
                  onClick={() => insertMarkdown('## ')}
                  className="rounded border border-neutral-300 bg-white px-2 py-1 font-semibold hover:bg-neutral-100 cursor-pointer"
                >
                  H2
                </button>
                <button
                  type="button"
                  title="Bullet List"
                  onClick={() => insertMarkdown('- ')}
                  className="rounded border border-neutral-300 bg-white px-2 py-1 hover:bg-neutral-100 cursor-pointer"
                >
                  &bull; List
                </button>
                <button
                  type="button"
                  title="Quote"
                  onClick={() => insertMarkdown('> ')}
                  className="rounded border border-neutral-300 bg-white px-2 py-1 hover:bg-neutral-100 cursor-pointer"
                >
                  &ldquo;
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className={`p-6 ${activeTab === 'split' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : ''}`}>
              {/* Textarea */}
              {(activeTab === 'write' || activeTab === 'split') && (
                <div className="space-y-2">
                  <textarea
                    id="post-content-textarea"
                    rows={20}
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Write your story content here in Markdown format..."
                    className="w-full rounded-xl border border-[#E5E0D8] bg-[#FDFCFB] p-4 font-mono text-sm leading-relaxed text-[#071E13] outline-none transition focus:border-[#0D311F]"
                  />
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Markdown supported. Dangerous HTML tags are automatically sanitized.</span>
                    <span>{content.trim().split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </div>
              )}

              {/* Live Preview Pane */}
              {(activeTab === 'preview' || activeTab === 'split') && (
                <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF9F7] p-6 max-h-[500px] overflow-y-auto space-y-4">
                  <div className="border-b border-[#E5E0D8] pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#0D311F] bg-[#0D311F]/10 px-2 py-0.5 rounded-full">
                      Live Preview
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none text-neutral-800">
                    <SimpleMarkdownPreview content={content} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Post Metadata & Settings */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#071E13] border-b border-[#E5E0D8] pb-3">
              Publication Settings
            </h2>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Slug (URL Identifier) *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); handleFieldChange(); }}
                placeholder="my-post-slug"
                className="w-full rounded-lg border border-[#E5E0D8] bg-[#FDFCFB] px-3 py-2 font-mono text-xs text-[#071E13] outline-none transition focus:border-[#0D311F]"
              />
              <p className="mt-1 text-[11px] text-neutral-500">
                Public URL: <code className="text-[#0D311F]">/blog/{slug || '...'}</code>
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); handleFieldChange(); }}
                className="w-full rounded-lg border border-[#E5E0D8] bg-[#FDFCFB] px-3 py-2 text-xs font-medium text-[#071E13] outline-none transition focus:border-[#0D311F] cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Author Byline *
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => { setAuthorName(e.target.value); handleFieldChange(); }}
                placeholder="e.g. Aarti Rawat, Education Lead"
                className="w-full rounded-lg border border-[#E5E0D8] bg-[#FDFCFB] px-3 py-2 text-xs text-[#071E13] outline-none transition focus:border-[#0D311F]"
              />
            </div>

            {/* Reading Time */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Estimated Reading Time (Minutes)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={readingTime}
                  onChange={(e) => { setReadingTime(Math.max(1, parseInt(e.target.value) || 1)); handleFieldChange(); }}
                  className="w-24 rounded-lg border border-[#E5E0D8] bg-[#FDFCFB] px-3 py-2 text-xs text-[#071E13] outline-none transition focus:border-[#0D311F]"
                />
                <span className="text-xs text-neutral-500">minutes</span>
              </div>
            </div>
          </div>

          {/* Cover Media Card */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#071E13] border-b border-[#E5E0D8] pb-3">
              Cover Image
            </h2>

            {/* Preview Selected Image */}
            {coverImagePath && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-neutral-100 border border-[#E5E0D8]">
                <BlurImage
                  src={coverImagePath}
                  alt="Cover Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Preset Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Select from local assets
              </label>
              <select
                value={coverImagePath}
                onChange={(e) => { setCoverImagePath(e.target.value); handleFieldChange(); }}
                className="w-full rounded-lg border border-[#E5E0D8] bg-[#FDFCFB] px-3 py-2 text-xs text-[#071E13] outline-none transition focus:border-[#0D311F] cursor-pointer"
              >
                {PRESET_IMAGES.map((img) => (
                  <option key={img.path} value={img.path}>{img.label}</option>
                ))}
              </select>
            </div>

            {/* Custom Path */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Or custom relative path
              </label>
              <input
                type="text"
                value={coverImagePath}
                onChange={(e) => { setCoverImagePath(e.target.value); handleFieldChange(); }}
                placeholder="/isssa-healthcare-program-v2.png"
                className="w-full rounded-lg border border-[#E5E0D8] bg-[#FDFCFB] px-3 py-2 font-mono text-xs text-[#071E13] outline-none transition focus:border-[#0D311F]"
              />
            </div>
          </div>

          {/* SEO Meta Card */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#071E13] border-b border-[#E5E0D8] pb-3">
              SEO & Social Meta
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Custom SEO Title (optional)
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => { setSeoTitle(e.target.value); handleFieldChange(); }}
                placeholder="Leave blank to use post title"
                className="w-full rounded-lg border border-[#E5E0D8] bg-[#FDFCFB] px-3 py-2 text-xs text-[#071E13] outline-none transition focus:border-[#0D311F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Custom Meta Description (optional)
              </label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => { setSeoDescription(e.target.value); handleFieldChange(); }}
                placeholder="Leave blank to use post excerpt"
                className="w-full rounded-lg border border-[#E5E0D8] bg-[#FDFCFB] px-3 py-2 text-xs text-[#071E13] outline-none transition focus:border-[#0D311F]"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-[#071E13]">
              Schedule Blog Publication
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Select a future date and time for automatic publication. The post will remain in &ldquo;Scheduled&rdquo; status until the specified time.
            </p>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Publication Date & Time *
              </label>
              <input
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                className="w-full rounded-lg border border-[#E5E0D8] bg-[#FDFCFB] px-3 py-2 text-sm text-[#071E13] outline-none transition focus:border-[#0D311F]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="rounded-lg border border-[#E5E0D8] px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-[#F7F6F3] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!scheduledDateTime}
                onClick={() => handleStatusTransition('schedule', { scheduledAt: scheduledDateTime })}
                className="rounded-lg bg-purple-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-purple-800 disabled:opacity-50 cursor-pointer"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revisions Drawer / Modal */}
      {showRevisionsDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-[#0D311F]" />
                  <h3 className="text-lg font-semibold text-[#071E13]">Revision History</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRevisionsDrawer(false)}
                  className="rounded-lg border border-[#E5E0D8] px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <p className="text-xs text-neutral-600">
                Immutable snapshots recorded upon publishing, scheduling, unpublishing, or restoring.
              </p>

              {revisions.length === 0 ? (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-center text-xs text-neutral-500">
                  No revisions recorded yet for this post. Revisions are created when posts are published or changed.
                </div>
              ) : (
                <div className="space-y-4">
                  {revisions.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl border border-[#E5E0D8] bg-[#FAF9F7] p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0D311F]">
                          Revision #{rev.revisionNumber}
                        </span>
                        <span className="text-neutral-500">
                          {new Date(rev.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </span>
                      </div>

                      <p className="font-medium text-[#071E13]">
                        {rev.title}
                      </p>

                      <div className="text-neutral-600">
                        <span>Editor: <strong>{rev.editorEmail}</strong></span>
                        {rev.changeSummary && (
                          <span className="block italic text-neutral-500 mt-1">
                            &ldquo;{rev.changeSummary}&rdquo;
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <div className="pt-2 border-t border-[#E5E0D8] flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRestoreRevision(rev)}
                            className="inline-flex items-center gap-1 rounded bg-[#0D311F] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#17452F] cursor-pointer"
                          >
                            <RotateCcw className="h-3 w-3" /> Restore This Snapshot
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-[#E5E0D8] pt-4">
              <button
                type="button"
                onClick={() => setShowRevisionsDrawer(false)}
                className="w-full rounded-lg border border-[#E5E0D8] py-2 text-xs font-semibold text-neutral-700 hover:bg-[#F7F6F3] cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SimpleMarkdownPreview({ content }: { content: string }) {
  if (!content || !content.trim()) {
    return <p className="text-xs text-neutral-400 italic">No content to preview...</p>;
  }

  const lines = content.split(/\r?\n/);
  return (
    <div className="space-y-3 font-sans text-xs text-neutral-800 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;
        if (trimmed.startsWith('# ')) {
          return <h2 key={idx} className="text-lg font-serif font-bold text-[#071E13]">{trimmed.replace('# ', '')}</h2>;
        }
        if (trimmed.startsWith('## ')) {
          return <h3 key={idx} className="text-base font-serif font-bold text-[#071E13]">{trimmed.replace('## ', '')}</h3>;
        }
        if (trimmed.startsWith('### ')) {
          return <h4 key={idx} className="text-sm font-serif font-bold text-[#071E13]">{trimmed.replace('### ', '')}</h4>;
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return <li key={idx} className="ml-4 list-disc">{trimmed.slice(2)}</li>;
        }
        return <p key={idx}>{trimmed}</p>;
      })}
    </div>
  );
}
