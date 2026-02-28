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
import { randomBytes, createHash, createHmac, timingSafeEqual } from 'crypto'
import bcrypt from 'bcryptjs'
import { promises as dns } from 'dns'
import net from 'net'
import tls from 'tls'

const __dirname = dirname(fileURLToPath(import.meta.url))
// Load .env from project root (override: false so Railway/platform env vars win)
const envPath = join(__dirname, '..', '.env')
loadEnv({ path: envPath, override: false })
if (!process.env.RECAPTCHA_SECRET_KEY && existsSync(join(process.cwd(), '.env'))) {
  loadEnv({ path: join(process.cwd(), '.env'), override: false })
}

const config = {
  host: process.env.DB_HOST || '192.232.249.125',
  user: process.env.DB_USER || 'redsaber_antisemitism',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'redsaber_antisemitism',
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT_MS) || 10000,
}

const PORT = Number(process.env.PORT) || Number(process.env.API_PORT) || 3001
const isProduction = process.env.NODE_ENV === 'production'

const app = express()
app.use(express.json())

// Fast health endpoint for platform checks.
app.get('/api/healthz', (_req, res) => {
  res.status(200).json({ ok: true })
})

// Runtime SMTP diagnostics for Railway->provider connectivity.
// Set SMTP_DEBUG_TOKEN and call /api/diagnostics/smtp?token=... to run.
app.get('/api/diagnostics/smtp', async (req, res) => {
  if (!SMTP_DEBUG_TOKEN || req.query?.token !== SMTP_DEBUG_TOKEN) {
    return res.status(404).json({ error: 'Not found' })
  }
  try {
    if (!SMTP_HOST || !SMTP_PORT) {
      return res.status(400).json({ error: 'SMTP_HOST and SMTP_PORT are required.' })
    }
    const timeoutMs = Math.max(SMTP_CONNECT_TIMEOUT_MS, 5000)
    const report = {
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      timeoutMs,
      dns: await resolveHost(SMTP_HOST),
      tcp: await testTcpConnect(SMTP_HOST, SMTP_PORT, timeoutMs),
      tls: null,
      verify: null,
    }
    if (SMTP_SECURE) {
      report.tls = await testTlsConnect(SMTP_HOST, SMTP_PORT, timeoutMs)
    }
    try {
      const nodemailer = (await import('nodemailer')).default
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
        connectionTimeout: SMTP_CONNECT_TIMEOUT_MS,
        greetingTimeout: SMTP_CONNECT_TIMEOUT_MS,
        socketTimeout: SMTP_SOCKET_TIMEOUT_MS,
      })
      await transporter.verify()
      report.verify = { ok: true }
    } catch (err) {
      report.verify = {
        ok: false,
        message: err?.message || String(err),
        code: err?.code || null,
        errno: err?.errno || null,
        command: err?.command || null,
        address: err?.address || null,
        port: err?.port || null,
      }
    }
    return res.json(report)
  } catch (err) {
    return res.status(500).json({ error: err?.message || String(err) })
  }
})

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || process.env.RECAPTCHA_SECRET
if (!RECAPTCHA_SECRET && !isProduction) {
  console.warn('Contact form: RECAPTCHA_SECRET_KEY not set. Add it to .env in the project root and restart the server.')
}
const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || 'aribradshawaz@gmail.com'
const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@hashem.faith'
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const SMTP_SECURE = process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1'
const RECAPTCHA_VERIFY_TIMEOUT_MS = Number(process.env.RECAPTCHA_VERIFY_TIMEOUT_MS) || 10000
const SMTP_CONNECT_TIMEOUT_MS = Number(process.env.SMTP_CONNECT_TIMEOUT_MS) || 10000
const SMTP_SOCKET_TIMEOUT_MS = Number(process.env.SMTP_SOCKET_TIMEOUT_MS) || 10000
const SMTP_DEBUG_TOKEN = process.env.SMTP_DEBUG_TOKEN || ''
const SESSION_COOKIE_NAME = 'af_session'
const ADMIN_SESSION_COOKIE_NAME = 'af_admin_session'
const SESSION_DAYS = Number(process.env.SESSION_DAYS) || 30
const SESSION_TTL_MS = SESSION_DAYS * 24 * 60 * 60 * 1000
const SESSION_SECRET = process.env.SESSION_SECRET || process.env.DB_PASSWORD || 'change-me-session-secret'
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'aribradshawaz@gmail.com')
  .split(',')
  .map((v) => v.trim().toLowerCase())
  .filter(Boolean)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

const PROGRESS_CATEGORY_SQL = {
  definitions: 'SELECT COUNT(*) AS c FROM definitions',
  agitators: 'SELECT COUNT(*) AS c FROM agitators',
  conspiracies: 'SELECT COUNT(*) AS c FROM conspiracies',
  talmud: 'SELECT COUNT(*) AS c FROM talmud_entries',
  misconceptions: 'SELECT COUNT(*) AS c FROM misconception_entries',
}
const VALID_PROGRESS_CATEGORIES = new Set(Object.keys(PROGRESS_CATEGORY_SQL))

async function getConnection() {
  if (!config.password) {
    const hint = process.env.RAILWAY_ENVIRONMENT
      ? 'Set DB_PASSWORD in Railway → Variables for this service and redeploy.'
      : 'Set DB_PASSWORD in .env (copy .env.example to .env)'
    throw new Error(hint)
  }
  return mysql.createConnection(config)
}

function parseCookies(req) {
  const raw = req.headers?.cookie
  if (!raw) return {}
  const out = {}
  raw.split(';').forEach((part) => {
    const idx = part.indexOf('=')
    if (idx <= 0) return
    const key = part.slice(0, idx).trim()
    const value = part.slice(idx + 1).trim()
    if (!key) return
    out[key] = decodeURIComponent(value)
  })
  return out
}

function hashSessionToken(token) {
  return createHash('sha256').update(`${token}:${SESSION_SECRET}`).digest('hex')
}

function setSessionCookie(res, token, expiresAt) {
  const maxAge = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
  const secureFlag = isProduction ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`)
}

function clearSessionCookie(res) {
  const secureFlag = isProduction ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`)
}

function signAdminSession(email, expiresAtMs) {
  const payload = `${email}|${expiresAtMs}`
  const sig = createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
  return Buffer.from(`${payload}|${sig}`).toString('base64url')
}

function parseAdminSession(token) {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const [email, expiresAtRaw, sig] = decoded.split('|')
    const expiresAtMs = Number(expiresAtRaw)
    if (!email || !Number.isFinite(expiresAtMs) || !sig) return null
    const payload = `${email}|${expiresAtMs}`
    const expectedSig = createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
    const a = Buffer.from(sig, 'hex')
    const b = Buffer.from(expectedSig, 'hex')
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
    if (Date.now() > expiresAtMs) return null
    return { email }
  } catch {
    return null
  }
}

function setAdminSessionCookie(res, token, expiresAtMs) {
  const maxAge = Math.max(0, Math.floor((expiresAtMs - Date.now()) / 1000))
  const secureFlag = isProduction ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${ADMIN_SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`)
}

function clearAdminSessionCookie(res) {
  const secureFlag = isProduction ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${ADMIN_SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`)
}

function getAdminFromRequest(req) {
  const token = parseCookies(req)[ADMIN_SESSION_COOKIE_NAME]
  if (!token) return null
  return parseAdminSession(token)
}

async function fetchJsonWithTimeout(url, init, timeoutMs) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...init, signal: controller.signal })
    const data = await res.json()
    return { res, data }
  } finally {
    clearTimeout(timeoutId)
  }
}

async function resolveHost(host) {
  const out = { host, a: [], aaaa: [] }
  try {
    out.a = await dns.resolve4(host)
  } catch (err) {
    out.a_error = err?.message || String(err)
  }
  try {
    out.aaaa = await dns.resolve6(host)
  } catch (err) {
    out.aaaa_error = err?.message || String(err)
  }
  return out
}

function testTcpConnect(host, port, timeoutMs) {
  return new Promise((resolve) => {
    const startedAt = Date.now()
    const socket = net.createConnection({ host, port })
    let settled = false
    const done = (result) => {
      if (settled) return
      settled = true
      resolve({ ...result, elapsed_ms: Date.now() - startedAt })
      socket.destroy()
    }
    socket.setTimeout(timeoutMs)
    socket.on('connect', () => {
      done({
        ok: true,
        remoteAddress: socket.remoteAddress || null,
        remoteFamily: socket.remoteFamily || null,
        remotePort: socket.remotePort || null,
      })
    })
    socket.on('timeout', () => done({ ok: false, error: 'TCP timeout' }))
    socket.on('error', (err) => done({ ok: false, error: err?.message || String(err), code: err?.code || null }))
  })
}

function testTlsConnect(host, port, timeoutMs) {
  return new Promise((resolve) => {
    const startedAt = Date.now()
    const socket = tls.connect({
      host,
      port,
      servername: host,
      rejectUnauthorized: false,
    })
    let settled = false
    const done = (result) => {
      if (settled) return
      settled = true
      resolve({ ...result, elapsed_ms: Date.now() - startedAt })
      socket.destroy()
    }
    socket.setTimeout(timeoutMs)
    socket.on('secureConnect', () => {
      done({
        ok: true,
        authorized: socket.authorized,
        authorizationError: socket.authorizationError || null,
        protocol: socket.getProtocol?.() || null,
        remoteAddress: socket.remoteAddress || null,
        remoteFamily: socket.remoteFamily || null,
        remotePort: socket.remotePort || null,
      })
    })
    socket.on('timeout', () => done({ ok: false, error: 'TLS timeout' }))
    socket.on('error', (err) => done({ ok: false, error: err?.message || String(err), code: err?.code || null }))
  })
}

function sanitizeUser(row) {
  if (!row) return null
  return {
    id: row.id,
    username: row.username,
    email: row.email || null,
    profile_image_url: row.profile_image_url || null,
    first_name: row.first_name || '',
    last_name: row.last_name || '',
    zip_code: row.zip_code || '',
    created_at: row.created_at || null,
  }
}

async function getSessionUser(req, conn) {
  const cookies = parseCookies(req)
  const token = cookies[SESSION_COOKIE_NAME]
  if (!token) return null
  const tokenHash = hashSessionToken(token)
  const [rows] = await conn.execute(
    `SELECT u.id, u.username, u.email, u.profile_image_url, u.first_name, u.last_name, u.zip_code, u.created_at
     FROM user_sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.session_token_hash = ? AND s.expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  )
  if (!rows || rows.length === 0) return null
  await conn.execute('UPDATE user_sessions SET last_seen_at = CURRENT_TIMESTAMP WHERE session_token_hash = ?', [tokenHash])
  return sanitizeUser(rows[0])
}

async function requireAuth(req, res) {
  const conn = await getConnection()
  const user = await getSessionUser(req, conn)
  if (!user) {
    await conn.end()
    res.status(401).json({ error: 'Unauthorized' })
    return null
  }
  return { conn, user }
}

const authAttempts = new Map()
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
function isRateLimited(req) {
  const key = req.ip || req.headers['x-forwarded-for'] || 'unknown'
  const now = Date.now()
  const windowMs = 5 * 60 * 1000
  const max = 25
  const existing = authAttempts.get(key) || []
  const recent = existing.filter((t) => now - t < windowMs)
  recent.push(now)
  authAttempts.set(key, recent)
  return recent.length > max
}

function normalizeEmail(value) {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : ''
  return EMAIL_RE.test(email) ? email : ''
}

function usernameFromEmail(email) {
  const local = (email.split('@')[0] || '').toLowerCase()
  const base = local.replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '')
  return (base || 'user').slice(0, 24)
}

async function createUserWithUniqueUsername(conn, email, password) {
  const passwordHash = await bcrypt.hash(password, 12)
  const base = usernameFromEmail(email)
  let createdUserId = null
  for (let i = 0; i < 20; i += 1) {
    const suffix = i === 0 ? '' : `_${randomBytes(3).toString('hex')}`
    const username = `${base}${suffix}`.slice(0, 32)
    try {
      const [result] = await conn.execute(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, passwordHash]
      )
      createdUserId = result.insertId
      break
    } catch (err) {
      if (err?.code === 'ER_DUP_ENTRY') continue
      throw err
    }
  }
  if (!createdUserId) throw new Error('Failed to create account username.')
  return createdUserId
}

// POST /api/auth/register — create account and session
app.post('/api/auth/register', async (req, res) => {
  if (isRateLimited(req)) return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  try {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim().toLowerCase() : ''
    const email = normalizeEmail(req.body?.email)
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    if (!/^[a-z0-9_]{3,32}$/.test(username)) {
      return res.status(400).json({ error: 'Username must be 3-32 chars using letters, numbers, or underscores.' })
    }
    if (req.body?.email && !email) {
      return res.status(400).json({ error: 'Please provide a valid email.' })
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' })
    }
    const conn = await getConnection()
    try {
      const [existing] = await conn.execute('SELECT id FROM users WHERE username = ? LIMIT 1', [username])
      if (existing && existing.length > 0) {
        return res.status(409).json({ error: 'Username already exists.' })
      }
      if (email) {
        const [emailExisting] = await conn.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
        if (emailExisting && emailExisting.length > 0) {
          return res.status(409).json({ error: 'Email already exists.' })
        }
      }
      const passwordHash = await bcrypt.hash(password, 12)
      const [result] = await conn.execute('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email || null, passwordHash])
      const userId = result.insertId
      const sessionToken = randomBytes(32).toString('hex')
      const tokenHash = hashSessionToken(sessionToken)
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
      await conn.execute(
        'INSERT INTO user_sessions (user_id, session_token_hash, expires_at) VALUES (?, ?, ?)',
        [userId, tokenHash, expiresAt]
      )
      const [users] = await conn.execute(
        'SELECT id, username, email, profile_image_url, first_name, last_name, zip_code, created_at FROM users WHERE id = ? LIMIT 1',
        [userId]
      )
      setSessionCookie(res, sessionToken, expiresAt)
      return res.json({ user: sanitizeUser(users?.[0]) })
    } finally {
      await conn.end()
    }
  } catch (err) {
    console.error('POST /api/auth/register:', err.message)
    return res.status(500).json({ error: 'Failed to register.' })
  }
})

// POST /api/auth/login — authenticate and create session
app.post('/api/auth/login', async (req, res) => {
  if (isRateLimited(req)) return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  try {
    const identifierRaw =
      typeof req.body?.identifier === 'string'
        ? req.body.identifier
        : typeof req.body?.username === 'string'
        ? req.body.username
        : ''
    const identifier = identifierRaw.trim().toLowerCase()
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    if (!identifier || !password) return res.status(400).json({ error: 'Username/email and password are required.' })
    const conn = await getConnection()
    try {
      const [rows] = await conn.execute(
        `SELECT id, username, email, password_hash, profile_image_url, first_name, last_name, zip_code, created_at
         FROM users
         WHERE username = ? OR email = ?
         LIMIT 1`,
        [identifier, identifier]
      )
      if (!rows || rows.length === 0) return res.status(401).json({ error: 'Invalid username or password.' })
      const row = rows[0]
      const ok = await bcrypt.compare(password, row.password_hash)
      if (!ok) return res.status(401).json({ error: 'Invalid username or password.' })
      const sessionToken = randomBytes(32).toString('hex')
      const tokenHash = hashSessionToken(sessionToken)
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
      await conn.execute(
        'INSERT INTO user_sessions (user_id, session_token_hash, expires_at) VALUES (?, ?, ?)',
        [row.id, tokenHash, expiresAt]
      )
      setSessionCookie(res, sessionToken, expiresAt)
      return res.json({ user: sanitizeUser(row) })
    } finally {
      await conn.end()
    }
  } catch (err) {
    console.error('POST /api/auth/login:', err.message)
    return res.status(500).json({ error: 'Failed to login.' })
  }
})

// POST /api/auth/logout — invalidate current session
app.post('/api/auth/logout', async (req, res) => {
  try {
    const token = parseCookies(req)[SESSION_COOKIE_NAME]
    if (token) {
      const conn = await getConnection()
      try {
        await conn.execute('DELETE FROM user_sessions WHERE session_token_hash = ?', [hashSessionToken(token)])
      } finally {
        await conn.end()
      }
    }
    clearSessionCookie(res)
    return res.json({ success: true })
  } catch (err) {
    console.error('POST /api/auth/logout:', err.message)
    return res.status(500).json({ error: 'Failed to logout.' })
  }
})

// GET /api/auth/me — current user (if logged in)
app.get('/api/auth/me', async (req, res) => {
  try {
    const conn = await getConnection()
    try {
      const user = await getSessionUser(req, conn)
      return res.json({ user: user || null })
    } finally {
      await conn.end()
    }
  } catch (err) {
    console.error('GET /api/auth/me:', err.message)
    return res.status(500).json({ error: 'Failed to load current user.' })
  }
})

// POST /api/admin/login — admin-only email/password login from env vars
app.post('/api/admin/login', async (req, res) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' })
    if (!ADMIN_PASSWORD) return res.status(503).json({ error: 'Admin login is not configured.' })
    if (!ADMIN_EMAILS.includes(email) || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid admin credentials.' })
    }
    const expiresAtMs = Date.now() + SESSION_TTL_MS
    const token = signAdminSession(email, expiresAtMs)
    setAdminSessionCookie(res, token, expiresAtMs)
    return res.json({ admin: { email } })
  } catch (err) {
    console.error('POST /api/admin/login:', err.message)
    return res.status(500).json({ error: 'Failed to login.' })
  }
})

// POST /api/admin/logout — clear admin session
app.post('/api/admin/logout', (req, res) => {
  clearAdminSessionCookie(res)
  return res.json({ success: true })
})

// GET /api/admin/me — current admin identity
app.get('/api/admin/me', (req, res) => {
  const admin = getAdminFromRequest(req)
  return res.json({ admin: admin ? { email: admin.email } : null })
})

// GET /api/admin/contact-entries — latest submitted questions for dashboard
app.get('/api/admin/contact-entries', async (req, res) => {
  const admin = getAdminFromRequest(req)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const limitRaw = Number(req.query?.limit)
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(Math.floor(limitRaw), 1), 500) : 200
    const conn = await getConnection()
    try {
      const [rows] = await conn.execute(
        `SELECT id, user_id, name, email, category, question, answer_text, answered_at, created_at
         FROM contact_entries
         ORDER BY created_at DESC
         LIMIT ?`,
        [limit]
      )
      return res.json({ entries: rows || [] })
    } finally {
      await conn.end()
    }
  } catch (err) {
    console.error('GET /api/admin/contact-entries:', err.message)
    return res.status(500).json({ error: 'Failed to load contact entries.' })
  }
})

// PATCH /api/admin/contact-entries/:id — mark a question answered/unanswered
app.patch('/api/admin/contact-entries/:id', async (req, res) => {
  const admin = getAdminFromRequest(req)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: 'Invalid entry id.' })
    const answerText = typeof req.body?.answer_text === 'string' ? req.body.answer_text.trim() : ''
    const conn = await getConnection()
    try {
      await conn.execute(
        `UPDATE contact_entries
         SET answer_text = ?, answered_at = ?
         WHERE id = ?`,
        [answerText || null, answerText ? new Date() : null, id]
      )
      return res.json({ success: true })
    } finally {
      await conn.end()
    }
  } catch (err) {
    console.error('PATCH /api/admin/contact-entries/:id:', err.message)
    return res.status(500).json({ error: 'Failed to update answer.' })
  }
})

// PATCH /api/profile — update profile fields
app.patch('/api/profile', async (req, res) => {
  try {
    const auth = await requireAuth(req, res)
    if (!auth) return
    const { conn, user } = auth
    try {
      const profile_image_url = typeof req.body?.profile_image_url === 'string' ? req.body.profile_image_url.trim() : ''
      const first_name = typeof req.body?.first_name === 'string' ? req.body.first_name.trim() : ''
      const last_name = typeof req.body?.last_name === 'string' ? req.body.last_name.trim() : ''
      const zip_code = typeof req.body?.zip_code === 'string' ? req.body.zip_code.trim() : ''
      if (profile_image_url && profile_image_url.length > 512) return res.status(400).json({ error: 'Profile image URL is too long.' })
      if (first_name.length > 128 || last_name.length > 128 || zip_code.length > 20) {
        return res.status(400).json({ error: 'One or more profile fields are too long.' })
      }
      await conn.execute(
        `UPDATE users
         SET profile_image_url = ?, first_name = ?, last_name = ?, zip_code = ?
         WHERE id = ?`,
        [profile_image_url || null, first_name || null, last_name || null, zip_code || null, user.id]
      )
      const [rows] = await conn.execute(
        'SELECT id, username, email, profile_image_url, first_name, last_name, zip_code, created_at FROM users WHERE id = ? LIMIT 1',
        [user.id]
      )
      return res.json({ user: sanitizeUser(rows?.[0]) })
    } finally {
      await conn.end()
    }
  } catch (err) {
    console.error('PATCH /api/profile:', err.message)
    return res.status(500).json({ error: 'Failed to update profile.' })
  }
})

// POST /api/progress/mark-read — mark one detail page as read
app.post('/api/progress/mark-read', async (req, res) => {
  try {
    const auth = await requireAuth(req, res)
    if (!auth) return
    const { conn, user } = auth
    try {
      const category = typeof req.body?.category === 'string' ? req.body.category.trim() : ''
      const itemSlug = typeof req.body?.item_slug === 'string' ? req.body.item_slug.trim() : ''
      if (!VALID_PROGRESS_CATEGORIES.has(category)) return res.status(400).json({ error: 'Invalid category.' })
      if (!itemSlug || itemSlug.length > 128) return res.status(400).json({ error: 'Invalid item slug.' })
      await conn.execute(
        `INSERT INTO user_read_progress (user_id, category, item_slug)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE last_read_at = CURRENT_TIMESTAMP`,
        [user.id, category, itemSlug]
      )
      return res.json({ success: true })
    } finally {
      await conn.end()
    }
  } catch (err) {
    console.error('POST /api/progress/mark-read:', err.message)
    return res.status(500).json({ error: 'Failed to update progress.' })
  }
})

// GET /api/progress/summary — overall and per-category progress for current user
app.get('/api/progress/summary', async (req, res) => {
  try {
    const auth = await requireAuth(req, res)
    if (!auth) return
    const { conn, user } = auth
    try {
      const categories = Object.keys(PROGRESS_CATEGORY_SQL)
      const totals = {}
      for (const cat of categories) {
        const [rows] = await conn.execute(PROGRESS_CATEGORY_SQL[cat])
        totals[cat] = Number(rows?.[0]?.c || 0)
      }
      const [readRows] = await conn.execute(
        `SELECT category, COUNT(*) AS c
         FROM user_read_progress
         WHERE user_id = ?
         GROUP BY category`,
        [user.id]
      )
      const readByCategory = {}
      for (const r of readRows || []) readByCategory[r.category] = Number(r.c || 0)
      const byCategory = categories.map((category) => {
        const completed = Math.min(readByCategory[category] || 0, totals[category] || 0)
        const total = totals[category] || 0
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0
        return { category, completed, total, percent }
      })
      const overall = byCategory.reduce((acc, row) => {
        acc.completed += row.completed
        acc.total += row.total
        return acc
      }, { completed: 0, total: 0 })
      overall.percent = overall.total > 0 ? Math.round((overall.completed / overall.total) * 100) : 0
      return res.json({ overall, byCategory })
    } finally {
      await conn.end()
    }
  } catch (err) {
    console.error('GET /api/progress/summary:', err.message)
    return res.status(500).json({ error: 'Failed to load progress summary.' })
  }
})

// GET /api/my/questions — current user's submitted contact questions with answer status
app.get('/api/my/questions', async (req, res) => {
  try {
    const auth = await requireAuth(req, res)
    if (!auth) return
    const { conn, user } = auth
    try {
      const [rows] = await conn.execute(
        `SELECT id, category, question, answer_text, answered_at, created_at
         FROM contact_entries
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [user.id]
      )
      return res.json({ questions: rows || [] })
    } finally {
      await conn.end()
    }
  } catch (err) {
    console.error('GET /api/my/questions:', err.message)
    return res.status(500).json({ error: 'Failed to load your questions.' })
  }
})

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
    const { name, email, password, question, category, recaptchaToken } = req.body || {}
    const nameStr = typeof name === 'string' ? name.trim() : ''
    const emailStr = normalizeEmail(email)
    const passwordStr = typeof password === 'string' ? password : ''
    const questionStr = typeof question === 'string' ? question.trim() : ''
    const categoryStr = typeof category === 'string' ? category.trim() || 'other' : 'other'

    if (!nameStr || !emailStr || !questionStr || !recaptchaToken) {
      return res.status(400).json({ error: 'Name, email, question, and reCAPTCHA are required.' })
    }
    if (!RECAPTCHA_SECRET) {
      console.error('RECAPTCHA_SECRET_KEY (or RECAPTCHA_SECRET) not set. Add it to .env in project root or set the env var, then restart the server.')
      return res.status(503).json({
        error: 'Contact form is not configured. Set RECAPTCHA_SECRET_KEY in .env and restart the API server (e.g. npm run dev).',
      })
    }
    const { data: verify } = await fetchJsonWithTimeout(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: RECAPTCHA_SECRET, response: recaptchaToken }).toString(),
      },
      RECAPTCHA_VERIFY_TIMEOUT_MS
    )
    if (!verify.success) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' })
    }
    // reCAPTCHA v3: score check (0.0 = bot, 1.0 = likely human). Use 0.3 threshold to avoid blocking real users.
    const score = verify.score
    if (typeof score === 'number' && score < 0.3) {
      console.warn('POST /api/contact: reCAPTCHA score too low', score)
      return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' })
    }

    // 1) Ensure account rules by email.
    // - If not logged in and email exists: force login first.
    // - If not logged in and email is new: create account (password required) and sign in.
    // - If logged in: email must match their account email if one exists.
    const conn = await getConnection()
    let userId = null
    try {
      const sessionUser = await getSessionUser(req, conn)
      if (sessionUser) {
        userId = sessionUser.id
        if (sessionUser.email && sessionUser.email.toLowerCase() !== emailStr) {
          return res.status(400).json({ error: 'Use your account email when submitting questions.' })
        }
        if (!sessionUser.email) {
          const [emailOwner] = await conn.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [emailStr])
          if (emailOwner && emailOwner.length > 0 && Number(emailOwner[0].id) !== Number(sessionUser.id)) {
            return res.status(409).json({ error: 'This email is already used by another account.' })
          }
          await conn.execute('UPDATE users SET email = ? WHERE id = ?', [emailStr, sessionUser.id])
        }
      } else {
        const [existingByEmail] = await conn.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [emailStr])
        if (existingByEmail && existingByEmail.length > 0) {
          return res.status(409).json({ error: 'This email already has an account. Please log in first.' })
        }
        if (!passwordStr || passwordStr.length < 8) {
          return res.status(400).json({ error: 'Create a password (8+ chars) to submit your first question.' })
        }
        userId = await createUserWithUniqueUsername(conn, emailStr, passwordStr)
        const sessionToken = randomBytes(32).toString('hex')
        const tokenHash = hashSessionToken(sessionToken)
        const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
        await conn.execute(
          'INSERT INTO user_sessions (user_id, session_token_hash, expires_at) VALUES (?, ?, ?)',
          [userId, tokenHash, expiresAt]
        )
        setSessionCookie(res, sessionToken, expiresAt)
      }

      // 2) Save question linked to account
      await conn.execute(
        'INSERT INTO contact_entries (user_id, name, email, category, question) VALUES (?, ?, ?, ?, ?)',
        [userId, nameStr, emailStr, categoryStr, questionStr]
      )
    } finally {
      await conn.end()
    }

    // 3) Return success immediately after save; send notification email in background.
    // This prevents SMTP/network stalls from leaving users stuck on "Sending...".
    res.json({ success: true })
    if (!EMAIL_USER || !EMAIL_PASS) {
      console.error('EMAIL_USER or EMAIL_PASS not set; entry saved but email not sent')
      return
    }
    ;(async () => {
      try {
        const nodemailer = (await import('nodemailer')).default
        const baseOpts = {
          auth: { user: EMAIL_USER, pass: EMAIL_PASS },
          connectionTimeout: SMTP_CONNECT_TIMEOUT_MS,
          greetingTimeout: SMTP_CONNECT_TIMEOUT_MS,
          socketTimeout: SMTP_SOCKET_TIMEOUT_MS,
        }
        const transporterOpts = SMTP_HOST
          ? { ...baseOpts, host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_SECURE }
          : { ...baseOpts, service: 'gmail' }
        const transporter = nodemailer.createTransport(transporterOpts)
        await transporter.sendMail({
          from: EMAIL_FROM,
          to: CONTACT_EMAIL_TO,
          replyTo: emailStr,
          subject: `[Site contact] ${categoryStr}: ${nameStr.slice(0, 50)}`,
          text: `Name: ${nameStr}\nEmail: ${emailStr}\nCategory: ${categoryStr}\n\nQuestion:\n${questionStr}`,
          html: `<p><strong>Name:</strong> ${escapeHtml(nameStr)}</p><p><strong>Email:</strong> ${escapeHtml(emailStr)}</p><p><strong>Category:</strong> ${escapeHtml(categoryStr)}</p><p><strong>Question:</strong></p><p>${escapeHtml(questionStr).replace(/\n/g, '<br>')}</p>`,
        })
      } catch (mailErr) {
        console.error(
          'POST /api/contact email delivery failed:',
          mailErr?.message || String(mailErr),
          JSON.stringify({
            code: mailErr?.code || null,
            errno: mailErr?.errno || null,
            command: mailErr?.command || null,
            address: mailErr?.address || null,
            port: mailErr?.port || null,
            host: SMTP_HOST || null,
            smtpPort: SMTP_PORT || null,
            secure: SMTP_SECURE,
          })
        )
      }
    })()
    return
  } catch (err) {
    if (err?.name === 'AbortError') {
      console.error('POST /api/contact: upstream timeout')
      return res.status(504).json({ error: 'Verification timed out. Please try again.' })
    }
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
