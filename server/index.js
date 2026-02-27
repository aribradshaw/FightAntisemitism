/**
 * API server for About Jews app. Serves timeline and other data from MySQL.
 * Requires .env with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.
 * Run: node server/index.js  (default port 3001)
 */

import express from 'express'
import mysql from 'mysql2/promise'
import { existsSync } from 'fs'
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
}

const PORT = Number(process.env.PORT) || Number(process.env.API_PORT) || 3001
const isProduction = process.env.NODE_ENV === 'production'

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

// GET /api/definitions — all definitions (slug, title, summary) for list
app.get('/api/definitions', async (_req, res) => {
  try {
    const conn = await getConnection()
    const [rows] = await conn.execute(
      'SELECT slug, title, summary FROM definitions ORDER BY title ASC'
    )
    conn.end()
    res.json(rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      summary: r.summary,
    })))
  } catch (err) {
    console.error('GET /api/definitions:', err.message)
    res.status(500).json({ error: 'Failed to load definitions.' })
  }
})

// GET /api/definitions/:slug — one definition with body_text and further_reading
app.get('/api/definitions/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const conn = await getConnection()
    const [rows] = await conn.execute(
      'SELECT slug, title, summary, body_text, further_reading FROM definitions WHERE slug = ? LIMIT 1',
      [slug]
    )
    conn.end()
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Definition not found.' })
    }
    const r = rows[0]
    let further_reading = r.further_reading
    if (typeof further_reading === 'string') {
      try {
        further_reading = further_reading ? JSON.parse(further_reading) : []
      } catch {
        further_reading = []
      }
    }
    if (!Array.isArray(further_reading)) further_reading = []
    res.json({
      slug: r.slug,
      title: r.title,
      summary: r.summary,
      body_text: r.body_text ?? '',
      further_reading,
    })
  } catch (err) {
    console.error('GET /api/definitions/:slug:', err.message)
    res.status(500).json({ error: 'Failed to load definition.' })
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

// GET /api/conspiracies — all conspiracy theories with sources
app.get('/api/conspiracies', async (_req, res) => {
  try {
    const conn = await getConnection()
    const [conspiracies] = await conn.execute(
      'SELECT id, slug, title, summary, body_text, category, tags, sort_order FROM conspiracies ORDER BY sort_order ASC, title ASC'
    )
    const [sources] = await conn.execute(
      'SELECT conspiracy_id, label, url, sort_order FROM conspiracy_sources ORDER BY conspiracy_id, sort_order ASC'
    )
    conn.end()
    const sourcesByConspiracy = {}
    for (const s of sources) {
      if (!sourcesByConspiracy[s.conspiracy_id]) sourcesByConspiracy[s.conspiracy_id] = []
      sourcesByConspiracy[s.conspiracy_id].push({ label: s.label, url: s.url })
    }
    const result = conspiracies.map((c) => ({
      slug: c.slug,
      title: c.title,
      summary: c.summary,
      body_text: c.body_text,
      category: c.category,
      tags: typeof c.tags === 'string' ? (c.tags ? JSON.parse(c.tags) : []) : (c.tags || []),
      sources: sourcesByConspiracy[c.id] || [],
    }))
    res.json(result)
  } catch (err) {
    console.error('GET /api/conspiracies:', err.message)
    res.status(500).json({ error: 'Failed to load conspiracies.' })
  }
})

// GET /api/talmud — all Talmud entries with sources
app.get('/api/talmud', async (_req, res) => {
  try {
    const conn = await getConnection()
    const [entries] = await conn.execute(
      'SELECT id, slug, title, summary, body_text, category, tags, sort_order FROM talmud_entries ORDER BY sort_order ASC, title ASC'
    )
    const [sources] = await conn.execute(
      'SELECT talmud_entry_id, label, url, sort_order FROM talmud_sources ORDER BY talmud_entry_id, sort_order ASC'
    )
    conn.end()
    const sourcesByEntry = {}
    for (const s of sources) {
      if (!sourcesByEntry[s.talmud_entry_id]) sourcesByEntry[s.talmud_entry_id] = []
      sourcesByEntry[s.talmud_entry_id].push({ label: s.label, url: s.url })
    }
    const result = entries.map((e) => ({
      slug: e.slug,
      title: e.title,
      summary: e.summary,
      body_text: e.body_text,
      category: e.category,
      tags: typeof e.tags === 'string' ? (e.tags ? JSON.parse(e.tags) : []) : (e.tags || []),
      sources: sourcesByEntry[e.id] || [],
    }))
    res.json(result)
  } catch (err) {
    console.error('GET /api/talmud:', err.message)
    res.status(500).json({ error: 'Failed to load Talmud entries.' })
  }
})

// GET /api/misconception-entries/:topic — entries for a misconception topic (israel | jewish-race)
app.get('/api/misconception-entries/:topic', async (req, res) => {
  const topic = (req.params.topic || '').toLowerCase()
  if (topic !== 'israel' && topic !== 'jewish-race') {
    return res.json([])
  }
  try {
    const conn = await getConnection()
    const [entries] = await conn.execute(
      'SELECT id, topic_slug, slug, title, summary, body_text, sort_order FROM misconception_entries WHERE topic_slug = ? ORDER BY sort_order ASC, title ASC',
      [topic]
    )
    const [sources] = await conn.execute(
      'SELECT misconception_entry_id, label, url, sort_order FROM misconception_entry_sources ORDER BY misconception_entry_id, sort_order ASC'
    )
    conn.end()
    const sourcesByEntry = {}
    for (const s of sources) {
      if (!sourcesByEntry[s.misconception_entry_id]) sourcesByEntry[s.misconception_entry_id] = []
      sourcesByEntry[s.misconception_entry_id].push({ label: s.label, url: s.url })
    }
    const result = entries.map((e) => ({
      slug: e.slug,
      title: e.title,
      summary: e.summary,
      body_text: e.body_text,
      sources: sourcesByEntry[e.id] || [],
    }))
    res.json(result)
  } catch (err) {
    console.error('GET /api/misconception-entries/:topic:', err.message)
    res.status(500).json({ error: 'Failed to load misconception entries.' })
  }
})

// GET /api/by-tag?tag=... — items (conspiracies, talmud, etc.) that have this tag
app.get('/api/by-tag', async (req, res) => {
  const tag = typeof req.query.tag === 'string' ? req.query.tag.trim() : ''
  if (!tag) {
    return res.json({ items: [] })
  }
  try {
    const conn = await getConnection()
    const tagJson = JSON.stringify(tag)
    const [conspiracies] = await conn.execute(
      'SELECT slug, title FROM conspiracies WHERE JSON_CONTAINS(tags, ?, "$")',
      [tagJson]
    )
    const [talmud] = await conn.execute(
      'SELECT slug, title FROM talmud_entries WHERE JSON_CONTAINS(tags, ?, "$")',
      [tagJson]
    )
    conn.end()
    const items = [
      ...conspiracies.map((r) => ({ slug: r.slug, title: r.title, parent: 'conspiracies' })),
      ...talmud.map((r) => ({ slug: r.slug, title: r.title, parent: 'talmud' })),
    ]
    res.json({ items })
  } catch (err) {
    console.error('GET /api/by-tag:', err.message)
    res.status(500).json({ error: 'Failed to load items by tag.', items: [] })
  }
})

// Production: serve built frontend and SPA fallback
if (isProduction) {
  const distPath = join(__dirname, '..', 'dist')
  if (existsSync(distPath)) {
    app.use(express.static(distPath))
    app.get('*', (_req, res) => {
      res.sendFile(join(distPath, 'index.html'))
    })
  }
}

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})
