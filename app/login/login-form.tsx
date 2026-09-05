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
    <main className="min-h-[calc(100vh-160px)] bg-[#F7F6F3] text-[#071E13]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        <form
          onSubmit={submit}
          className="w-full max-w-sm flex flex-col items-start text-left space-y-5 rounded-2xl border border-[#E5E0D8] bg-white p-8 shadow-xs"
          aria-describedby="login-status"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0D311F]/10 text-lg">
            ✉️
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-serif font-bold text-[#071E13]">Staff Sign In</h1>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {email ? `Enter the code sent to ${email}.` : 'Enter your username to receive a secure OTP code.'}
            </p>
          </div>

          {!email ? (
            <label className="w-full grid gap-1.5 text-xs font-semibold text-neutral-700">
              Pinebrook user ID
              <span className="flex overflow-hidden rounded-lg border border-[#E5E0D8] bg-white focus-within:border-[#0D311F] focus-within:ring-1 focus-within:ring-[#0D311F]">
                <input
                  name="userId"
                  autoComplete="username"
                  required
                  placeholder="e.g. yashvardhan.singh"
                  className="min-w-0 flex-1 px-3.5 py-2 text-xs text-[#071E13] outline-none"
                />
                <span className="select-none border-l border-[#E5E0D8] bg-[#F7F6F3] px-3 py-2 text-xs text-neutral-500 font-mono">
                  {domain}
                </span>
              </span>
            </label>
          ) : (
            <label className="w-full grid gap-1.5 text-xs font-semibold text-neutral-700">
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
                className="w-full rounded-lg border border-[#E5E0D8] px-3.5 py-2 text-left font-mono text-lg tracking-[0.3em] text-[#071E13] outline-none focus:border-[#0D311F] focus:ring-1 focus:ring-[#0D311F]"
              />
            </label>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full cursor-pointer rounded-lg bg-[#0D311F] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#17452F] disabled:cursor-not-allowed disabled:opacity-60 text-center"
          >
            {sending ? (email ? 'Verifying…' : 'Sending Code…') : (email ? 'Verify and Sign In' : 'Email Me a Code')}
          </button>

          {message && (
            <p
              id="login-status"
              aria-live="polite"
              className={`text-xs font-medium ${isError ? 'text-red-600' : 'text-emerald-700'}`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
