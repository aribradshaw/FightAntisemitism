// 13+ age screen: date rules, the signed retry cookie, and that the register
// API itself refuses accounts without an eligible screen. Run:
//   node --test server/ageGate.test.js
// Uses a fake database connection; no MySQL and synthetic data only.
/* global process */
import assert from 'node:assert/strict'
import test from 'node:test'
import { ageEligibility, createAgeGate, AGE_BLOCKED_MESSAGE } from './ageGate.js'

const secret = 'synthetic-age-fixture-secret'

test('age is worked out on exact birthday boundaries, leap days, and bad dates', () => {
  const today = new Date('2026-11-22T12:00:00Z')
  assert.equal(ageEligibility('2013-11-22', today), 'eligible')
  assert.equal(ageEligibility('2013-11-23', today), 'blocked')
  assert.equal(ageEligibility('1990-05-01', today), 'eligible')
  assert.equal(ageEligibility('2020-01-01', today), 'blocked')
  assert.equal(ageEligibility('2026-11-23', today), 'invalid')
  for (const value of ['', null, undefined, true, 20000101, '2013-02-30', '2013-2-1', '0000-01-01', '1800-01-01', '2000-01-01T00:00'])
    assert.equal(ageEligibility(value, today), 'invalid')
  assert.equal(ageEligibility('2012-02-29', new Date('2025-02-28T12:00:00Z')), 'blocked')
  assert.equal(ageEligibility('2012-02-29', new Date('2025-03-01T12:00:00Z')), 'eligible')
})

test('the screen cookie is signed, short-lived, holds no birth date, and blocks a retry', () => {
  let time = Date.parse('2026-11-22T12:00:00Z')
  const gate = createAgeGate(secret, { now: () => time })
  const req = (cookie) => ({ headers: { cookie: cookie || '' } })
  const pair = (setCookie) => setCookie.split(';')[0]

  const passed = gate.check(req(), '2000-01-01')
  assert.equal(passed.status, 'eligible')
  assert.match(passed.cookie, /^__Host-af_age=eligible\.\d+\.[\w-]+; Path=\/; HttpOnly; SameSite=Lax; Max-Age=1800; Secure$/)
  assert.equal(passed.cookie.includes('2000'), false)
  assert.equal(gate.status(req(pair(passed.cookie))), 'eligible')
  assert.equal(gate.status(req(pair(passed.cookie).replace('eligible', 'blocked'))), 'unknown', 'tampered result')
  assert.equal(gate.status(req('__Host-af_age=eligible.99999999999999.forged')), 'unknown', 'forged signature')
  assert.equal(createAgeGate('another-secret', { now: () => time }).status(req(pair(passed.cookie))), 'unknown')

  const blocked = gate.check(req(), '2020-01-01')
  assert.equal(blocked.status, 'blocked')
  assert.match(blocked.cookie, /Max-Age=86400/)
  assert.equal(blocked.cookie.includes('2020'), false)
  // Back button, different date: still blocked while the cookie lives.
  assert.equal(gate.check(req(pair(blocked.cookie)), '1980-01-01').status, 'blocked')
  assert.equal(gate.check(req(), 'not-a-date').status, 'invalid')
  assert.equal(gate.check(req(), 'not-a-date').cookie, undefined)

  time += 1800 * 1000 + 1
  assert.equal(gate.status(req(pair(passed.cookie))), 'unknown', 'eligible expires after 30 minutes')
  assert.equal(gate.status(req(pair(blocked.cookie))), 'blocked', 'blocked lasts longer')
  time += 86400 * 1000
  assert.equal(gate.status(req(pair(blocked.cookie))), 'unknown', 'blocked expires after a day')
})

// The real Express app with a fake MySQL connection that records every query.
async function startApp() {
  process.env.SESSION_SECRET = secret
  const { app, setConnectionFactoryForTests } = await import('./index.js')
  const queries = []
  let nextId = 100
  setConnectionFactoryForTests(async () => ({
    async execute(sql, params = []) {
      queries.push({ sql, params })
      if (/^SELECT id FROM users/.test(sql)) return [[]]
      if (/^INSERT INTO users/.test(sql)) return [{ insertId: (nextId += 1) }]
      if (/^SELECT id, username/.test(sql)) return [[{ id: params[0], username: 'fixture_reader', email: null }]]
      return [{ affectedRows: 1 }]
    },
    async end() {},
  }))
  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s))
  })
  const base = `http://127.0.0.1:${server.address().port}`
  const post = (path, body, cookie) =>
    fetch(base + path, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) },
      body: JSON.stringify(body),
    })
  const screen = async (birthDate, cookie) => {
    const res = await post('/api/auth/age-screen', { birthDate }, cookie)
    const setCookie = res.headers.get('set-cookie') || ''
    return { res, body: await res.json(), cookie: setCookie.split(';')[0] }
  }
  return { base, post, screen, queries, close: () => new Promise((r) => server.close(r)) }
}

test('the register API needs an eligible screen, so the form cannot be skipped', async (t) => {
  const api = await startApp()
  t.after(api.close)
  const account = { username: 'fixture_reader', password: 'synthetic-password' }

  // Straight to the API, with or without a claimed birth date: refused before any DB work.
  for (const body of [account, { ...account, birthDate: '1990-01-01' }, { ...account, ageVerified: true }]) {
    const res = await api.post('/api/auth/register', body)
    assert.equal(res.status, 403)
    assert.equal((await res.json()).code, 'age_screen_required')
  }
  const forged = await api.post('/api/auth/register', account, `af_age=eligible.${Date.now() + 60000}.forged`)
  assert.equal(forged.status, 403)
  assert.equal(api.queries.length, 0)

  // The screen takes a date only, never identity fields.
  const withEmail = await api.post('/api/auth/age-screen', { birthDate: '1990-01-01', email: 'fixture@example.invalid' })
  assert.equal(withEmail.status, 400)
  assert.equal((await api.screen('2013-02-30')).res.status, 400)
  assert.equal(api.queries.length, 0)
})

test('under 13 is refused neutrally, and the same browser cannot retry with another date', async (t) => {
  const api = await startApp()
  t.after(api.close)

  const blocked = await api.screen('2020-06-15')
  assert.equal(blocked.res.status, 200)
  assert.deepEqual(blocked.body, { status: 'blocked', message: AGE_BLOCKED_MESSAGE })
  assert.doesNotMatch(AGE_BLOCKED_MESSAGE, /13|age|old|parent/i)
  assert.match(blocked.cookie, /^af_age=blocked\./)
  assert.equal(blocked.cookie.includes('2020'), false)

  const register = await api.post('/api/auth/register', { username: 'fixture_child', password: 'synthetic-password' }, blocked.cookie)
  assert.equal(register.status, 403)
  assert.deepEqual(await register.json(), { error: AGE_BLOCKED_MESSAGE, code: 'age_blocked' })

  const retry = await api.screen('1990-01-01', blocked.cookie)
  assert.equal(retry.body.status, 'blocked')
  const status = await fetch(`${api.base}/api/auth/age-screen`, { headers: { cookie: blocked.cookie } })
  assert.deepEqual(await status.json(), { status: 'blocked' })

  // Nothing about the refused person reached the database.
  assert.equal(api.queries.length, 0)
})

test('13 and over can create an account; only the screen time is stored, never the date', async (t) => {
  const api = await startApp()
  t.after(api.close)

  const passed = await api.screen('1990-01-01')
  assert.deepEqual(passed.body, { status: 'eligible' })
  assert.match(passed.cookie, /^af_age=eligible\./)

  const res = await api.post('/api/auth/register', { username: 'fixture_reader', password: 'synthetic-password', birthDate: '1990-01-01' }, passed.cookie)
  assert.equal(res.status, 200)
  assert.equal((await res.json()).user.username, 'fixture_reader')
  assert.match(res.headers.get('set-cookie'), /^af_session=/)

  const sql = api.queries.map((q) => q.sql)
  assert.ok(sql.some((s) => /^INSERT INTO users/.test(s)))
  assert.ok(sql.some((s) => /UPDATE users SET age_verified_at = CURRENT_TIMESTAMP WHERE id = \?/.test(s)))
  assert.equal(JSON.stringify(api.queries).includes('1990'), false, 'the birth date never reaches the database')
})

test('sign-up still works before the age_verified_at migration is applied', async (t) => {
  const api = await startApp()
  t.after(api.close)
  const { setConnectionFactoryForTests } = await import('./index.js')
  const warn = t.mock.method(console, 'warn', () => {})
  setConnectionFactoryForTests(async () => ({
    async execute(sql, params = []) {
      if (/^UPDATE users SET age_verified_at/.test(sql)) throw Object.assign(new Error('Unknown column'), { code: 'ER_BAD_FIELD_ERROR' })
      if (/^SELECT id FROM users/.test(sql)) return [[]]
      if (/^INSERT INTO users/.test(sql)) return [{ insertId: 7 }]
      if (/^SELECT id, username/.test(sql)) return [[{ id: params[0], username: 'fixture_early' }]]
      return [{ affectedRows: 1 }]
    },
    async end() {},
  }))
  const passed = await api.screen('2000-01-01')
  const res = await api.post('/api/auth/register', { username: 'fixture_early', password: 'synthetic-password' }, passed.cookie)
  assert.equal(res.status, 200)
  assert.equal(warn.mock.callCount(), 1)
})
