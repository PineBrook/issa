'use client';

import React, { useState } from 'react';
import type { AuditEventRecord } from '@/lib/audit';
import { ShieldCheck, Download, Search, RefreshCw, ChevronDown, ChevronRight, Sliders, Globe } from 'lucide-react';

export default function AuditLogTab({
  initialEvents = [],
}: {
  initialEvents?: AuditEventRecord[];
}) {
  const [events, setEvents] = useState<AuditEventRecord[]>(initialEvents);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredEvents = events.filter((e) => {
    let matchesAction = true;
    if (actionFilter === 'settings') matchesAction = e.action.includes('settings') || e.entityType.includes('setting');
    else if (actionFilter === 'cms') matchesAction = e.action.startsWith('cms.') || e.entityType.includes('hero') || e.entityType.includes('home') || e.entityType.includes('impact') || e.entityType.includes('program') || e.entityType.includes('faq') || e.entityType.includes('office') || e.entityType.includes('legal');
    else if (actionFilter !== 'all') matchesAction = e.action.toLowerCase().includes(actionFilter.toLowerCase());

    const matchesEntity = entityFilter === 'all' || e.entityType.toLowerCase() === entityFilter.toLowerCase();
    const matchesSearch =
      search.trim() === '' ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.actorEmail.toLowerCase().includes(search.toLowerCase()) ||
      e.entityType.toLowerCase().includes(search.toLowerCase()) ||
      (e.entityId && e.entityId.toLowerCase().includes(search.toLowerCase()));

    return matchesAction && matchesEntity && matchesSearch;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/cms/audit-log');
      if (res.ok) {
        const data = await res.json();
        if (data.events) setEvents(data.events);
      }
    } catch {
      // ignore
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      await fetch('/api/cms/audit-log?export=true');
    } catch {
      // ignore
    }

    const headers = ['ID', 'Timestamp (IST)', 'Actor Email', 'Action', 'Entity Type', 'Entity ID', 'Correlation ID', 'Metadata'];
    const rows = filteredEvents.map((e) => [
      e.id,
      `"${formatIST(e.createdAt)}"`,
      `"${e.actorEmail}"`,
      `"${e.action}"`,
      `"${e.entityType}"`,
      `"${e.entityId || ''}"`,
      `"${e.requestCorrelationId || ''}"`,
      `"${e.metadata ? JSON.stringify(e.metadata).replace(/"/g, '""') : ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `issa_website_audit_log_ist_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatIST = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return (
        d.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' IST'
      );
    } catch {
      return isoString;
    }
  };

  const getActionBadge = (action: string) => {
    if (action.includes('delete') || action.includes('archive') || action.includes('suspend')) {
      return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">{action}</span>;
    }
    if (action.includes('create') || action.includes('publish') || action.includes('login') || action.includes('update')) {
      return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">{action}</span>;
    }
    return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">{action}</span>;
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-bold text-neutral-900">Website & Settings Change Audit Log</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> IST Timestamp Only
            </span>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Append-only audit trail of all ISSA website modifications, global settings, branding, hero slides, program updates, and staff access changes. Strictly visible only to Admin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV (IST)
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200 w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, email, or entity..."
            className="text-xs bg-transparent focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <span className="font-semibold">Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:border-primary"
            >
              <option value="all">All Operations</option>
              <option value="settings">Site Settings & Branding</option>
              <option value="cms">Website Content & Programs</option>
              <option value="blog">Stories & Blog</option>
              <option value="job">Jobs & Vacancies</option>
              <option value="application">Career Applications</option>
              <option value="staff">Staff Directory & Roles</option>
              <option value="auth">Auth & Login</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <span className="font-semibold">Entity:</span>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:border-primary"
            >
              <option value="all">All Entities</option>
              <option value="site_setting">Site Settings</option>
              <option value="hero_slide">Hero Slides</option>
              <option value="home_sections">Home Sections</option>
              <option value="impact_content">Impact Metrics</option>
              <option value="program_content">Programs & Pillars</option>
              <option value="faq">FAQs</option>
              <option value="office_location">Office Locations</option>
              <option value="media_asset">Media Asset</option>
              <option value="legal_page">Legal Pages</option>
              <option value="blog_post">Blog Post</option>
              <option value="job_opening">Job Opening</option>
              <option value="career_application">Career Application</option>
              <option value="staff">Staff Profile</option>
            </select>
          </div>
        </div>
      </div>

      {/* EVENT LOG TABLE */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Timestamp (IST)</th>
                <th className="px-4 py-3.5">Staff / Actor</th>
                <th className="px-4 py-3.5">Operation Action</th>
                <th className="px-4 py-3.5">Entity</th>
                <th className="px-4 py-3.5">Target ID</th>
                <th className="px-4 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans">
              {filteredEvents.map((event) => {
                const isExpanded = expandedId === event.id;
                return (
                  <React.Fragment key={event.id}>
                    <tr className="hover:bg-neutral-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono text-neutral-700 whitespace-nowrap">
                        {formatIST(event.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-medium text-neutral-900 truncate max-w-[180px]">
                        {event.actorEmail}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{getActionBadge(event.action)}</td>
                      <td className="px-4 py-3 font-mono text-neutral-700">{event.entityType}</td>
                      <td className="px-4 py-3 font-mono text-neutral-500">{event.entityId || '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : event.id)}
                          className="text-primary hover:text-primary-dark font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                        >
                          {isExpanded ? 'Hide' : 'Inspect'}
                          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-neutral-50">
                        <td colSpan={6} className="px-6 py-4 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                            {event.beforeState && (
                              <div className="bg-white p-3 rounded-xl border border-neutral-200">
                                <span className="font-bold text-neutral-500 block mb-1">State Before Edit:</span>
                                <pre className="text-[11px] text-neutral-700 whitespace-pre-wrap overflow-x-auto">
                                  {JSON.stringify(event.beforeState, null, 2)}
                                </pre>
                              </div>
                            )}
                            {event.afterState && (
                              <div className="bg-white p-3 rounded-xl border border-neutral-200">
                                <span className="font-bold text-neutral-500 block mb-1">State After Edit:</span>
                                <pre className="text-[11px] text-neutral-700 whitespace-pre-wrap overflow-x-auto">
                                  {JSON.stringify(event.afterState, null, 2)}
                                </pre>
                              </div>
                            )}
                            {event.metadata && (
                              <div className="bg-white p-3 rounded-xl border border-neutral-200 md:col-span-2">
                                <span className="font-bold text-neutral-500 block mb-1">Audit Metadata:</span>
                                <pre className="text-[11px] text-neutral-700 whitespace-pre-wrap overflow-x-auto">
                                  {JSON.stringify(event.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-neutral-500 text-xs">
                    No change records found matching selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
