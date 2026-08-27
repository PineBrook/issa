import { Metadata } from 'next';
import EducationInitiativeView from '@/components/programs/EducationInitiativeView';
import { getProgramsContent } from '@/lib/site-cms';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Education Programs',
  description: 'ISSA Foundation education programs strengthen schools, improve learning outcomes, and prepare students across Uttarakhand for the future.',
  alternates: { canonical: 'https://issafoundation.co.in/programs/education' },
  openGraph: { type: 'website', url: 'https://issafoundation.co.in/programs/education', title: 'Education Programs | ISSA Foundation', description: 'Strengthening education and future-ready learning across Uttarakhand.' },
  twitter: { card: 'summary', title: 'Education Programs | ISSA Foundation', description: 'Strengthening education and future-ready learning across Uttarakhand.' },
};

export default async function EducationProgramsPage() {
  const content = await getProgramsContent('education');
  return <EducationInitiativeView program={content.education} />;
}
