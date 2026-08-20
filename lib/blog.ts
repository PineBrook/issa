import 'server-only';

import { neon } from '@neondatabase/serverless';
import type { BlogPost } from './blog-types';

const connectionString = process.env.DB_CONN_KEY;

if (!connectionString) {
  throw new Error('DB_CONN_KEY must contain the Neon connection string.');
}

const sql = neon(connectionString);
type BlogRow = Omit<BlogPost, 'publishedAt' | 'displayDate'> & { publishedAt: string | Date };
const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
});

export async function getPublishedBlogPosts(limit: number): Promise<BlogPost[]> {
  const rows = await sql`
    SELECT
      slug,
      category,
      title,
      subtitle,
      excerpt,
      content_markdown AS content,
      cover_image_path AS "coverImagePath",
      author_name AS "authorName",
      reading_time_minutes AS "readingTimeMinutes",
      published_at AS "publishedAt"
    FROM blog_posts
    WHERE status = 'published' AND published_at <= NOW()
    ORDER BY published_at DESC
    LIMIT ${limit}
  `;

  return (rows as BlogRow[]).map((row) => {
    const publishedAt = new Date(row.publishedAt);

    return {
      ...row,
      readingTimeMinutes: Number(row.readingTimeMinutes),
      publishedAt: publishedAt.toISOString(),
      displayDate: dateFormatter.format(publishedAt),
    };
  });
}
