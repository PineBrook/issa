'use client';

import React, { useState } from 'react';
import type { ProgramContentData, MediaAssetItem, ProgramFeatureItem, ProgramStatItem } from '@/lib/site-cms-types';
import { Save, Loader2, CheckCircle2, Plus, Trash2, BookOpen, Stethoscope, Briefcase, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function ProgramsTab({
  initialPrograms = {},
  mediaAssets = [],
}: {
  initialPrograms?: Record<string, ProgramContentData>;
  mediaAssets?: MediaAssetItem[];
}) {
  const [selectedSlug, setSelectedSlug] = useState<'education' | 'healthcare' | 'entrepreneurship'>('education');
  const [programs, setPrograms] = useState<Record<string, ProgramContentData>>(initialPrograms);

  const activeProgram: ProgramContentData = programs[selectedSlug] || {
    slug: selectedSlug,
    title: 'Program Title',
    subtitle: 'Program Subtitle',
    badge: 'Initiative',
    heroImage: '/isssa-education-program-v2.png',
    overviewP1: '',
    overviewP2: '',
    vision: '',
    mission: '',
    approachTitle: 'Our approach',
    approachDesc: '',
    programmes: [],
    skills: [],
    stats: [],
    roadmap: [],
    involvement: [],
    updatedAt: new Date().toISOString(),
  };

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleFieldChange = (field: keyof ProgramContentData, val: any) => {
    setPrograms((prev) => ({
      ...prev,
      [selectedSlug]: {
        ...activeProgram,
        [field]: val,
      },
    }));
  };

  // Program initiative cards
  const handleAddProgramme = () => {
    const updated = [...(activeProgram.programmes || []), { title: 'New Sub-Program', description: 'Description of this initiative...' }];
    handleFieldChange('programmes', updated);
  };

  const handleProgrammeChange = (idx: number, field: keyof ProgramFeatureItem, val: string) => {
    const updated = [...activeProgram.programmes];
    updated[idx] = { ...updated[idx], [field]: val };
    handleFieldChange('programmes', updated);
  };

  const handleRemoveProgramme = (idx: number) => {
    handleFieldChange('programmes', activeProgram.programmes.filter((_, i) => i !== idx));
  };

  // Stats
  const handleAddStat = () => {
    const updated = [...(activeProgram.stats || []), { value: '10+', label: 'Metric label' }];
    handleFieldChange('stats', updated);
  };

  const handleStatChange = (idx: number, field: keyof ProgramStatItem, val: string) => {
    const updated = [...activeProgram.stats];
    updated[idx] = { ...updated[idx], [field]: val };
    handleFieldChange('stats', updated);
  };

  const handleRemoveStat = (idx: number) => {
    handleFieldChange('stats', activeProgram.stats.filter((_, i) => i !== idx));
  };

  // Roadmap
  const handleAddRoadmap = () => {
    handleFieldChange('roadmap', [...(activeProgram.roadmap || []), 'New milestone or target objective']);
  };

  const handleRoadmapChange = (idx: number, val: string) => {
    const updated = [...activeProgram.roadmap];
    updated[idx] = val;
    handleFieldChange('roadmap', updated);
  };

  const handleRemoveRoadmap = (idx: number) => {
    handleFieldChange('roadmap', activeProgram.roadmap.filter((_, i) => i !== idx));
  };

  // Skills
  const handleSkillsChange = (text: string) => {
    const arr = text.split(',').map((s) => s.trim()).filter(Boolean);
    handleFieldChange('skills', arr);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/cms/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeProgram),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save program content');

      setSuccess(`"${activeProgram.badge || selectedSlug}" saved successfully in Neon DB!`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Error saving program');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Programs & Pillars Editor</h2>
          <p className="text-sm text-neutral-600">
            Edit content for Education (CIAS), Healthcare, and Entrepreneurship (IEDP) initiatives.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : `Save ${selectedSlug.toUpperCase()} Pillar`}
        </button>
      </div>

      {/* PILLAR SWITCHER */}
      <div className="flex items-center gap-3 p-1.5 bg-neutral-100 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setSelectedSlug('education')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            selectedSlug === 'education'
              ? 'bg-white text-primary shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Education (CIAS)
        </button>
        <button
          type="button"
          onClick={() => setSelectedSlug('healthcare')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            selectedSlug === 'healthcare'
              ? 'bg-white text-primary shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Stethoscope className="w-4 h-4" /> Healthcare
        </button>
        <button
          type="button"
          onClick={() => setSelectedSlug('entrepreneurship')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            selectedSlug === 'entrepreneurship'
              ? 'bg-white text-primary shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Entrepreneurship (IEDP)
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
        <h3 className="text-lg font-serif font-bold text-neutral-900">1. Hero Header & Banner Image</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Pillar Badge Tag</label>
            <input
              type="text"
              value={activeProgram.badge}
              onChange={(e) => handleFieldChange('badge', e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Hero Image Path</label>
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
              value={activeProgram.heroImage}
              onChange={(e) => handleFieldChange('heroImage', e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>

          {showMediaPicker && (
            <div className="sm:col-span-2 p-3 bg-neutral-100 rounded-2xl max-h-48 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-2 border border-neutral-200">
              {mediaAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    handleFieldChange('heroImage', asset.fileUrl);
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
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Headline</label>
            <input
              type="text"
              value={activeProgram.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-serif font-bold focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Sub-Headline (Accent)</label>
            <input
              type="text"
              value={activeProgram.subtitle}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-serif focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* 2. OVERVIEW & VISION */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <h3 className="text-lg font-serif font-bold text-neutral-900">2. Overview, Vision & Mission</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Overview Paragraph 1</label>
            <textarea
              rows={3}
              value={activeProgram.overviewP1}
              onChange={(e) => handleFieldChange('overviewP1', e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Overview Paragraph 2</label>
            <textarea
              rows={3}
              value={activeProgram.overviewP2}
              onChange={(e) => handleFieldChange('overviewP2', e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Vision Statement</label>
            <textarea
              rows={3}
              value={activeProgram.vision}
              onChange={(e) => handleFieldChange('vision', e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Mission Statement</label>
            <textarea
              rows={3}
              value={activeProgram.mission}
              onChange={(e) => handleFieldChange('mission', e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>
      </div>

      {/* 3. PROGRAMMES / INITIATIVE CARDS */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-neutral-900">3. Component Programmes & Initiatives</h3>
          <button
            type="button"
            onClick={handleAddProgramme}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Program Card
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeProgram.programmes?.map((prog, idx) => (
            <div key={idx} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 relative group">
              <button
                type="button"
                onClick={() => handleRemoveProgramme(idx)}
                className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Program Title</label>
                <input
                  type="text"
                  value={prog.title}
                  onChange={(e) => handleProgrammeChange(idx, 'title', e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-sm font-serif font-bold text-primary focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Description</label>
                <textarea
                  rows={3}
                  value={prog.description}
                  onChange={(e) => handleProgrammeChange(idx, 'description', e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs leading-relaxed focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. KEY METRICS & ROADMAP */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <h3 className="text-lg font-serif font-bold text-neutral-900">4. Key Stats & Future Roadmap</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">Impact Stats</h4>
              <button
                type="button"
                onClick={handleAddStat}
                className="text-xs font-bold text-primary hover:text-primary-dark"
              >
                + Add Stat
              </button>
            </div>
            {activeProgram.stats?.map((st, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={st.value}
                  onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                  placeholder="Value (e.g. 12)"
                  className="w-24 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-sm font-serif font-bold text-primary"
                />
                <input
                  type="text"
                  value={st.label}
                  onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                  placeholder="Label description"
                  className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveStat(idx)}
                  className="p-1.5 text-neutral-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">Roadmap Targets</h4>
              <button
                type="button"
                onClick={handleAddRoadmap}
                className="text-xs font-bold text-primary hover:text-primary-dark"
              >
                + Add Target
              </button>
            </div>
            {activeProgram.roadmap?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-serif font-bold text-accent">0{idx + 1}</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleRoadmapChange(idx, e.target.value)}
                  className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveRoadmap(idx)}
                  className="p-1.5 text-neutral-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
            Future-Ready Skills / Focus Areas (Comma separated)
          </label>
          <input
            type="text"
            value={activeProgram.skills?.join(', ') || ''}
            onChange={(e) => handleSkillsChange(e.target.value)}
            placeholder="e.g. Communication, Digital skills, Financial literacy..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
          />
        </div>
      </div>
    </form>
  );
}
