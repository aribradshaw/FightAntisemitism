/**
 * Run database/migrate-talmud-reference.sql (adds reference column to talmud_entries).
 * Requires .env with DB credentials. Run: node database/run-migrate-talmud-reference.js
 */

import mysql from 'mysql2/promise'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import { config as dbConfig } from './lib/db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const config = {
  ...dbConfig,
  multipleStatements: true,
}

if (!config.password) {
  console.error('Set DB_PASSWORD in .env')
  process.exit(1)
}

async function run() {
  const sql = readFileSync(join(__dirname, 'migrate-talmud-reference.sql'), 'utf8')
  const conn = await mysql.createConnection(config)
  try {
    await conn.query(sql)
    console.log('Migration applied (talmud_entries.reference column added).')
  } catch (err) {
    if (err.code === 'ER_DUP_FIELD_NAME') {
      console.log('Column reference already exists; skipping.')
    } else throw err
  } finally {
    await conn.end()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
