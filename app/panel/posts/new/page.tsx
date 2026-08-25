import { redirect } from 'next/navigation';
import { getAuthSessionUser, getCurrentStaff } from '@/lib/staff';
import PostEditor from '@/components/cms/PostEditor';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const sessionUser = await getAuthSessionUser();
  if (!sessionUser?.id || !sessionUser.email) {
    redirect('/login?error=access');
  }

  const staff = await getCurrentStaff();
  if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
    redirect('/panel');
  }

  return (
    <PostEditor
      isNew
      currentUser={staff}
    />
  );
}
