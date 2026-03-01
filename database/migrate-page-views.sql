-- Add page view analytics table.
CREATE TABLE IF NOT EXISTS page_views (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_path VARCHAR(255) NOT NULL,
  user_id INT UNSIGNED DEFAULT NULL,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_page_views_path (page_path),
  KEY idx_page_views_user (user_id),
  KEY idx_page_views_viewed_at (viewed_at),
  CONSTRAINT fk_page_views_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
