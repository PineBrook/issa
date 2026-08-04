'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Pause, Play, Heart } from 'lucide-react';
import { ImpactCategory } from './HeroSocialImpactAnimation';
import HeroSocialImpactAnimation from './HeroSocialImpactAnimation';

export interface HeroSlide {
  id: string;
  pillar: ImpactCategory;
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
    pillar: 'ecosystem',
    eyebrow: 'Integrated Development',
    title: 'One connected',
    highlight: 'impact ecosystem.',
    description:
      'Synchronizing healthcare, digital education, and entrepreneurship into a self-reinforcing model for sustainable growth.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2400',
    cta: { label: 'Explore our work', href: '/programs' },
    ctaSecondary: { label: 'Impact', href: '/impact' },
    donate: { label: 'Donate', href: '/contact' },
  },
  {
    id: 'education',
    pillar: 'education',
    eyebrow: 'Education & Smart Classrooms',
    title: 'Digital literacy for',
    highlight: 'every hill school.',
    description:
      'Upgrading remote Himalayan schools with satellite e-learning labs, computer literacy programs, and certified teacher training.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2400',
    cta: { label: 'Discover Education', href: '/programs/education' },
    ctaSecondary: { label: 'Impact', href: '/impact' },
    donate: { label: 'Donate', href: '/contact' },
  },
  {
    id: 'healthcare',
    pillar: 'healthcare',
    eyebrow: 'Primary Healthcare Systems',
    title: 'Care that reaches',
    highlight: 'the unreachable peaks.',
    description:
      'Deploying specialist doctor rosters, free diagnostic camps, and clinical equipment to high-altitude villages.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2400',
    cta: { label: 'Discover Healthcare', href: '/programs/healthcare' },
    ctaSecondary: { label: 'Impact', href: '/impact' },
    donate: { label: 'Donate', href: '/contact' },
  },
  {
    id: 'entrepreneurship',
    pillar: 'entrepreneurship',
    eyebrow: 'Rural Entrepreneurship',
    title: 'Future-proofing',
    highlight: 'youth skills.',
    description:
      'Certifying local youth in digital administration, linking handloom weavers to global markets, and fostering local micro-enterprises.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2400',
    cta: { label: 'Discover Entrepreneurship', href: '/programs/entrepreneurship' },
    ctaSecondary: { label: 'Impact', href: '/impact' },
    donate: { label: 'Donate', href: '/contact' },
  },
  {
    id: 'socialwork',
    pillar: 'socialwork',
    eyebrow: 'Social Work & NGO Action',
    title: 'Grassroots trust,',
    highlight: 'built together.',
    description:
      'Working hand-in-hand with village authorities, women self-help groups, and local leaders to build long-term self-reliance.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2400',
    cta: { label: 'Explore our work', href: '/programs' },
    ctaSecondary: { label: 'Impact', href: '/impact' },
    donate: { label: 'Donate', href: '/contact' },
  },
];

interface HeroSlideshowProps {
  activeIndex: number;
  onSelect: (index: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  rightContent?: React.ReactNode;
}

export default function HeroSlideshow({
  activeIndex,
  onSelect,
  isPaused,
  onTogglePause,
  rightContent,
}: HeroSlideshowProps) {
  const slide = HERO_SLIDES[activeIndex] ?? HERO_SLIDES[0];
  const reduceMotion = useReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      onSelect((activeIndex + 1) % HERO_SLIDES.length);
    } else if (e.key === 'ArrowLeft') {
      onSelect((activeIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    }
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#12100e] select-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero slideshow"
    >
      {/* 1. Full-bleed photo layers — base of the stack */}
      {HERO_SLIDES.map((s, i) => {
        const isActive = i === activeIndex;
        return (
          <motion.div
            key={s.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ zIndex: 1, pointerEvents: isActive ? 'auto' : 'none' }}
            aria-hidden={!isActive}
          >
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={
                reduceMotion
                  ? { scale: 1.05 }
                  : isActive
                    ? { scale: [1.05, 1.12] }
                    : { scale: 1.05 }
              }
              transition={
                isActive && !reduceMotion
                  ? { duration: 12, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }
                  : { duration: 0.8 }
              }
            >
              <Image
                src={s.image}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
                quality={85}
              />
            </motion.div>
          </motion.div>
        );
      })}

      {/* 2. Soft photo grade — keep images readable, not crushed */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, rgba(18,16,14,0.88) 0%, rgba(18,16,14,0.55) 42%, rgba(18,16,14,0.25) 70%, rgba(18,16,14,0.35) 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(18,16,14,0.75) 0%, transparent 45%, rgba(18,16,14,0.35) 100%)',
        }}
      />

      {/* 3. Network animation as a light overlay on top of photos */}
      <div className="absolute inset-0 z-[3] pointer-events-none mix-blend-screen opacity-70">
        <HeroSocialImpactAnimation activeTab={slide.pillar} variant="overlay" />
      </div>

      {/* 4. Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-svh">
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent font-semibold">
                <span className="w-8 h-px bg-accent" />
                {slide.eyebrow}
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-white leading-[1.1]">
                {slide.title} <br className="hidden sm:inline" />
                <span className="text-accent italic font-normal">{slide.highlight}</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed font-sans font-light">
                {slide.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Link
                  href={slide.donate.href}
                  className="bg-accent hover:bg-accent-dark text-primary font-semibold px-8 py-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-3 shadow-lg shadow-black/20 cursor-pointer"
                >
                  {slide.donate.label}
                  <Heart className="w-4 h-4" />
                </Link>
                {slide.ctaSecondary && (
                  <Link
                    href={slide.ctaSecondary.href}
                    className="border border-white/25 hover:border-white/50 hover:bg-white/10 text-white font-medium px-8 py-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    {slide.ctaSecondary.label}
                  </Link>
                )}
                <Link
                  href={slide.cta.href}
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium text-sm transition-colors cursor-pointer"
                >
                  {slide.cta.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {rightContent && (
          <div className="hidden lg:flex lg:col-span-5 justify-center lg:justify-end">{rightContent}</div>
        )}
      </div>

      {/* Progress dots — scaleX instead of width to avoid layout animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <button
          type="button"
          onClick={onTogglePause}
          aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
          className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          <span className="font-medium">{isPaused ? 'Play' : 'Pause'}</span>
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Slideshow slides">
          {HERO_SLIDES.map((s, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                onClick={() => onSelect(i)}
                aria-label={`Go to slide ${i + 1}: ${s.eyebrow}`}
                aria-selected={isActive}
                className="group relative h-2.5 flex items-center cursor-pointer p-1"
              >
                <span
                  className={`relative block h-1.5 overflow-hidden rounded-full bg-white/30 ${
                    isActive ? 'w-9' : 'w-1.5 group-hover:bg-white/55'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      key={`progress-${activeIndex}-${isPaused}`}
                      className="absolute inset-y-0 left-0 origin-left rounded-full bg-accent"
                      initial={{ scaleX: isPaused ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={
                        isPaused || reduceMotion
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
