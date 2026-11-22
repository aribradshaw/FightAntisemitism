-- Additive: record when a new account passed the 13+ age screen.
-- Only the time is kept, never the birth date. Existing accounts stay NULL.
-- Run once on existing DBs (npm run db:migrate:age-verified); schema.sql has it for new installs.
ALTER TABLE users ADD COLUMN age_verified_at DATETIME DEFAULT NULL AFTER zip_code;
