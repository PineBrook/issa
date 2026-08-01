'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  HeartPulse,
  Sprout,
  Users,
  Globe,
  Sparkles,
  ChevronRight,
  Play,
  Pause,
  ArrowUpRight,
  Shield,
  Activity,
  CheckCircle2,
  Building2,
  BookOpen,
  Briefcase
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
      { value: '350+', label: 'Students Trained' }
    ],
    highlights: ['Satellite E-Learning', 'STEM & Computer Labs', 'Teacher Upskilling']
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
    highlights: ['Mobile Diagnostics', 'Free Cataract Surgeries', 'Tele-med Support']
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
    highlights: ['Tech & Admin Certs', 'Artisan Handloom Grants', 'Marketplace Access']
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
    highlights: ['Panchayat Co-Action', 'Women SHG Empowerment', 'Ecological Protection']
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
    highlights: ['Synergistic Impact', 'Community Ownership', 'Scalable NGO Model']
  }
];

interface HeroAnimationProps {
  activeTab: ImpactCategory;
}

/**
 * HTML5 Canvas + Floating Nodes background animation representing ISSA Foundation's 5 pillars:
 * Social Work, NGO Community Mesh, Education, Primary Healthcare, and Rural Entrepreneurship.
 */
export default function HeroSocialImpactAnimation({ activeTab }: HeroAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    <div className="absolute inset-0 overflow-hidden bg-primary-dark select-none" aria-hidden="true">
      {/* 1. Dynamic Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-[2] w-full h-full"
      />

      {/* 2. Deep Organic Radial Glow matching ISSA Brand */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_-10%,rgba(13,49,31,0.85),rgba(7,30,19,1))] z-[1]" />

      {/* Dynamic Pillar Glow Spotlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] opacity-20 transition-all duration-1000 z-[1] pointer-events-none"
        style={{ backgroundColor: currentPillar.accentColor }}
      />

      {/* Ambient Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/85 to-primary-dark/40 z-[3] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-transparent to-transparent z-[3] pointer-events-none" />

      {/* Floating Badges in Atmosphere */}
      <div className="hidden lg:block absolute inset-0 z-[4] pointer-events-none">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[16%] left-[58%] bg-white/5 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs text-neutral-300 shadow-xl"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <GraduationCap className="w-3.5 h-3.5 text-accent" />
          <span>Smart Classrooms Active</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="absolute top-[42%] left-[62%] bg-white/5 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs text-neutral-300 shadow-xl"
        >
          <HeartPulse className="w-3.5 h-3.5 text-sky-400" />
          <span>Mobile Medical Vans on Route</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2.4 }}
          className="absolute bottom-[20%] left-[55%] bg-white/5 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs text-neutral-300 shadow-xl"
        >
          <Sprout className="w-3.5 h-3.5 text-terracotta" />
          <span>Youth Skill Certifications</span>
        </motion.div>
      </div>
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
 * Interactive 5-Pillar Social Impact HUD Card displayed in the Hero Section
 */
export function HeroImpactCard({
  activeTab,
  onSelectTab,
  isPaused,
  onTogglePause
}: HeroImpactCardProps) {
  const currentPillar = PILLARS.find((p) => p.id === activeTab) || PILLARS[0];
  const ActiveIcon = currentPillar.icon;

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl space-y-5 text-white w-full max-w-lg">
      {/* Header & Play/Pause */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: currentPillar.accentColor }}
          />
          <span className="text-xs uppercase tracking-widest text-neutral-300 font-semibold font-sans">
            ISSA Impact Engine
          </span>
        </div>

        <button
          onClick={onTogglePause}
          className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/15 cursor-pointer"
          title={isPaused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
        >
          {isPaused ? <Play className="w-3 h-3 text-accent" /> : <Pause className="w-3 h-3 text-neutral-300" />}
          <span className="font-medium">{isPaused ? 'Play' : 'Auto'}</span>
        </button>
      </div>

      {/* 5 Pillar Selector Tabs */}
      <div className="grid grid-cols-5 gap-1 bg-black/40 p-1.5 rounded-xl border border-white/10">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          const isActive = activeTab === pillar.id;
          return (
            <button
              key={pillar.id}
              onClick={() => onSelectTab(pillar.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[10px] font-medium transition-all duration-300 relative cursor-pointer ${
                isActive
                  ? 'bg-white/20 text-white shadow-lg border border-white/25'
                  : 'text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon
                className="w-4 h-4 mb-1 transition-transform duration-300"
                style={{ color: isActive ? pillar.accentColor : 'currentColor' }}
              />
              <span className="truncate w-full text-center leading-none font-sans font-medium">{pillar.shortLabel}</span>
              {isActive && (
                <motion.div
                  layoutId="activePillarUnderline"
                  className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full"
                  style={{ backgroundColor: pillar.accentColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Pillar Card Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPillar.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="space-y-4 pt-1"
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border inline-block"
              style={{
                borderColor: `${currentPillar.accentColor}66`,
                color: currentPillar.accentColor,
                backgroundColor: `${currentPillar.accentColor}20`
              }}
            >
              {currentPillar.badge}
            </span>
            <span className="text-[11px] text-neutral-300 font-sans italic">
              {currentPillar.tagline}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2.5">
              <ActiveIcon className="w-5 h-5 shrink-0" style={{ color: currentPillar.accentColor }} />
              {currentPillar.title}
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans mt-2 font-light">
              {currentPillar.description}
            </p>
          </div>

          {/* Metrics & Highlights Box */}
          <div className="bg-black/35 rounded-xl p-3.5 border border-white/10 space-y-3">
            <div className="grid grid-cols-2 gap-3 divide-x divide-white/10">
              {currentPillar.metrics.map((m, idx) => (
                <div key={idx} className={idx > 0 ? 'pl-3' : ''}>
                  <p
                    className="text-2xl font-serif font-bold tracking-tight"
                    style={{ color: currentPillar.accentColor }}
                  >
                    {m.value}
                  </p>
                  <p className="text-[11px] text-neutral-300 font-sans mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-2.5 flex flex-wrap gap-1.5">
              {currentPillar.highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-white/10 border border-white/10 text-neutral-200 px-2 py-0.5 rounded-md flex items-center gap-1 font-sans"
                >
                  <Sparkles className="w-2.5 h-2.5 text-accent" />
                  {h}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Bar */}
      {!isPaused && (
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
          <motion.div
            key={activeTab}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 6, ease: 'linear' }}
            className="h-full"
            style={{ backgroundColor: currentPillar.accentColor }}
          />
        </div>
      )}
    </div>
  );
}
