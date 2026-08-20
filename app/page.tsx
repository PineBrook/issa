import { Metadata } from 'next';
import HomeView from '@/components/HomeView';
import { Analytics } from "@vercel/analytics/next"
import { getPublishedBlogPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Supporting Communities Across Uttarakhand',
  description: 'We strengthen education, healthcare, and opportunity for communities across the Himalayan region—working with people, not around them.',
  alternates: { canonical: 'https://issafoundation.co.in' },
  openGraph: {
    type: 'website',
    url: 'https://issafoundation.co.in/',
    title: 'ISSA Foundation - Supporting Communities Across Uttarakhand',
    description: 'We strengthen education, healthcare, and opportunity for communities across the Himalayan region.',
    images: [{ url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200', width: 1200, height: 630, alt: 'Himalayan community landscape' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ISSA Foundation - Supporting Communities Across Uttarakhand',
    description: 'Strengthening education, healthcare, and opportunity for Himalayan communities.',
    images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200'],
  },
};

export default async function HomePage() {
  const stories = await getPublishedBlogPosts(3);

  return (
    <>
      <HomeView stories={stories} />
      <Analytics />
    </>
  );
}
