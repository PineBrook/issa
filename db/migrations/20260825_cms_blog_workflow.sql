-- migrate:statement
DO $$
BEGIN
  ALTER TABLE blog_posts DROP CONSTRAINT IF EXISTS blog_posts_check;
  ALTER TABLE blog_posts DROP CONSTRAINT IF EXISTS blog_posts_status_check;
  ALTER TABLE blog_posts DROP CONSTRAINT IF EXISTS blog_posts_published_at_check;
EXCEPTION
  WHEN undefined_object THEN NULL;
END
$$;

-- migrate:statement
ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_status_check
  CHECK (status IN ('draft', 'in_review', 'scheduled', 'published', 'archived'));

-- migrate:statement
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1;

-- migrate:statement
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_title TEXT;

-- migrate:statement
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- migrate:statement
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS created_by_id BIGINT REFERENCES staff_profiles(id) ON DELETE SET NULL;

-- migrate:statement
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS updated_by_id BIGINT REFERENCES staff_profiles(id) ON DELETE SET NULL;

-- migrate:statement
CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON blog_posts (status);

-- migrate:statement
CREATE INDEX IF NOT EXISTS blog_posts_updated_at_idx ON blog_posts (updated_at DESC);

-- migrate:statement
CREATE TABLE IF NOT EXISTS blog_post_revisions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  editor_id BIGINT REFERENCES staff_profiles(id) ON DELETE SET NULL,
  editor_email TEXT NOT NULL,
  revision_number INT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  cover_image_path TEXT NOT NULL,
  author_name TEXT NOT NULL,
  reading_time_minutes SMALLINT NOT NULL,
  status TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  change_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:statement
CREATE INDEX IF NOT EXISTS blog_post_revisions_post_id_idx
  ON blog_post_revisions (post_id, revision_number DESC);
