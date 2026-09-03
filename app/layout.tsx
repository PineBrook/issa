import type { Metadata } from 'next';
import { Source_Sans_3, Lora } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { ToastProvider } from '@/components/Toast';
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from '@/lib/site-cms';
import './globals.css';

/* Source Sans 3 pairs with Lora better than Inter for editorial NGO surfaces */
const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://issafoundation.co.in'),
  title: {
    default: 'ISSA Foundation - Empowering Uttarakhand through Direct Action',
    template: '%s | ISSA Foundation',
  },
  description: 'A grassroots non-profit committed to strengthening education infrastructure, digital literacy, and clinical healthcare systems across remote Himalayan communities.',
  keywords: [
    'ISSA Foundation',
    'Uttarakhand NGO',
    'Himalayan Community Development',
    'Smart Classrooms',
    'UttaraCare Hospital',
    'Rural Healthcare Uttarakhand',
    'Digital Literacy Pauri Garhwal'
  ],
  authors: [{ name: 'ISSA Foundation' }],
  creator: 'ISSA Foundation',
  publisher: 'ISSA Foundation',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://issafoundation.co.in',
    siteName: 'ISSA Foundation',
    title: 'ISSA Foundation - Empowering Uttarakhand through Direct Action',
    description: 'Strengthening education, healthcare, and opportunity for remote Himalayan communities.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'ISSA Foundation Community Action in Uttarakhand',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ISSA Foundation - Empowering Uttarakhand',
    description: 'Strengthening education, healthcare, and opportunity for remote Himalayan communities.',
    images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200'],
  },
  alternates: {
    canonical: 'https://issafoundation.co.in',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'NGO'],
    name: settings.siteName || 'ISSA Foundation',
    url: 'https://issafoundation.co.in',
    logo: settings.logoUrl || 'https://issafoundation.co.in/logo_new.png',
    description: settings.siteTagline || settings.footerTagline,
    telephone: settings.phone || '+91-0135-430-8180',
    email: settings.email || 'career.issafoundation@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.headOfficeAddress || 'Dehradun',
      addressLocality: 'Pauri Garhwal',
      addressRegion: 'Uttarakhand',
      addressCountry: 'IN',
    },
  };

  return (
    <html lang="en" className={`${sourceSans.variable} ${lora.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body className="font-sans text-charcoal bg-page selection:bg-accent selection:text-primary antialiased flex flex-col min-h-screen" suppressHydrationWarning>
        <ToastProvider>
          <Navbar settings={settings} />
          <BackToTop />
          <main className="flex-grow animate-fade-in">{children}</main>
          <Footer settings={settings} />
        </ToastProvider>
      </body>
    </html>
  );
}
