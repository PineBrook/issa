import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ProgramsView from '@/components/ProgramsView';

export const metadata: Metadata = {
  title: 'Core Programs & Pillars',
  description: 'Explore ISSA Foundation’s connected pillars: Education Empowerment, Healthcare Access, and Entrepreneurship Development in Uttarakhand.',
  alternates: { canonical: 'https://issafoundation.org/programs' },
  openGraph: {
    type: 'website', url: 'https://issafoundation.org/programs',
    title: 'Core Programs & Pillars | ISSA Foundation',
    description: 'Transforming rural Uttarakhand through Education, Healthcare, and Sustainable Livelihoods.',
    images: [{ url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200', width: 1200, height: 630, alt: 'ISSA Foundation community action' }],
  },
  twitter: { card: 'summary_large_image', title: 'Core Programs & Pillars | ISSA Foundation', description: 'Transforming rural Uttarakhand through Education, Healthcare, and Sustainable Livelihoods.', images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200'] },
};

const breadcrumbJsonLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://issafoundation.org/' }, { '@type': 'ListItem', position: 2, name: 'Programs', item: 'https://issafoundation.org/programs' }] };

interface ProgramsPageProps {
  searchParams: Promise<{ pillar?: string }>;
}

export default async function ProgramsPage({ searchParams }: ProgramsPageProps) {
  const params = await searchParams;
  if (params.pillar === 'education' || params.pillar === 'healthcare' || params.pillar === 'entrepreneurship') {
    redirect(`/programs/${params.pillar}`);
  }
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} /><ProgramsView view="overview" /></>;
}
