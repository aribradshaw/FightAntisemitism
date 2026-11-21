// The contact alert through OneMail with the hashem.faith brand: brand rules,
// content checks and render snapshots. Run:
//   node --test server/contactEmail.test.js
// After an intended template or brand change:
//   UPDATE_SNAPSHOTS=1 node --test server/contactEmail.test.js
/* global process */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { defineBrand } from '@aribradshaw/onemail'
import { contactAlertEmail, DEFAULT_EMAIL_FROM } from './contactEmail.js'
import { contactEmailSamples } from './contactEmailSamples.js'
import { hashemFaithBrand, LOGO_PATH } from './emailBrand.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const dir = path.join(here, '__snapshots__')
const update = process.env.UPDATE_SNAPSHOTS === '1'

test('the hashem.faith brand is valid, with the site logo and a display-name From', () => {
  const brand = defineBrand(hashemFaithBrand)
  assert.equal(brand.logoUrl, `https://antisemitism.hashem.faith${LOGO_PATH}`)
  assert.ok(fs.existsSync(path.join(here, '..', 'public', LOGO_PATH)), 'the logo is in public/')
  assert.equal(DEFAULT_EMAIL_FROM, '"hashem.faith" <no-reply@hashem.faith>')
})

test('the alert keeps its subject and plain text, and typed values stay text', () => {
  const email = contactAlertEmail({ fullName: '<b>Pat</b>', email: 'pat@example.test', category: 'other', question: '<script>x</script>\nline 2' })
  assert.equal(email.subject, '[Site contact] other: <b>Pat</b>')
  assert.equal(email.text, 'Name: <b>Pat</b>\nEmail: pat@example.test\nCategory: other\n\nQuestion:\n<script>x</script>\nline 2')
  assert.match(email.html, /&lt;script&gt;x&lt;\/script&gt;<br>line 2/)
  assert.doesNotMatch(email.html, /<script>|<b>Pat/)
})

test('every sample renders with logo, preheader and footer', () => {
  for (const sample of contactEmailSamples) {
    const { html } = sample.render()
    assert.match(html, /class="om-card/, sample.id)
    assert.ok(html.includes(`https://antisemitism.hashem.faith${LOGO_PATH}`), `${sample.id} logo`)
    assert.ok(html.includes('This site is for educational purposes.'), `${sample.id} footer`)
    assert.match(html, /<div style="display:none;[^"]*">[^<]{10,}/, `${sample.id} preheader`)
    assert.doesNotMatch(html, /undefined|>null</, sample.id)
  }
})

test('render snapshots (HTML and text)', () => {
  const expected = []
  for (const sample of contactEmailSamples) {
    const email = sample.render()
    for (const [ext, body] of [['html', email.html], ['txt', `Subject: ${email.subject}\n\n${email.text}\n`]]) {
      const name = `${sample.id}.${ext}`
      const file = path.join(dir, name)
      expected.push(name)
      if (update) {
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(file, body)
      }
      assert.ok(fs.existsSync(file), `missing snapshot ${name}; run with UPDATE_SNAPSHOTS=1`)
      assert.equal(body, fs.readFileSync(file, 'utf8'), `${name} changed; if intended, run with UPDATE_SNAPSHOTS=1`)
    }
  }
  assert.deepEqual(fs.readdirSync(dir).filter((name) => !expected.includes(name)), [], 'no stale snapshots')
})
