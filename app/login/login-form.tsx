'use client';

import { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth/client';

const domain = '@pinebrooktechnologies.com';

function internalPath(value: string | null) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : '/panel';
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [sending, setSending] = useState(false);

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const userId = String(new FormData(event.currentTarget).get('userId') ?? '').trim().toLowerCase();
    if (!userId || userId.includes('@')) {
      setMessage('Enter only your Pinebrook username (before @pinebrooktechnologies.com).');
      setIsError(true);
      return;
    }
    const email = `${userId}${domain}`;
    const firstName = userId.split('.')[0];
    setSending(true);
    setMessage('');
    setIsError(false);

    try {
      const result = await authClient.signIn.magicLink({
        email,
        name: firstName,
        callbackURL: internalPath(searchParams.get('next')),
      });

      if (result?.error) {
        setMessage(result.error.message || 'Unable to send sign-in link. Please verify Magic Link is enabled in Neon Console.');
        setIsError(true);
      } else {
        setMessage(`Sign-in link sent to ${email}! Please check your email inbox.`);
        setIsError(false);
      }
    } catch {
      setMessage('Unable to send sign-in link. Please ensure Magic Link provider is enabled and email provider is configured in Neon Console.');
      setIsError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F7F6F3] px-6 py-16 text-[#071E13]">
      <form onSubmit={sendMagicLink} className="w-full max-w-md space-y-4 rounded-2xl border border-[#E5E0D8] bg-white p-8 text-center shadow-sm" aria-describedby="login-status">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#0D311F]/10 text-xl">
          ✉️
        </div>
        <h1 className="text-2xl font-semibold">Staff Sign In</h1>
        <p className="text-sm text-neutral-600">Enter your Pinebrook username to receive a secure login link.</p>

        <label className="grid gap-1.5 text-left text-sm font-medium">
          Pinebrook user ID
          <span className="flex overflow-hidden rounded-lg border border-[#E5E0D8] bg-white focus-within:border-[#0D311F] focus-within:ring-1 focus-within:ring-[#0D311F]">
            <input
              name="userId"
              autoComplete="username"
              required
              placeholder="e.g. anoop.singh"
              className="min-w-0 flex-1 px-3.5 py-2.5 outline-none text-sm text-[#071E13]"
            />
            <span className="bg-[#F7F6F3] px-3.5 py-2.5 text-sm text-neutral-600 select-none border-l border-[#E5E0D8]">
              {domain}
            </span>
          </span>
        </label>

        <button
          type="submit"
          disabled={sending}
          className="w-full cursor-pointer rounded-lg bg-[#0D311F] px-4 py-3 font-medium text-white transition-colors hover:bg-[#17452F] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? 'Sending Link…' : 'Email Me a Sign-in Link'}
        </button>

        {message && (
          <p
            id="login-status"
            aria-live="polite"
            className={`mt-4 text-sm font-medium ${isError ? 'text-red-600' : 'text-emerald-700'}`}
          >
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
