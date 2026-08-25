import { redirect, notFound } from 'next/navigation';
import { getAuthSessionUser, getCurrentStaff } from '@/lib/staff';
import { getPanelBlogPostById, getBlogPostRevisions } from '@/lib/cms';
import PostEditor from '@/components/cms/PostEditor';

export const dynamic = 'force-dynamic';

export default async function EditPostPage(props: { params: Promise<{ id: string }> }) {
  const sessionUser = await getAuthSessionUser();
  if (!sessionUser?.id || !sessionUser.email) {
    redirect('/login?error=access');
  }

  const staff = await getCurrentStaff();
  if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
    redirect('/panel');
  }

  const { id } = await props.params;
  const postId = Number(id);
  if (isNaN(postId)) {
    notFound();
  }

  const post = await getPanelBlogPostById(postId);
  if (!post) {
    notFound();
  }

  const revisions = await getBlogPostRevisions(postId);

  return (
    <PostEditor
      initialPost={post}
      initialRevisions={revisions}
      currentUser={staff}
    />
  );
}
