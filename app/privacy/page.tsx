import { Metadata } from 'next';
import PrivacyPolicyView from '@/components/PrivacyPolicyView';
import { getLegalPage } from '@/lib/site-cms';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ISSA Foundation privacy policy and data governance practices.',
  alternates: { canonical: 'https://issafoundation.co.in/privacy' },
  openGraph: { type: 'website', url: 'https://issafoundation.co.in/privacy', title: 'Privacy Policy | ISSA Foundation', description: 'ISSA Foundation privacy policy and data governance practices.', images: [{ url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200', width: 1200, height: 630, alt: 'ISSA Foundation' }] },
  twitter: { card: 'summary_large_image', title: 'Privacy Policy | ISSA Foundation', description: 'ISSA Foundation privacy policy and data governance practices.', images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200'] },
};

export default async function PrivacyPage() {
  const [privacyPage, termsPage] = await Promise.all([
    getLegalPage('privacy').catch(() => null),
    getLegalPage('terms').catch(() => null),
  ]);

  return <PrivacyPolicyView defaultSubTab="privacy" privacyPage={privacyPage} termsPage={termsPage} />;
}
