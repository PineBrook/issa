-- migrate:statement
DO $$
BEGIN
  ALTER TYPE staff_role_access_name ADD VALUE IF NOT EXISTS 'no_access';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- migrate:statement
DO $$
BEGIN
  CREATE TYPE staff_role_type AS ENUM ('no_access', 'admin', 'content');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- migrate:statement
ALTER TABLE staff_profiles DROP CONSTRAINT IF EXISTS staff_profiles_role_check;

-- migrate:statement
ALTER TABLE staff_profiles ADD CONSTRAINT staff_profiles_role_check CHECK (role IN ('NO_ACCESS', 'ADMIN', 'CONTENT', 'no_access', 'admin', 'content'));

-- migrate:statement
ALTER TABLE staff_profiles DROP CONSTRAINT IF EXISTS staff_profiles_email_check;

-- migrate:statement
ALTER TABLE staff_profiles ADD CONSTRAINT staff_profiles_email_check CHECK (email = LOWER(email) AND email LIKE '%@pinebrooktechnologies.com');

-- migrate:statement
ALTER TABLE staff_profiles ADD COLUMN IF NOT EXISTS first_name TEXT;

-- migrate:statement
UPDATE staff_profiles SET first_name = SPLIT_PART(full_name, ' ', 1) WHERE first_name IS NULL OR first_name = '';
