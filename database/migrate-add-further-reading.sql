-- Add Hashem.Faith further_reading to definitions and misconception_topics.
-- Run this if you already have the tables and don't want to recreate them.
-- MySQL 5.7+ (JSON type). If column already exists, skip or ignore the error.

ALTER TABLE definitions
  ADD COLUMN further_reading JSON DEFAULT NULL COMMENT 'Array of {label, url} e.g. Hashem.Faith';

ALTER TABLE misconception_topics
  ADD COLUMN further_reading JSON DEFAULT NULL COMMENT 'Array of {label, url} e.g. Hashem.Faith';
