-- Add priority column to agitators (run once on existing DBs).
-- New installs use schema.sql which already includes priority.
ALTER TABLE agitators
  ADD COLUMN priority INT UNSIGNED NOT NULL DEFAULT 100 COMMENT 'Lower = shown first on Agitators page' AFTER image_url,
  ADD KEY idx_priority (priority);
