'use client';

import React, { useState } from 'react';
import type { HeroSlideItem, MediaAssetItem } from '@/lib/site-cms-types';
import { Plus, Edit2, Trash2, CheckCircle2, Eye, EyeOff, Save, Loader2, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function HeroSlidesTab({
  initialSlides = [],
  mediaAssets = [],
}: {
  initialSlides?: HeroSlideItem[];
  mediaAssets?: MediaAssetItem[];
}) {
  const [slides, setSlides] = useState<HeroSlideItem[]>(initialSlides);
  const [editingSlide, setEditingSlide] = useState<HeroSlideItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleEdit = (slide: HeroSlideItem) => {
    setEditingSlide({ ...slide });
    setIsNew(false);
    setError('');
  };

  const handleCreateNew = () => {
    setEditingSlide({
      id: 0,
      slideKey: `slide_${Date.now()}`,
      eyebrow: 'Community Development',
      title: 'Empowering Communities',
      highlight: 'across Uttarakhand.',
      description: 'Creating meaningful impact through sustainable programs in healthcare, education, and livelihoods.',
      image: '/isssa-school-community-v2.png',
      ctaLabel: 'Learn More',
      ctaHref: '/programs',
      donateLabel: 'Support Our Mission',
      donateHref: '/contact',
      displayOrder: slides.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsNew(true);
    setError('');
  };

  const handleToggleActive = async (slide: HeroSlideItem) => {
    try {
      const res = await fetch(`/api/cms/hero-slides/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...slide, isActive: !slide.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      setSlides((prev) => prev.map((s) => (s.id === slide.id ? data.slide : s)));
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;
    try {
      const res = await fetch(`/api/cms/hero-slides/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete slide');
      setSlides((prev) => prev.filter((s) => s.id !== id));
      if (editingSlide?.id === id) setEditingSlide(null);
    } catch (err: any) {
      alert(err.message || 'Error deleting slide');
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;
    setIsSaving(true);
    setError('');

    try {
      const url = isNew ? '/api/cms/hero-slides' : `/api/cms/hero-slides/${editingSlide.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSlide),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save slide');

      if (isNew) {
        setSlides((prev) => [...prev, data.slide]);
      } else {
        setSlides((prev) => prev.map((s) => (s.id === data.slide.id ? data.slide : s)));
      }

      setSuccess('Slide saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setEditingSlide(null);
    } catch (err: any) {
      setError(err.message || 'Error saving slide');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Hero Slideshow Editor</h2>
          <p className="text-sm text-neutral-600">
            Manage the full-viewport homepage carousel slides, headlines, images, and button links.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Slide
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {success}
        </div>
      )}

      {/* SLIDES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`bg-white rounded-2xl border ${
              slide.isActive ? 'border-neutral-200' : 'border-neutral-200 opacity-60'
            } shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all`}
          >
            <div>
              <div className="relative aspect-[16/9] w-full bg-neutral-900 overflow-hidden">
                <Image
                  src={slide.image || '/isssa-school-community-v2.png'}
                  alt={slide.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-semibold">
                  Slide #{slide.displayOrder || idx + 1}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(slide)}
                    title={slide.isActive ? 'Deactivate slide' : 'Activate slide'}
                    className={`p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                      slide.isActive
                        ? 'bg-emerald-500/80 text-white hover:bg-emerald-600'
                        : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {slide.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-accent block">
                    {slide.eyebrow}
                  </span>
                  <p className="text-base font-serif font-bold leading-snug">
                    {slide.title} <span className="text-accent italic font-normal">{slide.highlight}</span>
                  </p>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-xs text-neutral-600 line-clamp-2">{slide.description}</p>
                <div className="flex flex-wrap gap-2 text-xs font-medium text-neutral-500">
                  <span className="bg-neutral-100 px-2 py-0.5 rounded">Primary: {slide.ctaLabel} ({slide.ctaHref})</span>
                  <span className="bg-neutral-100 px-2 py-0.5 rounded">Donate: {slide.donateLabel}</span>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-neutral-100 flex items-center justify-between">
              <span className={`text-xs font-semibold ${slide.isActive ? 'text-emerald-700' : 'text-neutral-400'}`}>
                {slide.isActive ? '● Live on site' : '○ Disabled'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(slide)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark p-1.5 hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(slide.id)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h3 className="text-xl font-serif font-bold text-neutral-900">
                {isNew ? 'Create New Hero Slide' : `Edit Slide: ${editingSlide.eyebrow}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSaveSlide} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Eyebrow / Category Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.eyebrow}
                    onChange={(e) => setEditingSlide({ ...editingSlide, eyebrow: e.target.value })}
                    placeholder="e.g. Healthcare Systems"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Display Order (Sort)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingSlide.displayOrder}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, displayOrder: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Main Headline (Part 1)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.title}
                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                    placeholder="e.g. Care that reaches"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Highlighted Headline (Gold Italic)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.highlight}
                    onChange={(e) => setEditingSlide({ ...editingSlide, highlight: e.target.value })}
                    placeholder="e.g. to the last mile."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Description / Subtitle
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editingSlide.description}
                    onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                      Background Image Path / URL
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker(!showMediaPicker)}
                      className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      {showMediaPicker ? 'Hide Asset Library' : 'Pick from Media Library'}
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={editingSlide.image}
                    onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                    placeholder="/isssa-healthcare-program-v2.png or /api/media/..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
                  />

                  {showMediaPicker && (
                    <div className="p-3 bg-neutral-100 rounded-2xl max-h-48 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-2 border border-neutral-200">
                      {mediaAssets.map((asset) => (
                        <div
                          key={asset.id}
                          onClick={() => {
                            setEditingSlide({ ...editingSlide, image: asset.fileUrl });
                            setShowMediaPicker(false);
                          }}
                          className="relative aspect-video rounded-lg overflow-hidden border border-neutral-300 hover:border-primary cursor-pointer group bg-neutral-800"
                        >
                          <Image
                            src={asset.fileUrl}
                            alt={asset.filename}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold p-1 text-center">
                            Select
                          </div>
                        </div>
                      ))}
                      {mediaAssets.length === 0 && (
                        <p className="col-span-full text-xs text-neutral-500 text-center py-4">
                          No uploaded media assets found. Upload images in the Media Library tab first.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Primary CTA Button Label
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.ctaLabel}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaLabel: e.target.value })}
                    placeholder="e.g. Explore Healthcare"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Primary CTA Button Link
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.ctaHref}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaHref: e.target.value })}
                    placeholder="e.g. /programs/healthcare"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Donate / Support Button Label
                  </label>
                  <input
                    type="text"
                    value={editingSlide.donateLabel}
                    onChange={(e) => setEditingSlide({ ...editingSlide, donateLabel: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Donate / Support Button Link
                  </label>
                  <input
                    type="text"
                    value={editingSlide.donateHref}
                    onChange={(e) => setEditingSlide({ ...editingSlide, donateHref: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingSlide.isActive}
                      onChange={(e) => setEditingSlide({ ...editingSlide, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    <span className="ml-3 text-xs font-semibold text-neutral-700">
                      Show in live slideshow (Active)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
