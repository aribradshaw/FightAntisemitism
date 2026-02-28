/**
 * Add contact_entries table (for existing DBs that don't have it).
 * Run: node database/run-migrate-contact-entries.js
 */

import { getConnection } from './lib/db.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function run() {
  const sql = readFileSync(join(__dirname, 'migrate-contact-entries.sql'), 'utf8')
  const conn = await getConnection()
  try {
    await conn.query(sql)
    console.log('Migration applied (contact_entries table created if missing).')
  } finally {
    await conn.end()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
