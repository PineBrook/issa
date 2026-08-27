'use client';

import React, { useState } from 'react';
import type { FaqItem, OfficeLocationItem } from '@/lib/site-cms-types';
import { Plus, Edit2, Trash2, CheckCircle2, HelpCircle, MapPin, Save, Loader2, X } from 'lucide-react';

export default function FaqsOfficesTab({
  initialFaqs = [],
  initialOffices = [],
}: {
  initialFaqs?: FaqItem[];
  initialOffices?: OfficeLocationItem[];
}) {
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [offices, setOffices] = useState<OfficeLocationItem[]>(initialOffices);

  // FAQ Modal state
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isNewFaq, setIsNewFaq] = useState(false);
  const [isSavingFaq, setIsSavingFaq] = useState(false);
  const [faqError, setFaqError] = useState('');

  // Office Modal state
  const [editingOffice, setEditingOffice] = useState<OfficeLocationItem | null>(null);
  const [isNewOffice, setIsNewOffice] = useState(false);
  const [isSavingOffice, setIsSavingOffice] = useState(false);
  const [officeError, setOfficeError] = useState('');

  const [success, setSuccess] = useState('');

  // FAQ Handlers
  const handleCreateFaq = () => {
    setEditingFaq({
      id: 0,
      category: 'contact',
      question: '',
      answer: '',
      displayOrder: faqs.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsNewFaq(true);
    setFaqError('');
  };

  const handleEditFaq = (faq: FaqItem) => {
    setEditingFaq({ ...faq });
    setIsNewFaq(false);
    setFaqError('');
  };

  const handleDeleteFaq = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/cms/faqs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete FAQ');
      setFaqs(faqs.filter((f) => f.id !== id));
      setSuccess('FAQ removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Error deleting FAQ');
    }
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    setIsSavingFaq(true);
    setFaqError('');

    try {
      const url = isNewFaq ? '/api/cms/faqs' : `/api/cms/faqs/${editingFaq.id}`;
      const method = isNewFaq ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save FAQ');

      if (isNewFaq) {
        setFaqs([...faqs, data.faq]);
      } else {
        setFaqs(faqs.map((f) => (f.id === data.faq.id ? data.faq : f)));
      }

      setSuccess('FAQ saved successfully in Neon DB!');
      setTimeout(() => setSuccess(''), 3000);
      setEditingFaq(null);
    } catch (err: any) {
      setFaqError(err.message || 'Error saving FAQ');
    } finally {
      setIsSavingFaq(false);
    }
  };

  // Office Handlers
  const handleCreateOffice = () => {
    setEditingOffice({
      id: 0,
      city: '',
      role: 'Regional Office',
      address: '',
      phone: '+91 135 430 8180',
      email: 'career.issafoundation@gmail.com',
      displayOrder: offices.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsNewOffice(true);
    setOfficeError('');
  };

  const handleEditOffice = (office: OfficeLocationItem) => {
    setEditingOffice({ ...office });
    setIsNewOffice(false);
    setOfficeError('');
  };

  const handleDeleteOffice = async (id: number) => {
    if (!confirm('Are you sure you want to delete this office location?')) return;
    try {
      const res = await fetch(`/api/cms/offices/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete office location');
      setOffices(offices.filter((o) => o.id !== id));
      setSuccess('Office location deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Error deleting office');
    }
  };

  const handleSaveOffice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffice) return;
    setIsSavingOffice(true);
    setOfficeError('');

    try {
      const url = isNewOffice ? '/api/cms/offices' : `/api/cms/offices/${editingOffice.id}`;
      const method = isNewOffice ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingOffice),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save office');

      if (isNewOffice) {
        setOffices([...offices, data.office]);
      } else {
        setOffices(offices.map((o) => (o.id === data.office.id ? data.office : o)));
      }

      setSuccess('Office location saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setEditingOffice(null);
    } catch (err: any) {
      setOfficeError(err.message || 'Error saving office');
    } finally {
      setIsSavingOffice(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl">
      <div className="border-b border-neutral-200 pb-5">
        <h2 className="text-2xl font-serif font-bold text-neutral-900">FAQs & Regional Offices</h2>
        <p className="text-sm text-neutral-600">
          Manage questions and answers displayed on the contact page, plus physical office locations.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {success}
        </div>
      )}

      {/* 1. FAQS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent/15 text-primary rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-neutral-900">Frequently Asked Questions ({faqs.length})</h3>
              <p className="text-xs text-neutral-500">Add or edit questions shown to prospective partners & volunteers.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCreateFaq}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-accent/20 px-2 py-0.5 rounded">
                  {faq.category}
                </span>
                <h4 className="text-sm font-serif font-bold text-neutral-900">{faq.question}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleEditFaq(faq)}
                  className="p-2 text-primary hover:bg-primary/5 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. REGIONAL OFFICES SECTION */}
      <div className="space-y-4 pt-6 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-800 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-neutral-900">Office Locations ({offices.length})</h3>
              <p className="text-xs text-neutral-500">Official office addresses shown across Contact and Footer.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCreateOffice}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Location
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {offices.map((office) => (
            <div
              key={office.id}
              className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-primary">{office.city}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                    {office.role}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">{office.address}</p>
                <div className="text-xs text-neutral-500 space-y-0.5 pt-1">
                  <p>📞 {office.phone}</p>
                  <p>✉️ {office.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => handleEditOffice(office)}
                  className="p-1.5 text-primary hover:bg-primary/5 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteOffice(office.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ MODAL */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-neutral-900">
                {isNewFaq ? 'Add New FAQ' : 'Edit FAQ'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingFaq(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {faqError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
                {faqError}
              </div>
            )}

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Category</label>
                <select
                  value={editingFaq.category}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="contact">Contact & General</option>
                  <option value="education">Education (CIAS)</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="entrepreneurship">Entrepreneurship (IEDP)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Question</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingFaq}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-60"
                >
                  {isSavingFaq ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICE MODAL */}
      {editingOffice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-neutral-900">
                {isNewOffice ? 'Add Office Location' : 'Edit Office Location'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingOffice(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {officeError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
                {officeError}
              </div>
            )}

            <form onSubmit={handleSaveOffice} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">City / Title</label>
                  <input
                    type="text"
                    required
                    value={editingOffice.city}
                    onChange={(e) => setEditingOffice({ ...editingOffice, city: e.target.value })}
                    placeholder="Head Office (Dehradun)"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Role / Designation</label>
                  <input
                    type="text"
                    required
                    value={editingOffice.role}
                    onChange={(e) => setEditingOffice({ ...editingOffice, role: e.target.value })}
                    placeholder="Headquarters"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Full Physical Address</label>
                <textarea
                  rows={3}
                  required
                  value={editingOffice.address}
                  onChange={(e) => setEditingOffice({ ...editingOffice, address: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Phone</label>
                  <input
                    type="text"
                    required
                    value={editingOffice.phone}
                    onChange={(e) => setEditingOffice({ ...editingOffice, phone: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">Email</label>
                  <input
                    type="email"
                    required
                    value={editingOffice.email}
                    onChange={(e) => setEditingOffice({ ...editingOffice, email: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingOffice(null)}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingOffice}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-60"
                >
                  {isSavingOffice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
