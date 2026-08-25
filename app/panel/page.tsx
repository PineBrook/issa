import { redirect } from 'next/navigation';
import { getAuthSessionUser, getCurrentStaff, getAllStaffUsers } from '@/lib/staff';
import { getPanelBlogPosts } from '@/lib/cms';
import StaffPanel from './staff-panel';

export const dynamic = 'force-dynamic';

export default async function PanelPage() {
  const sessionUser = await getAuthSessionUser();
  if (!sessionUser?.id || !sessionUser.email) {
    redirect('/login?error=access');
  }

  const staff = await getCurrentStaff();
  const isAuthorized = staff && (staff.role === 'ADMIN' || staff.role === 'CONTENT');

  const [allUsers, allPosts] = await Promise.all([
    isAuthorized ? getAllStaffUsers() : Promise.resolve([]),
    isAuthorized ? getPanelBlogPosts().catch(() => []) : Promise.resolve([]),
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
    />
  );
}
