'use client';

import React, { useState, useRef } from 'react';
import type { MediaAssetItem } from '@/lib/site-cms-types';
import { Upload, Trash2, Copy, Check, Search, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function MediaLibraryTab({
  initialAssets = [],
  onAssetsUpdated,
}: {
  initialAssets?: MediaAssetItem[];
  onAssetsUpdated?: (assets: MediaAssetItem[]) => void;
}) {
  const [assets, setAssets] = useState<MediaAssetItem[]>(initialAssets);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = assets.filter(
    (a) =>
      a.filename.toLowerCase().includes(search.toLowerCase()) ||
      a.altText.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File exceeds the 10MB limit.');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', file.name.replace(/\.[^/.]+$/, ''));

    try {
      const res = await fetch('/api/cms/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload media');

      const updated = [data.asset, ...assets];
      setAssets(updated);
      onAssetsUpdated?.(updated);
      setSuccess(`"${file.name}" uploaded and stored in Neon DB successfully!`);
      setTimeout(() => setSuccess(''), 4000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (asset: MediaAssetItem) => {
    navigator.clipboard.writeText(asset.fileUrl);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    try {
      const res = await fetch(`/api/cms/media/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete asset');
      const updated = assets.filter((a) => a.id !== id);
      setAssets(updated);
      onAssetsUpdated?.(updated);
      setSuccess('Asset deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Error deleting asset');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Media & Asset Library</h2>
          <p className="text-sm text-neutral-600">
            Upload images and media directly to Neon DB. Copy URLs to paste into Hero Slides, Stories, or Programs.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,application/pdf"
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isUploading ? 'Uploading to Neon...' : 'Upload Image / File'}
          </button>
        </div>
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

      {/* SEARCH BAR */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-neutral-200 shadow-sm max-w-md">
        <Search className="w-4 h-4 text-neutral-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media by filename or alt text..."
          className="w-full text-sm bg-transparent focus:outline-none"
        />
      </div>

      {/* ASSETS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                {asset.contentType.startsWith('image/') ? (
                  <Image
                    src={asset.fileUrl}
                    alt={asset.altText || asset.filename}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white text-xs font-bold">
                    DOCUMENT
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-medium">
                  {formatBytes(asset.sizeBytes)}
                </div>
              </div>

              <div className="p-3 space-y-1">
                <p className="text-xs font-semibold text-neutral-900 truncate" title={asset.filename}>
                  {asset.filename}
                </p>
                <p className="text-[10px] text-neutral-500 font-mono truncate">{asset.fileUrl}</p>
              </div>
            </div>

            <div className="p-3 pt-0 flex items-center justify-between gap-2 border-t border-neutral-100 mt-2">
              <button
                type="button"
                onClick={() => handleCopyUrl(asset)}
                className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-[11px] font-bold text-neutral-800 transition-colors cursor-pointer"
              >
                {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === asset.id ? 'Copied!' : 'Copy URL'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(asset.id)}
                className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Delete asset"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-3 bg-white rounded-3xl border border-neutral-200">
            <ImageIcon className="w-12 h-12 text-neutral-300 mx-auto" />
            <p className="text-sm font-semibold text-neutral-700">No media assets found</p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Upload photos, banners, and brochures here to store them safely in Neon DB.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
