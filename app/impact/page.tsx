import { Metadata } from 'next';
import ImpactView from '@/components/ImpactView';
import { getPublishedBlogPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Impact Metrics',
  description: 'Measured progress across 11+ adopted schools, 20+ hospital beds, and 600+ trained students in Uttarakhand.',
  alternates: { canonical: 'https://issafoundation.co.in/impact' },
  openGraph: {
    type: 'website', url: 'https://issafoundation.co.in/impact',
    title: 'Our Impact Metrics | ISSA Foundation',
    description: 'Measured progress in remote Himalayan communities.',
    images: [{ url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200', width: 1200, height: 630, alt: 'ISSA Foundation community action' }],
  },
  twitter: { card: 'summary_large_image', title: 'Our Impact Metrics | ISSA Foundation', description: 'Measured progress in remote Himalayan communities.', images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200'] },
};

const breadcrumbJsonLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://issafoundation.co.in/' }, { '@type': 'ListItem', position: 2, name: 'Impact', item: 'https://issafoundation.co.in/impact' }] };

export default async function ImpactPage() {
  const stories = await getPublishedBlogPosts(2);

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }} /><ImpactView stories={stories} /></>;
}
