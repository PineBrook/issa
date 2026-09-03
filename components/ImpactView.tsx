'use client';

import React from 'react';
import Link from 'next/link';
import BlurImage from './BlurImage';
import { Award, CheckCircle, BarChart3, TrendingUp } from 'lucide-react';
import type { BlogPost } from '@/lib/blog-types';
import type { ImpactContentData } from '@/lib/site-cms-types';

export default function ImpactView({
  stories,
  impactContent,
}: {
  stories: BlogPost[];
  impactContent?: ImpactContentData;
}) {
  const [activeStoryIdx, setActiveStoryIdx] = React.useState(0);

  const hero = impactContent?.hero || {
    eyebrow: 'Measured Progress',
    title: 'Transforming Lives.',
    highlight: 'One Village At A Time.',
    description:
      'We focus on measurable outputs. Our financial allocations and community programs are audited periodically to maintain rigorous performance ratios.',
  };

  const featuredImpacts = impactContent?.metrics || [
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
  ];

  const milestones = impactContent?.milestones || {
    eyebrow: 'Metrics Trend',
    title: 'Sustained Growth in Student Competency',
    desc: 'Independent assessment of rural primary and secondary students adopted into our CIAS digital classrooms showing competency increases over three school terms.',
    bars: [
      { label: 'Pre-Adoption', value: 35, color: 'primary' },
      { label: 'Term 1 (CIAS)', value: 60, color: 'rust' },
      { label: 'Term 2 (CIAS)', value: 88, color: 'accent' },
    ],
  };

  const activeStory = stories[activeStoryIdx] ?? stories[0];

  return (
    <div className="pb-24 bg-neutral-50 font-sans" id="impact-view">
      {/* HERO SECTION */}
      <section className="bg-teal-brand text-white pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#E8B94C_1px,transparent_1px)] [background-size:24px_24px]" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-wider text-accent font-sans font-bold">{hero.eyebrow}</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">
              {hero.title} <br />
              <span className="italic font-normal text-accent">{hero.highlight}</span>
            </h1>
            <p className="text-neutral-200 text-base sm:text-lg max-w-xl leading-relaxed font-normal">
              {hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* METRIC CARD QUAD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" id="impact-metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredImpacts.map((imp, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-wider text-neutral-600 font-sans font-bold block">{imp.title}</span>
                <p className="text-5xl sm:text-6xl font-serif font-bold text-primary tracking-tight">{imp.metric}</p>
                <h3 className="text-lg font-bold text-neutral-900 font-serif">{imp.sub}</h3>
                <p className="text-sm text-neutral-700 leading-relaxed font-sans">{imp.details}</p>
              </div>
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs text-primary uppercase font-sans tracking-wider font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-rust" /> {imp.verifiedText || 'Direct Impact Verified'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE GRAPHICAL OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24" id="impact-milestones">
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Chart Content on Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-wider text-primary font-sans font-bold">{milestones.eyebrow}</p>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary">{milestones.title}</h3>
              <p className="text-sm text-neutral-700 leading-relaxed max-w-lg font-sans">
                {milestones.desc}
              </p>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="pt-4 bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
              <div className="flex items-end justify-between h-48 gap-4 pt-4 border-b border-neutral-200">
                {milestones.bars.map((bar, idx) => (
                  <div key={idx} className="flex-1 h-full flex flex-col items-center justify-end gap-2">
                    <div className="w-full transition-all rounded-t-lg relative group" style={{ height: `${bar.value}%` }}>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-sans text-neutral-700 font-bold">{bar.value}%</span>
                      <div className={`absolute inset-x-0 bottom-0 ${idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-rust' : 'bg-accent'} h-full rounded-t-md`}></div>
                    </div>
                    <span className="text-xs font-sans uppercase tracking-wider text-neutral-600 font-semibold mt-1 text-center truncate w-full" title={bar.label}>
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Stats list on Right */}
          <div className="lg:col-span-5 space-y-8" id="impact-highlights">
            <span className="text-sm uppercase tracking-wider text-neutral-700 block border-b border-neutral-100 pb-2 font-sans font-bold">Key Highlights</span>

            <div className="space-y-6">
              {impactContent?.highlights && impactContent.highlights.length > 0 ? (
                impactContent.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-primary shrink-0">
                      {i % 2 === 0 ? <Award className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-primary">{h.title}</h4>
                      <p className="text-sm text-neutral-700 leading-relaxed mt-1 font-sans">{h.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-primary shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-primary">3+ Edtech Village Labs</h4>
                      <p className="text-sm text-neutral-700 leading-relaxed mt-1 font-sans">Computers and digital learning equipment maintained by trained local administrators.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-primary shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-primary">Zero Administrative Overhead</h4>
                      <p className="text-sm text-neutral-700 leading-relaxed mt-1 font-sans">100% of designated public contributions flow directly into verified ground intervention programs.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIARY STORY SPOTLIGHT */}
      {activeStory && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24" id="impact-spotlight">
          <div className="bg-primary-dark rounded-3xl p-8 sm:p-12 text-white grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-[16/11] rounded-2xl overflow-hidden shadow-xl">
              <BlurImage
                src={activeStory.coverImagePath || '/isssa-school-community-v2.png'}
                alt={activeStory.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-accent bg-white/10 px-3 py-1 rounded-full">
                {activeStory.category} Spotlight
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-snug">
                {activeStory.title}
              </h3>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
                {activeStory.excerpt}
              </p>
              <div className="pt-2">
                <Link
                  href={`/stories#story-${activeStory.slug}`}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-primary px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Read Full Case Story
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
