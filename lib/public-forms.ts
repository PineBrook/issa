import 'server-only';

import { neon } from '@neondatabase/serverless';

export type FormResult = { success: boolean; message: string; errors?: Record<string, string> };

function getDb() {
  const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
  return connectionString ? neon(connectionString) : null;
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function saveContactSubmission(input: { name: string; email: string; subject: string; message: string; honeypot: string }): Promise<FormResult> {
  if (input.honeypot.trim()) return { success: true, message: 'Thank you. Your inquiry has been received.' };
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const subject = input.subject.trim();
  const message = input.message.trim();
  const errors: Record<string, string> = {};
  if (name.length < 2 || name.length > 100) errors.name = 'Please enter a name between 2 and 100 characters.';
  if (!validEmail(email)) errors.email = 'Please enter a valid email address.';
  if (!subject || subject.length > 100) errors.subject = 'Please select a valid subject.';
  if (message.length < 10 || message.length > 5000) errors.message = 'Message must be between 10 and 5,000 characters.';
  if (Object.keys(errors).length) return { success: false, message: 'Please correct the highlighted fields.', errors };
  const sql = getDb();
  if (!sql) return { success: false, message: 'We cannot accept messages right now. Please try again later.' };
  await sql`INSERT INTO contact_submissions (full_name, email, inquiry_type, message) VALUES (${name}, ${email}, ${subject}, ${message})`;
  return { success: true, message: 'Thank you. Your inquiry has been received.' };
}

export async function saveNewsletterSubscription(input: { email: string; honeypot: string; source: string }): Promise<FormResult> {
  if (input.honeypot.trim()) return { success: true, message: 'Thank you for subscribing.' };
  const email = normalizeEmail(input.email);
  if (!validEmail(email)) return { success: false, message: 'Please enter a valid email address.', errors: { email: 'Please enter a valid email address.' } };
  const sql = getDb();
  if (!sql) return { success: false, message: 'We cannot subscribe you right now. Please try again later.' };
  await sql`
    INSERT INTO newsletter_subscriptions (email, consent_source)
    VALUES (${email}, ${input.source})
    ON CONFLICT (email) DO UPDATE SET
      status = 'active', subscribed_at = NOW(), unsubscribed_at = NULL, updated_at = NOW()
  `;
  return { success: true, message: 'Thank you for subscribing.' };
}
