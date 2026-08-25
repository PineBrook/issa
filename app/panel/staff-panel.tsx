'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SignOutButton from './sign-out-button';
import type { StaffProfile, StaffRole } from '@/lib/staff';
import type { BlogPost, BlogStatus } from '@/lib/blog-types';
import {
  FileText,
  Users,
  Plus,
  Edit,
  Eye,
  Calendar,
  Clock,
  Search,
  RefreshCw,
  ExternalLink,
  Shield,
  CheckCircle,
  AlertCircle,
  Archive,
  RotateCcw,
} from 'lucide-react';

interface SessionUserInfo {
  id: string;
  email: string;
  name: string;
}

interface StaffPanelProps {
  initialUser: SessionUserInfo;
  initialStaff: StaffProfile | null;
  initialUsers?: StaffProfile[];
  initialPosts?: BlogPost[];
}

export default function StaffPanel({
  initialUser,
  initialStaff,
  initialUsers = [],
  initialPosts = [],
}: StaffPanelProps) {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffProfile | null>(initialStaff);
  const [users, setUsers] = useState<StaffProfile[]>(initialUsers);
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);

  // Active navigation tab: 'posts' | 'users'
  const [currentTab, setCurrentTab] = useState<'posts' | 'users'>('posts');

  // Posts Filter & Search State
  const [postStatusFilter, setPostStatusFilter] = useState<string>('all');
  const [postSearchQuery, setPostSearchQuery] = useState('');
  const [isRefreshingPosts, setIsRefreshingPosts] = useState(false);

  // Access Request & User management state
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [userSearchFilter, setUserSearchFilter] = useState('');

  const hasAuthorizedRole = staff && (staff.role === 'ADMIN' || staff.role === 'CONTENT');
  const isPendingAccess = !hasAuthorizedRole;
  const isAdmin = staff?.role === 'ADMIN';

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/staff/status', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.staff) {
        setStaff(data.staff);
        if (data.staff.role === 'ADMIN' || data.staff.role === 'CONTENT') {
          router.refresh();
        }
      }
    } catch {
      // Silent retry on polling error
    }
  }, [router]);

  const refreshUsersList = useCallback(async () => {
    if (!hasAuthorizedRole) return;
    try {
      const res = await fetch('/api/staff/users', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.users) {
        setUsers(data.users);
      }
    } catch {
      // Silent error
    }
  }, [hasAuthorizedRole]);

  const refreshPostsList = useCallback(async () => {
    if (!hasAuthorizedRole) return;
    setIsRefreshingPosts(true);
    try {
      const res = await fetch('/api/cms/posts', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.posts) {
        setPosts(data.posts);
      }
    } catch {
      // Silent error
    } finally {
      setIsRefreshingPosts(false);
    }
  }, [hasAuthorizedRole]);

  // Real-time polling when waiting for access approval
  useEffect(() => {
    if (!isPendingAccess) return;

    const interval = setInterval(() => {
      checkStatus();
    }, 2500);

    return () => {
      clearInterval(interval);
    };
  }, [isPendingAccess, checkStatus]);

  async function handleRequestAccess() {
    setRequesting(true);
    setMessage('');
    try {
      const res = await fetch('/api/staff/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.profile) {
        setStaff(data.profile);
        if (data.profile.role === 'ADMIN' || data.profile.role === 'CONTENT') {
          router.refresh();
        } else {
          setMessage('Request submitted successfully! Waiting for an admin to grant access.');
        }
      } else if (data.message) {
        setMessage(data.message);
      }
    } catch {
      setMessage('Failed to submit access request. Please try again.');
    } finally {
      setRequesting(false);
    }
  }

  async function handleRoleChange(userId: number, newRole: StaffRole) {
    setUpdatingUserId(userId);
    try {
      const res = await fetch('/api/staff/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
        );
        refreshUsersList();
      }
    } catch {
      // Error handling
    } finally {
      setUpdatingUserId(null);
    }
  }

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesStatus = postStatusFilter === 'all' || p.status === postStatusFilter;
    const q = postSearchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.authorName.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Filter users
  const filteredUsers = users.filter((u) => {
    const q = userSearchFilter.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(q) ||
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const postCounts = {
    all: posts.length,
    draft: posts.filter((p) => p.status === 'draft').length,
    in_review: posts.filter((p) => p.status === 'in_review').length,
    scheduled: posts.filter((p) => p.status === 'scheduled').length,
    published: posts.filter((p) => p.status === 'published').length,
    archived: posts.filter((p) => p.status === 'archived').length,
  };

  const statusBadgeClasses: Record<string, string> = {
    draft: 'bg-amber-100 text-amber-800 border-amber-300',
    in_review: 'bg-blue-100 text-blue-800 border-blue-300',
    scheduled: 'bg-purple-100 text-purple-800 border-purple-300',
    published: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    archived: 'bg-neutral-200 text-neutral-700 border-neutral-300',
  };

  // Authorized View
  if (hasAuthorizedRole && staff) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-[#F7F6F3] px-4 sm:px-6 py-10 text-[#071E13]">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-semibold">Welcome, {staff.fullName}</h1>
                <span className="inline-flex items-center rounded-full bg-[#0D311F]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0D311F]">
                  {staff.role}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-600">
                ISSA Operations & Content Panel &bull; Signed in as <span className="font-medium text-[#071E13]">{staff.email}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/stories"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition"
              >
                View Public Site <ExternalLink className="h-3.5 w-3.5 opacity-60" />
              </Link>
              <SignOutButton />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E0D8] pb-1">
            <button
              type="button"
              onClick={() => setCurrentTab('posts')}
              className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-sm font-semibold transition cursor-pointer border-b-2 ${
                currentTab === 'posts'
                  ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                  : 'border-transparent text-neutral-600 hover:text-[#071E13]'
              }`}
            >
              <FileText className="h-4 w-4" />
              Blog Posts & Stories
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-bold text-neutral-700">
                {posts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('users')}
              className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-sm font-semibold transition cursor-pointer border-b-2 ${
                currentTab === 'users'
                  ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                  : 'border-transparent text-neutral-600 hover:text-[#071E13]'
              }`}
            >
              <Users className="h-4 w-4" />
              Staff & Access Directory
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-bold text-neutral-700">
                {users.length}
              </span>
            </button>
          </div>

          {/* TAB 1: BLOG POSTS (CMS) */}
          {currentTab === 'posts' && (
            <div className="rounded-2xl border border-[#E5E0D8] bg-white shadow-sm overflow-hidden space-y-0">
              {/* Top Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] p-6 bg-white">
                <div>
                  <h2 className="text-xl font-semibold text-[#071E13]">Blog Posts & Stories CMS</h2>
                  <p className="mt-1 text-xs text-neutral-500">
                    Author, edit, submit for review, schedule, and publish stories across ISSA initiatives.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={refreshPostsList}
                    disabled={isRefreshingPosts}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRefreshingPosts ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>

                  <Link
                    href="/panel/posts/new"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D311F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#17452F] transition shadow-xs"
                  >
                    <Plus className="h-4 w-4" /> New Blog Post
                  </Link>
                </div>
              </div>

              {/* Status Filters & Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] bg-[#FAF9F7] px-6 py-3">
                {/* Status Pills */}
                <div className="flex flex-wrap gap-1.5 text-xs font-medium">
                  {(['all', 'draft', 'in_review', 'scheduled', 'published', 'archived'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setPostStatusFilter(st)}
                      className={`rounded-lg px-3 py-1.5 transition cursor-pointer capitalize ${
                        postStatusFilter === st
                          ? 'bg-[#0D311F] text-white font-semibold'
                          : 'bg-white border border-[#E5E0D8] text-neutral-700 hover:bg-[#F7F6F3]'
                      }`}
                    >
                      {st.replace('_', ' ')}
                      <span className={`ml-1.5 text-[10px] rounded-full px-1.5 py-0.2 ${postStatusFilter === st ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                        {postCounts[st]}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                  <input
                    type="text"
                    value={postSearchQuery}
                    onChange={(e) => setPostSearchQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full rounded-lg border border-[#E5E0D8] bg-white pl-8 pr-3 py-1.5 text-xs text-[#071E13] outline-none transition focus:border-[#0D311F]"
                  />
                </div>
              </div>

              {/* Posts Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F7F6F3] text-xs uppercase tracking-wider text-neutral-600 border-b border-[#E5E0D8]">
                    <tr>
                      <th scope="col" className="px-6 py-3.5 font-semibold">Post Title & Slug</th>
                      <th scope="col" className="px-6 py-3.5 font-semibold">Category</th>
                      <th scope="col" className="px-6 py-3.5 font-semibold">Author</th>
                      <th scope="col" className="px-6 py-3.5 font-semibold">Status</th>
                      <th scope="col" className="px-6 py-3.5 font-semibold">Version</th>
                      <th scope="col" className="px-6 py-3.5 font-semibold">Last Updated</th>
                      <th scope="col" className="px-6 py-3.5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E0D8]">
                    {filteredPosts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-neutral-500 text-xs">
                          No blog posts found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredPosts.map((post) => (
                        <tr key={post.id || post.slug} className="hover:bg-[#FDFCFB] transition">
                          <td className="px-6 py-4 max-w-sm">
                            <div className="font-semibold text-[#071E13] line-clamp-1">
                              {post.title}
                            </div>
                            <div className="text-[11px] font-mono text-neutral-500 line-clamp-1">
                              /blog/{post.slug}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block rounded-md bg-[#0D311F]/10 px-2 py-0.5 text-xs font-semibold text-[#0D311F]">
                              {post.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-neutral-700">
                            {post.authorName}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                                statusBadgeClasses[post.status || 'draft'] || statusBadgeClasses.draft
                              }`}
                            >
                              {post.status?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono font-medium text-neutral-600">
                            v{post.version || 1}
                          </td>
                          <td className="px-6 py-4 text-xs text-neutral-500">
                            {post.updatedAt
                              ? new Date(post.updatedAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  timeZone: 'Asia/Kolkata',
                                })
                              : post.displayDate}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              {post.id && (
                                <>
                                  <Link
                                    href={`/panel/posts/${post.id}`}
                                    className="inline-flex items-center gap-1 rounded-md border border-[#E5E0D8] bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition"
                                  >
                                    <Edit className="h-3 w-3" /> Edit
                                  </Link>
                                  <Link
                                    href={`/panel/posts/${post.id}/preview`}
                                    target="_blank"
                                    className="inline-flex items-center gap-1 rounded-md border border-[#E5E0D8] bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition"
                                  >
                                    <Eye className="h-3 w-3" /> Preview
                                  </Link>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-[#E5E0D8] bg-[#FAF9F7] px-6 py-3 text-xs text-neutral-500 flex justify-between items-center">
                <span>Showing {filteredPosts.length} of {posts.length} posts</span>
                <span>Role: <strong>{staff.role}</strong> ({isAdmin ? 'Full editorial & publishing rights' : 'Draft authoring & review submission'})</span>
              </div>
            </div>
          )}

          {/* TAB 2: STAFF & ACCESS DIRECTORY */}
          {currentTab === 'users' && (
            <div className="rounded-2xl border border-[#E5E0D8] bg-white shadow-sm overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] p-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#071E13]">Staff & Access Directory</h2>
                  <p className="mt-1 text-xs text-neutral-500">
                    Registered Pinebrook Technologies accounts with assigned operational roles.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={userSearchFilter}
                    onChange={(e) => setUserSearchFilter(e.target.value)}
                    placeholder="Filter staff..."
                    className="rounded-lg border border-[#E5E0D8] bg-[#FDFCFB] px-3 py-1.5 text-sm text-[#071E13] outline-none transition focus:border-[#0D311F]"
                  />
                  <button
                    type="button"
                    onClick={refreshUsersList}
                    title="Refresh user list"
                    className="rounded-lg border border-[#E5E0D8] bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-[#F7F6F3] transition cursor-pointer"
                  >
                    ↻ Refresh
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F7F6F3] text-xs uppercase tracking-wider text-neutral-600 border-b border-[#E5E0D8]">
                    <tr>
                      <th scope="col" className="px-6 py-3.5 font-semibold">First Name</th>
                      <th scope="col" className="px-6 py-3.5 font-semibold">Email</th>
                      <th scope="col" className="px-6 py-3.5 font-semibold">Role</th>
                      {isAdmin && <th scope="col" className="px-6 py-3.5 font-semibold text-right">Role Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E0D8]">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={isAdmin ? 4 : 3} className="px-6 py-8 text-center text-neutral-500">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-[#FDFCFB] transition">
                          <td className="px-6 py-4 font-medium text-[#071E13]">
                            {u.firstName || u.fullName.split(' ')[0] || '—'}
                          </td>
                          <td className="px-6 py-4 text-neutral-700">
                            {u.email}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                u.role === 'ADMIN'
                                  ? 'bg-purple-100 text-purple-800'
                                  : u.role === 'CONTENT'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {u.role === 'NO_ACCESS' ? 'No Access' : u.role}
                            </span>
                          </td>
                          {isAdmin && (
                            <td className="px-6 py-4 text-right">
                              <select
                                value={u.role}
                                disabled={updatingUserId === u.id}
                                onChange={(e) => handleRoleChange(u.id, e.target.value as StaffRole)}
                                className="rounded-lg border border-[#E5E0D8] bg-white px-2.5 py-1 text-xs font-medium text-[#071E13] outline-none transition hover:border-[#0D311F] focus:border-[#0D311F] disabled:opacity-50 cursor-pointer"
                              >
                                <option value="NO_ACCESS">No Access</option>
                                <option value="CONTENT">Content</option>
                                <option value="ADMIN">Admin</option>
                              </select>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-[#E5E0D8] bg-[#FAF9F7] px-6 py-3 text-xs text-neutral-500">
                Total registered users: <span className="font-medium text-[#071E13]">{users.length}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Request Access / Pending View
  const isAlreadyRequested = staff?.role === 'NO_ACCESS';

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F7F6F3] px-6 py-16 text-[#071E13]">
      <section className="w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0D311F]/10 text-2xl">
          🔒
        </div>

        <h1 className="text-2xl font-semibold">
          {isAlreadyRequested ? 'Access Request Pending' : 'Staff Access Required'}
        </h1>

        <p className="mt-2 text-sm text-neutral-600">
          Signed in as <span className="font-medium text-[#071E13]">{initialUser.email}</span>
        </p>

        {isAlreadyRequested ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Pending Approval
              </span>
            </div>
            <p className="mt-2 text-sm text-amber-900">
              Your access request has been recorded. An administrator will review and assign your role (Admin or Content).
            </p>
            <p className="mt-2 text-xs text-amber-700">
              This screen will automatically refresh as soon as your role is approved.
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-sm text-neutral-600">
              You are authenticated, but you have not yet been granted staff access to the panel.
            </p>

            <button
              type="button"
              disabled={requesting}
              onClick={handleRequestAccess}
              className="mt-6 w-full cursor-pointer rounded-lg bg-[#0D311F] px-4 py-3 font-medium text-white transition-colors hover:bg-[#17452F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {requesting ? 'Submitting Request...' : 'Request Access'}
            </button>
          </div>
        )}

        {message && (
          <p className="mt-4 text-sm font-medium text-emerald-700">{message}</p>
        )}

        <div className="mt-6 border-t border-[#E5E0D8] pt-6">
          <SignOutButton />
        </div>
      </section>
    </div>
  );
}
