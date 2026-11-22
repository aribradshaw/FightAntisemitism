/**
 * Add users.age_verified_at (13+ age screen). Additive and safe to re-run.
 * Run: node database/run-migrate-user-age-verified.js
 */

import process from 'process'
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

async function run() {
  const conn = await getConnection()
  try {
    if (await hasColumn(conn, 'users', 'age_verified_at')) {
      console.log('users.age_verified_at already exists')
    } else {
      await conn.query('ALTER TABLE users ADD COLUMN age_verified_at DATETIME DEFAULT NULL AFTER zip_code')
      console.log('Added users.age_verified_at')
    }
    console.log('Migration applied (13+ age screen record ready).')
  } finally {
    await conn.end()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
