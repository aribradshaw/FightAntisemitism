/**
 * Download all OpenBible.info Bible Geocoding KML/KMZ files to public/geo/
 * Run: node scripts/download-bible-geo.js
 * Data: CC BY OpenBible.info https://www.openbible.info/geo/
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE_URL = 'https://a.openbible.info/geo/kmls'
const OUT_DIR = path.join(__dirname, '..', 'public', 'geo')

const COMPLETE = ['all.kmz', 'all-books.kmz', 'all-chapters.kmz', 'all-most-likely.kmz', 'water.kml']

const OT_FILES = [
  'gen', 'exod', 'lev', 'num', 'deut', 'josh', 'judg', 'ruth',
  '1sam', '2sam', '1kgs', '2kgs', '1chr', '2chr', 'ezra', 'neh', 'esth',
  'job', 'ps', 'prov', 'eccl', 'song', 'isa', 'jer', 'lam', 'ezek', 'dan',
  'hos', 'joel', 'amos', 'obad', 'jonah', 'mic', 'nah', 'hab', 'zeph', 'hag', 'zech', 'mal',
]

const NT_FILES = [
  'matt', 'mark', 'luke', 'john', 'acts', 'rom', '1cor', '2cor', 'gal', 'eph', 'phil', 'col',
  '1thess', '2thess', '1tim', '2tim', 'titus', 'heb', '1pet', '2pet', 'jude', 'rev',
]

async function download(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'AboutJews/1.0' } })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.arrayBuffer()
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true })
  }

  const all = [
    ...COMPLETE.map((file) => ({ url: `${BASE_URL}/${file}`, file })),
    ...OT_FILES.map((id) => ({ url: `${BASE_URL}/${id}.kml`, file: `${id}.kml` })),
    ...NT_FILES.map((id) => ({ url: `${BASE_URL}/${id}.kml`, file: `${id}.kml` })),
  ]

  console.log(`Downloading ${all.length} files to ${OUT_DIR}...`)
  let ok = 0
  let fail = 0
  for (const { url, file } of all) {
    try {
      const buf = await download(url)
      fs.writeFileSync(path.join(OUT_DIR, file), Buffer.from(buf))
      console.log(`  ✓ ${file}`)
      ok++
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`)
      fail++
    }
  }
  console.log(`Done. ${ok} ok, ${fail} failed.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
