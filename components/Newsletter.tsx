'use client';

import React, { useState } from 'react';
import { Send, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      toast('Please enter your email address to subscribe.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      toast('Invalid email address format.', 'error');
      return;
    }

    setStatus('loading');

    // Simulate API request
    setTimeout(() => {
      setStatus('success');
      toast('Subscription successful! Thank you for joining the ISSA Foundation community.', 'success');
      setEmail('');
    }, 1200);
  };

  return (
    <div className="space-y-4" id="newsletter-section">
      <p className="text-xs font-sans uppercase tracking-wider text-white font-bold">Stay Updated</p>
      <p className="text-xs text-neutral-400 leading-relaxed font-sans max-w-sm">
        Receive monthly dispatches, progress audits, and stories of direct impact from our teams in Uttarakhand.
      </p>

      {status === 'success' ? (
        <div 
          className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start gap-3 text-accent animate-fade-in"
          id="newsletter-success"
        >
          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3.5 h-3.5 text-accent" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Successfully Subscribed!</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Thank you for joining our journey. You will receive our next field dispatch shortly.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2 relative">
            <input
              type="email"
              placeholder="your.email@domain.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              disabled={status === 'loading'}
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 font-sans disabled:opacity-55"
              id="newsletter-email-input"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-accent hover:bg-accent-dark text-primary px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer hover:shadow-lg hover:shadow-accent/15 disabled:opacity-55"
              aria-label="Subscribe"
              id="newsletter-submit-button"
            >
              {status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          {status === 'error' && (
            <div 
              className="flex items-center gap-1.5 text-[11px] text-red-400 animate-fade-in pl-1"
              id="newsletter-error"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
