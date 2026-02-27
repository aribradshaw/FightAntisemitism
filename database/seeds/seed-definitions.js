import { DEFINITIONS, DEFINITION_FURTHER_READING } from '../data/definitions.js'

export async function run(conn) {
  await conn.execute('TRUNCATE TABLE definitions')
  for (const d of DEFINITIONS) {
    const furtherReading = DEFINITION_FURTHER_READING[d.slug] || []
    await conn.execute(
      'INSERT INTO definitions (slug, title, summary, body_text, further_reading) VALUES (?, ?, ?, ?, ?)',
      [d.slug, d.title, d.summary, d.body_text || null, furtherReading.length ? JSON.stringify(furtherReading) : null]
    )
  }
  console.log(`  ${DEFINITIONS.length} definitions.`)
}
