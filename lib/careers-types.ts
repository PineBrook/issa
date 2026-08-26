export type JobStatus = 'active' | 'closed' | 'draft' | 'archived';
export type CareerApplicationStatus =
  | 'new'
  | 'under_review'
  | 'interview_scheduled'
  | 'rejected'
  | 'hired'
  | 'archived';

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
  status: JobStatus;
  closingTime?: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PanelJobOpening extends JobOpening {
  applicationCount?: number;
}

export interface JobOpeningInput {
  title: string;
  slug?: string;
  department: string;
  location: string;
  employmentType: string;
  salary?: string | null;
  description: string;
  requirements: string[] | string;
  status?: JobStatus;
  closingTime?: string | null;
  displayOrder?: number;
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
  status: CareerApplicationStatus;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PanelResumeInfo {
  id: number;
  storageKey: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  uploadedAt: string;
  downloadUrl?: string;
}

export interface PanelCareerApplication extends CareerApplication {
  jobTitle?: string;
  jobDepartment?: string;
  resume?: PanelResumeInfo | null;
}

export interface CareerMetrics {
  totalActiveJobs: number;
  totalJobs: number;
  totalApplications: number;
  newApplications: number;
  underReviewApplications: number;
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

