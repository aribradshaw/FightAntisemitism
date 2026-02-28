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
// override: false so Railway/platform env vars are not overwritten by .env
loadEnv({ path: join(__dirname, '..', '.env'), override: false })

const config = {
  host: process.env.DB_HOST || '192.232.249.125',
  user: process.env.DB_USER || 'redsaber_antisemitism',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'redsaber_antisemitism',
}

const PORT = Number(process.env.PORT) || Number(process.env.API_PORT) || 3001
const isProduction = process.env.NODE_ENV === 'production'

const app = express()
app.use(express.json())

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY
const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || 'aribradshawaz@gmail.com'
const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@hashem.faith'
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const SMTP_SECURE = process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1'

async function getConnection() {
  if (!config.password) {
    const hint = process.env.RAILWAY_ENVIRONMENT
      ? 'Set DB_PASSWORD in Railway → Variables for this service and redeploy.'
      : 'Set DB_PASSWORD in .env (copy .env.example to .env)'
    throw new Error(hint)
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
      'SELECT id, slug, name, subtitle, description, image_url, priority FROM agitators ORDER BY priority ASC, name ASC'
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
      priority: Number(a.priority ?? a.PRIORITY ?? 100),
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
      'SELECT id, slug, title, reference, summary, body_text, category, tags, sort_order FROM talmud_entries ORDER BY sort_order ASC, title ASC'
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
      reference: e.reference || null,
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
    if (err.code) console.error('DB error code:', err.code)
    res.status(500).json({ error: 'Failed to load misconception entries.' })
  }
})

// POST /api/contact — submit question form (name, email, question, category, recaptchaToken); save to DB and email
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, question, category, recaptchaToken } = req.body || {}
    const nameStr = typeof name === 'string' ? name.trim() : ''
    const emailStr = typeof email === 'string' ? email.trim() : ''
    const questionStr = typeof question === 'string' ? question.trim() : ''
    const categoryStr = typeof category === 'string' ? category.trim() || 'other' : 'other'

    if (!nameStr || !emailStr || !questionStr || !recaptchaToken) {
      return res.status(400).json({ error: 'Name, email, question, and reCAPTCHA are required.' })
    }
    if (!RECAPTCHA_SECRET) {
      console.error('RECAPTCHA_SECRET_KEY not set')
      return res.status(503).json({ error: 'Contact form is not configured.' })
    }
    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: RECAPTCHA_SECRET, response: recaptchaToken }).toString(),
    })
    const verify = await verifyRes.json()
    if (!verify.success) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' })
    }
    // reCAPTCHA v3: optional score check (0.0 = bot, 1.0 = likely human)
    const score = verify.score
    if (typeof score === 'number' && score < 0.5) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' })
    }

    // 1) Save to database
    const conn = await getConnection()
    try {
      await conn.execute(
        'INSERT INTO contact_entries (name, email, category, question) VALUES (?, ?, ?, ?)',
        [nameStr, emailStr, categoryStr, questionStr]
      )
    } finally {
      conn.end()
    }

    // 2) Send email to you (from no-reply@hashem.faith)
    if (!EMAIL_USER || !EMAIL_PASS) {
      console.error('EMAIL_USER or EMAIL_PASS not set; entry saved but email not sent')
      return res.json({ success: true })
    }
    const nodemailer = (await import('nodemailer')).default
    const transporterOpts = SMTP_HOST
      ? { host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_SECURE, auth: { user: EMAIL_USER, pass: EMAIL_PASS } }
      : { service: 'gmail', auth: { user: EMAIL_USER, pass: EMAIL_PASS } }
    const transporter = nodemailer.createTransport(transporterOpts)
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: CONTACT_EMAIL_TO,
      replyTo: emailStr,
      subject: `[Site contact] ${categoryStr}: ${nameStr.slice(0, 50)}`,
      text: `Name: ${nameStr}\nEmail: ${emailStr}\nCategory: ${categoryStr}\n\nQuestion:\n${questionStr}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(nameStr)}</p><p><strong>Email:</strong> ${escapeHtml(emailStr)}</p><p><strong>Category:</strong> ${escapeHtml(categoryStr)}</p><p><strong>Question:</strong></p><p>${escapeHtml(questionStr).replace(/\n/g, '<br>')}</p>`,
    })
    res.json({ success: true })
  } catch (err) {
    console.error('POST /api/contact:', err.message)
    res.status(500).json({ error: 'Failed to send your message. Please try again.' })
  }
})

function escapeHtml(s) {
  if (typeof s !== 'string') return ''
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

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
