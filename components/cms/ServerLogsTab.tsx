'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { ServerLogItem, ServerHealthOverview } from '@/lib/server-logger';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  Globe,
  Loader2,
  Radio,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  Zap,
} from 'lucide-react';

export default function ServerLogsTab({
  initialLogs = [],
  initialOverview,
}: {
  initialLogs?: ServerLogItem[];
  initialOverview?: ServerHealthOverview;
}) {
  const [logs, setLogs] = useState<ServerLogItem[]>(initialLogs);
  const [overview, setOverview] = useState<ServerHealthOverview>(
    initialOverview || {
      status: 'healthy',
      dbLatencyMs: 0,
      uptime24h: 100,
      error4xxCount: 0,
      error5xxCount: 0,
      suspensionCount: 0,
      lastCheckIST: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      regions: [
        { name: 'Neon Serverless Postgres (Primary Connection)', status: 'operational', latencyMs: 0 },
      ],
    }
  );

  const [typeFilter, setTypeFilter] = useState<'all' | '4xx' | '5xx' | 'suspension' | 'heartbeat'>('all');
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRunningPing, setIsRunningPing] = useState(false);
  const [isLiveAsync, setIsLiveAsync] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [lastSyncedIST, setLastSyncedIST] = useState<string>(
    new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
  );

  const fetchLatestLogs = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await fetch('/api/cms/server-logs');
      if (res.ok) {
        const data = await res.json();
        if (data.logs) setLogs(data.logs);
        if (data.overview) setOverview(data.overview);
        setLastSyncedIST(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }));
      }
    } catch {
      // silent
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  // Live async background synchronization loop (every 5 seconds)
  useEffect(() => {
    if (!isLiveAsync) return;
    const timer = setInterval(() => {
      fetchLatestLogs(true);
    }, 5000);
    return () => clearInterval(timer);
  }, [isLiveAsync, fetchLatestLogs]);

  const handleRefresh = async () => {
    await fetchLatestLogs(false);
  };

  const handleSyncLogsToDb = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/cms/server-logs/sync', { method: 'POST' });
      if (res.ok) {
        await fetchLatestLogs(true);
      }
    } catch {
      // silent
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    let matchesType = true;
    if (typeFilter === '4xx') matchesType = log.statusCode >= 400 && log.statusCode < 500;
    else if (typeFilter === '5xx') matchesType = log.statusCode >= 500;
    else if (typeFilter === 'suspension') matchesType = log.logType === 'REGIONAL_SUSPENSION';
    else if (typeFilter === 'heartbeat') matchesType = log.logType === 'HEALTH_HEARTBEAT';

    const matchesSearch =
      search.trim() === '' ||
      (log.endpoint && log.endpoint.toLowerCase().includes(search.toLowerCase())) ||
      (log.errorMessage && log.errorMessage.toLowerCase().includes(search.toLowerCase())) ||
      log.region.toLowerCase().includes(search.toLowerCase()) ||
      String(log.statusCode).includes(search);

    return matchesType && matchesSearch;
  });

  const handleRunTelemetryPing = async () => {
    setIsRunningPing(true);
    try {
      const res = await fetch('/api/cms/server-logs', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.entry) setLogs([data.entry, ...logs]);
        if (data.overview) setOverview(data.overview);
        setLastSyncedIST(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }));
      }
    } catch {
      // silent
    } finally {
      setIsRunningPing(false);
    }
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

  const getStatusBadge = (code: number, logType: string) => {
    if (logType === 'REGIONAL_SUSPENSION') {
      return <span className="bg-rose-100 text-rose-900 border border-rose-300 font-bold px-2 py-0.5 rounded font-mono text-[10px]">SUSPENSION</span>;
    }
    if (code >= 500) {
      return <span className="bg-rose-100 text-rose-800 border border-rose-300 font-bold px-2 py-0.5 rounded font-mono text-[10px]">{code} Error</span>;
    }
    if (code >= 400) {
      return <span className="bg-amber-100 text-amber-800 border border-amber-300 font-bold px-2 py-0.5 rounded font-mono text-[10px]">{code} Client</span>;
    }
    return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded font-mono text-[10px]">200 Heartbeat</span>;
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-serif font-bold text-neutral-900">Server Health & Issue Monitoring</h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 15-Min Telemetry
            </span>
            {isLiveAsync ? (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live Async Active (5s)
              </span>
            ) : (
              <span className="bg-neutral-100 text-neutral-600 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-400"></span> Live Sync Paused
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Logs every 15 minutes database & endpoint performance, catching strictly 4xx, 5xx issues, and regional suspensions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLiveAsync(!isLiveAsync)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition cursor-pointer ${
              isLiveAsync
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
            title="Toggle real-time live background synchronization"
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveAsync ? 'text-emerald-600 animate-pulse' : 'text-neutral-400'}`} />
            {isLiveAsync ? 'Live Async: ON' : 'Live Async: OFF'}
          </button>

          <button
            type="button"
            onClick={handleSyncLogsToDb}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition cursor-pointer disabled:opacity-60"
            title="Synchronize pending in-memory and background server logs into DB now"
          >
            <Zap className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Logs to DB'}
          </button>

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
            onClick={handleRunTelemetryPing}
            disabled={isRunningPing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition cursor-pointer shadow-xs disabled:opacity-60"
          >
            {isRunningPing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            {isRunningPing ? 'Testing...' : 'Run 15-Min Health Ping'}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-500 px-1 -mt-4">
        <span>Showing {filteredLogs.length} recorded issues & telemetry pings</span>
        <span>Last synced: <span className="font-mono font-medium text-neutral-700">{lastSyncedIST}</span></span>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Neon DB Latency */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Database Latency</span>
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Database className="w-4 h-4" />
            </span>
          </div>
          <div className="pt-1">
            <p className="text-3xl font-bold font-serif text-neutral-900">{overview.dbLatencyMs} ms</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Neon Serverless Connected
            </p>
          </div>
        </div>

        {/* 4xx Errors */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">4xx Client Errors (24h)</span>
            <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="pt-1">
            <p className="text-3xl font-bold font-serif text-neutral-900">{overview.error4xxCount}</p>
            <p className="text-[11px] text-neutral-500 mt-1">404s & invalid path calls</p>
          </div>
        </div>

        {/* 5xx Server Errors */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">5xx Server Issues (24h)</span>
            <span className="p-2 bg-rose-100 text-rose-800 rounded-xl">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="pt-1">
            <p className="text-3xl font-bold font-serif text-neutral-900">{overview.error5xxCount}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              {overview.error5xxCount === 0 ? 'Zero critical server crashes' : 'Issues logged below'}
            </p>
          </div>
        </div>

        {/* Regional Health */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Regional Outages / Suspensions</span>
            <span className="p-2 bg-blue-100 text-blue-800 rounded-xl">
              <Globe className="w-4 h-4" />
            </span>
          </div>
          <div className="pt-1">
            <p className="text-3xl font-bold font-serif text-neutral-900">{overview.suspensionCount}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">All regions fully operational</p>
          </div>
        </div>
      </div>

      {/* DATABASE & GATEWAY STATUS STRIP */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Live Database & Gateway Connections</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {overview.regions.map((reg) => (
            <div key={reg.name} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-neutral-900">{reg.name}</p>
                <p className="text-[10px] text-neutral-500 font-mono">Live Ping: {reg.latencyMs} ms</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${reg.status === 'operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {reg.status}
              </span>
            </div>
          ))}
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
            placeholder="Search by endpoint, status, or region..."
            className="text-xs bg-transparent focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              typeFilter === 'all' ? 'bg-primary text-white font-bold' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            All Logs ({logs.length})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('4xx')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              typeFilter === '4xx' ? 'bg-amber-500 text-white font-bold' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            4xx Errors
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('5xx')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              typeFilter === '5xx' ? 'bg-rose-600 text-white font-bold' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            5xx Errors
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('suspension')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              typeFilter === 'suspension' ? 'bg-purple-600 text-white font-bold' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Regional Suspensions
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('heartbeat')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              typeFilter === 'heartbeat' ? 'bg-emerald-600 text-white font-bold' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            15-Min Heartbeats
          </button>
        </div>
      </div>

      {/* LOGS TABLE */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Timestamp (IST)</th>
                <th className="px-4 py-3.5">Status / Type</th>
                <th className="px-4 py-3.5">Region</th>
                <th className="px-4 py-3.5">Method & Endpoint</th>
                <th className="px-4 py-3.5">Response Time</th>
                <th className="px-4 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans">
              {filteredLogs.map((log) => {
                const isExpanded = expandedId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-neutral-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono text-neutral-700 whitespace-nowrap">
                        {formatIST(log.timestamp)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(log.statusCode, log.logType)}</td>
                      <td className="px-4 py-3 font-medium text-neutral-800 whitespace-nowrap">{log.region}</td>
                      <td className="px-4 py-3 font-mono text-neutral-700 truncate max-w-[200px]">
                        <span className="font-bold text-primary mr-1.5">{log.method}</span>
                        {log.endpoint}
                      </td>
                      <td className="px-4 py-3 font-mono text-neutral-600">
                        {log.responseTimeMs ? `${log.responseTimeMs} ms` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : log.id)}
                          className="text-primary hover:text-primary-dark font-bold text-[11px] cursor-pointer"
                        >
                          {isExpanded ? 'Hide' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-neutral-50">
                        <td colSpan={6} className="px-6 py-4 space-y-2">
                          <div className="bg-white p-4 rounded-xl border border-neutral-200 text-xs font-mono space-y-2">
                            {log.errorMessage && (
                              <div>
                                <span className="font-bold text-rose-600 block">Error Message:</span>
                                <p className="text-neutral-800">{log.errorMessage}</p>
                              </div>
                            )}
                            {log.metadata && (
                              <div>
                                <span className="font-bold text-neutral-500 block mb-1">Telemetry Payload:</span>
                                <pre className="text-[11px] text-neutral-700 whitespace-pre-wrap overflow-x-auto">
                                  {JSON.stringify(log.metadata, null, 2)}
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
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-neutral-500 text-xs">
                    No error logs or regional suspension events matching selected criteria.
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
