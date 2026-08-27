'use client';

import React, { useState } from 'react';
import type { ImpactContentData, ImpactMetricCard, CompetencyBar } from '@/lib/site-cms-types';
import { Save, Loader2, CheckCircle2, Award, BarChart3, Plus, Trash2 } from 'lucide-react';

export default function ImpactTab({
  initialImpact,
}: {
  initialImpact?: ImpactContentData;
}) {
  const [hero, setHero] = useState(
    initialImpact?.hero || {
      eyebrow: 'Measured Progress',
      title: 'Transforming Lives.',
      highlight: 'One Village At A Time.',
      description:
        'We focus on measurable outputs. Our financial allocations and community programs are audited periodically to maintain rigorous performance ratios.',
    }
  );

  const [metrics, setMetrics] = useState<ImpactMetricCard[]>(
    initialImpact?.metrics || [
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
    ]
  );

  const [milestones, setMilestones] = useState(
    initialImpact?.milestones || {
      eyebrow: 'Metrics Trend',
      title: 'Sustained Growth in Student Competency',
      desc: 'Independent assessment of rural primary and secondary students adopted into our CIAS digital classrooms showing competency increases over three school terms.',
      bars: [
        { label: 'Pre-Adoption', value: 35, color: 'primary' },
        { label: 'Term 1 (CIAS)', value: 60, color: 'rust' },
        { label: 'Term 2 (CIAS)', value: 88, color: 'accent' },
      ],
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleMetricChange = (idx: number, field: keyof ImpactMetricCard, val: string) => {
    const updated = [...metrics];
    updated[idx] = { ...updated[idx], [field]: val };
    setMetrics(updated);
  };

  const handleBarChange = (idx: number, field: keyof CompetencyBar, val: any) => {
    const updated = [...milestones.bars];
    updated[idx] = { ...updated[idx], [field]: val };
    setMilestones({ ...milestones, bars: updated });
  };

  const handleAddBar = () => {
    setMilestones({
      ...milestones,
      bars: [...milestones.bars, { label: `Term ${milestones.bars.length + 1}`, value: 90, color: 'primary' }],
    });
  };

  const handleRemoveBar = (idx: number) => {
    setMilestones({
      ...milestones,
      bars: milestones.bars.filter((_, i) => i !== idx),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await Promise.all([
        fetch('/api/cms/impact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionKey: 'hero', data: hero }),
        }),
        fetch('/api/cms/impact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionKey: 'metrics', data: metrics }),
        }),
        fetch('/api/cms/impact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionKey: 'milestones', data: milestones }),
        }),
      ]);

      setSuccess('Impact page content saved successfully to Neon DB!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Error saving impact content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Impact & Metrics Editor</h2>
          <p className="text-sm text-neutral-600">
            Edit hero copy, the 4 verified impact metric cards, and the interactive competency chart data.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Impact Content'}
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* 1. HERO HEADER */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <h3 className="text-lg font-serif font-bold text-neutral-900">1. Impact Hero Header</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Eyebrow</label>
            <input
              type="text"
              value={hero.eyebrow}
              onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Headline</label>
            <input
              type="text"
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-serif font-bold focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Sub-Headline (Accent)</label>
            <input
              type="text"
              value={hero.highlight}
              onChange={(e) => setHero({ ...hero, highlight: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-serif focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Description</label>
            <textarea
              rows={2}
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>
      </div>

      {/* 2. 4 METRIC CARDS */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accent/15 text-primary rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-neutral-900">2. Featured Metric Cards Quad</h3>
            <p className="text-xs text-neutral-500">The 4 primary outcome cards shown on the impact page.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {metrics.map((card, idx) => (
            <div key={idx} className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Category / Pill</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleMetricChange(idx, 'title', e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Big Number / %</label>
                  <input
                    type="text"
                    value={card.metric}
                    onChange={(e) => handleMetricChange(idx, 'metric', e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-lg font-serif font-bold text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Headline / Subtitle</label>
                <input
                  type="text"
                  value={card.sub}
                  onChange={(e) => handleMetricChange(idx, 'sub', e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs font-serif font-bold text-neutral-900 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Evaluation Details</label>
                <textarea
                  rows={2}
                  value={card.details}
                  onChange={(e) => handleMetricChange(idx, 'details', e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs leading-relaxed focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. COMPETENCY GROWTH CHART */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-neutral-900">3. Competency Growth Chart & Milestones</h3>
              <p className="text-xs text-neutral-500">Interactive SVG bar graph data on the impact page.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddBar}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Term Bar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Chart Title</label>
            <input
              type="text"
              value={milestones.title}
              onChange={(e) => setMilestones({ ...milestones, title: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-serif font-bold focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Eyebrow</label>
            <input
              type="text"
              value={milestones.eyebrow}
              onChange={(e) => setMilestones({ ...milestones, eyebrow: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Chart Explanation</label>
            <textarea
              rows={2}
              value={milestones.desc}
              onChange={(e) => setMilestones({ ...milestones, desc: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {milestones.bars.map((bar, idx) => (
            <div key={idx} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 relative group">
              <button
                type="button"
                onClick={() => handleRemoveBar(idx)}
                className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Label</label>
                <input
                  type="text"
                  value={bar.label}
                  onChange={(e) => handleBarChange(idx, 'label', e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Score Percentage (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={bar.value}
                  onChange={(e) => handleBarChange(idx, 'value', parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-lg font-serif font-bold text-primary focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
