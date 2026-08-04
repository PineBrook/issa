'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  HeartPulse,
  Sprout,
  Users,
  Globe
} from 'lucide-react';

export type ImpactCategory = 'education' | 'healthcare' | 'entrepreneurship' | 'socialwork' | 'ecosystem';

export interface PillarInfo {
  id: ImpactCategory;
  title: string;
  shortLabel: string;
  tagline: string;
  description: string;
  badge: string;
  icon: React.ElementType;
  accentColor: string;
  glowColor: string;
  metrics: { value: string; label: string }[];
  highlights: string[];
  story: { headline?: string; quote: string };
}

export const PILLARS: PillarInfo[] = [
  {
    id: 'ecosystem',
    title: 'ISSA Impact Ecosystem',
    shortLabel: 'Ecosystem',
    tagline: 'Integrated Himalayan Network',
    description: 'Synchronizing healthcare, digital education, and entrepreneurship into a self-reinforcing model for sustainable growth.',
    badge: 'Integrated',
    icon: Globe,
    accentColor: '#F59E0B', // Warm Amber
    glowColor: 'rgba(245, 158, 11, 0.4)',
    metrics: [
      { value: '4 Pillars', label: 'Interconnected' },
      { value: 'Sustainable', label: 'Village Autonomy' }
    ],
    highlights: ['Synergistic Impact', 'Community Ownership', 'Scalable NGO Model'],
    story: {
      quote: 'Education, healthcare, and livelihoods working together for families across Uttarakhand.'
    }
  },
  {
    id: 'education',
    title: 'Education & Smart Classrooms',
    shortLabel: 'Education',
    tagline: 'Digital Literacy & Rural School Support',
    description: 'Upgrading remote Himalayan schools with satellite e-learning labs, computer literacy programs, and certified teacher training.',
    badge: 'Pillar 01',
    icon: GraduationCap,
    accentColor: '#E8B94C', // Marigold Gold
    glowColor: 'rgba(232, 185, 76, 0.4)',
    metrics: [
      { value: '11+', label: 'Schools Adopted' },
      { value: '600+', label: 'Students Trained' }
    ],
    highlights: ['Satellite E-Learning', 'STEM & Computer Labs', 'Teacher Upskilling'],
    story: {
      quote: 'Students in remote mountain villages access high-quality interactive lessons daily.'
    }
  },
  {
    id: 'healthcare',
    title: 'Primary Healthcare Systems',
    shortLabel: 'Healthcare',
    tagline: 'Mobile Medical Camps & Clinical Infrastructure',
    description: 'Deploying specialist doctor rosters, free diagnostic camps, optical surgeries, and clinical equipment to high-altitude villages.',
    badge: 'Pillar 02',
    icon: HeartPulse,
    accentColor: '#38BDF8', // Sky Blue
    glowColor: 'rgba(56, 189, 248, 0.4)',
    metrics: [
      { value: '20+', label: 'Hospital Beds' },
      { value: '1,200+', label: 'Patients Cared For' }
    ],
    highlights: ['Mobile Diagnostics', 'Free Cataract Surgeries', 'Tele-med Support'],
    story: {
      quote: 'Specialist medical camps bring diagnostic care and sight-restoring treatment to remote villages.'
    }
  },
  {
    id: 'entrepreneurship',
    title: 'Rural Entrepreneurship',
    shortLabel: 'Enterprise',
    tagline: 'Youth Skill Labs & Micro-Business Grants',
    description: 'Certifying local youth in digital administration, linking handloom weavers to global markets, and fostering local micro-enterprises.',
    badge: 'Pillar 03',
    icon: Sprout,
    accentColor: '#E06D3B', // Terracotta Rust
    glowColor: 'rgba(224, 109, 59, 0.4)',
    metrics: [
      { value: '600+', label: 'Youth Certified' },
      { value: '100%', label: 'Local Sourcing' }
    ],
    highlights: ['Tech & Admin Certs', 'Artisan Handloom Grants', 'Marketplace Access'],
    story: {
      quote: 'Local youth earn industry digital certifications and artisan groups connect to sustainable markets.'
    }
  },
  {
    id: 'socialwork',
    title: 'Social Work & NGO Action',
    shortLabel: 'Social Work',
    tagline: 'Grassroots Community Governance & Trust',
    description: 'Working hand-in-hand with village authorities, women self-help groups, and local leaders to build long-term self-reliance.',
    badge: 'Pillar 04',
    icon: Users,
    accentColor: '#10B981', // Emerald Green
    glowColor: 'rgba(16, 185, 129, 0.4)',
    metrics: [
      { value: '15+', label: 'Remote Blocks' },
      { value: '100%', label: 'Grassroots Trust' }
    ],
    highlights: ['Panchayat Co-Action', 'Women SHG Empowerment', 'Ecological Protection'],
    story: {
      quote: 'Partnering directly with village leaders and self-help groups to foster enduring self-reliance.'
    }
  }
];

interface HeroAnimationProps {
  activeTab: ImpactCategory;
  /** `overlay` = transparent layer for photo heroes; `standalone` = full dark fill */
  variant?: 'overlay' | 'standalone';
}

export default function HeroSocialImpactAnimation({
  activeTab,
  variant = 'standalone',
}: HeroAnimationProps) {
  const isOverlay = variant === 'overlay';
  const currentPillar = PILLARS.find((p) => p.id === activeTab) || PILLARS[0];

  return (
    <div
      className={`absolute inset-0 overflow-hidden select-none ${isOverlay ? 'bg-transparent' : 'bg-primary-dark'}`}
      aria-hidden="true"
    >
      {!isOverlay && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_-10%,rgba(13,49,31,0.85),rgba(7,30,19,1))] z-[1]" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] opacity-20 transition-colors duration-1000 z-[1] pointer-events-none"
            style={{ backgroundColor: currentPillar.accentColor }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/85 to-primary-dark/40 z-[3] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-transparent to-transparent z-[3] pointer-events-none" />
        </>
      )}

      {isOverlay && (
        <div
          className="absolute top-1/2 right-[18%] -translate-y-1/2 w-[420px] h-[420px] rounded-full blur-[120px] opacity-25 transition-colors duration-1000 z-[1] pointer-events-none"
          style={{ backgroundColor: currentPillar.accentColor }}
        />
      )}
    </div>
  );
}

interface HeroImpactCardProps {
  activeTab: ImpactCategory;
  onSelectTab: (tab: ImpactCategory) => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

/**
 * Warm, human impact snapshot — one beneficiary story at a time.
 */
export function HeroImpactCard({
  activeTab,
}: HeroImpactCardProps) {
  const currentPillar = PILLARS.find((p) => p.id === activeTab) || PILLARS[0];
  const metric = currentPillar.metrics[0];

  return (
    <div className="bg-[#1a1714]/75 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl text-white w-full max-w-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPillar.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-baseline gap-3">
            <span
              className="text-5xl font-serif font-bold tracking-tight"
              style={{ color: currentPillar.accentColor }}
            >
              {metric.value}
            </span>
            <span className="text-sm text-white/80 font-sans">{metric.label}</span>
          </div>

          <p
            className="mt-5 text-[15px] text-white/85 leading-relaxed font-serif italic border-l-2 pl-4"
            style={{ borderColor: currentPillar.accentColor }}
          >
            &ldquo;{currentPillar.story.quote}&rdquo;
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
