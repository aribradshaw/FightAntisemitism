/**
 * Run database/schema.sql against the MySQL database.
 * Requires .env with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.
 * Run: node database/run-schema.js
 */

import mysql from 'mysql2/promise'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config as loadEnv } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
loadEnv({ path: join(__dirname, '..', '.env') })

const config = {
  host: process.env.DB_HOST || '192.232.249.125',
  user: process.env.DB_USER || 'redsaber_antisemitism',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'redsaber_antisemitism',
  multipleStatements: true,
}

if (!config.password) {
  console.error('Set DB_PASSWORD in .env (copy .env.example to .env)')
  process.exit(1)
}

async function run() {
  const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
  const conn = await mysql.createConnection(config)
  await conn.query(sql)
  await conn.end()
  console.log('Schema applied successfully.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
