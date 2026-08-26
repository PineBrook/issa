-- migrate:statement
ALTER TABLE resume_files ADD COLUMN IF NOT EXISTS file_data BYTEA;
