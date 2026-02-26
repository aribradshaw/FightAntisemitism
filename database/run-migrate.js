/**
 * Run database/migrate-add-further-reading.sql (adds further_reading column).
 * Requires .env with DB_PASSWORD. Run: node database/run-migrate.js
 */

import mysql from 'mysql2/promise'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env')
    const content = readFileSync(envPath, 'utf8')
    content.split('\n').forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/)
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
    })
  } catch (_) {}
}

loadEnv()

const config = {
  host: process.env.DB_HOST || '192.232.249.125',
  user: process.env.DB_USER || 'redsaber_antisemitism',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'redsaber_antisemitism',
  multipleStatements: true,
}

if (!config.password) {
  console.error('Set DB_PASSWORD in .env')
  process.exit(1)
}

async function run() {
  const sql = readFileSync(join(__dirname, 'migrate-add-further-reading.sql'), 'utf8')
  const conn = await mysql.createConnection(config)
  try {
    await conn.query(sql)
    console.log('Migration applied (further_reading columns added).')
  } catch (err) {
    if (err.code === 'ER_DUP_FIELD_NAME') {
      console.log('Columns already exist; skipping.')
    } else throw err
  } finally {
    await conn.end()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
