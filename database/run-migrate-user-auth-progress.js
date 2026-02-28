/**
 * Add users/user_sessions/user_read_progress tables (for existing DBs).
 * Run: node database/run-migrate-user-auth-progress.js
 */

import { getConnection } from './lib/db.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function run() {
  const sql = readFileSync(join(__dirname, 'migrate-user-auth-progress.sql'), 'utf8')
  const conn = await getConnection()
  try {
    const statements = sql
      .split(/;\s*\n/g)
      .map((s) => s.trim())
      .filter(Boolean)
    for (const statement of statements) {
      await conn.query(statement)
    }
    console.log('Migration applied (users/auth/progress tables created if missing).')
  } finally {
    await conn.end()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
