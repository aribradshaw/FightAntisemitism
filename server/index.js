/**
 * API server for About Jews app. Serves timeline and other data from MySQL.
 * Requires .env with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.
 * Run: node server/index.js  (default port 3001)
 */

import express from 'express'
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
}

const PORT = Number(process.env.API_PORT) || 3001

const app = express()

async function getConnection() {
  if (!config.password) {
    throw new Error('Set DB_PASSWORD in .env (copy .env.example to .env)')
  }
  return mysql.createConnection(config)
}

// GET /api/timeline-events — all timeline events (year, label, region, description, source_label, source_url)
app.get('/api/timeline-events', async (_req, res) => {
  try {
    const conn = await getConnection()
    const [rows] = await conn.execute(
      'SELECT id, year, label, region, description, source_label, source_url FROM timeline_events ORDER BY year ASC'
    )
    conn.end()
    const pickUrl = (row) => {
      const k = Object.keys(row).find((key) => key.toLowerCase() === 'source_url')
      if (!k) return null
      const v = row[k]
      if (v == null || v === '') return null
      const s = typeof v === 'string' ? v.trim() : String(v)
      return s || null
    }
    const pickLabel = (row) => {
      const k = Object.keys(row).find((key) => key.toLowerCase() === 'source_label')
      if (!k) return null
      const v = row[k]
      if (v == null || v === '') return null
      const s = typeof v === 'string' ? v.trim() : String(v)
      return s || null
    }
    const normalized = rows.map((r) => {
      const sourceUrl = pickUrl(r)
      const sourceLabel = pickLabel(r)
      return {
        id: r.id,
        year: r.year,
        label: r.label,
        region: r.region,
        description: r.description,
        source_label: sourceLabel,
        source_url: sourceUrl,
      }
    })
    res.json(normalized)
  } catch (err) {
    console.error('GET /api/timeline-events:', err.message)
    res.status(500).json({ error: 'Failed to load timeline events.' })
  }
})

// GET /api/agitators — all agitators with sources and image_url (Commons URLs)
app.get('/api/agitators', async (_req, res) => {
  try {
    const conn = await getConnection()
    const [agitators] = await conn.execute(
      'SELECT id, slug, name, subtitle, description, image_url FROM agitators ORDER BY name ASC'
    )
    const [sources] = await conn.execute(
      'SELECT agitator_id, date_label, text, url, sort_order FROM agitator_sources ORDER BY agitator_id, sort_order ASC'
    )
    conn.end()
    const sourcesByAgitator = {}
    for (const s of sources) {
      if (!sourcesByAgitator[s.agitator_id]) sourcesByAgitator[s.agitator_id] = []
      sourcesByAgitator[s.agitator_id].push({ date: s.date_label, text: s.text, url: s.url })
    }
    const result = agitators.map((a) => ({
      slug: a.slug,
      name: a.name,
      subtitle: a.subtitle,
      description: a.description,
      image: a.image_url,
      sources: sourcesByAgitator[a.id] || [],
    }))
    res.json(result)
  } catch (err) {
    console.error('GET /api/agitators:', err.message)
    res.status(500).json({ error: 'Failed to load agitators.' })
  }
})

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})
