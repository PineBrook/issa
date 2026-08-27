'use client';

import React, { useState } from 'react';
import type { LegalPageItem } from '@/lib/site-cms-types';
import { Save, Loader2, CheckCircle2, Shield, FileText } from 'lucide-react';

export default function LegalPagesTab({
  initialPrivacy,
  initialTerms,
}: {
  initialPrivacy?: LegalPageItem | null;
  initialTerms?: LegalPageItem | null;
}) {
  const [selectedSlug, setSelectedSlug] = useState<'privacy' | 'terms'>('privacy');
  const [privacy, setPrivacy] = useState<LegalPageItem>(
    initialPrivacy || {
      slug: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'How ISSA Foundation collects, uses, and safeguards your personal data.',
      contentMarkdown: '# Privacy Policy\n\nContent...',
      updatedAt: new Date().toISOString(),
    }
  );

  const [terms, setTerms] = useState<LegalPageItem>(
    initialTerms || {
      slug: 'terms',
      title: 'Terms & Conditions',
      subtitle: 'Terms of use and governance guidelines for ISSA Foundation digital platforms.',
      contentMarkdown: '# Terms & Conditions\n\nContent...',
      updatedAt: new Date().toISOString(),
    }
  );

  const activePage = selectedSlug === 'privacy' ? privacy : terms;

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = (field: keyof LegalPageItem, val: string) => {
    if (selectedSlug === 'privacy') {
      setPrivacy({ ...privacy, [field]: val });
    } else {
      setTerms({ ...terms, [field]: val });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/cms/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activePage),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save page');

      setSuccess(`"${activePage.title}" saved successfully to Neon DB!`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Error saving page');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Legal Pages Editor</h2>
          <p className="text-sm text-neutral-600">
            Edit statutory disclosures, Privacy Policy, and Terms & Conditions in Markdown.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : `Save ${activePage.title}`}
        </button>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-3 p-1.5 bg-neutral-100 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setSelectedSlug('privacy')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            selectedSlug === 'privacy'
              ? 'bg-white text-primary shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Shield className="w-4 h-4" /> Privacy Policy
        </button>
        <button
          type="button"
          onClick={() => setSelectedSlug('terms')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            selectedSlug === 'terms'
              ? 'bg-white text-primary shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <FileText className="w-4 h-4" /> Terms & Conditions
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

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Page Title</label>
            <input
              type="text"
              value={activePage.title}
              onChange={(e) => handleUpdate('title', e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-serif font-bold focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Subtitle / Meta</label>
            <input
              type="text"
              value={activePage.subtitle}
              onChange={(e) => handleUpdate('subtitle', e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Markdown Content
            </label>
            <textarea
              rows={16}
              value={activePage.contentMarkdown}
              onChange={(e) => handleUpdate('contentMarkdown', e.target.value)}
              className="w-full font-mono bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-xs leading-relaxed focus:bg-white focus:outline-none focus:border-primary resize-y"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
