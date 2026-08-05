import { Metadata } from 'next';
import StoriesView from '@/components/StoriesView';

export const metadata: Metadata = {
  title: 'Field Dispatches & Stories of Change',
  description: 'Read first-hand accounts of digital empowerment, health camps, and community growth across remote villages in Uttarakhand.',
  alternates: { canonical: 'https://issafoundation.co.in/stories' },
  openGraph: {
    type: 'website', url: 'https://issafoundation.co.in/stories',
    title: 'Field Dispatches & Stories of Change | ISSA Foundation',
    description: 'Read first-hand accounts of transformation from high-altitude Himalayan villages.',
    images: [{ url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200', width: 1200, height: 630, alt: 'ISSA Foundation community action' }],
  },
  twitter: { card: 'summary_large_image', title: 'Field Dispatches & Stories of Change | ISSA Foundation', description: 'Read first-hand accounts of transformation from high-altitude Himalayan villages.', images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200'] },
};

const breadcrumbJsonLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://issafoundation.co.in/' }, { '@type': 'ListItem', position: 2, name: 'Stories', item: 'https://issafoundation.co.in/stories' }] };

export default function StoriesPage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }} /><StoriesView /></>;
}
