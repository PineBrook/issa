-- migrate:statement
CREATE TABLE IF NOT EXISTS staff_profiles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  auth_user_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE CHECK (email = LOWER(email) AND email LIKE '%@pinebrooktechnologies.com'),
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'CONTENT')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:statement
CREATE INDEX IF NOT EXISTS staff_profiles_status_idx ON staff_profiles (status);

-- migrate:statement
DO $$
BEGIN
  CREATE TYPE staff_role_access_name AS ENUM ('admin', 'content');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- migrate:statement
CREATE TABLE IF NOT EXISTS staff_email_access (
  email TEXT PRIMARY KEY CHECK (email = LOWER(email)),
  role_access_name staff_role_access_name NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
