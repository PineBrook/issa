import { Metadata } from 'next';
import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { getAuthSessionUser, getCurrentStaff } from '@/lib/staff';
import { getPanelBlogPostById } from '@/lib/cms';
import BlurImage from '@/components/BlurImage';
import SignOutButton from '@/app/panel/sign-out-button';
import { ArrowLeft, Calendar, Clock, Eye, AlertTriangle } from 'lucide-react';
import React from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Authenticated CMS Post Preview',
  robots: {
    index: false,
    follow: false,
  },
};

function renderInlineMarkdown(text: string): React.ReactNode[] {
  return text.split(/(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('***') && part.endsWith('***')) {
      return <strong key={index}>{part.slice(3, -3)}</strong>;
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function PreviewMarkdownContent({ content }: { content: string }) {
  const blocks: React.ReactNode[] = [];
  const paragraph: string[] = [];
  const list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push(<p key={`p-${blocks.length}`}>{renderInlineMarkdown(paragraph.join(' '))}</p>);
      paragraph.length = 0;
    }
  };

  const flushList = () => {
    if (list.length > 0) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="list-disc space-y-2 pl-5">
          {list.map((item, index) => <li key={`${item}-${index}`}>{renderInlineMarkdown(item)}</li>)}
        </ul>,
      );
      list.length = 0;
    }
  };

  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    const heading = trimmed.match(/^#{1,6}\s+(.+)$/);
    const bullet = trimmed.match(/^[-*]\s+(.+)$/);

    if (!trimmed) {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push(
        <h4 key={`h-${blocks.length}`} className="pt-3 text-lg font-serif font-bold text-[#071E13]">
          {renderInlineMarkdown(heading[1])}
        </h4>,
      );
    } else if (bullet) {
      flushParagraph();
      list.push(bullet[1]);
    } else {
      flushList();
      paragraph.push(trimmed);
    }
  });

  flushParagraph();
  flushList();
  return <div className="space-y-4 text-neutral-800 leading-relaxed font-sans">{blocks}</div>;
}

export default async function PostPreviewPage(props: { params: Promise<{ id: string }> }) {
  const sessionUser = await getAuthSessionUser();
  if (!sessionUser?.id || !sessionUser.email) {
    redirect('/login?error=access');
  }

  const staff = await getCurrentStaff();
  if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
    redirect('/panel');
  }

  const { id } = await props.params;
  const postId = Number(id);
  if (isNaN(postId)) {
    notFound();
  }

  const post = await getPanelBlogPostById(postId);
  if (!post) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-amber-100 text-amber-800 border-amber-300',
    in_review: 'bg-blue-100 text-blue-800 border-blue-300',
    scheduled: 'bg-purple-100 text-purple-800 border-purple-300',
    published: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    archived: 'bg-neutral-200 text-neutral-700 border-neutral-300',
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#071E13]">
      {/* Sticky Preview Banner */}
      <div className="sticky top-20 z-40 border-b border-amber-300 bg-amber-50 px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-amber-900">
              <Eye className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Staff Preview Mode &bull; Version {post.version}
              </p>
              <p className="text-xs text-amber-700">
                This preview is private, authenticated, and not indexed by search engines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                statusColors[post.status || 'draft'] || statusColors.draft
              }`}
            >
              Status: {post.status?.replace('_', ' ')}
            </span>

            <Link
              href={`/panel/posts/${post.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3 py-1.5 text-xs font-medium text-[#071E13] hover:bg-[#F7F6F3] transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Editor
            </Link>

            <SignOutButton />
          </div>
        </div>
      </div>

      {/* Post Article View */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-[#E5E0D8] bg-white p-8 sm:p-12 shadow-sm space-y-8">
          <div className="space-y-4">
            <span className="inline-block rounded-full bg-[#0D311F]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#0D311F]">
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#071E13] leading-tight">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-base sm:text-lg font-sans font-semibold text-[#C84B31] uppercase tracking-wide">
                {post.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 font-sans border-y border-[#E5E0D8] py-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {post.publishedAt ? post.displayDate : 'Draft (Unpublished)'}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTimeMinutes} min read
              </span>
              <span>&bull;</span>
              <span>By {post.authorName}</span>
              {post.seoTitle && (
                <>
                  <span>&bull;</span>
                  <span className="italic">SEO Title: {post.seoTitle}</span>
                </>
              )}
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImagePath && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-100 border border-[#E5E0D8]">
              <BlurImage
                src={post.coverImagePath}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Excerpt */}
          <div className="rounded-xl border border-neutral-200 bg-[#FAF9F7] p-4 text-sm font-medium text-neutral-800 leading-relaxed italic">
            &ldquo;{post.excerpt}&rdquo;
          </div>

          {/* Markdown Content */}
          <div className="prose prose-neutral max-w-none pt-4">
            <PreviewMarkdownContent content={post.content} />
          </div>

          {/* Editorial Footer */}
          <div className="border-t border-[#E5E0D8] pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500">
            <div>
              <span>Slug: </span>
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-neutral-800">
                /blog/{post.slug}
              </code>
            </div>
            <div>
              {post.updatedAt && (
                <span>Last updated: {new Date(post.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
