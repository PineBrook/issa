export interface SiteSettings {
  id: number;
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementLink: string;
  announcementButtonText: string;
  phone: string;
  email: string;
  headOfficeAddress: string;
  regionalOfficeAddress: string;
  youtubeUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  taxExemptInfo: string;
  footerTagline: string;
  updatedAt: string;
}

export interface HeroSlideItem {
  id: number;
  slideKey: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  donateLabel: string;
  donateHref: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StatItem {
  value: string;
  label: string;
  order: number;
}

export interface PhilosophySectionData {
  heading: string;
  image: string;
  imageAlt: string;
  badgeTitle: string;
  badgeSub: string;
  p1: string;
  p2: string;
  bullet1Title: string;
  bullet1Sub: string;
  bullet2Title: string;
  bullet2Sub: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface StrategicInterventionItem {
  metric: string;
  desc: string;
}

export interface StrategicInterventionsData {
  heading: string;
  items: StrategicInterventionItem[];
}

export interface CollaborateSectionData {
  heading: string;
  desc: string;
  phone: string;
  email: string;
}

export interface HomeSectionsData {
  stats: StatItem[];
  philosophy: PhilosophySectionData;
  strategicInterventions: StrategicInterventionsData;
  collaborate: CollaborateSectionData;
}

export interface ImpactHeroData {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
}

export interface ImpactMetricCard {
  title: string;
  metric: string;
  sub: string;
  details: string;
  verifiedText: string;
}

export interface CompetencyBar {
  label: string;
  value: number;
  color: string;
}

export interface MilestonesData {
  eyebrow: string;
  title: string;
  desc: string;
  bars: CompetencyBar[];
}

export interface ImpactContentData {
  hero: ImpactHeroData;
  metrics: ImpactMetricCard[];
  milestones: MilestonesData;
}

export interface ProgramFeatureItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ProgramStatItem {
  value: string;
  label: string;
}

export interface ProgramContentData {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  heroImage: string;
  overviewP1: string;
  overviewP2: string;
  vision: string;
  mission: string;
  approachTitle: string;
  approachDesc: string;
  programmes: ProgramFeatureItem[];
  skills: string[];
  stats: ProgramStatItem[];
  roadmap: string[];
  involvement: ProgramFeatureItem[];
  updatedAt: string;
}

export interface FaqItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OfficeLocationItem {
  id: number;
  city: string;
  role: string;
  address: string;
  phone: string;
  email: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAssetItem {
  id: number;
  filename: string;
  contentType: string;
  fileUrl: string;
  sizeBytes: number;
  altText: string;
  createdAt: string;
}

export interface LegalPageItem {
  slug: string;
  title: string;
  subtitle: string;
  contentMarkdown: string;
  updatedAt: string;
}

export interface ContactSubmissionItem {
  id: number;
  fullName: string;
  email: string;
  inquiryType: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriberItem {
  id: number;
  email: string;
  status: 'active' | 'unsubscribed';
  consentSource: string;
  consentedAt: string;
  subscribedAt: string;
}
