'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth/client';

const domain = '@pinebrooktechnologies.com';

function internalPath(value: string | null) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : '/panel';
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setMessage('');
    setIsError(false);

    try {
      const form = new FormData(event.currentTarget);
      if (!email) {
        const userId = String(form.get('userId') ?? '').trim().toLowerCase();
        if (!userId || userId.includes('@')) {
          setMessage('Enter only your Pinebrook username (before @pinebrooktechnologies.com).');
          setIsError(true);
          return;
        }
        const nextEmail = `${userId}${domain}`;
        const nextFirstName = userId.split('.')[0];
        const result = await authClient.emailOtp.sendVerificationOtp({ email: nextEmail, type: 'sign-in' });

        if (result.error) throw new Error(result.error.message);
        setEmail(nextEmail);
        setFirstName(nextFirstName);
        setMessage(`Six-digit code sent to ${nextEmail}.`);
      } else {
        const otp = String(form.get('otp') ?? '').trim();
        const result = await authClient.signIn.emailOtp({ email, otp, name: firstName });
        if (result.error) throw new Error(result.error.message);
        router.replace(internalPath(searchParams.get('next')));
        router.refresh();
      }
    } catch (error) {
      setMessage(error instanceof Error && error.message ? error.message : 'Unable to sign in. Please try again.');
      setIsError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F7F6F3] px-6 py-16 text-[#071E13]">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl border border-[#E5E0D8] bg-white p-8 text-center shadow-sm" aria-describedby="login-status">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#0D311F]/10 text-xl">
          ✉️
        </div>
        <h1 className="text-2xl font-semibold">Staff Sign In</h1>
        <p className="text-sm text-neutral-600">{email ? `Enter the code sent to ${email}.` : 'Enter your Pinebrook username to receive a six-digit sign-in code.'}</p>

        {!email ? (
          <label className="grid gap-1.5 text-left text-sm font-medium">
            Pinebrook user ID
            <span className="flex overflow-hidden rounded-lg border border-[#E5E0D8] bg-white focus-within:border-[#0D311F] focus-within:ring-1 focus-within:ring-[#0D311F]">
              <input
                name="userId"
                autoComplete="username"
                required
                placeholder="e.g. anoop.singh"
                className="min-w-0 flex-1 px-3.5 py-2.5 text-sm text-[#071E13] outline-none"
              />
              <span className="select-none border-l border-[#E5E0D8] bg-[#F7F6F3] px-3.5 py-2.5 text-sm text-neutral-600">
                {domain}
              </span>
            </span>
          </label>
        ) : (
          <label className="grid gap-1.5 text-left text-sm font-medium">
            Six-digit code
            <input
              name="otp"
              autoComplete="one-time-code"
              inputMode="numeric"
              required
              minLength={6}
              maxLength={6}
              pattern="[0-9]{6}"
              placeholder="000000"
              autoFocus
              className="rounded-lg border border-[#E5E0D8] px-3.5 py-2.5 text-center font-mono text-xl tracking-[0.35em] text-[#071E13] outline-none focus:border-[#0D311F] focus:ring-1 focus:ring-[#0D311F]"
            />
          </label>
        )}

        <button
          type="submit"
          disabled={sending}
          className="w-full cursor-pointer rounded-lg bg-[#0D311F] px-4 py-3 font-medium text-white transition-colors hover:bg-[#17452F] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? (email ? 'Verifying…' : 'Sending Code…') : (email ? 'Verify and Sign In' : 'Email Me a Code')}
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
