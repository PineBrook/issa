'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  HeartPulse,
  Sprout,
  Users,
  Globe,
  Play,
  Pause
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
  story: { headline: string; quote: string };
}

export const PILLARS: PillarInfo[] = [
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
      headline: 'A classroom that reaches the peaks',
      quote: 'For the first time, my daughter can learn from the world\u2019s best teachers \u2014 right here in our village.'
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
      headline: 'Care that climbs the mountain',
      quote: 'The medical camp came to us. My mother\u2019s eyesight was saved without a single day of travel.'
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
      headline: 'Hands that weave, futures that grow',
      quote: 'I turned my grandmother\u2019s loom into a business that now feeds our whole family.'
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
      headline: 'Trust, built village by village',
      quote: 'We don\u2019t just visit these villages \u2014 we belong to them.'
    }
  },
  {
    id: 'ecosystem',
    title: 'ISSA Impact Ecosystem',
    shortLabel: 'Ecosystem',
    tagline: 'Integrated Rural Development Network',
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
      headline: 'One circle of care',
      quote: 'Education, health and livelihood \u2014 working together for every family in the hills.'
    }
  }
];

interface HeroAnimationProps {
  activeTab: ImpactCategory;
  /** `overlay` = transparent layer for photo heroes; `standalone` = full dark fill */
  variant?: 'overlay' | 'standalone';
}

/**
 * HTML5 Canvas + floating nodes representing ISSA's interconnected pillars.
 * Use `variant="overlay"` over photo heroes so images stay visible.
 */
export default function HeroSocialImpactAnimation({
  activeTab,
  variant = 'standalone',
}: HeroAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isOverlay = variant === 'overlay';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic Nodes representing community hubs
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      category: ImpactCategory;
      pulse: number;
      pulseSpeed: number;
    }

    const categories: ImpactCategory[] = ['education', 'healthcare', 'entrepreneurship', 'socialwork'];
    const nodeCount = 42;
    const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2.5 + 2,
      category: categories[i % categories.length],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.025
    }));

    const colorMap: Record<ImpactCategory, string> = {
      education: '#E8B94C',
      healthcare: '#38BDF8',
      entrepreneurship: '#E06D3B',
      socialwork: '#10B981',
      ecosystem: '#F59E0B'
    };

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient concentric network circles
      const centerX = width * 0.65;
      const centerY = height * 0.45;

      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      for (let r = 90; r <= 420; r += 85) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r + Math.sin(time + r * 0.01) * 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Connect nearby nodes with animated energetic conduits
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.25;
            const isMatch =
              activeTab === 'ecosystem' ||
              nodes[i].category === activeTab ||
              nodes[j].category === activeTab;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            if (isMatch) {
              const activeColor = colorMap[activeTab] || '#E8B94C';
              ctx.strokeStyle = `${activeColor}${Math.floor(alpha * 255)
                .toString(16)
                .padStart(2, '0')}`;
              ctx.lineWidth = 1.3;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();

            // Energy particle travelling along connection
            if (isMatch && (i + j) % 3 === 0) {
              const progress = (Math.sin(time * 2.2 + i * 0.5) + 1) / 2;
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * progress;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * progress;

              ctx.beginPath();
              ctx.arc(px, py, 2, 0, Math.PI * 2);
              ctx.fillStyle = colorMap[activeTab] || '#E8B94C';
              ctx.shadowColor = colorMap[activeTab] || '#E8B94C';
              ctx.shadowBlur = 8;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      // 3. Render Nodes with Category Styling
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.pulse += node.pulseSpeed;
        const currentPulse = node.radius + Math.sin(node.pulse) * 1.2;

        const isHighlighted = activeTab === 'ecosystem' || node.category === activeTab;
        const nodeColor = colorMap[node.category];

        if (isHighlighted) {
          // Soft outer pulse glow
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentPulse * 3, 0, Math.PI * 2);
          ctx.fillStyle = `${nodeColor}1a`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(node.x, node.y, currentPulse * 1.8, 0, Math.PI * 2);
          ctx.strokeStyle = `${nodeColor}88`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, currentPulse, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted ? nodeColor : 'rgba(255, 255, 255, 0.45)';
        if (isHighlighted) {
          ctx.shadowColor = nodeColor;
          ctx.shadowBlur = 10;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 4. Special Pillar-Specific Live Overlay Animations
      if (activeTab === 'healthcare') {
        // Continuous Medical ECG Line across lower viewport
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 2.2;
        const startY = height * 0.88;
        ctx.moveTo(0, startY);
        for (let x = 0; x < width; x += 4) {
          const wavePhase = (x + time * 200) % 360;
          let y = startY;
          if (wavePhase > 140 && wavePhase < 152) y -= 18;
          else if (wavePhase >= 152 && wavePhase < 168) y += 38;
          else if (wavePhase >= 168 && wavePhase < 185) y -= 55;
          else if (wavePhase >= 185 && wavePhase < 200) y += 22;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      } else if (activeTab === 'education') {
        // Floating Knowledge Sparks rising upwards
        ctx.save();
        for (let k = 0; k < 8; k++) {
          const sparkX = (width * 0.3) + Math.sin(time + k * 1.2) * 260;
          const sparkY = (height * 0.9) - ((time * 50 + k * 70) % (height * 0.8));
          ctx.beginPath();
          ctx.arc(sparkX, sparkY, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232, 185, 76, ${(1 - sparkY / height) * 0.7})`;
          ctx.shadowColor = '#E8B94C';
          ctx.shadowBlur = 8;
          ctx.fill();
        }
        ctx.restore();
      } else if (activeTab === 'entrepreneurship') {
        // Rising Growth Trend Lines
        ctx.save();
        ctx.strokeStyle = 'rgba(224, 109, 59, 0.4)';
        ctx.lineWidth = 1.8;
        for (let b = 0; b < 3; b++) {
          const bx = width * 0.15 + b * 280;
          ctx.beginPath();
          ctx.moveTo(bx, height * 0.92);
          ctx.quadraticCurveTo(
            bx + 50 + Math.sin(time + b) * 25,
            height * 0.6,
            bx + 110 + Math.sin(time + b) * 15,
            height * 0.28
          );
          ctx.stroke();
        }
        ctx.restore();
      } else if (activeTab === 'socialwork') {
        // Concentric Community Unity Waves
        ctx.save();
        const swX = width * 0.5;
        const swY = height * 0.5;
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.lineWidth = 1.5;
        const ringRadius = (time * 60) % 240;
        ctx.beginPath();
        ctx.arc(swX, swY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab]);

  const currentPillar = PILLARS.find((p) => p.id === activeTab) || PILLARS[0];

  return (
    <div
      className={`absolute inset-0 overflow-hidden select-none ${isOverlay ? 'bg-transparent' : 'bg-primary-dark'}`}
      aria-hidden="true"
    >
      {/* Canvas network — always on top of optional fills */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-[2] w-full h-full"
      />

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
  isPaused,
  onTogglePause,
}: HeroImpactCardProps) {
  const currentPillar = PILLARS.find((p) => p.id === activeTab) || PILLARS[0];
  const ActiveIcon = currentPillar.icon;
  const metric = currentPillar.metrics[0];

  return (
    <div className="bg-[#1a1714]/75 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl text-white w-full max-w-lg">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-white/70 font-sans font-medium">
          A story from the hills
        </span>

        <button
          type="button"
          onClick={onTogglePause}
          className="text-white/70 hover:text-white transition-colors flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/15 cursor-pointer"
          title={isPaused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
        >
          {isPaused ? <Play className="w-3 h-3 text-accent" /> : <Pause className="w-3 h-3 text-white/70" />}
          <span className="font-medium">{isPaused ? 'Play' : 'Auto'}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPillar.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="pt-6"
        >
          <div className="flex items-start gap-3">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${currentPillar.accentColor}22`,
                color: currentPillar.accentColor,
              }}
            >
              <ActiveIcon className="w-5 h-5" />
            </span>
            {/* Visual title under page h1 — not a heading to preserve outline */}
            <p className="text-2xl font-serif font-bold leading-snug">
              {currentPillar.story.headline}
            </p>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
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

          <p className="mt-4 text-xs text-white/55 font-sans">
            {currentPillar.shortLabel} · {currentPillar.tagline}
          </p>
        </motion.div>
      </AnimatePresence>

      {!isPaused && (
        <div className="mt-6 w-full bg-white/10 h-1 rounded-full overflow-hidden">
          <motion.div
            key={activeTab}
            className="h-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 6, ease: 'linear' }}
            style={{ backgroundColor: currentPillar.accentColor, width: '100%' }}
          />
        </div>
      )}
    </div>
  );
}
