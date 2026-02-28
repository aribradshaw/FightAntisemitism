/**
 * Add users.email and contact_entries user/answer fields.
 * Run: node database/run-migrate-contact-user-answers.js
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

async function hasConstraint(conn, table, constraintName) {
  const [rows] = await conn.query(
    `SELECT 1
     FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND CONSTRAINT_NAME = ?
     LIMIT 1`,
    [table, constraintName]
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
    if (!(await hasColumn(conn, 'users', 'email'))) {
      await conn.query('ALTER TABLE users ADD COLUMN email VARCHAR(255) DEFAULT NULL UNIQUE AFTER username')
      console.log('Added users.email')
    } else {
      console.log('users.email already exists')
    }

    if (!(await hasColumn(conn, 'contact_entries', 'user_id'))) {
      await conn.query('ALTER TABLE contact_entries ADD COLUMN user_id INT UNSIGNED DEFAULT NULL AFTER id')
      console.log('Added contact_entries.user_id')
    }
    if (!(await hasColumn(conn, 'contact_entries', 'answer_text'))) {
      await conn.query('ALTER TABLE contact_entries ADD COLUMN answer_text TEXT DEFAULT NULL AFTER question')
      console.log('Added contact_entries.answer_text')
    }
    if (!(await hasColumn(conn, 'contact_entries', 'answered_at'))) {
      await conn.query('ALTER TABLE contact_entries ADD COLUMN answered_at DATETIME DEFAULT NULL AFTER answer_text')
      console.log('Added contact_entries.answered_at')
    }
    if (!(await hasIndex(conn, 'contact_entries', 'idx_contact_entries_user'))) {
      await conn.query('ALTER TABLE contact_entries ADD KEY idx_contact_entries_user (user_id)')
      console.log('Added contact_entries idx_contact_entries_user')
    }
    if (!(await hasConstraint(conn, 'contact_entries', 'fk_contact_entries_user'))) {
      await conn.query(
        'ALTER TABLE contact_entries ADD CONSTRAINT fk_contact_entries_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL'
      )
      console.log('Added fk_contact_entries_user')
    }

    console.log('Migration applied (contact/user account linkage + answer fields).')
  } finally {
    await conn.end()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
