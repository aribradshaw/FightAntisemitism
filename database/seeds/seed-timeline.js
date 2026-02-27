import { TIMELINE_EVENTS } from '../data/timeline.js'

export async function run(conn) {
  await conn.execute('TRUNCATE TABLE timeline_events')
  for (const e of TIMELINE_EVENTS) {
    await conn.execute(
      'INSERT INTO timeline_events (year, label, region, description, source_label, source_url) VALUES (?, ?, ?, ?, ?, ?)',
      [e.year, e.label, e.region || null, e.description || null, e.source_label || null, e.source_url || null]
    )
  }
  console.log(`  ${TIMELINE_EVENTS.length} timeline events.`)
}
