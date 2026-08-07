'use client';

import React from 'react';
import {
  ArrowRight,
  Award,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Compass,
  Cpu,
  Globe2,
  Handshake,
  Layers,
  Lightbulb,
  LineChart,
  MapPin,
  Megaphone,
  PiggyBank,
  Rocket,
  ShieldCheck,
  Sprout,
  Store,
  TrendingUp,
  Users,
  Utensils,
  Zap,
} from 'lucide-react';
import Image from 'next/image';

// Districts covered in current EDP cohort
const edpDistricts = [
  { name: 'Pauri Garhwal', region: 'Garhwal Hills', note: 'E-learning, agriculture & rural homestays' },
  { name: 'Tehri Garhwal', region: 'Garhwal Hills', note: 'Organic horticulture & handloom crafts' },
  { name: 'Rudraprayag', region: 'High Altitude', note: 'Herbal processing & eco-tourism' },
  { name: 'Uttarkashi', region: 'High Altitude', note: 'Traditional foods & apple value addition' },
  { name: 'Dehradun', region: 'Valley & Tech Hub', note: 'Digital enterprise & service innovation' },
  { name: 'Haridwar', region: 'Plains & Manufacturing', note: 'Food processing & micro-manufacturing' },
];

// 10 Business Sectors Supported
const edpSectors = [
  {
    icon: Utensils,
    title: 'Food Processing & Value Addition',
    desc: 'Transforming raw hill produce into market-ready packaged goods with enhanced shelf life.',
  },
  {
    icon: Sprout,
    title: 'Organic & Herbal Products',
    desc: 'Leveraging Uttarakhand’s pristine biodiversity for certified organic & wellness lines.',
  },
  {
    icon: Globe2,
    title: 'Agriculture & Horticulture',
    desc: 'Boosting farm-gate incomes through sustainable cultivation and modern post-harvest tech.',
  },
  {
    icon: Users,
    title: 'Women’s Enterprises',
    desc: 'Fostering financial independence through women-led self-help groups and artisanal collectives.',
  },
  {
    icon: Store,
    title: 'Traditional Foods & Local Products',
    desc: 'Preserving indigenous culinary heritage while introducing modern branding and packaging.',
  },
  {
    icon: Building2,
    title: 'Manufacturing',
    desc: 'Supporting micro-manufacturing units to upgrade machinery, quality controls, and capacity.',
  },
  {
    icon: Compass,
    title: 'Tourism & Homestays',
    desc: 'Empowering local homestay hosts and eco-tour guides to deliver authentic Himalayan experiences.',
  },
  {
    icon: Briefcase,
    title: 'Service-Based Businesses',
    desc: 'Backing essential community services, logistics, and repair networks across hill towns.',
  },
  {
    icon: Cpu,
    title: 'Digital & Tech-Enabled Enterprises',
    desc: 'Equipping youth to launch tech services, e-commerce stores, and digital marketing agencies.',
  },
  {
    icon: Zap,
    title: 'Rural Innovation',
    desc: 'Nurturing grassroots inventions that solve local challenges in water, energy, and farming.',
  },
];

// 7-Step Entrepreneur Journey
const edpSteps = [
  {
    num: '01',
    title: 'Application & Business Profiling',
    desc: 'Understanding the entrepreneur, business idea, vision, and growth potential.',
  },
  {
    num: '02',
    title: 'Expert Evaluation',
    desc: 'Business experts assess innovation, sustainability, scalability, and market readiness.',
  },
  {
    num: '03',
    title: 'Due Diligence',
    desc: 'Verification of business information and readiness for program onboarding.',
  },
  {
    num: '04',
    title: 'Entrepreneur Onboarding',
    desc: 'Selected entrepreneurs formally become part of the ISSA Entrepreneurship Network.',
  },
  {
    num: '05',
    title: 'Mentorship & Capacity Building',
    desc: 'Entrepreneurs receive structured mentoring, business guidance, technical support, and leadership development.',
  },
  {
    num: '06',
    title: 'Financial Assistance',
    desc: 'Eligible businesses receive structured financial support linked with business growth and responsible utilization.',
  },
  {
    num: '07',
    title: 'Continuous Growth Support',
    desc: 'Regular reviews, mentoring sessions, business monitoring, networking, and strategic guidance to scale sustainably.',
  },
];

// 4 Pillars of Support
const supportPillars = [
  {
    title: 'Business Development',
    icon: Briefcase,
    color: '#E06D3B', // Terracotta Rust
    points: [
      'Business Planning & Strategy',
      'Growth Strategy & Scaling Roadmaps',
      'Financial Planning & Cash Flow Modeling',
      'Business Model Refinement',
      'Compliance & Legal Guidance',
    ],
  },
  {
    title: 'Technology & Digital Enablement',
    icon: Cpu,
    color: '#38BDF8', // Sky Blue
    points: [
      'Branding & Visual Identity',
      'Custom Website & E-commerce Development',
      'Digital Marketing & Customer Acquisition',
      'Social Media Strategy & Content Creation',
      'Business Automation & Tech Adoption',
    ],
  },
  {
    title: 'Customer and Buyer Connections',
    icon: Megaphone,
    color: '#E8B94C', // Marigold Gold
    points: [
      'Customer Networks & Buyer Introductions',
      'B2B & Retail Business Partnerships',
      'Industry Connections & Mentorship Access',
      'Trade Fairs & Market Exposure',
      'Promotional Platforms & Exhibition Support',
    ],
  },
  {
    title: 'Funding and Financial Guidance',
    icon: PiggyBank,
    color: '#10B981', // Emerald
    points: [
      'Responsible Financial Assistance',
      'Patient Capital & Soft Loan Structure',
      'Performance-Based Growth Guidance',
      'Financial Advisory & Capital Readiness',
      'Continuous Monitoring & Accountability',
    ],
  },
];

// Impact Outcomes
const impactOutcomes = [
  'Creating sustainable local employment',
  'Supporting women-led enterprises',
  'Promoting rural entrepreneurship',
  'Encouraging value addition to local products',
  'Strengthening agriculture and allied businesses',
  'Increasing digital adoption among entrepreneurs',
  'Expanding market access for rural enterprises',
  'Building financially sustainable businesses',
  'Reducing migration by creating opportunities closer to home',
  'Strengthening Uttarakhand’s local economy',
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-rust font-sans">{children}</p>;
}

function ActionLink({ href, children, dark = false }: { href: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition-all hover:-translate-y-0.5 cursor-pointer ${
        dark
          ? 'bg-accent text-primary hover:bg-accent-dark shadow-md'
          : 'border border-white/25 text-white hover:border-accent hover:text-accent bg-white/5 hover:bg-white/10'
      }`}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

export default function EntrepreneurshipInitiativeView() {
  return (
    <section id="entrepreneurship-initiative" className="bg-neutral-50 font-sans text-neutral-800">
      {/* HERO SECTION */}
      <header className="relative overflow-hidden bg-primary-dark text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8B94C_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-28 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Entrepreneurship Development Program (EDP)
            </h1>
            <p className="text-xl font-serif text-accent font-medium leading-snug">
              Creating Entrepreneurs. Generating Employment. Building a Self-Reliant Uttarakhand.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-neutral-300 font-sans max-w-2xl">
              The ISSA Foundation EDP is a flagship initiative designed to identify, mentor, and support aspiring and existing entrepreneurs across Uttarakhand. Our mission is to transform innovative ideas and local skills into sustainable enterprises that generate employment, strengthen local economies, and improve livelihoods.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <ActionLink href="#apply-edp" dark>
                Apply to EDP
              </ActionLink>
              <ActionLink href="#edp-journey">Explore 7-Step Journey</ActionLink>
              <ActionLink href="#partner-edp">Partner With Us</ActionLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl p-8 border border-white/15 shadow-2xl space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center">
                <Lightbulb className="w-6 h-6" />
              </div>
              <blockquote className="text-base sm:text-lg font-serif italic text-white leading-relaxed border-l-2 border-accent pl-4">
                &ldquo;Employment is not created only by offering jobs—it is created by empowering individuals to become entrepreneurs who build businesses, create opportunities, and inspire others.&rdquo;
              </blockquote>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                Rather than offering one-time financial assistance, ISSA has built an integrated support ecosystem that nurtures entrepreneurs throughout their business journey—from idea validation to growth and expansion.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* SUGGESTED HOMEPAGE IMPACT COUNTERS / TILES BAR */}
      <div className="border-b border-neutral-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200">
            <div className="text-center pt-2 sm:pt-0 sm:px-2">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-primary">20+</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-sans">
                Entrepreneurs Supported
              </p>
            </div>
            <div className="text-center pt-2 sm:pt-0 sm:px-2">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-primary">6</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-sans">
                Districts Covered
              </p>
            </div>
            <div className="text-center pt-2 sm:pt-0 sm:px-2">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-primary">10+</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-sans">
                Sectors Supported
              </p>
            </div>
            <div className="text-center pt-2 sm:pt-0 sm:px-2">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-primary">100+</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-sans">
                Jobs Targeted
              </p>
            </div>
            <div className="text-center pt-2 sm:pt-0 sm:px-2">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-primary">100%</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-sans">
                Structured Mentorship
              </p>
            </div>
            <div className="text-center pt-2 sm:pt-0 sm:px-2">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-rust">1 Mission</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-sans">
                Sustainable Livelihoods
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* WHY THIS INITIATIVE */}
        <section className="grid gap-12 lg:grid-cols-12 items-center" id="why-edp">
          <div className="lg:col-span-5 space-y-4">
            <SectionLabel>Why This Initiative?</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-primary">
              Bridging the gap between passion and business success.
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-neutral-600">
              Many talented individuals across Uttarakhand possess the passion and capability to build successful businesses but often lack access to mentoring, technical guidance, market opportunities, financial resources, and professional networks.
            </p>
          </div>
          <div className="relative min-h-64 overflow-hidden rounded-2xl bg-neutral-200 lg:col-span-3">
            <Image src="/isssa-entrepreneurship-program-v2.png" alt="Young entrepreneurs learning digital business skills with an ISSA mentor" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 25vw" />
          </div>
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-primary">
              Building Sustainable Enterprises in Himalayan Communities
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              The ISSA Entrepreneurship Development Program bridges this gap by providing structured support that enables entrepreneurs to build sustainable enterprises capable of creating long-term employment within their communities.
            </p>
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rust text-white flex items-center justify-center shrink-0 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-rust font-sans leading-relaxed">
                <strong>Core Belief:</strong> By strengthening entrepreneurs, we strengthen families, mountain villages, and the entire regional economy of Uttarakhand.
              </p>
            </div>
          </div>
        </section>

        {/* 6 DISTRICTS COVERED */}
        <section id="edp-districts" className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <SectionLabel>Where We Work</SectionLabel>
              <h2 className="mt-2 font-serif text-3xl font-bold text-primary">6 Districts Covered in Current Cohort</h2>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm">
              Supporting rural, semi-urban, and high-altitude mountain enterprises across diverse topographies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {edpDistricts.map((district) => (
              <div
                key={district.name}
                className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-primary/40 transition-all shadow-sm hover:shadow-md flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary">{district.name}</h3>
                  <p className="text-[11px] font-semibold text-rust uppercase tracking-wider mt-0.5">
                    {district.region}
                  </p>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{district.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SUPPORTING DIVERSE BUSINESS SECTORS */}
        <section id="edp-sectors" className="space-y-8">
          <div>
            <SectionLabel>Portfolio Diversity</SectionLabel>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-primary">
              Supporting 10+ Diverse Business Sectors
            </h2>
            <p className="mt-3 text-sm text-neutral-600 max-w-2xl leading-relaxed">
              This diverse portfolio promotes balanced economic growth while leveraging the unique geographic and cultural strengths of Uttarakhand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {edpSectors.map((sector) => {
              const IconComp = sector.icon;
              return (
                <div
                  key={sector.title}
                  className="bg-white rounded-2xl p-5 border border-neutral-200 hover:border-accent transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-primary flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-base font-bold text-primary leading-snug">{sector.title}</h3>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{sector.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* OUR ENTREPRENEUR JOURNEY (7 STEPS) */}
        <section id="edp-journey" className="bg-primary text-white rounded-3xl p-8 sm:p-12 space-y-12 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-accent font-bold">The 7-Step Roadmap</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">Our Entrepreneur Journey</h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Every entrepreneur follows a structured growth journey designed to maximize business success from initial idea validation to long-term scaling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {edpSteps.map((step) => (
              <div
                key={step.num}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col justify-between space-y-4 hover:bg-white/15 transition-all"
              >
                <div>
                  <span className="text-2xl font-serif font-bold text-accent">{step.num}</span>
                  <h3 className="mt-2 font-serif text-sm font-bold text-white leading-snug">{step.title}</h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW WE SUPPORT ENTREPRENEURS (4 SUPPORT PILLARS) */}
        <section id="edp-support" className="space-y-8">
          <div>
            <SectionLabel>Integrated Ecosystem</SectionLabel>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-primary">
              How We Support Entrepreneurs
            </h2>
            <p className="mt-3 text-sm text-neutral-600 max-w-2xl leading-relaxed">
              Practical support across four areas that help businesses grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {supportPillars.map((pillar) => {
              const PillarIcon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm hover:shadow-md transition-all space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: pillar.color }}
                    >
                      <PillarIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-primary">{pillar.title}</h3>
                  </div>

                  <ul className="space-y-3 border-t border-neutral-100 pt-4">
                    {pillar.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-700 font-sans">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* THE IMPACT WE ARE CREATING */}
        <section id="edp-impact" className="bg-neutral-100 rounded-3xl p-8 sm:p-12 border border-neutral-200/80 space-y-8">
          <div className="max-w-3xl space-y-3">
            <SectionLabel>Creating Real Change</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">The Impact We Are Creating</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Our objective is not only to support businesses—but to build an entrepreneurial ecosystem that creates employment and transforms communities across Uttarakhand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {impactOutcomes.map((item, idx) => (
              <div
                key={item}
                className="bg-white rounded-2xl p-4 border border-neutral-200 flex items-center gap-3.5 shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xs">
                  ✓
                </div>
                <span className="text-xs sm:text-sm font-semibold text-neutral-800 font-sans">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* BEYOND FUNDING & OUR VISION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="edp-vision">
          <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <SectionLabel>Beyond Funding</SectionLabel>
              <h3 className="font-serif text-2xl font-bold text-primary">Building Future Business Leaders</h3>
              <p className="text-sm leading-relaxed text-neutral-600">
                Financial assistance alone cannot create successful enterprises. Every entrepreneur in the ISSA Entrepreneurship Development Program receives ongoing mentorship, strategic guidance, technology support, business reviews, and continuous engagement to help overcome challenges and unlock new growth opportunities.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-100 text-xs font-semibold text-primary font-sans">
              &bull; Our relationship with entrepreneurs begins at onboarding—it does not end there.
            </div>
          </div>

          <div className="lg:col-span-6 bg-primary text-white rounded-3xl p-8 shadow-md space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-accent font-bold">Our Vision</span>
              <h3 className="font-serif text-2xl font-bold">Self-Reliant Himalayan Communities</h3>
              <p className="text-sm leading-relaxed text-neutral-200">
                We envision an entrepreneurial ecosystem where every aspiring entrepreneur in Uttarakhand has access to the knowledge, mentorship, technology, and opportunities needed to build a successful enterprise.
              </p>
            </div>
            <p className="text-xs italic text-accent border-t border-white/20 pt-4">
              Through collaborative partnerships, innovation, and continuous support, ISSA Foundation is committed to developing enterprises that create employment and long-term regional prosperity.
            </p>
          </div>
        </section>
      </main>

      {/* JOIN THE MOVEMENT CTA */}
      <section className="bg-primary-dark text-white py-20" id="apply-edp">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <SectionLabel>Join the Movement</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold">
              Building a stronger, more self-reliant Uttarakhand.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              At ISSA Foundation, we are proud to partner with entrepreneurs who share the vision of building a stronger Uttarakhand—one enterprise at a time.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <a
              href="mailto:career.issafoundation@gmail.com?subject=EDP%20Entrepreneur%20Application"
              className="group rounded-2xl border border-white/15 bg-white/5 p-6 transition-all hover:border-accent hover:bg-white/10"
            >
              <Rocket className="h-6 w-6 text-accent" />
              <h3 className="mt-4 font-serif text-lg font-bold">Apply as Entrepreneur</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-300">
                Are you an aspiring or existing entrepreneur in Uttarakhand? Submit your business profile to join our upcoming cohort.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-accent">
                Apply to EDP <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>

            <a
              href="mailto:career.issafoundation@gmail.com?subject=EDP%20Partnership"
              className="group rounded-2xl border border-white/15 bg-white/5 p-6 transition-all hover:border-accent hover:bg-white/10"
            >
              <Handshake className="h-6 w-6 text-accent" />
              <h3 className="mt-4 font-serif text-lg font-bold">Become a Partner</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-300">
                Partner across government, corporate, academic, technology, and market channels to support rural entrepreneurs.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-accent">
                Partner with ISSA <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>

            <a
              href="mailto:career.issafoundation@gmail.com?subject=EDP%20Mentor%20Network"
              className="group rounded-2xl border border-white/15 bg-white/5 p-6 transition-all hover:border-accent hover:bg-white/10"
            >
              <Users className="h-6 w-6 text-accent" />
              <h3 className="mt-4 font-serif text-lg font-bold">Join Mentor Network</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-300">
                Share your expertise as an industry specialist, domain expert, or experienced business leader.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-accent">
                Become a Mentor <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>

            <a
              href="mailto:career.issafoundation@gmail.com?subject=EDP%20Support%20Enquiry"
              className="group rounded-2xl border border-white/15 bg-white/5 p-6 transition-all hover:border-accent hover:bg-white/10"
            >
              <PiggyBank className="h-6 w-6 text-accent" />
              <h3 className="mt-4 font-serif text-lg font-bold">Support & Fund</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-300">
                Contribute capital, technology enablement, equipment, market access, or training infrastructure.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-accent" id="partner-edp">
                Contribute Support <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          </div>

          <p className="text-xs text-neutral-400 border-t border-white/15 pt-6">
            To apply, partner, mentor, or support EDP, reach out directly to{' '}
            <a href="mailto:career.issafoundation@gmail.com" className="text-accent underline">
              career.issafoundation@gmail.com
            </a>{' '}
            with your background and expression of interest.
          </p>
        </div>
      </section>
    </section>
  );
}
