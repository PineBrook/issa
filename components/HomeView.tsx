'use client';

import React from 'react';
import Link from 'next/link';
import BlurImage from './BlurImage';
import { ArrowRight, BookOpen, Stethoscope, Briefcase, Cpu, CheckCircle2, Calendar, Compass } from 'lucide-react';
import HeroSlideshow, { HERO_SLIDES, type HeroSlide } from './HeroSlideshow';
import type { BlogPost } from '@/lib/blog-types';
import type { HeroSlideItem, HomeSectionsData, SiteSettings } from '@/lib/site-cms-types';
import { submitContactAction } from '@/app/forms/actions';

export default function HomeView({
  stories,
  heroSlides,
  homeSections,
  settings,
}: {
  stories: BlogPost[];
  heroSlides?: HeroSlideItem[];
  homeSections?: HomeSectionsData;
  settings?: SiteSettings;
}) {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [isHeroPaused, setIsHeroPaused] = React.useState(false);

  // Convert CMS hero slides to HeroSlide interface
  const formattedSlides: HeroSlide[] = React.useMemo(() => {
    if (heroSlides && heroSlides.length > 0) {
      return heroSlides.map((s) => ({
        id: s.slideKey,
        eyebrow: s.eyebrow,
        title: s.title,
        highlight: s.highlight,
        description: s.description,
        image: s.image,
        cta: { label: s.ctaLabel, href: s.ctaHref },
        donate: { label: s.donateLabel || 'Support Our Mission', href: s.donateHref || '/contact' },
      }));
    }
    return HERO_SLIDES;
  }, [heroSlides]);

  React.useEffect(() => {
    if (isHeroPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % formattedSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHeroPaused, formattedSlides.length]);

  const handleSelectSlide = (index: number) => {
    setActiveSlide(index);
  };

  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [formError, setFormError] = React.useState('');
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    const result = await submitContactAction(new FormData(e.currentTarget));
    if (result.success) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 5000);
    } else {
      setFormError(result.message);
    }
  };

  // Section data with default fallbacks
  const stats = homeSections?.stats || [
    { value: '11+', label: 'Schools Adopted', order: 1 },
    { value: '600+', label: 'Students Reached', order: 2 },
    { value: '20+', label: 'Hospital Beds', order: 3 },
    { value: '1,200+', label: 'Patients Cared For', order: 4 },
    { value: '20+', label: 'Entrepreneurs', order: 5 },
    { value: '6+', label: 'Districts', order: 6 },
  ];

  const philosophy = homeSections?.philosophy || {
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
  };

  const interventions = homeSections?.strategicInterventions || {
    heading: 'Targeted Work, Measurable Results',
    items: [
      { metric: '11+', desc: 'Smart boards and computers distributed across high-altitude government schools to improve classroom learning.' },
      { metric: '11+', desc: 'Specialist teachers appointed to mentor rural students and provide ongoing digital training.' },
      { metric: '20', desc: 'Hospital beds and high-tech equipment delivering critical, life-saving diagnostic care in Pauri Garhwal.' },
    ],
  };

  const collaborate = homeSections?.collaborate || {
    heading: 'Partner with us to Transform Lives',
    desc: 'Volunteer, partner, or support the work bringing lasting opportunity and structural development to remote communities in Uttarakhand.',
    phone: settings?.phone || '0135 430 8180',
    email: settings?.email || 'career.issafoundation@gmail.com',
  };

  return (
    <div className="bg-page" id="home-view">
      {/* 1. HERO SECTION */}
      <section className="relative w-full text-white bg-ink overflow-hidden" id="home-hero" aria-label="Homepage hero">
        <HeroSlideshow
          slides={formattedSlides}
          activeIndex={activeSlide}
          onSelect={handleSelectSlide}
          isPaused={isHeroPaused}
          onTogglePause={() => setIsHeroPaused(!isHeroPaused)}
        />
      </section>

      {/* 2. STATS STRIP */}
      <section className="bg-white border-b border-neutral-200" id="home-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            {stats.map((st, idx) => (
              <div key={idx} className="text-center pt-4 md:pt-0">
                <p className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">{st.value}</p>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-600 font-sans mt-2">
                  {st.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR PHILOSOPHY SECTION */}
      <section className="py-24 bg-white overflow-hidden" id="home-philosophy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative border border-neutral-200/80">
                <BlurImage 
                  src={philosophy.image}
                  alt={philosophy.imageAlt} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"></div>
              </div>
              <div className="absolute z-10 bottom-6 -right-6 md:-right-10 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-neutral-200/80 max-w-xs hidden sm:block">
                <p className="text-primary font-serif font-semibold text-base mb-1">{philosophy.badgeTitle}</p>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans">
                  {philosophy.badgeSub}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-tight">
                  {philosophy.heading}
                </h2>
              </div>

              <div className="space-y-6 text-neutral-700 leading-relaxed font-sans text-base sm:text-lg">
                <p>{philosophy.p1}</p>
                <p>{philosophy.p2}</p>
              </div>

              <div className="space-y-5 pt-4 border-t border-neutral-200">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-primary mt-1 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary">{philosophy.bullet1Title}</h3>
                    <p className="text-sm text-neutral-600 mt-0.5">{philosophy.bullet1Sub}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-primary mt-1 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary">{philosophy.bullet2Title}</h3>
                    <p className="text-sm text-neutral-600 mt-0.5">{philosophy.bullet2Sub}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link 
                  href={philosophy.ctaHref}
                  className="inline-flex items-center gap-2 text-primary hover:text-rust font-bold text-sm sm:text-base transition-colors group cursor-pointer"
                >
                  {philosophy.ctaLabel}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONNECTED IMPACT ECOSYSTEM SECTION */}
      <section className="py-20 bg-neutral-100 border-t border-b border-neutral-200" id="home-pillars">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">
              One Connected Ecosystem for Holistic Impact.
            </h2>
            <p className="text-neutral-700 text-base sm:text-lg max-w-6xl mx-auto leading-relaxed">
              Connecting Healthcare, Education, Entrepreneurship and Career Aspirations with Digital Inclusion to build a stronger Uttarakhand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Healthcare */}
            <div className="group bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-primary bg-accent px-3 py-1 rounded-full shadow-xs">Healthcare</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div className="space-y-2.5">
                  <h3 className="text-xl sm:text-[1.35rem] font-serif font-extrabold text-primary tracking-tight leading-snug group-hover:text-rust transition-colors">Care that reaches to last mile</h3>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans">
                    Connecting remote communities with specialist care, diagnostics and essential health services.
                  </p>
                </div>
              </div>
              <Link 
                href="/programs/healthcare" 
                className="text-xs sm:text-sm font-bold text-primary hover:text-rust transition-colors text-left pt-6 flex items-center gap-1 cursor-pointer"
              >
                DISCOVER HEALTHCARE <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* 2. Education */}
            <div className="group bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-primary bg-accent px-3 py-1 rounded-full shadow-xs">Education</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-2.5">
                  <h3 className="text-xl sm:text-[1.35rem] font-serif font-extrabold text-primary tracking-tight leading-snug group-hover:text-rust transition-colors">Smart learning for students</h3>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans">
                    Bringing quality education, teacher support and better learning opportunities to students across Uttarakhand.
                  </p>
                </div>
              </div>
              <Link 
                href="/programs/education" 
                className="text-xs sm:text-sm font-bold text-primary hover:text-rust transition-colors text-left pt-6 flex items-center gap-1 cursor-pointer"
              >
                DISCOVER EDUCATION <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* 3. Entrepreneurship */}
            <div className="group bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-primary bg-accent px-3 py-1 rounded-full shadow-xs">Entrepreneurship</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="space-y-2.5">
                  <h3 className="text-xl sm:text-[1.35rem] font-serif font-extrabold text-primary tracking-tight leading-snug group-hover:text-rust transition-colors">Growing local businesses, Creating local livelihoods.</h3>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans">
                    Supporting rural entrepreneurs with financial assistance, mentorship, technology and market access to build sustainable businesses.
                  </p>
                </div>
              </div>
              <Link 
                href="/programs/entrepreneurship" 
                className="text-xs sm:text-sm font-bold text-primary hover:text-rust transition-colors text-left pt-6 flex items-center gap-1 cursor-pointer"
              >
                DISCOVER EDP <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* 4. Career & Opportunities */}
            <div className="group bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-primary bg-accent px-3 py-1 rounded-full shadow-xs">Career & Opportunities</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-2.5">
                  <h3 className="text-xl sm:text-[1.35rem] font-serif font-extrabold text-primary tracking-tight leading-snug group-hover:text-rust transition-colors">Turning aspirations into opportunities.</h3>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans">
                    Enabling people across Uttarakhand prepare for careers, access employment opportunities and build sustainable futures.
                  </p>
                </div>
              </div>
              <Link 
                href="/careers" 
                className="text-xs sm:text-sm font-bold text-primary hover:text-rust transition-colors text-left pt-6 flex items-center gap-1 cursor-pointer"
              >
                EXPLORE CAREERS <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Digital Transformation Feature Card */}
          <div className="mt-8 group bg-white rounded-2xl p-7 sm:p-8 border border-neutral-200/80 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-primary bg-accent px-3 py-1 rounded-full shadow-xs">Digital Transformation</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300 mt-1">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-primary tracking-tight group-hover:text-rust transition-colors">Connecting technology to community needs.</h3>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans">
                    Building technology solutions that enable smarter healthcare, education and livelihoods across Uttarakhand.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0 pt-2 md:pt-0">
              <Link
                href="https://pinebrooktechnologies.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-bold text-primary hover:text-rust transition-colors flex items-center gap-1 cursor-pointer"
              >
                DISCOVER IT SOLUTIONS <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="https://classes.issafoundation.in" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-bold text-primary hover:text-rust transition-colors flex items-center gap-1 cursor-pointer"
              >
                ISSA CLASSES LMS <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STRATEGIC INTERVENTIONS SECTION */}
      <section className="py-24 bg-primary text-white" id="home-strategic-interventions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
              {interventions.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8 border-t border-white/10">
            {interventions.items.map((it, idx) => (
              <div key={idx} className="space-y-4">
                <p className="text-4xl font-serif font-bold text-accent">{it.metric}</p>
                <p className="text-base sm:text-lg text-neutral-200 leading-relaxed">
                  {it.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. STORIES OF CHANGE */}
      <section className="py-24 bg-white" id="home-stories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">
                Stories from Himalayan Communities
              </h2>
            </div>
            <Link 
              href="/stories"
              className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-primary px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors cursor-pointer"
            >
              ALL STORIES <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div key={story.slug} className="bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200/80 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <BlurImage 
                      src={story.coverImagePath}
                      alt={story.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                      {story.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                      <Calendar className="w-4 h-4 text-primary/70" />
                      <span>{story.displayDate}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-primary group-hover:text-rust transition-colors leading-snug">
                      {story.title}
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed line-clamp-3">
                      {story.excerpt}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-2">
                  <Link 
                    href={`/stories#story-${story.slug}`}
                    className="text-xs sm:text-sm font-bold text-primary hover:text-rust transition-colors flex items-center gap-1 group/btn cursor-pointer"
                  >
                    READ STORY <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COLLABORATE & IMPACT FORM SECTION */}
      <section className="py-24 bg-teal-brand text-white" id="home-collaborate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                  {collaborate.heading}
                </h2>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {collaborate.desc}
              </p>
              
              <div className="pt-6 border-t border-white/10 space-y-2">
                <span className="text-xs text-neutral-400 block font-sans uppercase tracking-widest">Call Any Time</span>
                <p className="text-3xl font-serif text-accent font-bold tracking-tight">{collaborate.phone}</p>
                <p className="text-xs text-neutral-400 font-sans">{collaborate.email}</p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white text-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-primary">Thank you for reaching out!</h3>
                  <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                    We appreciate your interest in the ISSA Foundation. Our team will review your submission and get back to you within 3 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input type="hidden" name="subject" value="Homepage collaboration" />
                  <input name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-sans uppercase tracking-wider text-neutral-500 block">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Aarav Sharma" 
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-sans uppercase tracking-wider text-neutral-500 block">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="aarav.sharma@example.com" 
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-sans uppercase tracking-wider text-neutral-500 block">How would you like to help?</label>
                    <textarea 
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us a little about yourself or how you would like to collaborate..." 
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-accent hover:bg-accent-dark text-primary font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 tracking-wide text-sm shadow-md cursor-pointer"
                  >
                    Send message
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {formError && <p role="status" className="text-sm text-red-700 font-medium">{formError}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
