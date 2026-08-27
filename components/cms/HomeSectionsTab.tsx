'use client';

import React, { useState } from 'react';
import type { HomeSectionsData, StatItem, MediaAssetItem } from '@/lib/site-cms-types';
import { Save, Loader2, CheckCircle2, Plus, Trash2, Hash, BookOpen, Target, Users, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function HomeSectionsTab({
  initialSections,
  mediaAssets = [],
}: {
  initialSections?: HomeSectionsData;
  mediaAssets?: MediaAssetItem[];
}) {
  const [stats, setStats] = useState<StatItem[]>(
    initialSections?.stats || [
      { value: '11+', label: 'Schools Adopted', order: 1 },
      { value: '600+', label: 'Students Reached', order: 2 },
      { value: '20+', label: 'Hospital Beds', order: 3 },
      { value: '1,200+', label: 'Patients Cared For', order: 4 },
      { value: '20+', label: 'Entrepreneurs', order: 5 },
      { value: '6+', label: 'Districts', order: 6 },
    ]
  );

  const [philosophy, setPhilosophy] = useState(
    initialSections?.philosophy || {
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
    }
  );

  const [interventions, setInterventions] = useState(
    initialSections?.strategicInterventions || {
      heading: 'Targeted Work, Measurable Results',
      items: [
        { metric: '11+', desc: 'Smart boards and computers distributed across high-altitude government schools to improve classroom learning.' },
        { metric: '11+', desc: 'Specialist teachers appointed to mentor rural students and provide ongoing digital training.' },
        { metric: '20', desc: 'Hospital beds and high-tech equipment delivering critical, life-saving diagnostic care in Pauri Garhwal.' },
      ],
    }
  );

  const [collaborate, setCollaborate] = useState(
    initialSections?.collaborate || {
      heading: 'Partner with us to Transform Lives',
      desc: 'Volunteer, partner, or support the work bringing lasting opportunity and structural development to remote communities in Uttarakhand.',
      phone: '0135 430 8180',
      email: 'career.issafoundation@gmail.com',
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Stats handlers
  const handleAddStat = () => {
    setStats([...stats, { value: '10+', label: 'New Metric', order: stats.length + 1 }]);
  };

  const handleStatChange = (index: number, field: keyof StatItem, val: any) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: val };
    setStats(updated);
  };

  const handleRemoveStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  // Interventions handlers
  const handleInterventionChange = (index: number, field: 'metric' | 'desc', val: string) => {
    const updated = [...interventions.items];
    updated[index] = { ...updated[index], [field]: val };
    setInterventions({ ...interventions, items: updated });
  };

  const handleAddIntervention = () => {
    setInterventions({
      ...interventions,
      items: [...interventions.items, { metric: '50+', desc: 'New impact milestone description.' }],
    });
  };

  const handleRemoveIntervention = (index: number) => {
    setInterventions({
      ...interventions,
      items: interventions.items.filter((_, i) => i !== index),
    });
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await Promise.all([
        fetch('/api/cms/home-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionKey: 'stats', data: stats }),
        }),
        fetch('/api/cms/home-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionKey: 'philosophy', data: philosophy }),
        }),
        fetch('/api/cms/home-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionKey: 'strategic_interventions', data: interventions }),
        }),
        fetch('/api/cms/home-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionKey: 'collaborate', data: collaborate }),
        }),
      ]);

      setSuccess('Homepage sections saved successfully to Neon DB!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Error saving homepage sections');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Homepage Sections</h2>
          <p className="text-sm text-neutral-600">
            Edit the stats counter bar, philosophy story, strategic intervention metrics, and collaboration banner.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save All Homepage Sections'}
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

      {/* 1. STATS COUNTERS */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent/15 text-primary rounded-xl">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-neutral-900">Stats Counter Strip</h3>
              <p className="text-xs text-neutral-500">Key numeric impact highlights displayed below the hero.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddStat}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Metric
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((st, idx) => (
            <div key={idx} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 relative group">
              <button
                type="button"
                onClick={() => handleRemoveStat(idx)}
                className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Value / Figure
                </label>
                <input
                  type="text"
                  value={st.value}
                  onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                  placeholder="e.g. 11+"
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-base font-serif font-bold text-primary focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Label
                </label>
                <input
                  type="text"
                  value={st.label}
                  onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                  placeholder="e.g. Schools Adopted"
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. PHILOSOPHY / ABOUT STORY */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-neutral-900">Our Philosophy & Community Story</h3>
            <p className="text-xs text-neutral-500">Edit the editorial story, photo, floating badge, and core bullet points.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Main Heading</label>
            <input
              type="text"
              value={philosophy.heading}
              onChange={(e) => setPhilosophy({ ...philosophy, heading: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-serif font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Photo Image URL</label>
              <button
                type="button"
                onClick={() => setShowMediaPicker(!showMediaPicker)}
                className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" /> Media Picker
              </button>
            </div>
            <input
              type="text"
              value={philosophy.image}
              onChange={(e) => setPhilosophy({ ...philosophy, image: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Image Alt Description</label>
            <input
              type="text"
              value={philosophy.imageAlt}
              onChange={(e) => setPhilosophy({ ...philosophy, imageAlt: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>

          {showMediaPicker && (
            <div className="sm:col-span-2 p-3 bg-neutral-100 rounded-2xl max-h-48 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-2 border border-neutral-200">
              {mediaAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    setPhilosophy({ ...philosophy, image: asset.fileUrl });
                    setShowMediaPicker(false);
                  }}
                  className="relative aspect-video rounded-lg overflow-hidden border border-neutral-300 hover:border-primary cursor-pointer group bg-neutral-800"
                >
                  <Image src={asset.fileUrl} alt={asset.filename} fill unoptimized className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold">
                    Select
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Floating Badge Title</label>
            <input
              type="text"
              value={philosophy.badgeTitle}
              onChange={(e) => setPhilosophy({ ...philosophy, badgeTitle: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Floating Badge Subtext</label>
            <input
              type="text"
              value={philosophy.badgeSub}
              onChange={(e) => setPhilosophy({ ...philosophy, badgeSub: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Story Paragraph 1</label>
            <textarea
              rows={2}
              value={philosophy.p1}
              onChange={(e) => setPhilosophy({ ...philosophy, p1: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Story Paragraph 2</label>
            <textarea
              rows={2}
              value={philosophy.p2}
              onChange={(e) => setPhilosophy({ ...philosophy, p2: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Bullet 1 Title & Description</label>
            <input
              type="text"
              value={philosophy.bullet1Title}
              onChange={(e) => setPhilosophy({ ...philosophy, bullet1Title: e.target.value })}
              placeholder="Title"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary mb-2"
            />
            <input
              type="text"
              value={philosophy.bullet1Sub}
              onChange={(e) => setPhilosophy({ ...philosophy, bullet1Sub: e.target.value })}
              placeholder="Description"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Bullet 2 Title & Description</label>
            <input
              type="text"
              value={philosophy.bullet2Title}
              onChange={(e) => setPhilosophy({ ...philosophy, bullet2Title: e.target.value })}
              placeholder="Title"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary mb-2"
            />
            <input
              type="text"
              value={philosophy.bullet2Sub}
              onChange={(e) => setPhilosophy({ ...philosophy, bullet2Sub: e.target.value })}
              placeholder="Description"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* 3. STRATEGIC INTERVENTIONS */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-800 rounded-xl">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-neutral-900">Strategic Interventions (Green Band)</h3>
              <p className="text-xs text-neutral-500">Measurable highlights displayed on the forest green band.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddIntervention}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Milestone
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Section Heading</label>
          <input
            type="text"
            value={interventions.heading}
            onChange={(e) => setInterventions({ ...interventions, heading: e.target.value })}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm font-serif font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {interventions.items.map((item, idx) => (
            <div key={idx} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 relative group">
              <button
                type="button"
                onClick={() => handleRemoveIntervention(idx)}
                className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Number / Metric</label>
                <input
                  type="text"
                  value={item.metric}
                  onChange={(e) => handleInterventionChange(idx, 'metric', e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-base font-serif font-bold text-primary focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Outcome Details</label>
                <textarea
                  rows={3}
                  value={item.desc}
                  onChange={(e) => handleInterventionChange(idx, 'desc', e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs leading-relaxed focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. COLLABORATE BANNER */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-700 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-neutral-900">Collaborate & Partner Section</h3>
            <p className="text-xs text-neutral-500">The callout banner above the homepage contact form.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Heading</label>
            <input
              type="text"
              value={collaborate.heading}
              onChange={(e) => setCollaborate({ ...collaborate, heading: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-serif font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Description</label>
            <textarea
              rows={2}
              value={collaborate.desc}
              onChange={(e) => setCollaborate({ ...collaborate, desc: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Hotline Phone</label>
            <input
              type="text"
              value={collaborate.phone}
              onChange={(e) => setCollaborate({ ...collaborate, phone: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Direct Email</label>
            <input
              type="email"
              value={collaborate.email}
              onChange={(e) => setCollaborate({ ...collaborate, email: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
