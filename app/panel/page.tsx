import { redirect } from 'next/navigation';
import { getAuthSessionUser, getCurrentStaff, getAllStaffUsers } from '@/lib/staff';
import { getPanelBlogPosts } from '@/lib/cms';
import {
  getPanelJobOpenings,
  getPanelCareerApplications,
  getCareerDashboardMetrics,
} from '@/lib/careers';
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

  const [allUsers, allPosts, allJobs, allApplications, careerMetrics] = await Promise.all([
    isAuthorized ? getAllStaffUsers().catch(() => []) : Promise.resolve([]),
    isAuthorized ? getPanelBlogPosts().catch(() => []) : Promise.resolve([]),
    isAuthorized ? getPanelJobOpenings().catch(() => []) : Promise.resolve([]),
    isAdmin ? getPanelCareerApplications().catch(() => []) : Promise.resolve([]),
    isAuthorized ? getCareerDashboardMetrics().catch(() => ({
      totalActiveJobs: 0,
      totalJobs: 0,
      totalApplications: 0,
      newApplications: 0,
      underReviewApplications: 0,
    })) : Promise.resolve({
      totalActiveJobs: 0,
      totalJobs: 0,
      totalApplications: 0,
      newApplications: 0,
      underReviewApplications: 0,
    }),
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
    />
  );
}
