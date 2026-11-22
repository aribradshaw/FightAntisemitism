/**
 * Check every hashem.faith link the sub-site uses (further reading, sources,
 * links inside entry text). Exits non-zero if any link does not answer 200.
 * Run: npm run check:links
 */

import process from 'process'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIRS = ['database/data', 'src', 'server']
const HASHEM = 'https://hashem.faith'

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return files(path)
    return /\.(js|jsx|mjs)$/.test(name) ? [path] : []
  })
}

function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
}

const urls = new Set()
for (const file of DIRS.flatMap((d) => files(join(root, d)))) {
  const text = stripComments(readFileSync(file, 'utf8'))
  for (const m of text.matchAll(/(?:https:\/\/hashem\.faith|\$\{HASHEM\}|\$\{BASE\})(\/[A-Za-z0-9/_-]*)?/g)) {
    urls.add(HASHEM + (m[1] || '/'))
  }
  for (const m of text.matchAll(/path:\s*'(\/[A-Za-z0-9/_-]*)'/g)) {
    if (file.endsWith('hashemFaithSources.js')) urls.add(HASHEM + m[1])
  }
}

let failed = 0
for (const url of [...urls].sort()) {
  let status
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'FightAntisemitism link check' } })
    status = res.status
  } catch (err) {
    status = `error (${err.cause?.code || err.message})`
  }
  const ok = status === 200
  if (!ok) failed++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${status} ${url}`)
}

console.log(`\n${urls.size} hashem.faith links checked, ${failed} failed.`)
process.exit(failed ? 1 : 0)
