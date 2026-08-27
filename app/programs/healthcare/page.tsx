import { Metadata } from 'next';
import HealthcareInitiativeView from '@/components/programs/HealthcareInitiativeView';
import { getProgramsContent } from '@/lib/site-cms';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Healthcare Programs',
  description: 'ISSA Foundation connects hospitals, rural health hubs, mobile healthcare, and telemedicine to improve access across Uttarakhand.',
  alternates: { canonical: 'https://issafoundation.co.in/programs/healthcare' },
  openGraph: { type: 'website', url: 'https://issafoundation.co.in/programs/healthcare', title: 'Healthcare Programs | ISSA Foundation', description: 'Connected rural healthcare closer to every home in Uttarakhand.' },
  twitter: { card: 'summary', title: 'Healthcare Programs | ISSA Foundation', description: 'Connected rural healthcare closer to every home in Uttarakhand.' },
};

export default async function HealthcareProgramsPage() {
  const content = await getProgramsContent('healthcare');
  return <HealthcareInitiativeView program={content.healthcare} />;
}
