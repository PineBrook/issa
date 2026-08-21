export interface JobOpening {
  id: number;
  slug: string;
  title: string;
  department: string;
  dept?: string;
  location: string;
  employmentType: string;
  type?: string;
  salary?: string | null;
  description: string;
  desc?: string;
  requirements: string[];
  reqs?: string[];
  status: 'active' | 'closed' | 'draft' | 'archived';
  closingTime?: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CareerApplication {
  id: number;
  jobId?: number | null;
  roleSlug: string;
  fullName: string;
  email: string;
  phone?: string | null;
  experienceYears: string;
  statement?: string | null;
  consentText: string;
  consentVersion: string;
  consentedAt: string;
  status: 'new' | 'under_review' | 'interview_scheduled' | 'rejected' | 'hired' | 'archived';
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeFile {
  id: number;
  applicationId: number;
  storageKey: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  uploadedAt: string;
  deletedAt?: string | null;
  createdAt: string;
}

export interface CareerApplicationInput {
  fullName: string;
  email: string;
  role: string;
  experience: string;
  statement?: string;
  consent: boolean;
  consentText?: string;
  consentVersion?: string;
  honeypot?: string;
}

export interface ResumeFileInput {
  buffer: Buffer;
  originalFilename: string;
  mimeType: string;
  size: number;
}

export interface ApplicationSubmissionState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  applicationId?: number;
}
