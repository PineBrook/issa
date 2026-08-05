import { Metadata } from 'next';
import CareersView from '@/components/CareersView';

export const metadata: Metadata = {
  title: 'Join Our Team & Careers',
  description: 'Work with ISSA Foundation to bring high-quality education, healthcare, and technology to rural Himalayan communities.',
  alternates: { canonical: 'https://issafoundation.co.in/careers' },
  openGraph: {
    type: 'website',
    url: 'https://issafoundation.co.in/careers',
    title: 'Join Our Team & Careers | ISSA Foundation',
    description: 'Career opportunities and fellowships in grassroots development and health systems in Uttarakhand.',
    images: [{ url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200', width: 1200, height: 630, alt: 'ISSA Foundation community action' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join Our Team & Careers | ISSA Foundation',
    description: 'Career opportunities and fellowships in grassroots development and health systems in Uttarakhand.',
    images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://issafoundation.co.in/' },
    { '@type': 'ListItem', position: 2, name: 'Careers', item: 'https://issafoundation.co.in/careers' },
  ],
};

export default function CareersPage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }} /><CareersView /></>;
}
