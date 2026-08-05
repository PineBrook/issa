import { Metadata } from 'next';
import PrivacyPolicyView from '@/components/PrivacyPolicyView';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'ISSA Foundation terms and conditions of use.',
  alternates: { canonical: 'https://issafoundation.co.in/terms' },
  openGraph: { type: 'website', url: 'https://issafoundation.co.in/terms', title: 'Terms & Conditions | ISSA Foundation', description: 'ISSA Foundation terms and conditions of use.', images: [{ url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200', width: 1200, height: 630, alt: 'ISSA Foundation' }] },
  twitter: { card: 'summary_large_image', title: 'Terms & Conditions | ISSA Foundation', description: 'ISSA Foundation terms and conditions of use.', images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200'] },
};

export default function TermsPage() {
  return <PrivacyPolicyView defaultSubTab="terms" />;
}
