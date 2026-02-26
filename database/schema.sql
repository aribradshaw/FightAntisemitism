-- About Jews / Fight Antisemitism – MySQL schema
-- Run against database: redsaber_antisemitism

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Timeline events (from Jews, Israel, Left-wing antisemitism wikis + app)
CREATE TABLE IF NOT EXISTS timeline_events (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  year INT NOT NULL COMMENT 'Year (BCE as negative)',
  label VARCHAR(255) NOT NULL,
  region VARCHAR(64) DEFAULT NULL COMMENT 'e.g. levant, europe',
  description TEXT,
  source_url VARCHAR(512) DEFAULT NULL,
  source_label VARCHAR(255) DEFAULT NULL COMMENT 'e.g. Jews wiki, Israel wiki',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_year (year),
  KEY idx_region (region)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Definitions (Jew, Talmud, Genocide, Antisemitism, Zionism, etc.)
CREATE TABLE IF NOT EXISTS definitions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  summary VARCHAR(512) DEFAULT NULL,
  body_text TEXT COMMENT 'Full content (plain or HTML)',
  further_reading JSON DEFAULT NULL COMMENT 'Array of {label, url} e.g. Hashem.Faith',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agitators (public figures who have promoted antisemitic ideas)
CREATE TABLE IF NOT EXISTS agitators (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  subtitle VARCHAR(512) DEFAULT NULL,
  description TEXT,
  image_url VARCHAR(512) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agitator sources (quotes, actions, timeline of antisemitic comments)
CREATE TABLE IF NOT EXISTS agitator_sources (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  agitator_id INT UNSIGNED NOT NULL,
  date_label VARCHAR(64) DEFAULT NULL COMMENT 'e.g. 2019, 2022, Decades',
  text TEXT NOT NULL,
  url VARCHAR(512) DEFAULT NULL,
  sort_order INT UNSIGNED DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY fk_agitator (agitator_id),
  CONSTRAINT fk_agitator_sources_agitator FOREIGN KEY (agitator_id) REFERENCES agitators (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Misconceptions (hub entries: Israel, Talmud, Jewish race, Conspiracy)
CREATE TABLE IF NOT EXISTS misconceptions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  summary VARCHAR(512) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Misconception topic content (body per topic)
CREATE TABLE IF NOT EXISTS misconception_topics (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  misconception_id INT UNSIGNED NOT NULL,
  topic_slug VARCHAR(64) NOT NULL COMMENT 'e.g. israel, talmud, jewish-race, conspiracy',
  title VARCHAR(255) NOT NULL,
  body_text TEXT COMMENT 'HTML or plain text',
  further_reading JSON DEFAULT NULL COMMENT 'Array of {label, url} e.g. Hashem.Faith',
  sort_order INT UNSIGNED DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_misconception_topic (misconception_id, topic_slug),
  KEY fk_misconception (misconception_id),
  CONSTRAINT fk_misconception_topics_misconception FOREIGN KEY (misconception_id) REFERENCES misconceptions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
