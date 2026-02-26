-- Misconception entries: per-topic myths (Israel, Jewish Race) with list+detail like Conspiracies/Talmud
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS misconception_entries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  topic_slug VARCHAR(64) NOT NULL COMMENT 'israel | jewish-race',
  slug VARCHAR(128) NOT NULL,
  title VARCHAR(512) NOT NULL,
  summary VARCHAR(512) DEFAULT NULL,
  body_text TEXT COMMENT 'Refutation (plain or HTML)',
  sort_order INT UNSIGNED DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_topic_slug (topic_slug, slug),
  KEY idx_topic (topic_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS misconception_entry_sources (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  misconception_entry_id INT UNSIGNED NOT NULL,
  label VARCHAR(255) NOT NULL,
  url VARCHAR(512) DEFAULT NULL,
  sort_order INT UNSIGNED DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY fk_misconception_entry (misconception_entry_id),
  CONSTRAINT fk_misconception_entry_sources_entry FOREIGN KEY (misconception_entry_id) REFERENCES misconception_entries (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
