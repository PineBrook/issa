import { Metadata } from 'next';
import ProgramsView from '@/components/ProgramsView';

export const metadata: Metadata = {
  title: 'Entrepreneurship Programs',
  description: 'ISSA Foundation supports Uttarakhand entrepreneurs with mentorship, business training, market access, and sustainable livelihood opportunities.',
  alternates: { canonical: 'https://issafoundation.co.in/programs/entrepreneurship' },
  openGraph: { type: 'website', url: 'https://issafoundation.co.in/programs/entrepreneurship', title: 'Entrepreneurship Programs | ISSA Foundation', description: 'Building sustainable businesses and livelihoods across Uttarakhand.' },
  twitter: { card: 'summary', title: 'Entrepreneurship Programs | ISSA Foundation', description: 'Building sustainable businesses and livelihoods across Uttarakhand.' },
};

export default function EntrepreneurshipProgramsPage() {
  return <ProgramsView initialPillar="entrepreneurship" />;
}
