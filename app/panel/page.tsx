import { redirect } from 'next/navigation';
import { getAuthSessionUser, getCurrentStaff, getAllStaffUsers } from '@/lib/staff';
import { getPanelBlogPosts } from '@/lib/cms';
import {
  getPanelJobOpenings,
  getPanelCareerApplications,
  getCareerDashboardMetrics,
} from '@/lib/careers';
import {
  getSiteSettings,
  getHeroSlides,
  getHomeSections,
  getImpactContent,
  getProgramsContent,
  getFaqs,
  getOfficeLocations,
  getMediaAssets,
  getLegalPage,
  getContactSubmissions,
  getNewsletterSubscribers,
} from '@/lib/site-cms';
import { getAuditEvents } from '@/lib/audit';
import { getServerLogs, getServerHealthOverview } from '@/lib/server-logger';
import StaffPanel from './staff-panel';

export const dynamic = 'force-dynamic';

export default async function PanelPage() {
  const sessionUser = await getAuthSessionUser();
  if (!sessionUser?.id || !sessionUser.email) {
    redirect('/login?error=access');
  }

  const staff = await getCurrentStaff();
  const isAuthorized = staff && (staff.role === 'ADMIN' || staff.role === 'CONTENT');
  const isAdmin = staff?.role === 'ADMIN';

  const [
    allUsers,
    allPosts,
    allJobs,
    allApplications,
    careerMetrics,
    siteSettings,
    heroSlides,
    homeSections,
    impactContent,
    programsContent,
    faqs,
    offices,
    mediaAssets,
    legalPrivacy,
    legalTerms,
    inquiries,
    subscribers,
    auditEvents,
    serverLogs,
    serverOverview,
  ] = await Promise.all([
    isAdmin ? getAllStaffUsers().catch(() => []) : Promise.resolve([]),
    isAuthorized ? getPanelBlogPosts().catch(() => []) : Promise.resolve([]),
    isAuthorized ? getPanelJobOpenings().catch(() => []) : Promise.resolve([]),
    isAdmin ? getPanelCareerApplications().catch(() => []) : Promise.resolve([]),
    isAuthorized
      ? getCareerDashboardMetrics().catch(() => ({
          totalActiveJobs: 0,
          totalJobs: 0,
          totalApplications: 0,
          newApplications: 0,
          underReviewApplications: 0,
        }))
      : Promise.resolve({
          totalActiveJobs: 0,
          totalJobs: 0,
          totalApplications: 0,
          newApplications: 0,
          underReviewApplications: 0,
        }),
    isAdmin ? getSiteSettings().catch(() => undefined) : Promise.resolve(undefined),
    getHeroSlides(true).catch(() => []),
    getHomeSections().catch(() => undefined),
    getImpactContent().catch(() => undefined),
    getProgramsContent().catch(() => ({})),
    getFaqs().catch(() => []),
    getOfficeLocations().catch(() => []),
    isAuthorized ? getMediaAssets().catch(() => []) : Promise.resolve([]),
    getLegalPage('privacy').catch(() => null),
    getLegalPage('terms').catch(() => null),
    isAuthorized ? getContactSubmissions().catch(() => []) : Promise.resolve([]),
    isAuthorized ? getNewsletterSubscribers().catch(() => []) : Promise.resolve([]),
    isAdmin ? getAuditEvents().catch(() => []) : Promise.resolve([]),
    isAdmin ? getServerLogs().catch(() => []) : Promise.resolve([]),
    isAdmin ? getServerHealthOverview().catch(() => undefined) : Promise.resolve(undefined),
  ]);

  return (
    <StaffPanel
      initialUser={{
        id: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.name ?? '',
      }}
      initialStaff={staff}
      initialUsers={allUsers}
      initialPosts={allPosts}
      initialJobs={allJobs}
      initialApplications={allApplications}
      initialCareerMetrics={careerMetrics}
      initialSiteSettings={siteSettings}
      initialHeroSlides={heroSlides}
      initialHomeSections={homeSections}
      initialImpactContent={impactContent}
      initialProgramsContent={programsContent}
      initialFaqs={faqs}
      initialOffices={offices}
      initialMediaAssets={mediaAssets}
      initialLegalPrivacy={legalPrivacy}
      initialLegalTerms={legalTerms}
      initialInquiries={inquiries}
      initialSubscribers={subscribers}
      initialAuditEvents={auditEvents}
      initialServerLogs={serverLogs}
      initialServerOverview={serverOverview}
    />
  );
}
