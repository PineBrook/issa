'use client';

import React, { useState } from 'react';
import { Send, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface NewsletterProps {
  variant?: 'dark' | 'light';
  title?: string;
  subtitle?: string;
  className?: string;
  id?: string;
}

export default function Newsletter({
  variant = 'dark',
  title = 'Stay Updated',
  subtitle = 'Receive monthly newsletter, progress audits, and stories of direct impact from our teams in Uttarakhand.',
  className = '',
  id = 'newsletter-section',
}: NewsletterProps) {
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

    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      toast('Please enter your email address to subscribe.', 'error');
      return;
    }

    if (!validateEmail(email.trim())) {
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

  const isDark = variant === 'dark';

  return (
    <div className={`space-y-4 ${className}`} id={id}>
      <div>
        <p className={`text-sm font-sans uppercase tracking-wider font-bold ${isDark ? 'text-white' : 'text-primary'}`}>
          {title}
        </p>
        {subtitle && (
          <p className={`text-sm leading-relaxed font-sans max-w-sm mt-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700 font-medium'}`}>
            {subtitle}
          </p>
        )}
      </div>

      {status === 'success' ? (
        <div 
          className={`rounded-xl p-4 flex items-start gap-3 animate-fade-in ${
            isDark 
              ? 'bg-accent/10 border border-accent/20 text-accent' 
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
          id={`${id}-success`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
            isDark ? 'bg-accent/20 text-accent' : 'bg-emerald-200 text-emerald-800'
          }`}>
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-emerald-900'}`}>
              Successfully Subscribed!
            </p>
            <p className={`text-xs mt-0.5 font-sans ${isDark ? 'text-neutral-300' : 'text-emerald-800'}`}>
              Thank you for subscribing. You will receive our next program update soon.
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
              aria-label="Email address for field updates"
              className={`flex-grow rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 font-sans disabled:opacity-55 ${
                isDark
                  ? 'bg-white/10 border border-white/20 text-white placeholder-neutral-400 focus:border-accent focus:ring-1 focus:ring-accent'
                  : 'bg-neutral-50 border border-neutral-300 text-neutral-800 placeholder-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary'
              }`}
              id={`${id}-email-input`}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-55 ${
                isDark
                  ? 'bg-accent hover:bg-accent-dark text-primary hover:shadow-lg hover:shadow-accent/15'
                  : 'bg-primary hover:bg-primary-light text-white hover:shadow-lg hover:shadow-primary/15'
              }`}
              aria-label="Subscribe to newsletter"
              id={`${id}-submit-button`}
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
              className="flex items-center gap-1.5 text-xs text-red-400 animate-fade-in pl-1 font-medium"
              id={`${id}-error`}
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
