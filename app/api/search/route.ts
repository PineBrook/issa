import { NextResponse } from 'next/server';
import { getPublishedBlogPosts } from '@/lib/blog';
import { getActiveJobOpenings } from '@/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [posts, jobs] = await Promise.all([
      getPublishedBlogPosts(20).catch(() => []),
      getActiveJobOpenings().catch(() => []),
    ]);

    const postItems = posts.map((p) => ({
      id: `story-${p.slug}`,
      label: p.title,
      description: p.excerpt || p.subtitle || 'Program dispatch from Himalayan communities',
      category: 'Stories',
      href: `/stories?story=${encodeURIComponent(p.slug)}`,
      elementId: 'stories-view',
      keywords: `${p.title} ${p.category} story dispatch ${p.excerpt || ''}`.toLowerCase(),
    }));

    const jobItems = jobs.map((j) => ({
      id: `job-${j.slug || j.id}`,
      label: j.title,
      description: `${j.location || 'Uttarakhand'} • ${j.type || 'Full-time'} • ${j.department || 'Field Operations'}`,
      category: 'Careers',
      href: `/careers#job-${j.slug || j.id}`,
      elementId: 'careers-openings',
      keywords: `${j.title} ${j.department || ''} ${j.location || ''} career job hiring`.toLowerCase(),
    }));

    return NextResponse.json({
      success: true,
      items: [...postItems, ...jobItems],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, items: [], error: error?.message || 'Search failed' },
      { status: 500 }
    );
  }
}
