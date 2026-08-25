export type BlogStatus = 'draft' | 'in_review' | 'scheduled' | 'published' | 'archived';

export type BlogPost = {
  id?: number;
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  coverImagePath: string;
  authorName: string;
  readingTimeMinutes: number;
  status?: BlogStatus;
  publishedAt: string | null;
  displayDate: string;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdById?: number | null;
  updatedById?: number | null;
};

export type BlogPostRevision = {
  id: number;
  postId: number;
  editorId?: number | null;
  editorEmail: string;
  revisionNumber: number;
  title: string;
  subtitle: string;
  category: string;
  excerpt: string;
  content: string;
  coverImagePath: string;
  authorName: string;
  readingTimeMinutes: number;
  status: BlogStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
  changeSummary?: string | null;
  createdAt: string;
};

