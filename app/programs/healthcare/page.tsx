import { Metadata } from 'next';
import ProgramsView from '@/components/ProgramsView';

export const metadata: Metadata = {
  title: 'Healthcare Programs',
  description: 'ISSA Foundation connects hospitals, rural health hubs, mobile healthcare, and telemedicine to improve access across Uttarakhand.',
  alternates: { canonical: 'https://issafoundation.org/programs/healthcare' },
  openGraph: { type: 'website', url: 'https://issafoundation.org/programs/healthcare', title: 'Healthcare Programs | ISSA Foundation', description: 'Connected rural healthcare closer to every home in Uttarakhand.' },
  twitter: { card: 'summary', title: 'Healthcare Programs | ISSA Foundation', description: 'Connected rural healthcare closer to every home in Uttarakhand.' },
};

export default function HealthcareProgramsPage() {
  return <ProgramsView initialPillar="healthcare" />;
}
