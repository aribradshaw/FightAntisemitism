// 13+ age screen for reader sign-up. The same approach as OneProfileID:
// a neutral birth-date screen comes before the sign-up form, the server works
// out the age, and the result (never the date) goes into a short-lived signed
// cookie. /api/auth/register refuses to create an account without an
// "eligible" cookie, so the check can't be skipped by calling the API directly.
// A "blocked" result lasts a day and wins over any later date from the same
// browser, so going back and entering another date doesn't help.
//
// This is an age screen, not identity verification or parental consent.
// The submitted birth date is never stored, logged, or put in the cookie.
import { Buffer } from 'buffer'
import { createHmac, timingSafeEqual } from 'crypto'

export const MIN_AGE = 13
export const ELIGIBLE_SECONDS = 30 * 60
export const BLOCKED_SECONDS = 24 * 60 * 60
// Shown to anyone the screen turns away. Deliberately neutral: no cutoff, no retry hint.
export const AGE_BLOCKED_MESSAGE = "Sorry, we can't create an account for you right now."
export const AGE_SCREEN_REQUIRED_MESSAGE = 'Please enter your date of birth to continue.'

// 'eligible' | 'blocked' | 'invalid' for a YYYY-MM-DD birth date, evaluated in UTC.
export function ageEligibility(value, today = new Date()) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'invalid'
  const birth = new Date(`${value}T00:00:00Z`)
  if (!Number.isFinite(birth.getTime()) || birth.toISOString().slice(0, 10) !== value) return 'invalid'
  if (birth > today || birth.getUTCFullYear() < 1900) return 'invalid'
  const cutoff = new Date(Date.UTC(today.getUTCFullYear() - MIN_AGE, today.getUTCMonth(), today.getUTCDate()))
  return birth <= cutoff ? 'eligible' : 'blocked'
}

function readCookie(header, name) {
  for (const part of String(header || '').split(';')) {
    const idx = part.indexOf('=')
    if (idx > 0 && part.slice(0, idx).trim() === name) return part.slice(idx + 1).trim()
  }
  return ''
}

export function createAgeGate(secret, { secure = true, now = () => Date.now() } = {}) {
  if (typeof secret !== 'string' || !secret) throw new Error('The age screen needs a server secret.')
  const name = secure ? '__Host-af_age' : 'af_age'
  const sign = (value) => createHmac('sha256', secret).update(`age-screen-v1:${value}`).digest('base64url')

  // 'eligible' | 'blocked' | 'unknown' from the request's cookie.
  const status = (req) => {
    const token = readCookie(req?.headers?.cookie, name)
    if (!token) return 'unknown'
    const [result, expiry, signature, ...extra] = token.split('.')
    if (extra.length || !['eligible', 'blocked'].includes(result) || !/^\d+$/.test(expiry || '')) return 'unknown'
    if (Number(expiry) <= now()) return 'unknown'
    const expected = Buffer.from(sign(`${result}.${expiry}`))
    const actual = Buffer.from(signature || '')
    return expected.length === actual.length && timingSafeEqual(expected, actual) ? result : 'unknown'
  }

  // Screens a birth date. A live "blocked" cookie keeps the result blocked.
  const check = (req, birthDate) => {
    const result = status(req) === 'blocked' ? 'blocked' : ageEligibility(birthDate, new Date(now()))
    if (result === 'invalid') return { status: result }
    const seconds = result === 'blocked' ? BLOCKED_SECONDS : ELIGIBLE_SECONDS
    const payload = `${result}.${now() + seconds * 1000}`
    const cookie = `${name}=${payload}.${sign(payload)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${seconds}${secure ? '; Secure' : ''}`
    return { status: result, cookie }
  }

  // Express middleware for account creation: only an eligible screen gets through.
  const requireEligible = (req, res, next) => {
    const current = status(req)
    if (current === 'eligible') return next()
    if (current === 'blocked') return res.status(403).json({ error: AGE_BLOCKED_MESSAGE, code: 'age_blocked' })
    return res.status(403).json({ error: AGE_SCREEN_REQUIRED_MESSAGE, code: 'age_screen_required' })
  }

  return { name, status, check, requireEligible }
}

// Routes for the screen itself. GET tells the client which step to show;
// POST takes { birthDate } and answers only { status }.
export function mountAgeScreenRoutes(app, gate, { isRateLimited = () => false } = {}) {
  app.get('/api/auth/age-screen', (req, res) => {
    res.setHeader('Cache-Control', 'no-store')
    res.json({ status: gate.status(req) })
  })
  app.post('/api/auth/age-screen', (req, res) => {
    res.setHeader('Cache-Control', 'no-store')
    if (isRateLimited(req)) return res.status(429).json({ error: 'Too many requests. Please try again later.' })
    const body = req.body && typeof req.body === 'object' ? req.body : {}
    // Only the date belongs on this screen; refuse anything that identifies the person.
    if (Object.keys(body).some((key) => key !== 'birthDate')) {
      return res.status(400).json({ error: 'Please enter only your date of birth.' })
    }
    const result = gate.check(req, body.birthDate)
    if (result.status === 'invalid') return res.status(400).json({ error: 'Please enter a valid date of birth.' })
    res.append('Set-Cookie', result.cookie)
    if (result.status === 'blocked') return res.json({ status: 'blocked', message: AGE_BLOCKED_MESSAGE })
    return res.json({ status: 'eligible' })
  })
}
