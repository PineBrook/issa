'use server';

import type { ApplicationSubmissionState } from '@/lib/careers-types';
import { submitCareerApplication } from '@/lib/careers';

export async function submitCareerApplicationAction(
  _prevState: ApplicationSubmissionState,
  formData: FormData
): Promise<ApplicationSubmissionState> {
  try {
    const fullName = String(formData.get('name') ?? formData.get('fullName') ?? '');
    const email = String(formData.get('email') ?? '');
    const role = String(formData.get('role') ?? '');
    const experience = String(formData.get('experience') ?? '');
    const statement = String(formData.get('statement') ?? '');
    const consent = formData.get('consent') === 'on' || formData.get('consent') === 'true' || formData.get('consent') === '1';
    const honeypot = String(formData.get('website') ?? formData.get('botField') ?? '');

    const file = formData.get('resume') as File | null;
    if (!file || !(file instanceof File) || file.size === 0) {
      return {
        success: false,
        message: 'Please attach your CV / Resume file (PDF, DOC, or DOCX).',
        errors: { resume: 'Resume file is required.' },
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return await submitCareerApplication(
      {
        fullName,
        email,
        role,
        experience,
        statement,
        consent,
        honeypot,
        consentText:
          'I consent to ISSA Foundation collecting and processing my application data and resume for recruitment in accordance with the Privacy Policy.',
        consentVersion: '2026-v1',
      },
      {
        buffer,
        originalFilename: file.name || 'resume.pdf',
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
      }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error in submitCareerApplicationAction:', err);
    return {
      success: false,
      message: err.message || 'An unexpected error occurred while processing your application. Please try again.',
    };
  }
}
