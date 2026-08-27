'use client';

import React, { useState } from 'react';
import type { ContactSubmissionItem, NewsletterSubscriberItem } from '@/lib/site-cms-types';
import { Mail, Users, Download, Search, CheckCircle2, Clock, AlertCircle, Archive, ChevronDown, Loader2 } from 'lucide-react';

export default function InquiriesTab({
  initialInquiries = [],
  initialSubscribers = [],
}: {
  initialInquiries?: ContactSubmissionItem[];
  initialSubscribers?: NewsletterSubscriberItem[];
}) {
  const [subTab, setSubTab] = useState<'inquiries' | 'subscribers'>('inquiries');
  const [inquiries, setInquiries] = useState<ContactSubmissionItem[]>(initialInquiries);
  const [subscribers, _setSubscribers] = useState<NewsletterSubscriberItem[]>(initialSubscribers);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    const matchesSearch =
      search.trim() === '' ||
      inq.fullName.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      inq.message.toLowerCase().includes(search.toLowerCase()) ||
      inq.inquiryType.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateStatus = async (id: number, status: 'new' | 'in_progress' | 'resolved' | 'archived') => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/cms/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const exportInquiriesCSV = () => {
    const headers = ['ID', 'Full Name', 'Email', 'Inquiry Type', 'Message', 'Status', 'Date Submitted'];
    const rows = filteredInquiries.map((inq) => [
      inq.id,
      `"${inq.fullName.replace(/"/g, '""')}"`,
      `"${inq.email}"`,
      `"${inq.inquiryType}"`,
      `"${inq.message.replace(/"/g, '""')}"`,
      inq.status,
      inq.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `issa_contact_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSubscribersCSV = () => {
    const headers = ['ID', 'Email', 'Status', 'Consent Source', 'Subscribed Date'];
    const rows = filteredSubscribers.map((sub) => [
      sub.id,
      `"${sub.email}"`,
      sub.status,
      sub.consentSource,
      sub.subscribedAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `issa_newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">New</span>;
      case 'in_progress':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">In Review</span>;
      case 'resolved':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">Resolved</span>;
      case 'archived':
        return <span className="bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">Archived</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Inquiries & Form Submissions</h2>
          <p className="text-sm text-neutral-600">
            View messages from the Contact Us form, collaboration requests, and newsletter subscribers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={subTab === 'inquiries' ? exportInquiriesCSV : exportSubscribersCSV}
            className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-3 p-1.5 bg-neutral-100 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setSubTab('inquiries')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            subTab === 'inquiries'
              ? 'bg-white text-primary shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Mail className="w-4 h-4" /> Contact Messages ({inquiries.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab('subscribers')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            subTab === 'subscribers'
              ? 'bg-white text-primary shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Users className="w-4 h-4" /> Newsletter Subscribers ({subscribers.length})
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-neutral-200 shadow-sm max-w-md w-full">
          <Search className="w-4 h-4 text-neutral-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or message..."
            className="w-full text-sm bg-transparent focus:outline-none"
          />
        </div>

        {subTab === 'inquiries' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-neutral-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-primary shadow-sm"
            >
              <option value="all">All Inquiries</option>
              <option value="new">New (Unreviewed)</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        )}
      </div>

      {/* INQUIRIES LIST */}
      {subTab === 'inquiries' && (
        <div className="space-y-4">
          {filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4 hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-serif font-bold text-neutral-900">{inq.fullName}</h4>
                  <span className="text-xs text-neutral-500 font-medium">{inq.email}</span>
                  {getStatusBadge(inq.status)}
                </div>
                <span className="text-xs text-neutral-400">
                  {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-accent/20 px-2 py-0.5 rounded">
                  {inq.inquiryType}
                </span>
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap pt-2">
                  {inq.message}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <span className="text-xs text-neutral-400">Inquiry #{inq.id}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-500">Update Status:</span>
                  <select
                    disabled={updatingId === inq.id}
                    value={inq.status}
                    onChange={(e) => handleUpdateStatus(inq.id, e.target.value as any)}
                    className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:border-primary cursor-pointer disabled:opacity-50"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {filteredInquiries.length === 0 && (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-neutral-200">
              <Mail className="w-12 h-12 text-neutral-300 mx-auto" />
              <p className="text-sm font-semibold text-neutral-700">No contact inquiries found</p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Messages submitted through the Contact Us form will appear here in real-time.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUBSCRIBERS LIST */}
      {subTab === 'subscribers' && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase font-bold text-neutral-500 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Consent Source</th>
                <th className="px-6 py-4">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredSubscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">{sub.email}</td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-neutral-500">{sub.consentSource}</td>
                  <td className="px-6 py-4 text-xs text-neutral-500">
                    {new Date(sub.subscribedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
              {filteredSubscribers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500 text-xs">
                    No newsletter subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
