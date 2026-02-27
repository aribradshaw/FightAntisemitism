/**
 * Shared DB config and connection for seed scripts.
 * Load .env from project root (parent of database/).
 */

import mysql from 'mysql2/promise'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config as loadEnv } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
loadEnv({ path: join(__dirname, '..', '..', '.env') })

export const config = {
  host: process.env.DB_HOST || '192.232.249.125',
  user: process.env.DB_USER || 'redsaber_antisemitism',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'redsaber_antisemitism',
}

export async function getConnection() {
  if (!config.password) {
    throw new Error('Set DB_PASSWORD in .env (e.g. copy .env.example to .env)')
  }
  return mysql.createConnection(config)
}
