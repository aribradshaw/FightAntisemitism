-- Add reference column for Talmud citation (e.g. Bava Metzia 114b) shown under title
ALTER TABLE talmud_entries ADD COLUMN reference VARCHAR(256) DEFAULT NULL COMMENT 'Talmud/source ref addressed' AFTER title;
