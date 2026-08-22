'use server';

import { headers } from 'next/headers';
import { saveContactSubmission, saveNewsletterSubscription, type FormResult } from '@/lib/public-forms';

const attempts = new Map<string, number[]>();

async function allowSubmission(kind: string) {
  const forwarded = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const key = `${kind}:${forwarded}`;
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < 60_000);
  if (recent.length >= 5) return false;
  recent.push(now);
  attempts.set(key, recent);
  return true;
}

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? '').slice(0, 6000);
}

export async function submitContactAction(formData: FormData): Promise<FormResult> {
  if (!(await allowSubmission('contact'))) return { success: false, message: 'Please wait a moment before trying again.' };
  try {
    return await saveContactSubmission({ name: field(formData, 'name'), email: field(formData, 'email'), subject: field(formData, 'subject'), message: field(formData, 'message'), honeypot: field(formData, 'website') });
  } catch {
    return { success: false, message: 'We could not send your message. Please try again.' };
  }
}

export async function subscribeNewsletterAction(formData: FormData): Promise<FormResult> {
  if (!(await allowSubmission('newsletter'))) return { success: false, message: 'Please wait a moment before trying again.' };
  try {
    return await saveNewsletterSubscription({ email: field(formData, 'email'), honeypot: field(formData, 'website'), source: field(formData, 'source') || 'website' });
  } catch {
    return { success: false, message: 'We could not subscribe you. Please try again.' };
  }
}
