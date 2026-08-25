'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { LogOut } from 'lucide-react';

interface SignOutButtonProps {
  className?: string;
  variant?: 'primary' | 'outline' | 'danger';
}

export default function SignOutButton({ className, variant = 'outline' }: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await authClient.signOut();
    } catch {
      // Continue redirect even on network drop
    } finally {
      window.location.assign('/login');
    }
  };

  const baseStyles = 'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed';
  
  const variantStyles = {
    outline: 'border border-[#E5E0D8] bg-white text-neutral-700 hover:bg-neutral-50 hover:text-red-700 hover:border-red-200',
    primary: 'bg-[#0D311F] text-white hover:bg-[#17452F]',
    danger: 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100',
  }[variant];

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleSignOut}
      className={className || `${baseStyles} ${variantStyles}`}
    >
      <LogOut className="h-3.5 w-3.5 opacity-80" />
      <span>{loading ? 'Signing out…' : 'Sign out'}</span>
    </button>
  );
}
