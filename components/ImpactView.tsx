'use client';

import React from 'react';
import BlurImage from './BlurImage';
import { Award, ShieldAlert, CheckCircle, BarChart3, TrendingUp, HelpCircle, FileSpreadsheet, ArrowUpRight } from 'lucide-react';

export default function ImpactView() {
  const [activeStoryIdx, setActiveStoryIdx] = React.useState(0);

  const featuredImpacts = [
    {
      title: 'EduTech Infrastructure',
      metric: '84%',
      sub: 'Student Attendance Surge',
      details: 'Evaluations indicate that smart classroom installations led to a direct 84% rise in consistent rural high school attendance rates.'
    },
    {
      title: 'Healthcare Coverage',
      metric: '72%',
      sub: 'Reduced Travel Burdens',
      details: 'By deploying local mobile camp vans, over 72% of critical dental/diagnostic patients were saved from traveling 60+ km to cities.'
    },
    {
      title: 'IEDP Entrepreneurship',
      metric: '20+',
      sub: 'Entrepreneurs Supported',
      details: 'Mentoring, technology support, and market connections across 6 districts and 10+ sectors, targeting 100+ local employment opportunities.'
    },
    {
      title: 'Accountability Model',
      metric: '100%',
      sub: 'Direct Aid Sourcing',
      details: 'All purchases, classroom equipment, and doctor salaries are routed directly with no intermediary layers, assuring 100% budget efficacy.'
    }
  ];

  const storiesOfTheMonth = [
    {
      title: "A New Vision: Meera's Journey to Sight",
      village: "Mana Outskirts",
      quote: "I thought my blurry vision was just a side effect of growing old in the hills. ISSA's medical van proved me wrong and gifted my needlework back.",
      narrative: "Meera, a 64-year-old traditional shawl weaver in high-altitude Mana, started losing her vision in 2022. Due to the high cost of traveling to Dehradun, she discontinued her craft. During our December Himalayan Mobile Camp, a specialist diagnostician diagnosed her cataracts. Two weeks later, she underwent completely free surgery funded directly by ISSA. Today, she is back to training young village girls in handloom weaving.",
      image: "/isssa-healthcare-program-v2.png"
    },
    {
      title: "A Class of Her Own: Renu's Academic Ascent",
      village: "Pauri School Cluster",
      quote: "Seeing a computer for the first time changed how I study. Now I want to become a software engineer right here in the hills.",
      narrative: "Renu, an eighth-grade student at Pauri Government High School, had never experienced interactive smart learning. After ISSA's CIAS schools initiative adopted her classroom and provided satellite internet connection, she scored 94% on the regional mathematics board assessments, top among her peer cluster. She now leads the village student computer circle every Saturday afternoon.",
      image: "/isssa-education-program-v2.png"
    }
  ];

  return (
    <div className="pb-24 bg-neutral-50 font-sans" id="impact-view">
      {/* HERO SECTION */}
      <section className="bg-teal-brand text-white pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#E8B94C_1px,transparent_1px)] [background-size:24px_24px]" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-wider text-accent font-sans font-bold">Measured Progress</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">
              Transforming Lives. <br />
              <span className="italic font-normal text-accent">One Village At A Time.</span>
            </h1>
            <p className="text-neutral-200 text-base sm:text-lg max-w-xl leading-relaxed font-normal">
              We focus on measurable outputs. Our financial allocations and community programs are audited periodically to maintain rigorous performance ratios.
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
                  <CheckCircle className="w-4 h-4 text-rust" /> Direct Impact Verified
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
              <p className="text-sm uppercase tracking-wider text-primary font-sans font-bold">Metrics Trend</p>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Sustained Growth in Student Competency</h3>
              <p className="text-sm text-neutral-700 leading-relaxed max-w-lg font-sans">
                Independent assessment of rural primary and secondary students adopted into our CIAS digital classrooms showing competency increases over three school terms.
              </p>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="pt-4 bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
              <div className="flex items-end justify-between h-48 gap-4 pt-4 border-b border-neutral-200">
                {/* Bar 1 */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-neutral-200 hover:bg-neutral-300 transition-all rounded-t-lg relative group h-[35%]">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-sans text-neutral-700 font-bold">35%</span>
                    <div className="absolute inset-x-0 bottom-0 bg-primary h-[85%] rounded-t-md"></div>
                  </div>
                  <span className="text-xs font-sans uppercase tracking-wider text-neutral-600 font-semibold mt-1">Pre-Adoption</span>
                </div>
                {/* Bar 2 */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-neutral-200 hover:bg-neutral-300 transition-all rounded-t-lg relative group h-[60%]">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-sans text-neutral-700 font-bold">60%</span>
                    <div className="absolute inset-x-0 bottom-0 bg-rust h-[85%] rounded-t-md"></div>
                  </div>
                  <span className="text-xs font-sans uppercase tracking-wider text-neutral-600 font-semibold mt-1">Term 1 (CIAS)</span>
                </div>
                {/* Bar 3 */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-neutral-200 hover:bg-neutral-300 transition-all rounded-t-lg relative group h-[88%]">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-sans text-neutral-700 font-bold">88%</span>
                    <div className="absolute inset-x-0 bottom-0 bg-accent h-full rounded-t-md"></div>
                  </div>
                  <span className="text-xs font-sans uppercase tracking-wider text-neutral-600 font-semibold mt-1">Term 2 (CIAS)</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 text-xs text-neutral-600 font-sans font-medium">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary rounded-full inline-block"></span> Basic Computer literacy</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-rust rounded-full inline-block"></span> Advanced Logical Coding</span>
              </div>
            </div>
          </div>

          {/* Core Stats list on Right */}
          <div className="lg:col-span-5 space-y-8" id="impact-highlights">
            <span className="text-sm uppercase tracking-wider text-neutral-700 block border-b border-neutral-100 pb-2 font-sans font-bold">Key Highlights</span>

            <div className="space-y-6">
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
                  <h4 className="text-base font-bold text-primary">15k+ Lives Impacted</h4>
                  <p className="text-sm text-neutral-700 leading-relaxed mt-1 font-sans">Direct access to diagnostic checks, secondary classes, or technical certificate modules.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-primary shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-primary">100% Transparency Audit</h4>
                  <p className="text-sm text-neutral-700 leading-relaxed mt-1 font-sans">We publish annual program audits detailing precisely how donations support our operational clusters.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24" id="impact-story-month">
        <div className="space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary">Stories from ISSA</h2>
        </div>

        <div className="bg-[#0D311F] text-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left: Interactive Tabs & Quote */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex gap-2 bg-white/10 p-1.5 rounded-full max-w-sm">
                {storiesOfTheMonth.map((st, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStoryIdx(idx)}
                    className={`flex-1 py-2 text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                      activeStoryIdx === idx
                        ? 'bg-accent text-primary'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    {st.village}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-accent leading-snug">
                  {storiesOfTheMonth[activeStoryIdx].title}
                </h3>
                <blockquote className="border-l-2 border-accent pl-4 text-lg italic text-neutral-200 font-serif font-normal">
                  &ldquo;{storiesOfTheMonth[activeStoryIdx].quote}&rdquo;
                </blockquote>
                <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-sans">
                  {storiesOfTheMonth[activeStoryIdx].narrative}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-sans text-neutral-300 uppercase tracking-wider font-semibold">Featured Himalayan Journal</span>
              <button 
                onClick={() => alert(`Sustained community programs are completely funded by donors and managed locally by ISSA partners. Thank you for your support.`)}
                className="bg-accent hover:bg-accent-dark text-primary px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                Learn More
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5 relative min-h-[300px]">
            <BlurImage 
              src={storiesOfTheMonth[activeStoryIdx].image} 
              alt={storiesOfTheMonth[activeStoryIdx].title} 
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
