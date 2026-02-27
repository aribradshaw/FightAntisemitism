/**
 * Seed database from data in database/data/*.js
 * Run all: node database/seed.js   (or npm run db:seed)
 * Run one: node database/seed.js <table>
 * Tables: timeline | definitions | agitators | conspiracies | talmud | misconceptions
 */

import { getConnection } from './lib/db.js'

const SEED_NAMES = ['timeline', 'definitions', 'agitators', 'conspiracies', 'talmud', 'misconceptions']

async function run() {
  const which = process.argv[2] ? process.argv[2].toLowerCase() : null
  if (which && !SEED_NAMES.includes(which)) {
    console.error('Usage: node database/seed.js [table]')
    console.error('Tables:', SEED_NAMES.join(', '))
    process.exit(1)
  }

  const conn = await getConnection()
  console.log('Connected to MySQL.')

  const toRun = which ? [which] : SEED_NAMES

  for (const name of toRun) {
    console.log(toRun.length > 1 ? `\nInserting ${name}...` : `Inserting ${name}...`)
    const mod = await import(`./seeds/seed-${name}.js`)
    await mod.run(conn)
  }

  await conn.end()
  console.log(toRun.length > 1 ? '\nSeed done.' : 'Seed done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
