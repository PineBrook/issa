'use client';

import { authClient } from '@/lib/auth/client';

export default function SignOutButton() {
  return <button className="rounded bg-[#0D311F] px-4 py-2 text-white" onClick={async () => {
    await authClient.signOut();
    window.location.assign('/login');
  }}>Sign out</button>;
}
