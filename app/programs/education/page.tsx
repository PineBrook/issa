import { Metadata } from 'next';
import ProgramsView from '@/components/ProgramsView';

export const metadata: Metadata = {
  title: 'Education Programs',
  description: 'ISSA Foundation education programs strengthen schools, improve learning outcomes, and prepare students across Uttarakhand for the future.',
  alternates: { canonical: 'https://issafoundation.org/programs/education' },
  openGraph: { type: 'website', url: 'https://issafoundation.org/programs/education', title: 'Education Programs | ISSA Foundation', description: 'Strengthening education and future-ready learning across Uttarakhand.' },
  twitter: { card: 'summary', title: 'Education Programs | ISSA Foundation', description: 'Strengthening education and future-ready learning across Uttarakhand.' },
};

export default function EducationProgramsPage() {
  return <ProgramsView initialPillar="education" />;
}
