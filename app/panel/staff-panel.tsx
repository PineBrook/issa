'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SignOutButton from './sign-out-button';
import { authClient } from '@/lib/auth/client';
import type { StaffProfile, StaffRole } from '@/lib/staff';
import type { BlogPost } from '@/lib/blog-types';
import type {
  PanelJobOpening,
  PanelCareerApplication,
  JobStatus,
  CareerApplicationStatus,
  CareerMetrics,
  JobOpeningInput,
} from '@/lib/careers-types';
import type {
  SiteSettings,
  HeroSlideItem,
  HomeSectionsData,
  ImpactContentData,
  ProgramContentData,
  FaqItem,
  OfficeLocationItem,
  MediaAssetItem,
  LegalPageItem,
  ContactSubmissionItem,
  NewsletterSubscriberItem,
} from '@/lib/site-cms-types';
import SiteSettingsTab from '@/components/cms/SiteSettingsTab';
import HeroSlidesTab from '@/components/cms/HeroSlidesTab';
import HomeSectionsTab from '@/components/cms/HomeSectionsTab';
import ProgramsTab from '@/components/cms/ProgramsTab';
import ImpactTab from '@/components/cms/ImpactTab';
import FaqsOfficesTab from '@/components/cms/FaqsOfficesTab';
import LegalPagesTab from '@/components/cms/LegalPagesTab';
import MediaLibraryTab from '@/components/cms/MediaLibraryTab';
import InquiriesTab from '@/components/cms/InquiriesTab';
import AuditLogTab from '@/components/cms/AuditLogTab';
import ServerLogsTab from '@/components/cms/ServerLogsTab';
import type { AuditEventRecord } from '@/lib/audit';
import type { ServerLogItem, ServerHealthOverview } from '@/lib/server-logger';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  UserCheck,
  Users,
  Plus,
  Edit,
  Eye,
  Search,
  RefreshCw,
  ExternalLink,
  Shield,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Download,
  X,
  ChevronRight,
  Trash2,
  Archive,
  ArchiveRestore,
  User,
  FileCode,
  Check,
  Sliders,
  Image as ImageIcon,
  Home as HomeIcon,
  BookOpen,
  BarChart3,
  HelpCircle,
  Mail,
  FolderOpen,
  ShieldCheck,
  Activity,
  Server,
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
  initialJobs?: PanelJobOpening[];
  initialApplications?: PanelCareerApplication[];
  initialCareerMetrics?: CareerMetrics;
  initialSiteSettings?: SiteSettings;
  initialHeroSlides?: HeroSlideItem[];
  initialHomeSections?: HomeSectionsData;
  initialImpactContent?: ImpactContentData;
  initialProgramsContent?: Record<string, ProgramContentData>;
  initialFaqs?: FaqItem[];
  initialOffices?: OfficeLocationItem[];
  initialMediaAssets?: MediaAssetItem[];
  initialLegalPrivacy?: LegalPageItem | null;
  initialLegalTerms?: LegalPageItem | null;
  initialInquiries?: ContactSubmissionItem[];
  initialSubscribers?: NewsletterSubscriberItem[];
  initialAuditEvents?: AuditEventRecord[];
  initialServerLogs?: ServerLogItem[];
  initialServerOverview?: ServerHealthOverview;
}

export default function StaffPanel({
  initialUser,
  initialStaff,
  initialUsers = [],
  initialPosts = [],
  initialJobs = [],
  initialApplications = [],
  initialCareerMetrics = {
    totalActiveJobs: 0,
    totalJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    underReviewApplications: 0,
  },
  initialSiteSettings,
  initialHeroSlides = [],
  initialHomeSections,
  initialImpactContent,
  initialProgramsContent = {},
  initialFaqs = [],
  initialOffices = [],
  initialMediaAssets = [],
  initialLegalPrivacy = null,
  initialLegalTerms = null,
  initialInquiries = [],
  initialSubscribers = [],
  initialAuditEvents = [],
  initialServerLogs = [],
  initialServerOverview,
}: StaffPanelProps) {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffProfile | null>(initialStaff);
  const [users, setUsers] = useState<StaffProfile[]>(initialUsers);
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [jobs, setJobs] = useState<PanelJobOpening[]>(initialJobs);
  const [applications, setApplications] = useState<PanelCareerApplication[]>(initialApplications);
  const [_careerMetrics] = useState<CareerMetrics>(initialCareerMetrics);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetItem[]>(initialMediaAssets);

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<
    | 'overview'
    | 'settings'
    | 'hero'
    | 'home'
    | 'programs'
    | 'impact'
    | 'faqs_offices'
    | 'legal'
    | 'media'
    | 'inquiries'
    | 'posts'
    | 'jobs'
    | 'applications'
    | 'users'
    | 'audit'
    | 'server_logs'
  >('overview');

  // Posts Filter & Search State
  const [postStatusFilter, setPostStatusFilter] = useState<string>('all');
  const [postSearchQuery, setPostSearchQuery] = useState('');
  const [isRefreshingPosts, setIsRefreshingPosts] = useState(false);

  // Job Openings Filter & Search State
  const [jobStatusFilter, setJobStatusFilter] = useState<string>('all');
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [isRefreshingJobs, setIsRefreshingJobs] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<PanelJobOpening | null>(null);
  const [jobFormData, setJobFormData] = useState<JobOpeningInput>({
    title: '',
    slug: '',
    department: 'Academic Programs',
    location: 'Srinagar Garhwal, Uttarakhand',
    employmentType: 'Full-time (On-site)',
    salary: '',
    description: '',
    requirements: '',
    status: 'active',
    displayOrder: 1,
    closingTime: null,
  });
  const [jobFormError, setJobFormError] = useState('');
  const [isSavingJob, setIsSavingJob] = useState(false);

  // Career Applications Filter & Search State
  const [appStatusFilter, setAppStatusFilter] = useState<string>('all');
  const [appRoleFilter, setAppRoleFilter] = useState<string>('all');
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [isRefreshingApps, setIsRefreshingApps] = useState(false);
  const [selectedApp, setSelectedApp] = useState<PanelCareerApplication | null>(null);
  const [isUpdatingAppStatus, setIsUpdatingAppStatus] = useState(false);
  const [appStatusUpdateTarget, setAppStatusUpdateTarget] = useState<CareerApplicationStatus>('new');
  const [appAssigneeTarget, setAppAssigneeTarget] = useState<string>('');
  const [appStatusFeedback, setAppStatusFeedback] = useState<string>('');

  // Access Request & User management state
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [userSearchFilter, setUserSearchFilter] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'pending' | 'content' | 'admin'>('all');
  const [userActionFeedback, setUserActionFeedback] = useState('');
  const [isRefreshingUsers, setIsRefreshingUsers] = useState(false);

  const hasAuthorizedRole = staff && (staff.role === 'ADMIN' || staff.role === 'CONTENT');
  const isPendingAccess = !hasAuthorizedRole;
  const isAdmin = staff?.role === 'ADMIN';
  const canManageJobs = isAdmin || staff?.role === 'CONTENT';

  useEffect(() => {
    const expiresAt = Number(document.cookie.match(/(?:^|; )issa_session_limit=(\d+)\./)?.[1]);
    if (!expiresAt) return;

    const timeout = window.setTimeout(async () => {
      try {
        await authClient.signOut();
      } finally {
        window.location.assign('/login?expired=1');
      }
    }, Math.max(0, expiresAt * 1000 - Date.now()));
    return () => window.clearTimeout(timeout);
  }, []);

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
      // Silent retry
    }
  }, [router]);

  const refreshUsersList = useCallback(async () => {
    if (!isAdmin) return;
    setIsRefreshingUsers(true);
    try {
      const res = await fetch('/api/staff/users', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.users) {
        setUsers(data.users);
      }
    } catch {
      // Silent error
    } finally {
      setIsRefreshingUsers(false);
    }
  }, [isAdmin]);

  // Restrict CONTENT role users from accessing admin-only tabs
  useEffect(() => {
    if (staff && staff.role === 'CONTENT' && (currentTab === 'settings' || currentTab === 'users' || currentTab === 'applications' || currentTab === 'audit')) {
      setCurrentTab('overview');
    }
    if (staff && staff.role === 'CONTENT' && currentTab === 'server_logs') {
      setCurrentTab('overview');
    }
  }, [staff, currentTab]);

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

  const refreshJobsList = useCallback(async () => {
    if (!hasAuthorizedRole) return;
    setIsRefreshingJobs(true);
    try {
      const res = await fetch('/api/careers/jobs', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.jobs) {
        setJobs(data.jobs);
      }
    } catch {
      // Silent error
    } finally {
      setIsRefreshingJobs(false);
    }
  }, [hasAuthorizedRole]);

  const refreshApplicationsList = useCallback(async () => {
    if (!isAdmin) return;
    setIsRefreshingApps(true);
    try {
      const res = await fetch('/api/careers/applications', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.applications) {
        setApplications(data.applications);
      }
    } catch {
      // Silent error
    } finally {
      setIsRefreshingApps(false);
    }
  }, [isAdmin]);

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

  // Periodic background polling for Admins to auto-detect new signups and applications
  useEffect(() => {
    if (!isAdmin) return;

    const interval = setInterval(() => {
      refreshUsersList();
      refreshApplicationsList();
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [isAdmin, refreshUsersList, refreshApplicationsList]);

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
          setMessage('Request submitted successfully. Waiting for an admin to assign a role.');
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
    setUserActionFeedback('');
    try {
      const res = await fetch('/api/staff/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.users) {
          setUsers(data.users);
        } else {
          setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
          );
        }
        setUserActionFeedback(`User assigned role: ${newRole === 'NO_ACCESS' ? 'No Access' : newRole}.`);
        setTimeout(() => setUserActionFeedback(''), 4000);
      } else {
        setUserActionFeedback(data.error || 'Failed to update user role.');
      }
    } catch {
      setUserActionFeedback('Network error updating user role.');
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleDeleteUser(userId: number, userName?: string) {
    if (!confirm(`Are you sure you want to remove the access request/account for ${userName || 'this user'}?`)) return;
    setUpdatingUserId(userId);
    setUserActionFeedback('');
    try {
      const res = await fetch(`/api/staff/users?userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok) {
        if (data.users) {
          setUsers(data.users);
        } else {
          setUsers((prev) => prev.filter((u) => u.id !== userId));
        }
        setUserActionFeedback('User request/account removed.');
        setTimeout(() => setUserActionFeedback(''), 4000);
      } else {
        setUserActionFeedback(data.error || 'Failed to remove user.');
      }
    } catch {
      setUserActionFeedback('Network error removing user.');
    } finally {
      setUpdatingUserId(null);
    }
  }

  // Handle open job modal (for create or edit)
  function handleOpenJobModal(jobToEdit?: PanelJobOpening) {
    setJobFormError('');
    if (jobToEdit) {
      setEditingJob(jobToEdit);
      setJobFormData({
        title: jobToEdit.title,
        slug: jobToEdit.slug,
        department: jobToEdit.department,
        location: jobToEdit.location,
        employmentType: jobToEdit.employmentType,
        salary: jobToEdit.salary || '',
        description: jobToEdit.description,
        requirements: Array.isArray(jobToEdit.requirements)
          ? jobToEdit.requirements.join('\n')
          : (typeof jobToEdit.requirements === 'string' ? jobToEdit.requirements : ''),
        status: jobToEdit.status,
        displayOrder: jobToEdit.displayOrder,
        closingTime: jobToEdit.closingTime || null,
      });
    } else {
      setEditingJob(null);
      setJobFormData({
        title: '',
        slug: '',
        department: 'Academic Programs',
        location: 'Srinagar Garhwal, Uttarakhand',
        employmentType: 'Full-time (On-site)',
        salary: '',
        description: '',
        requirements: '',
        status: 'active',
        displayOrder: jobs.length + 1,
        closingTime: null,
      });
    }
    setIsJobModalOpen(true);
  }

  async function handleSaveJobSubmit(e: React.FormEvent) {
    e.preventDefault();
    setJobFormError('');
    setIsSavingJob(true);

    try {
      const reqsArray = typeof jobFormData.requirements === 'string'
        ? jobFormData.requirements.split('\n').map((s) => s.trim()).filter(Boolean)
        : jobFormData.requirements;

      const payload = {
        ...jobFormData,
        requirements: reqsArray,
      };

      let res: Response;
      if (editingJob) {
        res = await fetch(`/api/careers/jobs/${editingJob.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/careers/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setJobFormError(data.error || 'Failed to save job opening.');
        return;
      }

      setIsJobModalOpen(false);
      refreshJobsList();
    } catch (err: any) {
      setJobFormError(err.message || 'An error occurred while saving the job.');
    } finally {
      setIsSavingJob(false);
    }
  }

  async function handleJobStatusQuickToggle(job: PanelJobOpening, newStatus: JobStatus) {
    try {
      const res = await fetch(`/api/careers/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
        );
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to update job status');
      }
    } catch {
      alert('Network error updating job status');
    }
  }

  async function handleDeleteJob(jobId: number) {
    if (!confirm('Are you sure you want to archive or remove this job opening?')) return;
    try {
      const res = await fetch(`/api/careers/jobs/${jobId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        refreshJobsList();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Network error deleting job opening');
    }
  }

  // Handle Application selection & status update
  function handleSelectApplication(app: PanelCareerApplication) {
    setSelectedApp(app);
    setAppStatusUpdateTarget(app.status);
    setAppAssigneeTarget(app.assignedTo || '');
    setAppStatusFeedback('');
  }

  async function handleUpdateApplicationStatus() {
    if (!selectedApp) return;
    setIsUpdatingAppStatus(true);
    setAppStatusFeedback('');

    try {
      const res = await fetch(`/api/careers/applications/${selectedApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: appStatusUpdateTarget,
          assignedTo: appAssigneeTarget,
        }),
      });

      const data = await res.json();
      if (res.ok && data.application) {
        setSelectedApp(data.application);
        setApplications((prev) =>
          prev.map((a) => (a.id === selectedApp.id ? data.application : a))
        );
        setAppStatusFeedback('Application updated successfully.');
        setTimeout(() => setAppStatusFeedback(''), 3000);
      } else {
        setAppStatusFeedback(data.error || 'Failed to update application.');
      }
    } catch (err: any) {
      setAppStatusFeedback(err.message || 'Update failed.');
    } finally {
      setIsUpdatingAppStatus(false);
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

  // Filter jobs
  const filteredJobs = jobs.filter((j) => {
    const matchesStatus = jobStatusFilter === 'all' || j.status === jobStatusFilter;
    const q = jobSearchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      j.title.toLowerCase().includes(q) ||
      j.slug.toLowerCase().includes(q) ||
      j.department.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Filter applications
  const filteredApplications = applications.filter((a) => {
    const matchesStatus = appStatusFilter === 'all' || a.status === appStatusFilter;
    const matchesRole = appRoleFilter === 'all' || a.roleSlug === appRoleFilter;
    const q = appSearchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      a.fullName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.jobTitle && a.jobTitle.toLowerCase().includes(q)) ||
      (a.assignedTo && a.assignedTo.toLowerCase().includes(q));
    return matchesStatus && matchesRole && matchesSearch;
  });

  const userCounts = {
    all: users.length,
    pending: users.filter((u) => u.role === 'NO_ACCESS').length,
    content: users.filter((u) => u.role === 'CONTENT').length,
    admin: users.filter((u) => u.role === 'ADMIN').length,
  };

  const pendingUsers = users.filter((u) => u.role === 'NO_ACCESS');

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesRole =
      userRoleFilter === 'all'
        ? true
        : userRoleFilter === 'pending'
        ? u.role === 'NO_ACCESS'
        : userRoleFilter === 'content'
        ? u.role === 'CONTENT'
        : userRoleFilter === 'admin'
        ? u.role === 'ADMIN'
        : true;

    const q = userSearchFilter.toLowerCase();
    const matchesSearch =
      !q ||
      u.firstName.toLowerCase().includes(q) ||
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q);

    return matchesRole && matchesSearch;
  });

  const postCounts = {
    all: posts.length,
    draft: posts.filter((p) => p.status === 'draft').length,
    in_review: posts.filter((p) => p.status === 'in_review').length,
    scheduled: posts.filter((p) => p.status === 'scheduled').length,
    published: posts.filter((p) => p.status === 'published').length,
    archived: posts.filter((p) => p.status === 'archived').length,
  };

  const jobCounts = {
    all: jobs.length,
    active: jobs.filter((j) => j.status === 'active').length,
    draft: jobs.filter((j) => j.status === 'draft').length,
    closed: jobs.filter((j) => j.status === 'closed').length,
    archived: jobs.filter((j) => j.status === 'archived').length,
  };

  const appCounts = {
    all: applications.length,
    new: applications.filter((a) => a.status === 'new').length,
    under_review: applications.filter((a) => a.status === 'under_review').length,
    interview_scheduled: applications.filter((a) => a.status === 'interview_scheduled').length,
    hired: applications.filter((a) => a.status === 'hired').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    archived: applications.filter((a) => a.status === 'archived').length,
  };

  const statusBadgeClasses: Record<string, string> = {
    draft: 'bg-amber-100 text-amber-800 border-amber-300',
    in_review: 'bg-blue-100 text-blue-800 border-blue-300',
    scheduled: 'bg-purple-100 text-purple-800 border-purple-300',
    published: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    archived: 'bg-neutral-200 text-neutral-700 border-neutral-300',
    active: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    closed: 'bg-neutral-200 text-neutral-700 border-neutral-300',
    new: 'bg-blue-100 text-blue-800 border-blue-300',
    under_review: 'bg-amber-100 text-amber-800 border-amber-300',
    interview_scheduled: 'bg-purple-100 text-purple-800 border-purple-300',
    hired: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
  };

  // Authorized View
  if (hasAuthorizedRole && staff) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-[#F7F6F3] px-4 py-8 sm:px-6 text-[#071E13]">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E5E0D8] bg-white p-5 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-[#071E13]">ISSA Operations Panel</h1>
                <span className="inline-flex items-center rounded-full bg-[#0D311F]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0D311F]">
                  {staff.role}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-600">
                Staff Account: <span className="font-medium text-[#071E13]">{staff.email}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/careers"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition"
              >
                Careers Portal <ExternalLink className="h-3.5 w-3.5 opacity-60" />
              </Link>
              <Link
                href="/stories"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition"
              >
                Public Site <ExternalLink className="h-3.5 w-3.5 opacity-60" />
              </Link>
              <SignOutButton />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E5E0D8] pb-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setCurrentTab('overview')}
              className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                currentTab === 'overview'
                  ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                  : 'border-transparent text-neutral-600 hover:text-[#071E13]'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Overview
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setCurrentTab('settings')}
                className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                  currentTab === 'settings'
                    ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                    : 'border-transparent text-neutral-600 hover:text-[#071E13]'
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                Site Settings
              </button>
            )}

            <button
              type="button"
              onClick={() => setCurrentTab('hero')}
              className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                currentTab === 'hero'
                  ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                  : 'border-transparent text-neutral-600 hover:text-[#071E13]'
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Hero Slides
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('home')}
              className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                currentTab === 'home'
                  ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                  : 'border-transparent text-neutral-600 hover:text-[#071E13]'
              }`}
            >
              <HomeIcon className="h-3.5 w-3.5" />
              Homepage
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('programs')}
              className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                currentTab === 'programs'
                  ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                  : 'border-transparent text-neutral-600 hover:text-[#071E13]'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Programs
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('impact')}
              className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                currentTab === 'impact'
                  ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                  : 'border-transparent text-neutral-600 hover:text-[#071E13]'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Impact
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('faqs_offices')}
              className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                currentTab === 'faqs_offices'
                  ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                  : 'border-transparent text-neutral-600 hover:text-[#071E13]'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              FAQs & Offices
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('media')}
              className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                currentTab === 'media'
                  ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                  : 'border-transparent text-neutral-600 hover:text-[#071E13]'
              }`}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Media
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('inquiries')}
              className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                currentTab === 'inquiries'
                  ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                  : 'border-transparent text-neutral-600 hover:text-[#071E13]'
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              Inquiries
              {initialInquiries.filter((i) => i.status === 'new').length > 0 && (
                <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-bold text-[#071E13]">
                  {initialInquiries.filter((i) => i.status === 'new').length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('posts')}
              className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                currentTab === 'posts'
                  ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                  : 'border-transparent text-neutral-600 hover:text-[#071E13]'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Stories
              <span className="rounded-full bg-neutral-200 px-1.5 py-0.2 text-[10px] font-bold text-neutral-700">
                {posts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('jobs')}
              className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                currentTab === 'jobs'
                  ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                  : 'border-transparent text-neutral-600 hover:text-[#071E13]'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              Jobs
              <span className="rounded-full bg-neutral-200 px-1.5 py-0.2 text-[10px] font-bold text-neutral-700">
                {jobs.length}
              </span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setCurrentTab('applications')}
                className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                  currentTab === 'applications'
                    ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                    : 'border-transparent text-neutral-600 hover:text-[#071E13]'
                }`}
              >
                <UserCheck className="h-3.5 w-3.5" />
                Applications
                {appCounts.new > 0 && (
                  <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-bold text-[#071E13]">
                    {appCounts.new}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setCurrentTab('legal')}
              className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                currentTab === 'legal'
                  ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                  : 'border-transparent text-neutral-600 hover:text-[#071E13]'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              Legal
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setCurrentTab('users')}
                className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                  currentTab === 'users'
                    ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                    : 'border-transparent text-neutral-600 hover:text-[#071E13]'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                Users
                {userCounts.pending > 0 ? (
                  <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-bold text-[#071E13] animate-pulse" title={`${userCounts.pending} pending access requests`}>
                    {userCounts.pending} req
                  </span>
                ) : (
                  <span className="rounded-full bg-neutral-200 px-1.5 py-0.2 text-[10px] font-bold text-neutral-700">
                    {users.length}
                  </span>
                )}
              </button>
            )}

            {isAdmin && (
              <button
                type="button"
                onClick={() => setCurrentTab('audit')}
                className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                  currentTab === 'audit'
                    ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                    : 'border-transparent text-neutral-600 hover:text-[#071E13]'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Audit Log
              </button>
            )}

            {isAdmin && (
              <button
                type="button"
                onClick={() => setCurrentTab('server_logs')}
                className={`inline-flex items-center gap-1.5 rounded-t-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                  currentTab === 'server_logs'
                    ? 'border-[#0D311F] bg-white text-[#0D311F] shadow-xs'
                    : 'border-transparent text-neutral-600 hover:text-[#071E13]'
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                Server Logs
              </button>
            )}
          </div>

          {/* TAB 0: OVERVIEW */}
          {currentTab === 'overview' && (
            <div className="space-y-6">
              {/* Action Banner for Admins if new users signed up */}
              {isAdmin && userCounts.pending > 0 && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4.5 shadow-xs flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3.5">
                    <div className="rounded-xl bg-amber-400/20 p-2.5 text-amber-900 shrink-0">
                      <AlertCircle className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-[#071E13]">
                          {userCounts.pending} Staff Access Request{userCounts.pending > 1 ? 's' : ''} Pending Approval
                        </h3>
                        <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-[#071E13]">
                          Action Required
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        New staff have signed up with their Pinebrook ID and are waiting for role approval in the Users section.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserRoleFilter('pending');
                      setCurrentTab('users');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D311F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#17452F] transition shadow-xs cursor-pointer shrink-0"
                  >
                    Review & Approve Requests <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Actionable Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Active Jobs */}
                <div
                  onClick={() => { setJobStatusFilter('active'); setCurrentTab('jobs'); }}
                  className="rounded-xl border border-[#E5E0D8] bg-white p-5 shadow-xs hover:border-[#0D311F] transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Active Vacancies
                    </span>
                    <span className="rounded-full bg-emerald-100 p-2 text-emerald-800">
                      <Briefcase className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-semibold text-[#071E13]">
                      {jobCounts.active}
                    </div>
                    <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
                      {jobCounts.all} total openings <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                </div>

                {/* Applications Metric */}
                {isAdmin ? (
                  <div
                    onClick={() => { setAppStatusFilter('new'); setCurrentTab('applications'); }}
                    className="rounded-xl border border-[#E5E0D8] bg-white p-5 shadow-xs hover:border-[#0D311F] transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        New Applications
                      </span>
                      <span className="rounded-full bg-blue-100 p-2 text-blue-800">
                        <UserCheck className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="text-3xl font-semibold text-[#071E13]">
                        {appCounts.new}
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
                        {appCounts.all} total submissions <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => { setPostStatusFilter('in_review'); setCurrentTab('posts'); }}
                    className="rounded-xl border border-[#E5E0D8] bg-white p-5 shadow-xs hover:border-[#0D311F] transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        In Review
                      </span>
                      <span className="rounded-full bg-blue-100 p-2 text-blue-800">
                        <Clock className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="text-3xl font-semibold text-[#071E13]">
                        {postCounts.in_review}
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
                        Awaiting admin review <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    </div>
                  </div>
                )}

                {/* Published Posts */}
                <div
                  onClick={() => { setPostStatusFilter('published'); setCurrentTab('posts'); }}
                  className="rounded-xl border border-[#E5E0D8] bg-white p-5 shadow-xs hover:border-[#0D311F] transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Published Posts
                    </span>
                    <span className="rounded-full bg-emerald-100 p-2 text-emerald-800">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-semibold text-[#071E13]">
                      {postCounts.published}
                    </div>
                    <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
                      Published stories <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                </div>

                {/* Staff & Requests / Drafts */}
                {isAdmin ? (
                  <div
                    onClick={() => {
                      if (userCounts.pending > 0) setUserRoleFilter('pending');
                      else setUserRoleFilter('all');
                      setCurrentTab('users');
                    }}
                    className="rounded-xl border border-[#E5E0D8] bg-white p-5 shadow-xs hover:border-[#0D311F] transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Staff & Requests
                      </span>
                      <span className={`rounded-full p-2 ${userCounts.pending > 0 ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'}`}>
                        <Users className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-baseline gap-2">
                        <div className="text-3xl font-semibold text-[#071E13]">
                          {userCounts.all}
                        </div>
                        {userCounts.pending > 0 && (
                          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-[#071E13] animate-pulse">
                            {userCounts.pending} pending
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
                        {userCounts.pending > 0 ? `${userCounts.pending} awaiting approval` : `${userCounts.all} registered staff`} <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => { setPostStatusFilter('draft'); setCurrentTab('posts'); }}
                    className="rounded-xl border border-[#E5E0D8] bg-white p-5 shadow-xs hover:border-[#0D311F] transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Draft Posts
                      </span>
                      <span className="rounded-full bg-amber-100 p-2 text-amber-800">
                        <FileEdit className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="text-3xl font-semibold text-[#071E13]">
                        {postCounts.draft}
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
                        Unpublished drafts <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Jump Modules */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Openings */}
                <div className="rounded-xl border border-[#E5E0D8] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-[#0D311F]" />
                      <h3 className="font-semibold text-sm text-[#071E13]">Job Openings</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentTab('jobs')}
                      className="text-xs font-semibold text-[#0D311F] hover:underline"
                    >
                      View All ({jobs.length})
                    </button>
                  </div>

                  <div className="mt-3 divide-y divide-[#E5E0D8]">
                    {jobs.slice(0, 4).map((j) => (
                      <div key={j.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                        <div>
                          <p className="font-semibold text-[#071E13]">{j.title}</p>
                          <p className="text-neutral-500 text-[11px]">{j.department} • {j.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBadgeClasses[j.status] || statusBadgeClasses.active}`}>
                            {j.status}
                          </span>
                          <span className="font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                            {j.applicationCount || 0} apps
                          </span>
                        </div>
                      </div>
                    ))}
                    {jobs.length === 0 && (
                      <p className="py-6 text-center text-xs text-neutral-500">No job openings created yet.</p>
                    )}
                  </div>
                </div>

                {/* Operations Summary */}
                <div className="rounded-xl border border-[#E5E0D8] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#0D311F]" />
                      <h3 className="font-semibold text-sm text-[#071E13]">Access & Configuration</h3>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">Node / Neon</span>
                  </div>

                  <div className="mt-3 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-neutral-500">Active Role:</span>
                      <strong className="text-[#0D311F]">{staff.role}</strong>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-neutral-500">Resume Storage:</span>
                      <strong className="text-[#0D311F]">Private Object Storage</strong>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-neutral-500">Domain Restriction:</span>
                      <strong className="text-[#0D311F]">@pinebrooktechnologies.com</strong>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-neutral-500">Audit Logging:</span>
                      <strong className="text-[#0D311F]">Append-Only (UTC)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CMS TABS */}
          {currentTab === 'settings' && isAdmin && initialSiteSettings && (
            <SiteSettingsTab initialSettings={initialSiteSettings} />
          )}

          {currentTab === 'hero' && (
            <HeroSlidesTab initialSlides={initialHeroSlides} mediaAssets={mediaAssets} />
          )}

          {currentTab === 'home' && (
            <HomeSectionsTab initialSections={initialHomeSections} mediaAssets={mediaAssets} />
          )}

          {currentTab === 'programs' && (
            <ProgramsTab initialPrograms={initialProgramsContent} mediaAssets={mediaAssets} />
          )}

          {currentTab === 'impact' && (
            <ImpactTab initialImpact={initialImpactContent} />
          )}

          {currentTab === 'faqs_offices' && (
            <FaqsOfficesTab initialFaqs={initialFaqs} initialOffices={initialOffices} />
          )}

          {currentTab === 'legal' && (
            <LegalPagesTab initialPrivacy={initialLegalPrivacy} initialTerms={initialLegalTerms} />
          )}

          {currentTab === 'media' && (
            <MediaLibraryTab initialAssets={mediaAssets} onAssetsUpdated={setMediaAssets} />
          )}

          {currentTab === 'inquiries' && (
            <InquiriesTab initialInquiries={initialInquiries} initialSubscribers={initialSubscribers} />
          )}

          {currentTab === 'audit' && isAdmin && (
            <AuditLogTab initialEvents={initialAuditEvents} />
          )}

          {currentTab === 'server_logs' && isAdmin && (
            <ServerLogsTab initialLogs={initialServerLogs} initialOverview={initialServerOverview} />
          )}

          {/* TAB 1: BLOG POSTS */}
          {currentTab === 'posts' && (
            <div className="rounded-xl border border-[#E5E0D8] bg-white shadow-xs overflow-hidden space-y-0">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] p-5 bg-white">
                <div>
                  <h2 className="text-lg font-semibold text-[#071E13]">Blog Posts</h2>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Draft, edit, review, and manage article publishing.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={refreshPostsList}
                    disabled={isRefreshingPosts}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRefreshingPosts ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>

                  <Link
                    href="/panel/posts/new"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D311F] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#17452F] transition shadow-xs cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> New Post
                  </Link>
                </div>
              </div>

              {/* Status Filters & Search */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] bg-[#FAF9F7] px-5 py-2.5">
                <div className="flex flex-wrap gap-1.5 text-xs font-medium">
                  {(['all', 'draft', 'in_review', 'scheduled', 'published', 'archived'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setPostStatusFilter(st)}
                      className={`rounded-lg px-2.5 py-1 transition cursor-pointer capitalize ${
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

                <div className="relative w-full sm:w-60">
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
                      <th scope="col" className="px-5 py-3 font-semibold">Title & Slug</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Category</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Author</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Version</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Updated</th>
                      <th scope="col" className="px-5 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E0D8]">
                    {filteredPosts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-neutral-500 text-xs">
                          No blog posts found.
                        </td>
                      </tr>
                    ) : (
                      filteredPosts.map((post) => (
                        <tr key={post.id || post.slug} className="hover:bg-[#FDFCFB] transition">
                          <td className="px-5 py-3.5 max-w-sm">
                            <div className="font-semibold text-xs text-[#071E13] line-clamp-1">
                              {post.title}
                            </div>
                            <div className="text-[11px] font-mono text-neutral-500 line-clamp-1">
                              /blog/{post.slug}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-block rounded-md bg-[#0D311F]/10 px-2 py-0.5 text-xs font-semibold text-[#0D311F]">
                              {post.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-neutral-700">
                            {post.authorName}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                statusBadgeClasses[post.status || 'draft'] || statusBadgeClasses.draft
                              }`}
                            >
                              {post.status?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs font-mono text-neutral-600">
                            v{post.version || 1}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-neutral-500">
                            {post.updatedAt
                              ? new Date(post.updatedAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  timeZone: 'Asia/Kolkata',
                                })
                              : post.displayDate}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              {post.id && (
                                <>
                                  <Link
                                    href={`/panel/posts/${post.id}`}
                                    className="inline-flex items-center gap-1 rounded-md border border-[#E5E0D8] bg-white px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition cursor-pointer"
                                  >
                                    <Edit className="h-3 w-3" /> Edit
                                  </Link>
                                  <Link
                                    href={`/panel/posts/${post.id}/preview`}
                                    target="_blank"
                                    className="inline-flex items-center gap-1 rounded-md border border-[#E5E0D8] bg-white px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition cursor-pointer"
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

              <div className="border-t border-[#E5E0D8] bg-[#FAF9F7] px-5 py-2.5 text-xs text-neutral-500 flex justify-between items-center">
                <span>Showing {filteredPosts.length} of {posts.length} posts</span>
                <span>Role: <strong>{staff.role}</strong></span>
              </div>
            </div>
          )}

          {/* TAB 2: JOB OPENINGS */}
          {currentTab === 'jobs' && (
            <div className="rounded-xl border border-[#E5E0D8] bg-white shadow-xs overflow-hidden space-y-0">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] p-5 bg-white">
                <div>
                  <h2 className="text-lg font-semibold text-[#071E13]">Job Openings</h2>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Manage active vacancies and requirements displayed on /careers.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={refreshJobsList}
                    disabled={isRefreshingJobs}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRefreshingJobs ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>

                  {canManageJobs && (
                    <button
                      type="button"
                      onClick={() => handleOpenJobModal()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D311F] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#17452F] transition shadow-xs cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Create Opening
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filters & Search */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] bg-[#FAF9F7] px-5 py-2.5">
                <div className="flex flex-wrap gap-1.5 text-xs font-medium">
                  {(['all', 'active', 'draft', 'closed', 'archived'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setJobStatusFilter(st)}
                      className={`rounded-lg px-2.5 py-1 transition cursor-pointer capitalize ${
                        jobStatusFilter === st
                          ? 'bg-[#0D311F] text-white font-semibold'
                          : 'bg-white border border-[#E5E0D8] text-neutral-700 hover:bg-[#F7F6F3]'
                      }`}
                    >
                      {st}
                      <span className={`ml-1.5 text-[10px] rounded-full px-1.5 py-0.2 ${jobStatusFilter === st ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                        {jobCounts[st]}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                  <input
                    type="text"
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    placeholder="Search jobs..."
                    className="w-full rounded-lg border border-[#E5E0D8] bg-white pl-8 pr-3 py-1.5 text-xs text-[#071E13] outline-none transition focus:border-[#0D311F]"
                  />
                </div>
              </div>

              {/* Jobs Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F7F6F3] text-xs uppercase tracking-wider text-neutral-600 border-b border-[#E5E0D8]">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold">Title & Slug</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Department</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Location & Type</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Applications</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Order</th>
                      <th scope="col" className="px-5 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E0D8]">
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-neutral-500 text-xs">
                          No job openings found.
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-[#FDFCFB] transition">
                          <td className="px-5 py-3.5 max-w-xs">
                            <div className="font-semibold text-xs text-[#071E13]">
                              {job.title}
                            </div>
                            <div className="text-[11px] font-mono text-neutral-500">
                              /careers#{job.slug}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-block rounded-md bg-[#0D311F]/10 px-2 py-0.5 text-xs font-semibold text-[#0D311F]">
                              {job.department}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-neutral-700">
                            <div>{job.location}</div>
                            <div className="text-neutral-500 text-[11px]">{job.employmentType}</div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                statusBadgeClasses[job.status] || statusBadgeClasses.active
                              }`}
                            >
                              {job.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (isAdmin) {
                                  setAppRoleFilter(job.slug);
                                  setCurrentTab('applications');
                                }
                              }}
                              className={`inline-flex items-center gap-1 text-xs font-semibold rounded-md px-2 py-0.5 ${
                                isAdmin ? 'hover:bg-neutral-200 cursor-pointer text-[#0D311F]' : 'text-neutral-600'
                              } bg-neutral-100`}
                            >
                              <UserCheck className="h-3 w-3" />
                              {job.applicationCount || 0}
                            </button>
                          </td>
                          <td className="px-5 py-3.5 text-xs font-mono text-neutral-600">
                            #{job.displayOrder}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              {canManageJobs && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenJobModal(job)}
                                    className="inline-flex items-center gap-1 rounded-md border border-[#E5E0D8] bg-white px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition cursor-pointer"
                                  >
                                    <Edit className="h-3 w-3" /> Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleJobStatusQuickToggle(job, job.status === 'active' ? 'closed' : 'active')}
                                    title={job.status === 'active' ? 'Close job' : 'Activate job'}
                                    className="inline-flex items-center gap-1 rounded-md border border-[#E5E0D8] bg-white px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition cursor-pointer"
                                  >
                                    {job.status === 'active' ? 'Close' : 'Activate'}
                                  </button>
                                  {job.status === 'archived' ? (
                                    <button
                                      type="button"
                                      onClick={() => handleJobStatusQuickToggle(job, 'active')}
                                      title="Unarchive job (set to active)"
                                      className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100 transition cursor-pointer"
                                    >
                                      <ArchiveRestore className="h-3 w-3" /> Unarchive
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleJobStatusQuickToggle(job, 'archived')}
                                      title="Archive job"
                                      className="inline-flex items-center gap-1 rounded-md border border-[#E5E0D8] bg-white px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition cursor-pointer"
                                    >
                                      <Archive className="h-3 w-3" /> Archive
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteJob(job.id)}
                                    title="Archive / Remove"
                                    className="inline-flex items-center rounded-md border border-red-200 bg-red-50 p-1 text-red-600 hover:bg-red-100 transition cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
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

              <div className="border-t border-[#E5E0D8] bg-[#FAF9F7] px-5 py-2.5 text-xs text-neutral-500 flex justify-between items-center">
                <span>Showing {filteredJobs.length} of {jobs.length} openings</span>
                <span>Active openings appear immediately on /careers</span>
              </div>
            </div>
          )}

          {/* TAB 3: APPLICATIONS */}
          {currentTab === 'applications' && isAdmin && (
            <div className="rounded-xl border border-[#E5E0D8] bg-white shadow-xs overflow-hidden space-y-0">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] p-5 bg-white">
                <div>
                  <h2 className="text-lg font-semibold text-[#071E13]">Career Applications</h2>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Review applicant profiles, statements, and verified resume files.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={refreshApplicationsList}
                    disabled={isRefreshingApps}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRefreshingApps ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Status Filters & Search */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] bg-[#FAF9F7] px-5 py-2.5">
                <div className="flex flex-wrap gap-1.5 text-xs font-medium">
                  {(['all', 'new', 'under_review', 'interview_scheduled', 'hired', 'rejected', 'archived'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAppStatusFilter(st)}
                      className={`rounded-lg px-2.5 py-1 transition cursor-pointer capitalize ${
                        appStatusFilter === st
                          ? 'bg-[#0D311F] text-white font-semibold'
                          : 'bg-white border border-[#E5E0D8] text-neutral-700 hover:bg-[#F7F6F3]'
                      }`}
                    >
                      {st.replace('_', ' ')}
                      <span className={`ml-1.5 text-[10px] rounded-full px-1.5 py-0.2 ${appStatusFilter === st ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                        {appCounts[st]}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={appRoleFilter}
                    onChange={(e) => setAppRoleFilter(e.target.value)}
                    className="rounded-lg border border-[#E5E0D8] bg-white px-2.5 py-1.5 text-xs text-[#071E13] outline-none transition focus:border-[#0D311F] cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    {jobs.map((j) => (
                      <option key={j.slug} value={j.slug}>
                        {j.title}
                      </option>
                    ))}
                    <option value="volunteer">Volunteer / General</option>
                  </select>

                  <div className="relative w-48 sm:w-60">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={appSearchQuery}
                      onChange={(e) => setAppSearchQuery(e.target.value)}
                      placeholder="Search applicants..."
                      className="w-full rounded-lg border border-[#E5E0D8] bg-white pl-8 pr-3 py-1.5 text-xs text-[#071E13] outline-none transition focus:border-[#0D311F]"
                    />
                  </div>
                </div>
              </div>

              {/* Applications Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F7F6F3] text-xs uppercase tracking-wider text-neutral-600 border-b border-[#E5E0D8]">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold">Applicant</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Position</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Experience</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Assignee</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Applied (IST)</th>
                      <th scope="col" className="px-5 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E0D8]">
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-neutral-500 text-xs">
                          No career applications found.
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-[#FDFCFB] transition">
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-xs text-[#071E13]">
                              {app.fullName}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              {app.email}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="text-xs font-semibold text-[#071E13]">
                              {app.jobTitle || app.roleSlug}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              {app.jobDepartment || 'Outreach'}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                              {app.experienceYears} yrs
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                statusBadgeClasses[app.status] || statusBadgeClasses.new
                              }`}
                            >
                              {app.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-neutral-600">
                            {app.assignedTo ? (
                              <span className="inline-flex items-center gap-1 font-medium text-[#0D311F]">
                                <User className="h-3 w-3" /> {app.assignedTo}
                              </span>
                            ) : (
                              <span className="text-neutral-400 italic text-[11px]">Unassigned</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-neutral-500 font-mono">
                            {new Date(app.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              timeZone: 'Asia/Kolkata',
                            })}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              {app.resume?.downloadUrl && (
                                <a
                                  href={app.resume.downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Download resume"
                                  className="inline-flex items-center gap-1 rounded-md border border-[#E5E0D8] bg-white px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition"
                                >
                                  <Download className="h-3 w-3 text-[#0D311F]" /> Resume
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => handleSelectApplication(app)}
                                className="inline-flex items-center gap-1 rounded-md bg-[#0D311F] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#17452F] transition cursor-pointer"
                              >
                                Review <ChevronRight className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-[#E5E0D8] bg-[#FAF9F7] px-5 py-2.5 text-xs text-neutral-500 flex justify-between items-center">
                <span>Showing {filteredApplications.length} of {applications.length} applications</span>
                <span>Protected resume storage with HMAC SHA-256 tokens</span>
              </div>
            </div>
          )}

          {/* TAB 4: STAFF DIRECTORY & ACCESS REQUESTS */}
          {currentTab === 'users' && isAdmin && (
            <div className="space-y-6">
              {/* Feedback Alert */}
              {userActionFeedback && (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span>{userActionFeedback}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUserActionFeedback('')}
                    className="text-emerald-700 hover:text-emerald-900"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* 1. DEDICATED PENDING ACCESS REQUESTS SECTION (FOR ADMINS) */}
              {isAdmin && pendingUsers.length > 0 && (
                <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-5 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg bg-amber-400/20 p-2 text-amber-900">
                        <AlertCircle className="h-4 w-4 text-amber-800" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#071E13]">
                            Pending Staff Access Requests ({pendingUsers.length})
                          </h3>
                          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-[#071E13]">
                            Action Required
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600">
                          These new users have verified their Pinebrook email OTP and are awaiting admin permission to access the operations panel.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {pendingUsers.map((u) => (
                      <div
                        key={u.id}
                        className="rounded-xl border border-amber-200 bg-white p-4 shadow-xs flex flex-col justify-between space-y-3.5 hover:border-amber-400 transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#0D311F]/10 text-[#0D311F] flex items-center justify-center font-bold text-xs shrink-0">
                              {(u.firstName || u.fullName || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#071E13]">
                                {u.fullName || u.firstName || 'New User'}
                              </div>
                              <div className="text-[11px] text-neutral-600 font-mono">
                                {u.email}
                              </div>
                            </div>
                          </div>
                          <span className="rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800 shrink-0">
                            Awaiting Role
                          </span>
                        </div>

                        <div className="text-[11px] text-neutral-500 flex items-center justify-between border-t border-neutral-100 pt-2">
                          <span>
                            Requested: {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) : 'Recently'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-neutral-100">
                          <button
                            type="button"
                            disabled={updatingUserId === u.id}
                            onClick={() => handleRoleChange(u.id, 'CONTENT')}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition disabled:opacity-50 cursor-pointer"
                          >
                            <Check className="h-3 w-3" /> Approve Content
                          </button>
                          <button
                            type="button"
                            disabled={updatingUserId === u.id}
                            onClick={() => handleRoleChange(u.id, 'ADMIN')}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-300 bg-purple-50 px-2.5 py-1.5 text-xs font-semibold text-purple-800 hover:bg-purple-100 transition disabled:opacity-50 cursor-pointer"
                          >
                            <Shield className="h-3 w-3" /> Approve Admin
                          </button>
                          <button
                            type="button"
                            disabled={updatingUserId === u.id}
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            title="Reject and delete access request"
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 p-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition disabled:opacity-50 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. FULL STAFF DIRECTORY TABLE & CONTROLS */}
              <div className="rounded-xl border border-[#E5E0D8] bg-white shadow-xs overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] p-5">
                  <div>
                    <h2 className="text-lg font-semibold text-[#071E13]">Staff Directory</h2>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Manage registered staff accounts, assign authorization roles, and control active status.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={refreshUsersList}
                      disabled={isRefreshingUsers}
                      title="Refresh user list"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-[#F7F6F3] transition cursor-pointer"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isRefreshingUsers ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] bg-[#FAF9F7] px-5 py-2.5">
                  <div className="flex flex-wrap gap-1.5 text-xs font-medium">
                    {(
                      [
                        { id: 'all', label: 'All Staff', count: userCounts.all },
                        { id: 'pending', label: 'Pending Requests', count: userCounts.pending },
                        { id: 'content', label: 'Content Editors', count: userCounts.content },
                        { id: 'admin', label: 'Admins', count: userCounts.admin },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setUserRoleFilter(tab.id)}
                        className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
                          userRoleFilter === tab.id
                            ? 'bg-[#0D311F] text-white font-semibold'
                            : tab.id === 'pending' && tab.count > 0
                            ? 'bg-amber-100 border border-amber-300 text-amber-900 hover:bg-amber-200'
                            : 'bg-white border border-[#E5E0D8] text-neutral-700 hover:bg-[#F7F6F3]'
                        }`}
                      >
                        {tab.label}
                        <span
                          className={`ml-1.5 text-[10px] rounded-full px-1.5 py-0.2 ${
                            userRoleFilter === tab.id
                              ? 'bg-white/20 text-white'
                              : tab.id === 'pending' && tab.count > 0
                              ? 'bg-amber-400 text-[#071E13] font-bold'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="relative w-48 sm:w-60">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={userSearchFilter}
                      onChange={(e) => setUserSearchFilter(e.target.value)}
                      placeholder="Search name, email, role..."
                      className="w-full rounded-lg border border-[#E5E0D8] bg-white pl-8 pr-3 py-1.5 text-xs text-[#071E13] outline-none transition focus:border-[#0D311F]"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#F7F6F3] text-xs uppercase tracking-wider text-neutral-600 border-b border-[#E5E0D8]">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-semibold">User</th>
                        <th scope="col" className="px-5 py-3 font-semibold">Email</th>
                        <th scope="col" className="px-5 py-3 font-semibold">Role</th>
                        <th scope="col" className="px-5 py-3 font-semibold">Registered (IST)</th>
                        <th scope="col" className="px-5 py-3 font-semibold">Last Login (IST)</th>
                        {isAdmin && <th scope="col" className="px-5 py-3 font-semibold text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D8]">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={isAdmin ? 6 : 5} className="px-5 py-8 text-center text-neutral-500 text-xs">
                            No matching staff users found.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-[#FDFCFB] transition">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#0D311F]/10 text-[#0D311F] flex items-center justify-center font-bold text-xs shrink-0">
                                  {(u.firstName || u.fullName || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-xs text-[#071E13]">
                                    {u.fullName || u.firstName || '—'}
                                  </div>
                                  {u.role === 'NO_ACCESS' && (
                                    <span className="text-[10px] text-amber-700 font-medium">
                                      New Access Request
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-xs text-neutral-700 font-mono">
                              {u.email}
                            </td>
                            <td className="px-5 py-3.5">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                  u.role === 'ADMIN'
                                    ? 'bg-purple-100 text-purple-800'
                                    : u.role === 'CONTENT'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {u.role === 'NO_ACCESS' ? 'No Access (Pending)' : u.role}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-xs text-neutral-500 font-mono">
                              {u.createdAt
                                ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    timeZone: 'Asia/Kolkata',
                                  })
                                : '—'}
                            </td>
                            <td className="px-5 py-3.5 text-xs text-neutral-500 font-mono">
                              {u.lastLoginAt
                                ? new Date(u.lastLoginAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZone: 'Asia/Kolkata',
                                  })
                                : 'Never'}
                            </td>
                            {isAdmin && (
                              <td className="px-5 py-3.5 text-right">
                                <div className="inline-flex items-center gap-1.5 justify-end">
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

                                  {u.id !== staff?.id && (
                                    <button
                                      type="button"
                                      disabled={updatingUserId === u.id}
                                      onClick={() => handleDeleteUser(u.id, u.email)}
                                      title="Remove account / request"
                                      className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 p-1 text-red-600 hover:bg-red-100 transition disabled:opacity-50 cursor-pointer"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-[#E5E0D8] bg-[#FAF9F7] px-5 py-2.5 text-xs text-neutral-500 flex flex-wrap justify-between items-center gap-2">
                  <span>
                    Total Staff: <strong className="text-[#071E13]">{userCounts.all}</strong> ({userCounts.admin} Admins, {userCounts.content} Content Editors)
                  </span>
                  {userCounts.pending > 0 ? (
                    <span className="text-amber-800 font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                      {userCounts.pending} pending request{userCounts.pending > 1 ? 's' : ''} awaiting approval
                    </span>
                  ) : (
                    <span className="text-emerald-700">All access requests reviewed</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL: CREATE / EDIT JOB OPENING */}
        {isJobModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-[#E5E0D8] bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#0D311F]" />
                  <h3 className="text-base font-semibold text-[#071E13]">
                    {editingJob ? 'Edit Job Opening' : 'New Job Opening'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {jobFormError && (
                <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{jobFormError}</span>
                </div>
              )}

              <form onSubmit={handleSaveJobSubmit} className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={jobFormData.title}
                      onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                      placeholder="Senior Education Expert"
                      className="w-full rounded-lg border border-[#E5E0D8] p-2.5 text-[#071E13] outline-none focus:border-[#0D311F]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={jobFormData.slug || ''}
                      onChange={(e) => setJobFormData({ ...jobFormData, slug: e.target.value })}
                      placeholder="edu-expert"
                      className="w-full rounded-lg border border-[#E5E0D8] p-2.5 text-[#071E13] outline-none focus:border-[#0D311F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={jobFormData.department}
                      onChange={(e) => setJobFormData({ ...jobFormData, department: e.target.value })}
                      placeholder="Academic Programs"
                      className="w-full rounded-lg border border-[#E5E0D8] p-2.5 text-[#071E13] outline-none focus:border-[#0D311F]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={jobFormData.location}
                      onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                      placeholder="Srinagar Garhwal, Uttarakhand"
                      className="w-full rounded-lg border border-[#E5E0D8] p-2.5 text-[#071E13] outline-none focus:border-[#0D311F]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Employment Type *
                    </label>
                    <input
                      type="text"
                      required
                      value={jobFormData.employmentType}
                      onChange={(e) => setJobFormData({ ...jobFormData, employmentType: e.target.value })}
                      placeholder="Full-time (On-site)"
                      className="w-full rounded-lg border border-[#E5E0D8] p-2.5 text-[#071E13] outline-none focus:border-[#0D311F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Salary Note
                    </label>
                    <input
                      type="text"
                      value={jobFormData.salary || ''}
                      onChange={(e) => setJobFormData({ ...jobFormData, salary: e.target.value })}
                      placeholder="Competitive & Housing"
                      className="w-full rounded-lg border border-[#E5E0D8] p-2.5 text-[#071E13] outline-none focus:border-[#0D311F]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Status
                    </label>
                    <select
                      value={jobFormData.status}
                      onChange={(e) => setJobFormData({ ...jobFormData, status: e.target.value as JobStatus })}
                      className="w-full rounded-lg border border-[#E5E0D8] p-2.5 text-[#071E13] outline-none focus:border-[#0D311F] bg-white cursor-pointer"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="closed">Closed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Display Priority
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={jobFormData.displayOrder || 1}
                      onChange={(e) => setJobFormData({ ...jobFormData, displayOrder: parseInt(e.target.value, 10) || 1 })}
                      className="w-full rounded-lg border border-[#E5E0D8] p-2.5 text-[#071E13] outline-none focus:border-[#0D311F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Job Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={jobFormData.description}
                    onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                    placeholder="Role responsibilities and expectations..."
                    className="w-full rounded-lg border border-[#E5E0D8] p-2.5 text-[#071E13] outline-none focus:border-[#0D311F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Requirements (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={typeof jobFormData.requirements === 'string' ? jobFormData.requirements : (jobFormData.requirements || []).join('\n')}
                    onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                    placeholder="Relevant degree&#10;Field experience in rural districts"
                    className="w-full rounded-lg border border-[#E5E0D8] p-2.5 text-[#071E13] outline-none focus:border-[#0D311F] font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-[#E5E0D8] pt-4">
                  <button
                    type="button"
                    onClick={() => setIsJobModalOpen(false)}
                    className="rounded-lg border border-[#E5E0D8] px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#F7F6F3] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingJob}
                    className="rounded-lg bg-[#0D311F] px-5 py-2 text-xs font-semibold text-white hover:bg-[#17452F] disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingJob ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DRAWER / MODAL: REVIEW CANDIDATE APPLICATION */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-[#E5E0D8] bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                <div>
                  <h3 className="text-base font-semibold text-[#071E13]">
                    {selectedApp.fullName}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Position: <strong className="text-[#0D311F]">{selectedApp.jobTitle || selectedApp.roleSlug}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {appStatusFeedback && (
                <div className={`mt-4 rounded-lg p-3 text-xs flex items-center gap-2 ${
                  appStatusFeedback.includes('successfully')
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{appStatusFeedback}</span>
                </div>
              )}

              <div className="mt-4 space-y-4 text-xs">
                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF9F7] p-3.5 rounded-lg border border-[#E5E0D8]">
                  <div>
                    <span className="text-neutral-500 block">Email:</span>
                    <strong className="text-[#071E13] select-all">{selectedApp.email}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Experience:</span>
                    <strong className="text-[#071E13]">{selectedApp.experienceYears} Years</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Applied (IST):</span>
                    <strong className="text-[#071E13]">
                      {new Date(selectedApp.createdAt).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Status:</span>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBadgeClasses[selectedApp.status] || statusBadgeClasses.new}`}>
                      {selectedApp.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Cover Statement */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-1">Applicant Statement:</h4>
                  <div className="p-3 bg-[#FDFCFB] rounded-lg border border-[#E5E0D8] text-neutral-800 leading-relaxed whitespace-pre-wrap">
                    {selectedApp.statement || 'No statement provided.'}
                  </div>
                </div>

                {/* Attached Resume */}
                {selectedApp.resume && (
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-1">Resume File:</h4>
                    <div className="flex items-center justify-between p-3 bg-[#FAF9F7] rounded-lg border border-[#E5E0D8]">
                      <div className="flex items-center gap-2.5">
                        <FileCode className="h-4 w-4 text-[#0D311F] shrink-0" />
                        <div>
                          <p className="font-semibold text-[#071E13]">{selectedApp.resume.originalFilename}</p>
                          <p className="text-[11px] text-neutral-500 font-mono">
                            {(selectedApp.resume.sizeBytes / 1024).toFixed(1)} KB • SHA: {selectedApp.resume.checksumSha256.substring(0, 12)}...
                          </p>
                        </div>
                      </div>

                      {selectedApp.resume.downloadUrl && (
                        <a
                          href={selectedApp.resume.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-[#0D311F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#17452F] transition shadow-xs"
                        >
                          <Download className="h-3.5 w-3.5" /> Download Resume
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Consent Audit */}
                <div className="text-[11px] text-neutral-500 bg-[#FAF9F7] p-2.5 rounded-lg border border-[#E5E0D8]">
                  <p><strong>Consent:</strong> {selectedApp.consentVersion} (Timestamp: {new Date(selectedApp.consentedAt).toISOString()})</p>
                </div>

                {/* Workflow Status & Assignee Controls */}
                <div className="border-t border-[#E5E0D8] pt-3.5 space-y-3">
                  <h4 className="font-semibold text-[#071E13]">Update Status & Assignee:</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-600 mb-1">Status</label>
                      <select
                        value={appStatusUpdateTarget}
                        onChange={(e) => setAppStatusUpdateTarget(e.target.value as CareerApplicationStatus)}
                        className="w-full rounded-lg border border-[#E5E0D8] p-2 text-[#071E13] outline-none focus:border-[#0D311F] bg-white cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="under_review">Under Review</option>
                        <option value="interview_scheduled">Interview Scheduled</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-600 mb-1">Assignee</label>
                      <input
                        type="text"
                        value={appAssigneeTarget}
                        onChange={(e) => setAppAssigneeTarget(e.target.value)}
                        placeholder="Staff or reviewer email/name"
                        className="w-full rounded-lg border border-[#E5E0D8] p-2 text-[#071E13] outline-none focus:border-[#0D311F]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedApp(null)}
                      className="rounded-lg border border-[#E5E0D8] px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-[#F7F6F3] cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      disabled={isUpdatingAppStatus}
                      onClick={handleUpdateApplicationStatus}
                      className="rounded-lg bg-[#0D311F] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#17452F] disabled:opacity-50 cursor-pointer"
                    >
                      {isUpdatingAppStatus ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Request Access / Pending View
  const isAlreadyRequested = staff?.role === 'NO_ACCESS';

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F7F6F3] px-6 py-16 text-[#071E13]">
      <section className="w-full max-w-md rounded-xl border border-[#E5E0D8] bg-white p-8 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0D311F]/10 text-xl">
          🔒
        </div>

        <h1 className="text-xl font-semibold text-[#071E13]">
          {isAlreadyRequested ? 'Access Request Pending' : 'Staff Access Required'}
        </h1>

        <p className="mt-1 text-xs text-neutral-600">
          Signed in as <span className="font-medium text-[#071E13]">{initialUser.email}</span>
        </p>

        {isAlreadyRequested ? (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-left text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              </span>
              <span className="font-semibold uppercase tracking-wider text-amber-800 text-[11px]">
                Pending Approval
              </span>
            </div>
            <p className="mt-2 text-amber-900">
              Your access request has been recorded. An administrator will assign your role.
            </p>
            <p className="mt-1.5 text-neutral-500 text-[11px]">
              This view refreshes automatically once approved.
            </p>
          </div>
        ) : (
          <div className="mt-5 text-xs">
            <p className="text-neutral-600">
              Your account is authenticated, but requires role authorization to access panel operations.
            </p>

            <button
              type="button"
              disabled={requesting}
              onClick={handleRequestAccess}
              className="mt-5 w-full cursor-pointer rounded-lg bg-[#0D311F] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#17452F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {requesting ? 'Submitting Request...' : 'Request Access'}
            </button>
          </div>
        )}

        {message && (
          <p className="mt-3 text-xs font-medium text-emerald-700">{message}</p>
        )}

        <div className="mt-5 border-t border-[#E5E0D8] pt-5">
          <SignOutButton />
        </div>
      </section>
    </div>
  );
}
