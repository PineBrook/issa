'use client';

import React from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  HeartPulse,
  Hospital,
  MapPin,
  Network,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import type { ProgramContentData } from '@/lib/site-cms-types';

export default function HealthcareInitiativeView({ program }: { program?: ProgramContentData }) {
  const title = program?.title || 'Care that reaches';
  const subtitle = program?.subtitle || 'to the last mile.';
  const badge = program?.badge || 'Healthcare initiative';
  const heroImage = program?.heroImage || '/isssa-healthcare-program-v2.png';
  const overviewP1 =
    program?.overviewP1 ||
    'Access to quality healthcare should not depend on geography. In remote Himalayan villages, geographical distance and lack of specialist medical staff pose severe barriers to timely treatment. ISSA Foundation collaborates with local health authorities to bridge this divide.';
  const overviewP2 =
    program?.overviewP2 ||
    'By equipping community hospitals, deploying mobile diagnostic clinics, and facilitating specialist teleconsultations, we ensure comprehensive primary and specialized medical care reaches the most isolated hill communities.';
  const vision =
    program?.vision ||
    'Accessible, dependable, and high-standard healthcare for every mountain community in Uttarakhand.';
  const mission =
    program?.mission ||
    'Deliver life-saving medical equipment, organize specialty health camps, and support rural hospitals to drastically reduce healthcare travel burdens.';

  const programmes = program?.programmes?.length
    ? program.programmes
    : [
        {
          title: 'UttaraCare Hospital',
          description:
            'Established in Pauri Garhwal, UttaraCare is the main hospital supporting the network, providing specialist consultations, inpatient care, diagnostics, and referrals for rural health centres.',
        },
        {
          title: 'Bironkhal Rural Health Hub',
          description:
            'The first Rural Health Hub in ISSA network, bringing outpatient consultations, diagnostics, pharmacy, laboratory services, day-care procedures, telemedicine, follow-up, and referrals closer to remote communities.',
        },
        {
          title: 'Mobile Healthcare',
          description:
            'Mobile medical units extend care beyond the clinic through weekly village visits, preventive camps, basic diagnostics, sample collection, medicine delivery, emergency support, and health education.',
        },
        {
          title: 'Digital Healthcare',
          description:
            'Tele-consultation, electronic health records, digital diagnostic reports, patient monitoring, clinical analytics, and referral coordination connect rural patients with the care they need.',
        },
      ];

  const stats = program?.stats?.length
    ? program.stats
    : [
        { value: '20+', label: 'Hospital beds equipped with advanced monitors' },
        { value: '1,200+', label: 'Patients treated in high-altitude communities' },
        { value: '72%', label: 'Reduction in travel distance for routine diagnostics' },
      ];

  const roadmap = program?.roadmap?.length
    ? program.roadmap
    : [
        'Additional Rural Health Hubs',
        'Village Health Centres',
        'More Mobile Medical Units',
        'Specialist Outreach Clinics',
        'Digital Health Platform',
        'AI-assisted Community Health Monitoring',
      ];

  const approachTitle = program?.approachTitle || 'Multi-Tier Healthcare Infrastructure';
  const approachDesc = program?.approachDesc || 'Bringing hospital care, mobile medical clinics, and digital consultations together.';

  return (
    <main id="healthcare-initiative" className="bg-neutral-50 font-sans text-neutral-800">
      <section className="relative overflow-hidden bg-primary py-20 text-white sm:py-28">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{badge}</p>
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-6xl">
              {title} <span className="italic font-normal text-accent">{subtitle}</span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-neutral-300">
              Connecting remote mountain communities with clinical diagnostics, specialist doctors, and essential healthcare infrastructure.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Overview</p>
          <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">Bridging the Healthcare Divide</h2>
          <p className="leading-8 text-neutral-600">{overviewP1}</p>
          <p className="leading-8 text-neutral-600">{overviewP2}</p>
        </div>

        <div className="space-y-5">
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200 rounded-2xl shadow-md">
            <Image src={heroImage} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 35vw" unoptimized />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div className="border-t-4 border-accent bg-white p-7 shadow-sm rounded-xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">Vision</p>
              <p className="font-serif text-xl leading-8 text-primary">{vision}</p>
            </div>
            <div className="border-t-4 border-primary bg-white p-7 shadow-sm rounded-xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">Mission</p>
              <p className="font-serif text-xl leading-8 text-primary">{mission}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Connected Network</p>
          <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">{approachTitle}</h2>
          <p className="leading-7 text-neutral-600">{approachDesc}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {programmes.map((p) => (
            <article key={p.title} className="group border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-accent hover:shadow-md rounded-2xl">
              <div className="mb-5 flex h-11 w-11 items-center justify-center bg-accent/20 text-primary rounded-xl">
                <Hospital className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mb-3 font-serif text-xl font-bold text-primary">{p.title}</h3>
              <p className="text-sm leading-7 text-neutral-600">{p.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="border-l-4 border-accent bg-white p-8 shadow-sm sm:p-10 rounded-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Impact so far</p>
          <h2 className="mb-6 font-serif text-3xl font-bold text-primary">Measurable Healthcare Reach</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {stats.map((s, idx) => (
              <div key={idx}>
                <p className="font-serif text-4xl font-bold text-primary">{s.value}</p>
                <p className="mt-1 text-sm text-neutral-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-3"><Activity className="h-5 w-5 text-accent" aria-hidden="true" /><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Roadmap</p></div>
          <h2 className="font-serif text-3xl font-bold text-primary">Expansion Roadmap</h2>
          <div className="space-y-4">
            {roadmap.map((item, index) => (
              <div key={item} className="flex gap-4 border-b border-neutral-200 pb-4">
                <span className="font-serif text-xl font-bold text-accent">0{index + 1}</span>
                <p className="pt-1 text-sm leading-7 text-neutral-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
