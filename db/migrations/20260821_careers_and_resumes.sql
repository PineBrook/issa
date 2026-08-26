-- migrate:statement
CREATE TABLE IF NOT EXISTS job_openings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  employment_type TEXT NOT NULL,
  salary TEXT,
  description TEXT NOT NULL,
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft', 'archived')),
  closing_time TIMESTAMPTZ,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:statement
CREATE INDEX IF NOT EXISTS job_openings_active_display_idx
  ON job_openings (display_order ASC, created_at ASC)
  WHERE status = 'active';

-- migrate:statement
CREATE TABLE IF NOT EXISTS career_applications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id BIGINT REFERENCES job_openings(id) ON DELETE SET NULL,
  role_slug TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  experience_years TEXT NOT NULL,
  statement TEXT,
  consent_text TEXT NOT NULL,
  consent_version TEXT NOT NULL DEFAULT '2026-v1',
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'under_review', 'interview_scheduled', 'rejected', 'hired', 'archived')),
  assigned_to TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:statement
CREATE INDEX IF NOT EXISTS career_applications_status_idx
  ON career_applications (status, created_at DESC);

-- migrate:statement
CREATE INDEX IF NOT EXISTS career_applications_email_role_idx
  ON career_applications (email, role_slug, created_at DESC);

-- migrate:statement
CREATE TABLE IF NOT EXISTS resume_files (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  application_id BIGINT NOT NULL REFERENCES career_applications(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL UNIQUE,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),
  checksum_sha256 TEXT NOT NULL,
  file_data BYTEA,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:statement
CREATE INDEX IF NOT EXISTS resume_files_application_id_idx
  ON resume_files (application_id);

-- migrate:statement
INSERT INTO job_openings (
  slug, title, department, location, employment_type, salary,
  description, requirements, status, display_order
)
VALUES
  (
    'edu-expert',
    'Senior Education Expert',
    'Academic Programs',
    'Srinagar Garhwal, Uttarakhand',
    'Full-time (On-site)',
    'Competitive & Housing Provided',
    'Lead the classroom curriculum implementation, smart board deployment, and monthly teacher evaluation circles across our adopt school clusters in Pauri and Chamoli districts.',
    '["Master’s degree in Education, Social Work, or a related computer field.", "At least 3 years of teaching or training experience, ideally in rural districts.", "Fluency in Hindi and local Garhwali/Kumaoni dialects is highly preferred.", "Ready to travel to remote, high-altitude village classrooms."]'::jsonb,
    'active',
    1
  ),
  (
    'health-practitioner',
    'Healthcare Camp Coordinator',
    'Clinical Outreach',
    'Pauri Garhwal, Uttarakhand',
    'Full-time (On-site / Mobile)',
    'Competitive & Travel Allowances',
    'Supervise the schedule, logistics, equipment stocking, and specialist medical doctor rosters for our Himalayan Mobile Health Camps across rural blocks.',
    '["Bachelor’s or Master’s in Public Health, Nursing, or Hospital Administration.", "Strong management experience organizing rural medical camps or logistics.", "Familiarity with medical emergency diagnostic machines.", "Compassionate mindset to serve senior populations in cold terrains."]'::jsonb,
    'active',
    2
  ),
  (
    'program-manager',
    'Program Operations Manager',
    'Administration',
    'Dehradun / Field visits',
    'Full-time (Hybrid)',
    NULL,
    'Coordinate program budgets, material purchase audits, and formal agreements with local government departments.',
    '["MBA or Post Graduate Degree in Rural Development or Operations.", "At least 5 years experience managing social impact initiatives at scale.", "Excellent proposal writing, budgeting, and English-Hindi communication.", "Proactive relationship builder with government officials and village authorities."]'::jsonb,
    'active',
    3
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  department = EXCLUDED.department,
  location = EXCLUDED.location,
  employment_type = EXCLUDED.employment_type,
  salary = EXCLUDED.salary,
  description = EXCLUDED.description,
  requirements = EXCLUDED.requirements,
  status = EXCLUDED.status,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();
