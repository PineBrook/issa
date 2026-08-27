import { Metadata } from 'next';
import EntrepreneurshipInitiativeView from '@/components/programs/EntrepreneurshipInitiativeView';
import { getProgramsContent } from '@/lib/site-cms';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Entrepreneurship Programs',
  description: 'ISSA Foundation supports rural entrepreneurs with financial assistance, mentorship, technology, and market access in Uttarakhand.',
  alternates: { canonical: 'https://issafoundation.co.in/programs/entrepreneurship' },
  openGraph: { type: 'website', url: 'https://issafoundation.co.in/programs/entrepreneurship', title: 'Entrepreneurship Programs | ISSA Foundation', description: 'Growing local businesses and sustainable mountain livelihoods.' },
  twitter: { card: 'summary', title: 'Entrepreneurship Programs | ISSA Foundation', description: 'Growing local businesses and sustainable mountain livelihoods.' },
};

export default async function EntrepreneurshipProgramsPage() {
  const content = await getProgramsContent('entrepreneurship');
  return <EntrepreneurshipInitiativeView program={content.entrepreneurship} />;
}
