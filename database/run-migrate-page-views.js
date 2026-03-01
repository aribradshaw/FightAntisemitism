/**
 * Add page_views analytics table.
 * Run: node database/run-migrate-page-views.js
 */

import { getConnection } from './lib/db.js'

async function hasTable(conn, table) {
  const [rows] = await conn.query(
    `SELECT 1
     FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
     LIMIT 1`,
    [table]
  )
  return Array.isArray(rows) && rows.length > 0
}

async function run() {
  const conn = await getConnection()
  try {
    if (await hasTable(conn, 'page_views')) {
      console.log('page_views table already exists')
      console.log('Migration applied (page view analytics ready).')
      return
    }
    await conn.query(
      `CREATE TABLE IF NOT EXISTS page_views (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        page_path VARCHAR(255) NOT NULL,
        user_id INT UNSIGNED DEFAULT NULL,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        KEY idx_page_views_path (page_path),
        KEY idx_page_views_user (user_id),
        KEY idx_page_views_viewed_at (viewed_at),
        CONSTRAINT fk_page_views_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    )
    console.log('Created page_views table')
    console.log('Migration applied (page view analytics ready).')
  } finally {
    await conn.end()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
