/**
 * Add archived_at support to contact_entries.
 * Run: node database/run-migrate-contact-archive.js
 */

import { getConnection } from './lib/db.js'

async function hasColumn(conn, table, column) {
  const [rows] = await conn.query(
    `SELECT 1
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?
     LIMIT 1`,
    [table, column]
  )
  return Array.isArray(rows) && rows.length > 0
}

async function hasIndex(conn, table, indexName) {
  const [rows] = await conn.query(
    `SELECT 1
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?
     LIMIT 1`,
    [table, indexName]
  )
  return Array.isArray(rows) && rows.length > 0
}

async function run() {
  const conn = await getConnection()
  try {
    if (!(await hasColumn(conn, 'contact_entries', 'archived_at'))) {
      await conn.query('ALTER TABLE contact_entries ADD COLUMN archived_at DATETIME DEFAULT NULL AFTER answered_at')
      console.log('Added contact_entries.archived_at')
    } else {
      console.log('contact_entries.archived_at already exists')
    }
    if (!(await hasIndex(conn, 'contact_entries', 'idx_contact_entries_archived'))) {
      await conn.query('ALTER TABLE contact_entries ADD KEY idx_contact_entries_archived (archived_at)')
      console.log('Added idx_contact_entries_archived')
    } else {
      console.log('idx_contact_entries_archived already exists')
    }
    console.log('Migration applied (contact archiving support).')
  } finally {
    await conn.end()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
