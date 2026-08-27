import 'server-only';

import { neon } from '@neondatabase/serverless';
import { getCurrentStaff, type StaffProfile } from '@/lib/staff';
import { CmsForbiddenError, CmsValidationError } from '@/lib/cms';
import type {
  SiteSettings,
  HeroSlideItem,
  HomeSectionsData,
  ImpactContentData,
  ProgramContentData,
  FaqItem,
  OfficeLocationItem,
  MediaAssetItem,
  LegalPageItem,
  ContactSubmissionItem,
  NewsletterSubscriberItem,
} from './site-cms-types';

function getDb() {
  const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
  if (!connectionString) return null;
  return neon(connectionString);
}

// ---------------------------------------------------------------------------
// DEFAULT FALLBACK VALUES
// ---------------------------------------------------------------------------

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 1,
  siteName: 'ISSA Foundation',
  siteTagline: 'Grassroots Development Across Uttarakhand',
  logoUrl: '',
  announcementEnabled: false,
  announcementText: '',
  announcementLink: '',
  announcementButtonText: 'Learn More',
  phone: '0135 430 8180',
  email: 'career.issafoundation@gmail.com',
  headOfficeAddress:
    '3F, Municipal No. 23/1 E.C. Road, New Municipal No. 107, Rajeev Gandhi Marg-II, Dehradun, Uttarakhand - 248001',
  regionalOfficeAddress:
    'Ward No 6, House No 33, C/o USHA RAWAT Agency Chowk, Kandoliya Mandir Road, Pauri Garhwal District Hospital, Pauri, Pauri Garhwal, Uttarakhand - 246001',
  youtubeUrl: 'https://www.youtube.com/@ISSAClasses',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61592854956791&sk=about',
  instagramUrl: 'https://www.instagram.com/issa__foundation/',
  twitterUrl: 'https://x.com/ISSAfoundation1',
  linkedinUrl:
    'https://www.linkedin.com/company/issa-foundation-uttarakhand/about/?viewAsMember=true',
  taxExemptInfo: 'ISSA Foundation is a registered non-profit organization.',
  footerTagline:
    'A grassroots non-profit committed to strengthening educational infrastructure, digital literacy, and clinical care systems across remote Himalayan communities.',
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_HERO_SLIDES: HeroSlideItem[] = [
  {
    id: 1,
    slideKey: 'ecosystem',
    eyebrow: 'Integrated Development',
    title: 'One Connected Ecosystem',
    highlight: 'for Holistic Impact.',
    description:
      'Connecting Healthcare, Education, Entrepreneurship and Career Aspirations with Digital Inclusion to build a stronger Uttarakhand.',
    image: '/isssa-local-ownership-v2.png',
    ctaLabel: 'Explore Ecosystem',
    ctaHref: '/programs',
    donateLabel: 'Support Our Mission',
    donateHref: '/contact',
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    slideKey: 'healthcare',
    eyebrow: 'Healthcare Systems',
    title: 'Care that reaches',
    highlight: 'to the last mile.',
    description:
      'Connecting remote communities with specialist care, diagnostics and essential health services.',
    image: '/isssa-healthcare-program-v2.png',
    ctaLabel: 'Explore Healthcare',
    ctaHref: '/programs/healthcare',
    donateLabel: 'Support Our Mission',
    donateHref: '/contact',
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    slideKey: 'education',
    eyebrow: 'Smart Classrooms & Education',
    title: 'Smart learning',
    highlight: 'for every student.',
    description:
      'Bringing quality education, teacher support and better learning opportunities to students across Uttarakhand.',
    image: '/isssa-education-program-v2.png',
    ctaLabel: 'Explore Education',
    ctaHref: '/programs/education',
    donateLabel: 'Support Our Mission',
    donateHref: '/contact',
    displayOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    slideKey: 'entrepreneurship',
    eyebrow: 'Entrepreneurship Development',
    title: 'Growing local businesses,',
    highlight: 'Creating local livelihoods.',
    description:
      'Supporting rural entrepreneurs with financial assistance, mentorship, technology and market access to build sustainable businesses.',
    image: '/isssa-entrepreneurship-program-v2.png',
    ctaLabel: 'Explore Entrepreneurship',
    ctaHref: '/programs/entrepreneurship',
    donateLabel: 'Support Our Mission',
    donateHref: '/contact',
    displayOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    slideKey: 'careers',
    eyebrow: 'Career & Opportunities',
    title: 'Turning aspirations',
    highlight: 'into opportunities.',
    description:
      'Enabling people across Uttarakhand prepare for careers, access employment opportunities and build sustainable futures.',
    image: '/isssa-community-dispatch-v2.png',
    ctaLabel: 'Explore Careers',
    ctaHref: '/careers',
    donateLabel: 'Support Our Mission',
    donateHref: '/contact',
    displayOrder: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    slideKey: 'digital',
    eyebrow: 'Digital Transformation',
    title: 'Connecting technology',
    highlight: 'to community needs.',
    description:
      'Building technology solutions that enable smarter healthcare, education and livelihoods across Uttarakhand.',
    image: '/isssa-digital-inclusion.png',
    ctaLabel: 'Explore IT Solutions',
    ctaHref: 'https://pinebrooktechnologies.com/',
    donateLabel: 'Support Our Mission',
    donateHref: '/contact',
    displayOrder: 6,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_HOME_SECTIONS: HomeSectionsData = {
  stats: [
    { value: '11+', label: 'Schools Adopted', order: 1 },
    { value: '600+', label: 'Students Reached', order: 2 },
    { value: '20+', label: 'Hospital Beds', order: 3 },
    { value: '1,200+', label: 'Patients Cared For', order: 4 },
    { value: '20+', label: 'Entrepreneurs', order: 5 },
    { value: '6+', label: 'Districts', order: 6 },
  ],
  philosophy: {
    heading: 'Development led by local communities',
    image: '/isssa-school-community-v2.png',
    imageAlt: 'Himalayan village children happily reading books in an Indian mountain community',
    badgeTitle: 'Working with communities.',
    badgeSub: 'Working closely with government departments and local communities on long-term programs.',
    p1: 'ISSA Foundation was established to improve access to education and healthcare. We focus on practical support that helps communities become more independent.',
    p2: 'We design programs with village elders, local leaders, and state authorities so they respond to local needs.',
    bullet1Title: 'Integrated Education',
    bullet1Sub: 'Merging digital literacy with traditional government curriculum.',
    bullet2Title: 'Holistic Health',
    bullet2Sub: 'Bringing specialist hospital care to remote hill districts.',
    ctaLabel: 'LEARN ABOUT ISSA',
    ctaHref: '/programs',
  },
  strategicInterventions: {
    heading: 'Targeted Work, Measurable Results',
    items: [
      { metric: '11+', desc: 'Smart boards and computers distributed across high-altitude government schools to improve classroom learning.' },
      { metric: '11+', desc: 'Specialist teachers appointed to mentor rural students and provide ongoing digital training.' },
      { metric: '20', desc: 'Hospital beds and high-tech equipment delivering critical, life-saving diagnostic care in Pauri Garhwal.' },
    ],
  },
  collaborate: {
    heading: 'Partner with us to Transform Lives',
    desc: 'Volunteer, partner, or support the work bringing lasting opportunity and structural development to remote communities in Uttarakhand.',
    phone: '0135 430 8180',
    email: 'career.issafoundation@gmail.com',
  },
};

export const DEFAULT_IMPACT_CONTENT: ImpactContentData = {
  hero: {
    eyebrow: 'Measured Progress',
    title: 'Transforming Lives.',
    highlight: 'One Village At A Time.',
    description: 'We focus on measurable outputs. Our financial allocations and community programs are audited periodically to maintain rigorous performance ratios.',
  },
  metrics: [
    {
      title: 'EduTech Infrastructure',
      metric: '84%',
      sub: 'Student Attendance Surge',
      details: 'Evaluations indicate that smart classroom installations led to a direct 84% rise in consistent rural high school attendance rates.',
      verifiedText: 'Direct Impact Verified',
    },
    {
      title: 'Healthcare Coverage',
      metric: '72%',
      sub: 'Reduced Travel Burdens',
      details: 'By deploying local mobile camp vans, over 72% of critical dental/diagnostic patients were saved from traveling 60+ km to cities.',
      verifiedText: 'Direct Impact Verified',
    },
    {
      title: 'IEDP Entrepreneurship',
      metric: '20+',
      sub: 'Entrepreneurs Supported',
      details: 'Mentoring, technology support, and market connections across 6 districts and 10+ sectors, targeting 100+ local employment opportunities.',
      verifiedText: 'Direct Impact Verified',
    },
    {
      title: 'Accountability Model',
      metric: '100%',
      sub: 'Direct Aid Sourcing',
      details: 'All purchases, classroom equipment, and doctor salaries are routed directly with no intermediary layers, assuring 100% budget efficacy.',
      verifiedText: 'Direct Impact Verified',
    },
  ],
  milestones: {
    eyebrow: 'Metrics Trend',
    title: 'Sustained Growth in Student Competency',
    desc: 'Independent assessment of rural primary and secondary students adopted into our CIAS digital classrooms showing competency increases over three school terms.',
    bars: [
      { label: 'Pre-Adoption', value: 35, color: 'primary' },
      { label: 'Term 1 (CIAS)', value: 60, color: 'rust' },
      { label: 'Term 2 (CIAS)', value: 88, color: 'accent' },
    ],
  },
};

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 1,
    category: 'contact',
    question: 'Where is the ISSA Foundation located?',
    answer: 'Our Head Office is located on E.C. Road in Dehradun, and our Regional Office is located near District Hospital in Pauri, Uttarakhand.',
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    category: 'contact',
    question: 'Can I volunteer directly in Uttarakhand schools?',
    answer: 'Absolutely. We run seasonal student tutoring and digital mentoring camps. Volunteers with backgrounds in computing, basic healthcare instruction, or physical therapy are welcome to submit applications through our Careers/Join Us page.',
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    category: 'contact',
    question: 'Is ISSA audited by state authorities?',
    answer: 'Yes. All school adoptions, classroom renovations, and medical device distributions are carried out under formal agreements with the relevant state departments and are subject to public auditing guidelines.',
    displayOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_OFFICES: OfficeLocationItem[] = [
  {
    id: 1,
    city: 'Head Office (Dehradun)',
    role: 'Headquarters',
    address: '3F, Municipal No. 23/1 E.C. Road, New Municipal No. 107, Rajeev Gandhi Marg-II, Dehradun, Uttarakhand - 248001',
    phone: '+91 135 430 8180',
    email: 'career.issafoundation@gmail.com',
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    city: 'Regional Office (Pauri)',
    role: 'Regional Administrative Hub',
    address: 'Ward No 6, House No 33, C/o USHA RAWAT Agency Chowk, Kandoliya Mandir Road, Pauri Garhwal District Hospital, Pauri, Pauri Garhwal, Uttarakhand - 246001',
    phone: '+91 135 430 8180',
    email: 'career.issafoundation@gmail.com',
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_PROGRAMS: Record<string, ProgramContentData> = {
  education: {
    slug: 'education',
    title: 'Empowering young minds.',
    subtitle: 'Building future leaders.',
    badge: 'Education initiative',
    heroImage: '/isssa-education-program-v2.png',
    overviewP1: 'Education is not limited to classrooms. It is about creating confident learners, responsible citizens, skilled professionals, and future entrepreneurs. Working with the Government of Uttarakhand, educators, communities, volunteers, and technology partners, ISSA is building an ecosystem that combines quality teaching, digital learning, career guidance, skill development, and real-world exposure.',
    overviewP2: 'The initiative was created because many government schools in rural and hill regions face limited digital infrastructure, shortages of subject-specialist teachers, and restricted access to career guidance and modern learning opportunities. ISSA exists to bridge these gaps so every learner can access quality education and build a brighter future.',
    vision: 'An inclusive, technology-enabled, future-ready education ecosystem where every learner can realise their full potential.',
    mission: 'Strengthen schools, empower teachers, improve outcomes, promote digital inclusion, and connect students with opportunity.',
    approachTitle: 'A connected model for stronger schools',
    approachDesc: 'We combine school-level support with digital access, specialist teaching, guidance, and skills that make learning useful beyond the exam.',
    programmes: [
      { title: 'CIAS: Cluster of ISSA Adopted Schools', description: 'In collaboration with the Uttarakhand Education Department, ISSA supports 12 government schools through a structured model of smart classrooms, subject-specialist teachers, academic support, and technology integration.' },
      { title: 'Smart Classrooms & Digital Learning', description: 'Smart Boards, computers, and engaging digital resources help students and teachers access interactive, technology-enabled learning in their own schools.' },
      { title: 'Academic Excellence', description: 'Subject-specialist teachers strengthen classroom learning, provide focused support in key subjects, and help government schools improve academic outcomes.' },
      { title: 'Computer Education & Digital Literacy', description: 'Structured computer education prepares students for higher education, employment, and participation in the digital economy.' },
      { title: 'Career & Competitive Exam Guidance', description: 'Students and young people receive coaching and career guidance for government examinations, future employment, and public service opportunities.' },
      { title: 'Agniveer Preparation Programme', description: 'Structured guidance, training, and physical readiness support youth aspiring to serve the nation through the Agniveer recruitment process.' },
    ],
    skills: ['Communication skills', 'Leadership', 'Digital skills', 'Financial literacy', 'Entrepreneurship awareness', 'Innovation and problem solving', 'Career readiness'],
    stats: [
      { value: '12', label: 'government schools adopted through CIAS' },
      { value: '1', label: 'connected model for teaching, technology, and opportunity' },
    ],
    roadmap: [
      'Strengthen and expand the CIAS network across Uttarakhand',
      'Add digital classrooms, STEM programmes, and practical learning experiences',
      'Create industry exposure, scholarships, and school-to-employment pathways',
      'Connect learners with higher education, careers, entrepreneurship, and lifelong learning',
    ],
    involvement: [
      { title: 'Schools', description: 'Partner with ISSA to strengthen learning environments, digital access, and academic support.' },
      { title: 'Students', description: 'Use learning, digital literacy, career guidance, and skill-building opportunities to prepare for what comes next.' },
      { title: 'Teachers', description: 'Bring subject expertise, mentorship, and classroom leadership to the government school ecosystem.' },
      { title: 'Volunteers', description: 'Contribute time, knowledge, mentoring, and local support to help learners and schools move forward.' },
      { title: 'Corporate Partners', description: 'Invest in scalable education infrastructure, teacher support, digital inclusion, and future-ready skills.' },
    ],
    updatedAt: new Date().toISOString(),
  },
  healthcare: {
    slug: 'healthcare',
    title: 'Care that reaches',
    subtitle: 'to the last mile.',
    badge: 'Healthcare initiative',
    heroImage: '/isssa-healthcare-program-v2.png',
    overviewP1: 'Access to quality healthcare should not depend on geography. In remote Himalayan villages, geographical distance and lack of specialist medical staff pose severe barriers to timely treatment. ISSA Foundation collaborates with local health authorities to bridge this divide.',
    overviewP2: 'By equipping community hospitals, deploying mobile diagnostic clinics, and facilitating specialist teleconsultations, we ensure comprehensive primary and specialized medical care reaches the most isolated hill communities.',
    vision: 'Accessible, dependable, and high-standard healthcare for every mountain community in Uttarakhand.',
    mission: 'Deliver life-saving medical equipment, organize specialty health camps, and support rural hospitals to drastically reduce healthcare travel burdens.',
    approachTitle: 'Bridging the healthcare divide in remote hills',
    approachDesc: 'Our healthcare intervention focuses on immediate clinical support, diagnostic infrastructure, and specialized outreach.',
    programmes: [
      { title: 'Hospital Infrastructure & Bed Enablement', description: 'Equipping district and block-level hospitals with advanced patient beds, diagnostic machinery, and critical medical supplies in Pauri Garhwal.' },
      { title: 'Mobile Medical & Diagnostic Units', description: 'Deploying vans equipped for dental, ophthalmic, and general diagnostics to remote villages unreachable by conventional clinics.' },
      { title: 'Specialist Teleconsultation', description: 'Connecting rural patients directly with expert doctors and medical consultants across top Indian healthcare institutions.' },
    ],
    skills: ['Emergency Care', 'Preventative Screening', 'Maternal Health', 'Digital Health Records', 'Telemedicine'],
    stats: [
      { value: '20+', label: 'Hospital beds equipped with advanced monitors' },
      { value: '1,200+', label: 'Patients treated in high-altitude communities' },
      { value: '72%', label: 'Reduction in travel distance for routine diagnostics' },
    ],
    roadmap: [
      'Expand mobile clinic coverage to 10 additional mountain blocks',
      'Integrate telemedicine kiosks in all CIAS school health corners',
      'Establish a 24/7 mountain ambulance network for emergency referrals',
    ],
    involvement: [
      { title: 'Doctors & Specialists', description: 'Volunteer your clinical expertise for mobile medical camps and teleconsultation sessions.' },
      { title: 'Hospitals & Medical Chains', description: 'Partner with ISSA to sponsor equipment and medical diagnostics.' },
      { title: 'Community Health Workers', description: 'Collaborate on local health surveillance and preventive education.' },
    ],
    updatedAt: new Date().toISOString(),
  },
  entrepreneurship: {
    slug: 'entrepreneurship',
    title: 'Growing local businesses.',
    subtitle: 'Creating local livelihoods.',
    badge: 'Entrepreneurship Development Programme (IEDP)',
    heroImage: '/isssa-entrepreneurship-program-v2.png',
    overviewP1: 'Uttarakhand has immense potential in agro-processing, ecotourism, handloom, and digital services. However, rural entrepreneurs often lack seed capital, mentorship, digital tools, and market linkages required to scale.',
    overviewP2: 'The ISSA Entrepreneurship Development Programme (IEDP) identifies ambitious rural and youth entrepreneurs, providing end-to-end incubation, business mentorship, digital marketing, and financial linkages.',
    vision: 'A vibrant, self-reliant rural economy where local youth build sustainable enterprises that create jobs in their own hometowns.',
    mission: 'Nurture and scale 100+ rural micro-enterprises across Uttarakhand through training, mentorship, and direct market access.',
    approachTitle: 'From idea to sustainable mountain enterprise',
    approachDesc: 'We provide practical, hands-on enterprise support tailored specifically to mountain economies and rural supply chains.',
    programmes: [
      { title: 'Incubation & Seed Support', description: 'Providing early-stage validation, financial literacy, and initial grant/seed linkages for viable mountain business concepts.' },
      { title: 'Digital Transformation for Rural Artisans', description: 'Helping local craftspeople, farmers, and entrepreneurs sell products nationwide through digital commerce and branding.' },
      { title: 'Mentorship & Market Access', description: 'Pairing entrepreneurs with experienced business leaders and linking products directly to urban and institutional markets.' },
    ],
    skills: ['Business Planning', 'Financial Management', 'E-commerce & Digital Marketing', 'Supply Chain Logistics', 'Regulatory Compliance'],
    stats: [
      { value: '20+', label: 'Entrepreneurs actively supported' },
      { value: '6+', label: 'Districts covered across Garhwal and Kumaon' },
      { value: '100+', label: 'Local direct and indirect jobs created' },
    ],
    roadmap: [
      'Establish enterprise incubation centers in Dehradun and Pauri',
      'Launch a dedicated regional artisanal and organic marketplace',
      'Facilitate INR 1 Crore in micro-enterprise credit linkages for women entrepreneurs',
    ],
    involvement: [
      { title: 'Aspiring Entrepreneurs', description: 'Apply to join the IEDP cohort for structured incubation and mentorship.' },
      { title: 'Industry Mentors', description: 'Guide emerging entrepreneurs in marketing, finance, and scaling operations.' },
      { title: 'Impact Investors & CSR', description: 'Fund revolving micro-grant pools to catalyze high-impact mountain enterprises.' },
    ],
    updatedAt: new Date().toISOString(),
  },
};

// ---------------------------------------------------------------------------
// SITE SETTINGS
// ---------------------------------------------------------------------------

export async function getSiteSettings(): Promise<SiteSettings> {
  const sql = getDb();
  if (!sql) return DEFAULT_SITE_SETTINGS;

  try {
    const rows = await sql`
      SELECT * FROM site_settings WHERE id = 1 LIMIT 1
    `;
    if (rows.length === 0) return DEFAULT_SITE_SETTINGS;
    const r = rows[0];
    return {
      id: 1,
      siteName: r.site_name || DEFAULT_SITE_SETTINGS.siteName,
      siteTagline: r.site_tagline || DEFAULT_SITE_SETTINGS.siteTagline,
      logoUrl: r.logo_url || '',
      announcementEnabled: Boolean(r.announcement_enabled),
      announcementText: r.announcement_text || '',
      announcementLink: r.announcement_link || '',
      announcementButtonText: r.announcement_button_text || 'Learn More',
      phone: r.phone || DEFAULT_SITE_SETTINGS.phone,
      email: r.email || DEFAULT_SITE_SETTINGS.email,
      headOfficeAddress: r.head_office_address || DEFAULT_SITE_SETTINGS.headOfficeAddress,
      regionalOfficeAddress: r.regional_office_address || DEFAULT_SITE_SETTINGS.regionalOfficeAddress,
      youtubeUrl: r.youtube_url || DEFAULT_SITE_SETTINGS.youtubeUrl,
      facebookUrl: r.facebook_url || DEFAULT_SITE_SETTINGS.facebookUrl,
      instagramUrl: r.instagram_url || DEFAULT_SITE_SETTINGS.instagramUrl,
      twitterUrl: r.twitter_url || DEFAULT_SITE_SETTINGS.twitterUrl,
      linkedinUrl: r.linkedin_url || DEFAULT_SITE_SETTINGS.linkedinUrl,
      taxExemptInfo: r.tax_exempt_info || DEFAULT_SITE_SETTINGS.taxExemptInfo,
      footerTagline: r.footer_tagline || DEFAULT_SITE_SETTINGS.footerTagline,
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSettings(
  data: Partial<SiteSettings>,
  staff?: StaffProfile | null
): Promise<SiteSettings> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || currentStaff.role !== 'ADMIN') {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) throw new Error('Database connection is not configured.');

  const current = await getSiteSettings();
  const merged = { ...current, ...data };

  await sql`
    INSERT INTO site_settings (
      id, site_name, site_tagline, logo_url,
      announcement_enabled, announcement_text, announcement_link, announcement_button_text,
      phone, email, head_office_address, regional_office_address,
      youtube_url, facebook_url, instagram_url, twitter_url, linkedin_url,
      tax_exempt_info, footer_tagline, updated_at
    ) VALUES (
      1,
      ${merged.siteName},
      ${merged.siteTagline},
      ${merged.logoUrl},
      ${merged.announcementEnabled},
      ${merged.announcementText},
      ${merged.announcementLink},
      ${merged.announcementButtonText},
      ${merged.phone},
      ${merged.email},
      ${merged.headOfficeAddress},
      ${merged.regionalOfficeAddress},
      ${merged.youtubeUrl},
      ${merged.facebookUrl},
      ${merged.instagramUrl},
      ${merged.twitterUrl},
      ${merged.linkedinUrl},
      ${merged.taxExemptInfo},
      ${merged.footerTagline},
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      site_name = EXCLUDED.site_name,
      site_tagline = EXCLUDED.site_tagline,
      logo_url = EXCLUDED.logo_url,
      announcement_enabled = EXCLUDED.announcement_enabled,
      announcement_text = EXCLUDED.announcement_text,
      announcement_link = EXCLUDED.announcement_link,
      announcement_button_text = EXCLUDED.announcement_button_text,
      phone = EXCLUDED.phone,
      email = EXCLUDED.email,
      head_office_address = EXCLUDED.head_office_address,
      regional_office_address = EXCLUDED.regional_office_address,
      youtube_url = EXCLUDED.youtube_url,
      facebook_url = EXCLUDED.facebook_url,
      instagram_url = EXCLUDED.instagram_url,
      twitter_url = EXCLUDED.twitter_url,
      linkedin_url = EXCLUDED.linkedin_url,
      tax_exempt_info = EXCLUDED.tax_exempt_info,
      footer_tagline = EXCLUDED.footer_tagline,
      updated_at = NOW()
  `;

  return getSiteSettings();
}

// ---------------------------------------------------------------------------
// HERO SLIDES
// ---------------------------------------------------------------------------

export async function getHeroSlides(includeInactive = false): Promise<HeroSlideItem[]> {
  const sql = getDb();
  if (!sql) return includeInactive ? DEFAULT_HERO_SLIDES : DEFAULT_HERO_SLIDES.filter((s) => s.isActive);

  try {
    const rows = await sql`
      SELECT * FROM hero_slides
      ${includeInactive ? sql`` : sql`WHERE is_active = true`}
      ORDER BY display_order ASC, id ASC
    `;
    if (rows.length === 0) return DEFAULT_HERO_SLIDES;

    return rows.map((r: any) => ({
      id: Number(r.id),
      slideKey: String(r.slide_key),
      eyebrow: String(r.eyebrow),
      title: String(r.title),
      highlight: String(r.highlight || ''),
      description: String(r.description || ''),
      image: String(r.image),
      ctaLabel: String(r.cta_label || 'Learn More'),
      ctaHref: String(r.cta_href || '/programs'),
      donateLabel: String(r.donate_label || 'Support Our Mission'),
      donateHref: String(r.donate_href || '/contact'),
      displayOrder: Number(r.display_order || 0),
      isActive: Boolean(r.is_active),
      createdAt: new Date(r.created_at || Date.now()).toISOString(),
      updatedAt: new Date(r.updated_at || Date.now()).toISOString(),
    }));
  } catch {
    return DEFAULT_HERO_SLIDES;
  }
}

export async function saveHeroSlide(
  slide: {
    id?: number;
    slideKey?: string;
    eyebrow: string;
    title: string;
    highlight?: string;
    description: string;
    image: string;
    ctaLabel: string;
    ctaHref: string;
    donateLabel?: string;
    donateHref?: string;
    displayOrder?: number;
    isActive?: boolean;
  },
  staff?: StaffProfile | null
): Promise<HeroSlideItem> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) throw new Error('Database connection is not configured.');

  const slideKey = slide.slideKey || `slide_${Date.now()}`;
  const highlight = slide.highlight || '';
  const donateLabel = slide.donateLabel || 'Support Our Mission';
  const donateHref = slide.donateHref || '/contact';
  const displayOrder = slide.displayOrder ?? 0;
  const isActive = slide.isActive ?? true;

  if (slide.id) {
    const rows = await sql`
      UPDATE hero_slides
      SET
        eyebrow = ${slide.eyebrow},
        title = ${slide.title},
        highlight = ${highlight},
        description = ${slide.description},
        image = ${slide.image},
        cta_label = ${slide.ctaLabel},
        cta_href = ${slide.ctaHref},
        donate_label = ${donateLabel},
        donate_href = ${donateHref},
        display_order = ${displayOrder},
        is_active = ${isActive},
        updated_at = NOW()
      WHERE id = ${slide.id}
      RETURNING *
    `;
    const r = rows[0];
    return {
      id: Number(r.id),
      slideKey: String(r.slide_key),
      eyebrow: String(r.eyebrow),
      title: String(r.title),
      highlight: String(r.highlight),
      description: String(r.description),
      image: String(r.image),
      ctaLabel: String(r.cta_label),
      ctaHref: String(r.cta_href),
      donateLabel: String(r.donate_label),
      donateHref: String(r.donate_href),
      displayOrder: Number(r.display_order),
      isActive: Boolean(r.is_active),
      createdAt: new Date(r.created_at).toISOString(),
      updatedAt: new Date(r.updated_at).toISOString(),
    };
  }

  const rows = await sql`
    INSERT INTO hero_slides (
      slide_key, eyebrow, title, highlight, description, image,
      cta_label, cta_href, donate_label, donate_href, display_order, is_active
    ) VALUES (
      ${slideKey},
      ${slide.eyebrow},
      ${slide.title},
      ${highlight},
      ${slide.description},
      ${slide.image},
      ${slide.ctaLabel},
      ${slide.ctaHref},
      ${donateLabel},
      ${donateHref},
      ${displayOrder},
      ${isActive}
    )
    RETURNING *
  `;
  const r = rows[0];
  return {
    id: Number(r.id),
    slideKey: String(r.slide_key),
    eyebrow: String(r.eyebrow),
    title: String(r.title),
    highlight: String(r.highlight),
    description: String(r.description),
    image: String(r.image),
    ctaLabel: String(r.cta_label),
    ctaHref: String(r.cta_href),
    donateLabel: String(r.donate_label),
    donateHref: String(r.donate_href),
    displayOrder: Number(r.display_order),
    isActive: Boolean(r.is_active),
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

export async function deleteHeroSlide(id: number, staff?: StaffProfile | null): Promise<void> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) throw new Error('Database connection is not configured.');

  await sql`DELETE FROM hero_slides WHERE id = ${id}`;
}

// ---------------------------------------------------------------------------
// HOMEPAGE SECTIONS
// ---------------------------------------------------------------------------

export async function getHomeSections(): Promise<HomeSectionsData> {
  const sql = getDb();
  if (!sql) return DEFAULT_HOME_SECTIONS;

  try {
    const rows = await sql`SELECT section_key, data FROM home_sections`;
    if (rows.length === 0) return DEFAULT_HOME_SECTIONS;

    const map: Record<string, any> = {};
    for (const r of rows) {
      map[r.section_key] = r.data;
    }

    return {
      stats: map.stats || DEFAULT_HOME_SECTIONS.stats,
      philosophy: map.philosophy || DEFAULT_HOME_SECTIONS.philosophy,
      strategicInterventions: map.strategic_interventions || DEFAULT_HOME_SECTIONS.strategicInterventions,
      collaborate: map.collaborate || DEFAULT_HOME_SECTIONS.collaborate,
    };
  } catch {
    return DEFAULT_HOME_SECTIONS;
  }
}

export async function updateHomeSection(
  sectionKey: 'stats' | 'philosophy' | 'strategic_interventions' | 'collaborate',
  data: any,
  staff?: StaffProfile | null
): Promise<void> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) throw new Error('Database connection is not configured.');

  await sql`
    INSERT INTO home_sections (section_key, data, updated_at)
    VALUES (${sectionKey}, ${JSON.stringify(data)}::jsonb, NOW())
    ON CONFLICT (section_key) DO UPDATE SET
      data = EXCLUDED.data,
      updated_at = NOW()
  `;
}

// ---------------------------------------------------------------------------
// IMPACT PAGE CONTENT
// ---------------------------------------------------------------------------

export async function getImpactContent(): Promise<ImpactContentData> {
  const sql = getDb();
  if (!sql) return DEFAULT_IMPACT_CONTENT;

  try {
    const rows = await sql`SELECT section_key, data FROM impact_content`;
    if (rows.length === 0) return DEFAULT_IMPACT_CONTENT;

    const map: Record<string, any> = {};
    for (const r of rows) {
      map[r.section_key] = r.data;
    }

    return {
      hero: map.hero || DEFAULT_IMPACT_CONTENT.hero,
      metrics: map.metrics || DEFAULT_IMPACT_CONTENT.metrics,
      milestones: map.milestones || DEFAULT_IMPACT_CONTENT.milestones,
    };
  } catch {
    return DEFAULT_IMPACT_CONTENT;
  }
}

export async function updateImpactSection(
  sectionKey: 'hero' | 'metrics' | 'milestones',
  data: any,
  staff?: StaffProfile | null
): Promise<void> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) throw new Error('Database connection is not configured.');

  await sql`
    INSERT INTO impact_content (section_key, data, updated_at)
    VALUES (${sectionKey}, ${JSON.stringify(data)}::jsonb, NOW())
    ON CONFLICT (section_key) DO UPDATE SET
      data = EXCLUDED.data,
      updated_at = NOW()
  `;
}

// ---------------------------------------------------------------------------
// PROGRAMS CONTENT
// ---------------------------------------------------------------------------

export async function getProgramsContent(slug?: string): Promise<Record<string, ProgramContentData>> {
  const sql = getDb();
  if (!sql) {
    if (slug && DEFAULT_PROGRAMS[slug]) {
      return { [slug]: DEFAULT_PROGRAMS[slug] };
    }
    return DEFAULT_PROGRAMS;
  }

  try {
    const rows = slug
      ? await sql`SELECT * FROM programs_content WHERE slug = ${slug}`
      : await sql`SELECT * FROM programs_content`;

    if (rows.length === 0) {
      if (slug && DEFAULT_PROGRAMS[slug]) return { [slug]: DEFAULT_PROGRAMS[slug] };
      return DEFAULT_PROGRAMS;
    }

    const result: Record<string, ProgramContentData> = {};
    for (const r of rows) {
      result[r.slug] = {
        slug: String(r.slug),
        title: String(r.title),
        subtitle: String(r.subtitle || ''),
        badge: String(r.badge || ''),
        heroImage: String(r.hero_image || ''),
        overviewP1: String(r.overview_p1 || ''),
        overviewP2: String(r.overview_p2 || ''),
        vision: String(r.vision || ''),
        mission: String(r.mission || ''),
        approachTitle: String(r.approach_title || ''),
        approachDesc: String(r.approach_desc || ''),
        programmes: Array.isArray(r.programmes) ? r.programmes : [],
        skills: Array.isArray(r.skills) ? r.skills : [],
        stats: Array.isArray(r.stats) ? r.stats : [],
        roadmap: Array.isArray(r.roadmap) ? r.roadmap : [],
        involvement: Array.isArray(r.involvement) ? r.involvement : [],
        updatedAt: new Date(r.updated_at || Date.now()).toISOString(),
      };
    }

    return result;
  } catch {
    if (slug && DEFAULT_PROGRAMS[slug]) return { [slug]: DEFAULT_PROGRAMS[slug] };
    return DEFAULT_PROGRAMS;
  }
}

export async function saveProgramContent(
  program: ProgramContentData,
  staff?: StaffProfile | null
): Promise<ProgramContentData> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) throw new Error('Database connection is not configured.');

  await sql`
    INSERT INTO programs_content (
      slug, title, subtitle, badge, hero_image,
      overview_p1, overview_p2, vision, mission,
      approach_title, approach_desc, programmes, skills,
      stats, roadmap, involvement, updated_at
    ) VALUES (
      ${program.slug},
      ${program.title},
      ${program.subtitle},
      ${program.badge},
      ${program.heroImage},
      ${program.overviewP1},
      ${program.overviewP2},
      ${program.vision},
      ${program.mission},
      ${program.approachTitle},
      ${program.approachDesc},
      ${JSON.stringify(program.programmes)}::jsonb,
      ${JSON.stringify(program.skills)}::jsonb,
      ${JSON.stringify(program.stats)}::jsonb,
      ${JSON.stringify(program.roadmap)}::jsonb,
      ${JSON.stringify(program.involvement)}::jsonb,
      NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      subtitle = EXCLUDED.subtitle,
      badge = EXCLUDED.badge,
      hero_image = EXCLUDED.hero_image,
      overview_p1 = EXCLUDED.overview_p1,
      overview_p2 = EXCLUDED.overview_p2,
      vision = EXCLUDED.vision,
      mission = EXCLUDED.mission,
      approach_title = EXCLUDED.approach_title,
      approach_desc = EXCLUDED.approach_desc,
      programmes = EXCLUDED.programmes,
      skills = EXCLUDED.skills,
      stats = EXCLUDED.stats,
      roadmap = EXCLUDED.roadmap,
      involvement = EXCLUDED.involvement,
      updated_at = NOW()
  `;

  const updated = await getProgramsContent(program.slug);
  return updated[program.slug];
}

// ---------------------------------------------------------------------------
// FAQS
// ---------------------------------------------------------------------------

export async function getFaqs(category?: string): Promise<FaqItem[]> {
  const sql = getDb();
  if (!sql) {
    return category ? DEFAULT_FAQS.filter((f) => f.category === category) : DEFAULT_FAQS;
  }

  try {
    const rows = category
      ? await sql`SELECT * FROM faqs WHERE category = ${category} ORDER BY display_order ASC, id ASC`
      : await sql`SELECT * FROM faqs ORDER BY category ASC, display_order ASC, id ASC`;

    if (rows.length === 0) {
      return category ? DEFAULT_FAQS.filter((f) => f.category === category) : DEFAULT_FAQS;
    }

    return rows.map((r: any) => ({
      id: Number(r.id),
      category: String(r.category),
      question: String(r.question),
      answer: String(r.answer),
      displayOrder: Number(r.display_order || 0),
      isActive: Boolean(r.is_active),
      createdAt: new Date(r.created_at || Date.now()).toISOString(),
      updatedAt: new Date(r.updated_at || Date.now()).toISOString(),
    }));
  } catch {
    return category ? DEFAULT_FAQS.filter((f) => f.category === category) : DEFAULT_FAQS;
  }
}

export async function saveFaq(
  faq: { id?: number; category: string; question: string; answer: string; displayOrder?: number; isActive?: boolean },
  staff?: StaffProfile | null
): Promise<FaqItem> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) throw new Error('Database connection is not configured.');

  const displayOrder = faq.displayOrder ?? 0;
  const isActive = faq.isActive ?? true;

  if (faq.id) {
    const rows = await sql`
      UPDATE faqs
      SET
        category = ${faq.category},
        question = ${faq.question},
        answer = ${faq.answer},
        display_order = ${displayOrder},
        is_active = ${isActive},
        updated_at = NOW()
      WHERE id = ${faq.id}
      RETURNING *
    `;
    const r = rows[0];
    return {
      id: Number(r.id),
      category: String(r.category),
      question: String(r.question),
      answer: String(r.answer),
      displayOrder: Number(r.display_order),
      isActive: Boolean(r.is_active),
      createdAt: new Date(r.created_at).toISOString(),
      updatedAt: new Date(r.updated_at).toISOString(),
    };
  }

  const rows = await sql`
    INSERT INTO faqs (category, question, answer, display_order, is_active)
    VALUES (${faq.category}, ${faq.question}, ${faq.answer}, ${displayOrder}, ${isActive})
    RETURNING *
  `;
  const r = rows[0];
  return {
    id: Number(r.id),
    category: String(r.category),
    question: String(r.question),
    answer: String(r.answer),
    displayOrder: Number(r.display_order),
    isActive: Boolean(r.is_active),
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

export async function deleteFaq(id: number, staff?: StaffProfile | null): Promise<void> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) throw new Error('Database connection is not configured.');

  await sql`DELETE FROM faqs WHERE id = ${id}`;
}

// ---------------------------------------------------------------------------
// OFFICE LOCATIONS
// ---------------------------------------------------------------------------

export async function getOfficeLocations(): Promise<OfficeLocationItem[]> {
  const sql = getDb();
  if (!sql) return DEFAULT_OFFICES;

  try {
    const rows = await sql`SELECT * FROM office_locations WHERE is_active = true ORDER BY display_order ASC, id ASC`;
    if (rows.length === 0) return DEFAULT_OFFICES;

    return rows.map((r: any) => ({
      id: Number(r.id),
      city: String(r.city),
      role: String(r.role),
      address: String(r.address),
      phone: String(r.phone),
      email: String(r.email),
      displayOrder: Number(r.display_order || 0),
      isActive: Boolean(r.is_active),
      createdAt: new Date(r.created_at || Date.now()).toISOString(),
      updatedAt: new Date(r.updated_at || Date.now()).toISOString(),
    }));
  } catch {
    return DEFAULT_OFFICES;
  }
}

export async function saveOfficeLocation(
  office: { id?: number; city: string; role: string; address: string; phone: string; email: string; displayOrder?: number; isActive?: boolean },
  staff?: StaffProfile | null
): Promise<OfficeLocationItem> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) throw new Error('Database connection is not configured.');

  const displayOrder = office.displayOrder ?? 0;
  const isActive = office.isActive ?? true;

  if (office.id) {
    const rows = await sql`
      UPDATE office_locations
      SET
        city = ${office.city},
        role = ${office.role},
        address = ${office.address},
        phone = ${office.phone},
        email = ${office.email},
        display_order = ${displayOrder},
        is_active = ${isActive},
        updated_at = NOW()
      WHERE id = ${office.id}
      RETURNING *
    `;
    const r = rows[0];
    return {
      id: Number(r.id),
      city: String(r.city),
      role: String(r.role),
      address: String(r.address),
      phone: String(r.phone),
      email: String(r.email),
      displayOrder: Number(r.display_order),
      isActive: Boolean(r.is_active),
      createdAt: new Date(r.created_at).toISOString(),
      updatedAt: new Date(r.updated_at).toISOString(),
    };
  }

  const rows = await sql`
    INSERT INTO office_locations (city, role, address, phone, email, display_order, is_active)
    VALUES (${office.city}, ${office.role}, ${office.address}, ${office.phone}, ${office.email}, ${displayOrder}, ${isActive})
    RETURNING *
  `;
  const r = rows[0];
  return {
    id: Number(r.id),
    city: String(r.city),
    role: String(r.role),
    address: String(r.address),
    phone: String(r.phone),
    email: String(r.email),
    displayOrder: Number(r.display_order),
    isActive: Boolean(r.is_active),
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

export async function deleteOfficeLocation(id: number, staff?: StaffProfile | null): Promise<void> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) throw new Error('Database connection is not configured.');

  await sql`DELETE FROM office_locations WHERE id = ${id}`;
}

// ---------------------------------------------------------------------------
// MEDIA ASSETS (Stored in Neon Database)
// ---------------------------------------------------------------------------

export async function getMediaAssets(search?: string): Promise<MediaAssetItem[]> {
  const sql = getDb();
  if (!sql) return [];

  try {
    const rows = search?.trim()
      ? await sql`
          SELECT id, filename, content_type, file_url, size_bytes, alt_text, created_at
          FROM media_assets
          WHERE LOWER(filename) LIKE ${`%${search.trim().toLowerCase()}%`}
             OR LOWER(alt_text) LIKE ${`%${search.trim().toLowerCase()}%`}
          ORDER BY id DESC
        `
      : await sql`
          SELECT id, filename, content_type, file_url, size_bytes, alt_text, created_at
          FROM media_assets
          ORDER BY id DESC
        `;

    return rows.map((r: any) => ({
      id: Number(r.id),
      filename: String(r.filename),
      contentType: String(r.content_type),
      fileUrl: String(r.file_url),
      sizeBytes: Number(r.size_bytes),
      altText: String(r.alt_text || ''),
      createdAt: new Date(r.created_at).toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function saveMediaAsset(
  file: { filename: string; contentType: string; buffer: Buffer; altText?: string },
  staff?: StaffProfile | null
): Promise<MediaAssetItem> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) throw new Error('Database connection is not configured.');

  const rows = await sql`
    INSERT INTO media_assets (filename, content_type, file_data, file_url, size_bytes, alt_text)
    VALUES (
      ${file.filename},
      ${file.contentType},
      ${file.buffer},
      '',
      ${file.buffer.length},
      ${file.altText || ''}
    )
    RETURNING id, filename, content_type, size_bytes, alt_text, created_at
  `;

  const assetId = Number(rows[0].id);
  const fileUrl = `/api/media/${assetId}`;

  await sql`
    UPDATE media_assets
    SET file_url = ${fileUrl}
    WHERE id = ${assetId}
  `;

  return {
    id: assetId,
    filename: String(rows[0].filename),
    contentType: String(rows[0].content_type),
    fileUrl,
    sizeBytes: Number(rows[0].size_bytes),
    altText: String(rows[0].alt_text || ''),
    createdAt: new Date(rows[0].created_at).toISOString(),
  };
}

export async function getMediaAssetData(id: number): Promise<{ contentType: string; buffer: Buffer; filename: string } | null> {
  const sql = getDb();
  if (!sql) return null;

  try {
    const rows = await sql`
      SELECT filename, content_type, file_data
      FROM media_assets
      WHERE id = ${id}
      LIMIT 1
    `;
    if (rows.length === 0 || !rows[0].file_data) return null;

    let buf: Buffer | null = null;
    const raw = rows[0].file_data;
    if (Buffer.isBuffer(raw)) buf = raw;
    else if (raw instanceof Uint8Array) buf = Buffer.from(raw);
    else if (typeof raw === 'string') {
      if (raw.startsWith('\\x')) buf = Buffer.from(raw.slice(2), 'hex');
      else buf = Buffer.from(raw, 'base64');
    }

    if (!buf) return null;

    return {
      filename: String(rows[0].filename),
      contentType: String(rows[0].content_type),
      buffer: buf,
    };
  } catch {
    return null;
  }
}

export async function deleteMediaAsset(id: number, staff?: StaffProfile | null): Promise<void> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) throw new Error('Database connection is not configured.');

  await sql`DELETE FROM media_assets WHERE id = ${id}`;
}

// ---------------------------------------------------------------------------
// LEGAL PAGES
// ---------------------------------------------------------------------------

export async function getLegalPage(slug: string): Promise<LegalPageItem | null> {
  const sql = getDb();
  if (!sql) return null;

  try {
    const rows = await sql`SELECT * FROM legal_pages WHERE slug = ${slug} LIMIT 1`;
    if (rows.length === 0) return null;
    return {
      slug: String(rows[0].slug),
      title: String(rows[0].title),
      subtitle: String(rows[0].subtitle || ''),
      contentMarkdown: String(rows[0].content_markdown),
      updatedAt: new Date(rows[0].updated_at || Date.now()).toISOString(),
    };
  } catch {
    return null;
  }
}

export async function saveLegalPage(
  page: { slug: string; title: string; subtitle?: string; contentMarkdown: string },
  staff?: StaffProfile | null
): Promise<LegalPageItem> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) throw new Error('Database connection is not configured.');

  const rows = await sql`
    INSERT INTO legal_pages (slug, title, subtitle, content_markdown, updated_at)
    VALUES (${page.slug}, ${page.title}, ${page.subtitle || ''}, ${page.contentMarkdown}, NOW())
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      subtitle = EXCLUDED.subtitle,
      content_markdown = EXCLUDED.content_markdown,
      updated_at = NOW()
    RETURNING *
  `;

  return {
    slug: String(rows[0].slug),
    title: String(rows[0].title),
    subtitle: String(rows[0].subtitle || ''),
    contentMarkdown: String(rows[0].content_markdown),
    updatedAt: new Date(rows[0].updated_at).toISOString(),
  };
}

// ---------------------------------------------------------------------------
// CONTACT SUBMISSIONS & NEWSLETTER SUBSCRIBERS
// ---------------------------------------------------------------------------

export async function getContactSubmissions(filters?: {
  status?: string;
  search?: string;
}): Promise<ContactSubmissionItem[]> {
  const staff = await getCurrentStaff();
  if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) return [];

  try {
    const status = filters?.status && filters.status !== 'all' ? filters.status : null;
    const search = filters?.search?.trim() ? `%${filters.search.trim().toLowerCase()}%` : null;

    let rows;
    if (status && search) {
      rows = await sql`
        SELECT * FROM contact_submissions
        WHERE status = ${status}
          AND (LOWER(full_name) LIKE ${search} OR LOWER(email) LIKE ${search} OR LOWER(message) LIKE ${search})
        ORDER BY created_at DESC
      `;
    } else if (status) {
      rows = await sql`
        SELECT * FROM contact_submissions
        WHERE status = ${status}
        ORDER BY created_at DESC
      `;
    } else if (search) {
      rows = await sql`
        SELECT * FROM contact_submissions
        WHERE LOWER(full_name) LIKE ${search} OR LOWER(email) LIKE ${search} OR LOWER(message) LIKE ${search}
        ORDER BY created_at DESC
      `;
    } else {
      rows = await sql`SELECT * FROM contact_submissions ORDER BY created_at DESC`;
    }

    return rows.map((r: any) => ({
      id: Number(r.id),
      fullName: String(r.full_name),
      email: String(r.email),
      inquiryType: String(r.inquiry_type),
      message: String(r.message),
      status: r.status as any,
      assignedTo: r.assigned_to ? String(r.assigned_to) : null,
      createdAt: new Date(r.created_at).toISOString(),
      updatedAt: new Date(r.updated_at).toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function updateContactSubmissionStatus(
  id: number,
  status: 'new' | 'in_progress' | 'resolved' | 'archived',
  staff?: StaffProfile | null
): Promise<void> {
  const currentStaff = staff ?? (await getCurrentStaff());
  if (!currentStaff || (currentStaff.role !== 'ADMIN' && currentStaff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) throw new Error('Database connection is not configured.');

  await sql`
    UPDATE contact_submissions
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${id}
  `;
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriberItem[]> {
  const staff = await getCurrentStaff();
  if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
    throw new CmsForbiddenError();
  }

  const sql = getDb();
  if (!sql) return [];

  try {
    const rows = await sql`SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC`;
    return rows.map((r: any) => ({
      id: Number(r.id),
      email: String(r.email),
      status: r.status as any,
      consentSource: String(r.consent_source || 'website'),
      consentedAt: new Date(r.consented_at).toISOString(),
      subscribedAt: new Date(r.subscribed_at).toISOString(),
    }));
  } catch {
    return [];
  }
}
