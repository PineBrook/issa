'use client';

import React, { useState } from 'react';
import type { SiteSettings } from '@/lib/site-cms-types';
import { Save, Loader2, CheckCircle2, Globe, Bell, Phone, Mail, MapPin, Share2 } from 'lucide-react';

export default function SiteSettingsTab({
  initialSettings,
  onSaved,
}: {
  initialSettings?: SiteSettings;
  onSaved?: (settings: SiteSettings) => void;
}) {
  const [settings, setSettings] = useState<SiteSettings>(
    initialSettings || {
      id: 1,
      siteName: 'ISSA Foundation',
      siteTagline: 'Grassroots Development Across Uttarakhand',
      logoUrl: '',
      announcementEnabled: false,
      announcementText: '',
      announcementLink: '',
      announcementButtonText: 'Learn More',
      phone: '0135 430 8180',
      email: 'career.issafoundation@gmail.com',
      headOfficeAddress:
        '3F, Municipal No. 23/1 E.C. Road, New Municipal No. 107, Rajeev Gandhi Marg-II, Dehradun, Uttarakhand - 248001',
      regionalOfficeAddress:
        'Ward No 6, House No 33, C/o USHA RAWAT Agency Chowk, Kandoliya Mandir Road, Pauri Garhwal District Hospital, Pauri, Pauri Garhwal, Uttarakhand - 246001',
      youtubeUrl: 'https://www.youtube.com/@ISSAClasses',
      facebookUrl: 'https://www.facebook.com/profile.php?id=61592854956791&sk=about',
      instagramUrl: 'https://www.instagram.com/issa__foundation/',
      twitterUrl: 'https://x.com/ISSAfoundation1',
      linkedinUrl:
        'https://www.linkedin.com/company/issa-foundation-uttarakhand/about/?viewAsMember=true',
      taxExemptInfo: 'ISSA Foundation is a registered non-profit organization.',
      footerTagline:
        'A grassroots non-profit committed to strengthening educational infrastructure, digital literacy, and clinical care systems across remote Himalayan communities.',
      updatedAt: new Date().toISOString(),
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings((prev) => ({ ...prev, [name]: checked }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');

      setSaveSuccess(true);
      if (data.settings) {
        setSettings(data.settings);
        onSaved?.(data.settings);
      }
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Site Settings & Branding</h2>
          <p className="text-sm text-neutral-600">
            Control global branding, sitewide banner, contact info, and social links stored in Neon DB.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          Site settings successfully saved and updated in Neon DB.
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* 1. ANNOUNCEMENT BANNER */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent/15 text-primary rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-neutral-900">Top Announcement Banner</h3>
              <p className="text-xs text-neutral-500">
                Display an emergency alert or prominent announcement at the top of every page.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="announcementEnabled"
              checked={settings.announcementEnabled}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span className="ml-3 text-xs font-semibold text-neutral-700">
              {settings.announcementEnabled ? 'Active' : 'Disabled'}
            </span>
          </label>
        </div>

        {settings.announcementEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                Announcement Message
              </label>
              <input
                type="text"
                name="announcementText"
                value={settings.announcementText}
                onChange={handleChange}
                placeholder="e.g., Admissions open for 2026-27 ISSA Smart Classroom cohort in Pauri Garhwal!"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                Button / Link Target URL
              </label>
              <input
                type="text"
                name="announcementLink"
                value={settings.announcementLink}
                onChange={handleChange}
                placeholder="e.g., /programs/education or https://..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                Button Label
              </label>
              <input
                type="text"
                name="announcementButtonText"
                value={settings.announcementButtonText}
                onChange={handleChange}
                placeholder="e.g., Apply Now"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. GENERAL BRANDING */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-neutral-900">Branding & Taglines</h3>
            <p className="text-xs text-neutral-500">Site title and footer descriptions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Organization Name
            </label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Site Tagline
            </label>
            <input
              type="text"
              name="siteTagline"
              value={settings.siteTagline}
              onChange={handleChange}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Footer Description
            </label>
            <textarea
              rows={3}
              name="footerTagline"
              value={settings.footerTagline}
              onChange={handleChange}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>
      </div>

      {/* 3. CONTACT INFO */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-800 rounded-xl">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-neutral-900">Direct Contact Details</h3>
            <p className="text-xs text-neutral-500">Official phones, emails, and physical registered addresses.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Official Helpline / Phone
            </label>
            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Official Inquiries Email
            </label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Head Office Address (Dehradun)
            </label>
            <textarea
              rows={2}
              name="headOfficeAddress"
              value={settings.headOfficeAddress}
              onChange={handleChange}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Regional Office Address (Pauri)
            </label>
            <textarea
              rows={2}
              name="regionalOfficeAddress"
              value={settings.regionalOfficeAddress}
              onChange={handleChange}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>
      </div>

      {/* 4. SOCIAL MEDIA URLS */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-700 rounded-xl">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-neutral-900">Social Media Links</h3>
            <p className="text-xs text-neutral-500">Links rendered in footer and contact sections.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">YouTube Channel</label>
            <input
              type="text"
              name="youtubeUrl"
              value={settings.youtubeUrl}
              onChange={handleChange}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Facebook Page</label>
            <input
              type="text"
              name="facebookUrl"
              value={settings.facebookUrl}
              onChange={handleChange}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Instagram Handle</label>
            <input
              type="text"
              name="instagramUrl"
              value={settings.instagramUrl}
              onChange={handleChange}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Twitter / X</label>
            <input
              type="text"
              name="twitterUrl"
              value={settings.twitterUrl}
              onChange={handleChange}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">LinkedIn Page</label>
            <input
              type="text"
              name="linkedinUrl"
              value={settings.linkedinUrl}
              onChange={handleChange}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
