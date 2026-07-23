import { Metadata } from 'next';
import PrivacyPolicyView from '@/components/PrivacyPolicyView';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ISSA Foundation privacy policy and data governance practices.',
  alternates: { canonical: 'https://issafoundation.org/privacy' },
  openGraph: { type: 'website', url: 'https://issafoundation.org/privacy', title: 'Privacy Policy | ISSA Foundation', description: 'ISSA Foundation privacy policy and data governance practices.', images: [{ url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200', width: 1200, height: 630, alt: 'ISSA Foundation' }] },
  twitter: { card: 'summary_large_image', title: 'Privacy Policy | ISSA Foundation', description: 'ISSA Foundation privacy policy and data governance practices.', images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200'] },
};

export default function PrivacyPage() {
  return <PrivacyPolicyView defaultSubTab="privacy" />;
}
