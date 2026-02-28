/**
 * Add priority column to agitators table (for existing DBs).
 * Run: node database/run-migrate-agitators-priority.js
 */

import { getConnection } from './lib/db.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function run() {
  const sql = readFileSync(join(__dirname, 'migrate-agitators-priority.sql'), 'utf8')
  const conn = await getConnection()
  try {
    await conn.execute(sql)
    console.log('Migration applied (agitators.priority added).')
  } catch (err) {
    if (err.code === 'ER_DUP_FIELD_NAME') {
      console.log('Column priority already exists; skipping.')
    } else throw err
  } finally {
    await conn.end()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
