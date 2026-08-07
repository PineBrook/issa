import { Metadata } from 'next';
import ContactView from '@/components/ContactView';

export const metadata: Metadata = {
  title: 'Contact Us & Regional Inquiries',
  description: 'Get in touch with ISSA Foundation for partnerships, volunteer opportunities, corporate social responsibility (CSR) collaborations, or general inquiries.',
  alternates: { canonical: 'https://issafoundation.co.in/contact' },
  openGraph: {
    type: 'website', url: 'https://issafoundation.co.in/contact',
    title: 'Contact Us & Regional Inquiries | ISSA Foundation',
    description: 'Partner with us to transform education and health infrastructure in Uttarakhand.',
    images: [{ url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200', width: 1200, height: 630, alt: 'ISSA Foundation community action' }],
  },
  twitter: { card: 'summary_large_image', title: 'Contact ISSA Foundation', description: 'Partner with us to transform education and health infrastructure in Uttarakhand.', images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200'] },
};

const breadcrumbJsonLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://issafoundation.co.in/' }, { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://issafoundation.co.in/contact' }] };

export default function ContactPage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }} /><ContactView /></>;
}
