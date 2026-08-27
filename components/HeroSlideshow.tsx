'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Pause, Play, Heart } from 'lucide-react';

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  cta: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  donate: { label: string; href: string };
}

/**
 * Full-viewport hero slideshow across ISSA pillars. Each slide pairs a
 * full-bleed photograph with left-aligned copy, CTAs, and a light network overlay.
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'ecosystem',
    eyebrow: 'Integrated Development',
    title: 'One Connected Ecosystem',
    highlight: 'for Holistic Impact.',
    description:
      'Connecting Healthcare, Education, Entrepreneurship and Career Aspirations with Digital Inclusion to build a stronger Uttarakhand.',
    image: '/isssa-local-ownership-v2.png',
    cta: { label: 'Explore Ecosystem', href: '/programs' },
    donate: { label: 'Support Our Mission', href: '/contact' },
  },
  {
    id: 'healthcare',
    eyebrow: 'Healthcare Systems',
    title: 'Care that reaches',
    highlight: 'to the last mile.',
    description:
      'Connecting remote communities with specialist care, diagnostics and essential health services.',
    image: '/isssa-healthcare-program-v2.png',
    cta: { label: 'Explore Healthcare', href: '/programs/healthcare' },
    donate: { label: 'Support Our Mission', href: '/contact' },
  },
  {
    id: 'education',
    eyebrow: 'Smart Classrooms & Education',
    title: 'Smart learning',
    highlight: 'for every student.',
    description:
      'Bringing quality education, teacher support and better learning opportunities to students across Uttarakhand.',
    image: '/isssa-education-program-v2.png',
    cta: { label: 'Explore Education', href: '/programs/education' },
    donate: { label: 'Support Our Mission', href: '/contact' },
  },
  {
    id: 'entrepreneurship',
    eyebrow: 'Entrepreneurship Development',
    title: 'Growing local businesses,',
    highlight: 'Creating local livelihoods.',
    description:
      'Supporting rural entrepreneurs with financial assistance, mentorship, technology and market access to build sustainable businesses.',
    image: '/isssa-entrepreneurship-program-v2.png',
    cta: { label: 'Explore Entrepreneurship', href: '/programs/entrepreneurship' },
    donate: { label: 'Support Our Mission', href: '/contact' },
  },
  {
    id: 'careers',
    eyebrow: 'Career & Opportunities',
    title: 'Turning aspirations',
    highlight: 'into opportunities.',
    description:
      'Enabling people across Uttarakhand prepare for careers, access employment opportunities and build sustainable futures.',
    image: '/isssa-community-dispatch-v2.png',
    cta: { label: 'Explore Careers', href: '/careers' },
    donate: { label: 'Support Our Mission', href: '/contact' },
  },
  {
    id: 'digital',
    eyebrow: 'Digital Transformation',
    title: 'Connecting technology',
    highlight: 'to community needs.',
    description:
      'Building technology solutions that enable smarter healthcare, education and livelihoods across Uttarakhand.',
    image: '/isssa-digital-inclusion.png',
    cta: { label: 'Explore IT Solutions', href: 'https://pinebrooktechnologies.com/' },
    donate: { label: 'Support Our Mission', href: '/contact' },
  },
];

export interface HeroSlideshowProps {
  slides?: HeroSlide[];
  activeIndex: number;
  onSelect: (index: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export default function HeroSlideshow({
  slides = HERO_SLIDES,
  activeIndex,
  onSelect,
  isPaused,
  onTogglePause,
}: HeroSlideshowProps) {
  const currentSlides = slides && slides.length > 0 ? slides : HERO_SLIDES;
  const slide = currentSlides[activeIndex] ?? currentSlides[0];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onSelect((activeIndex + 1) % currentSlides.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onSelect((activeIndex - 1 + currentSlides.length) % currentSlides.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onSelect(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      onSelect(currentSlides.length - 1);
    }
  };

  return (
    <div
      className="relative w-full min-h-svh flex flex-col justify-center overflow-hidden bg-[#12100e] select-none focus-visible:outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="ISSA Foundation Hero Slideshow"
    >
      {/* 1. Full-bleed photo layers — base of the stack */}
      {currentSlides.map((s, i) => {
        const isActive = i === activeIndex;
        return (
          <motion.div
            key={s.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ zIndex: isActive ? 2 : 1, pointerEvents: isActive ? 'auto' : 'none' }}
            aria-hidden={!isActive}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${HERO_SLIDES.length}: ${s.eyebrow}`}
          >
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={isActive ? { scale: [1.02, 1.08] } : { scale: 1.02 }}
              transition={
                isActive
                  ? { duration: 12, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }
                  : { duration: 0.8 }
              }
            >
              <Image
                src={s.image}
                alt=""
                fill
                priority={i === 0}
                unoptimized
                referrerPolicy="no-referrer"
                sizes="100vw"
                className="object-cover"
                quality={85}
              />
            </motion.div>
          </motion.div>
        );
      })}

      {/* 2. Targeted Left Scrim — guarantees AAA text contrast behind copy without darkening the whole image or corners */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(18,16,14,0.55) 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(18,16,14,0.6) 0%, transparent 35%)',
        }}
      />

      {/* 3. Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 sm:pt-32 sm:pb-28 lg:pt-36 lg:pb-28 w-full">
        <div className="max-w-4xl space-y-6 sm:space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              id={`hero-slide-panel-${slide.id}`}
              role="tabpanel"
              aria-labelledby={`hero-tab-${slide.id}`}
              aria-live="polite"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6 sm:space-y-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            >
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent font-semibold">
                <span className="w-8 h-px bg-accent" aria-hidden="true" />
                {slide.eyebrow}
              </span>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-white leading-[1.15]">
                <span className="block">{slide.title}</span>
                <span className="text-accent italic font-normal block">{slide.highlight}</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed font-sans font-light line-clamp-2">
                {slide.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-2">
                <Link
                  href={slide.donate.href}
                  className="bg-accent hover:bg-accent-dark text-primary font-bold px-7 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-black/25 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {slide.donate.label}
                  <Heart className="w-4 h-4 fill-primary/20" />
                </Link>
                <Link
                  href={slide.cta.href}
                  className="border border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-medium px-7 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {slide.cta.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Progress dots & Pause/Play control */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-lg">
        <button
          type="button"
          onClick={onTogglePause}
          aria-pressed={isPaused}
          aria-label={isPaused ? 'Play slideshow auto-advance' : 'Pause slideshow auto-advance'}
          className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-accent" /> : <Pause className="w-3.5 h-3.5 text-white/90" />}
        </button>

        <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero slide selection">
          {currentSlides.map((s, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={s.id}
                id={`hero-tab-${s.id}`}
                type="button"
                role="tab"
                onClick={() => onSelect(i)}
                aria-label={`Slide ${i + 1} of ${currentSlides.length}: ${s.eyebrow}`}
                aria-selected={isActive}
                aria-controls={`hero-slide-panel-${s.id}`}
                className="group relative h-3 flex items-center cursor-pointer p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span
                  className={`relative block h-1.5 overflow-hidden rounded-full bg-white/35 transition-all duration-300 ${
                    isActive ? 'w-10' : 'w-2 group-hover:bg-white/60'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      key={`progress-${activeIndex}-${isPaused}`}
                      className="absolute inset-y-0 left-0 origin-left rounded-full bg-accent"
                      initial={{ scaleX: isPaused ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={
                        isPaused
                          ? { duration: 0 }
                          : { duration: 6, ease: 'linear' }
                      }
                      style={{ width: '100%' }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
