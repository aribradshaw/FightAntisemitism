import {
  MISCONCEPTIONS,
  MISCONCEPTION_TOPICS,
  MISCONCEPTION_FURTHER_READING,
  ISRAEL_MISCONCEPTION_ENTRIES,
  JEWISH_RACE_MISCONCEPTION_ENTRIES,
} from '../data/misconceptions.js'

export async function run(conn) {
  await conn.execute('SET FOREIGN_KEY_CHECKS = 0')
  await conn.execute('TRUNCATE TABLE misconception_entry_sources')
  await conn.execute('TRUNCATE TABLE misconception_entries')
  await conn.execute('TRUNCATE TABLE misconception_topics')
  await conn.execute('TRUNCATE TABLE misconceptions')
  await conn.execute('SET FOREIGN_KEY_CHECKS = 1')

  const topicBySlug = Object.fromEntries(MISCONCEPTION_TOPICS.map((t) => [t.topic_slug, t]))
  for (const m of MISCONCEPTIONS) {
    const [r] = await conn.execute(
      'INSERT INTO misconceptions (slug, title, summary) VALUES (?, ?, ?)',
      [m.slug, m.title, m.summary]
    )
    const misId = r.insertId
    const t = topicBySlug[m.slug]
    if (t) {
      const furtherReading = MISCONCEPTION_FURTHER_READING[t.topic_slug] || []
      await conn.execute(
        'INSERT INTO misconception_topics (misconception_id, topic_slug, title, body_text, further_reading, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        [misId, t.topic_slug, t.title, t.body_text, furtherReading.length ? JSON.stringify(furtherReading) : null, t.sort_order]
      )
    }
  }
  console.log(`  ${MISCONCEPTIONS.length} misconceptions with topics.`)

  const allMisconceptionEntries = [
    ...ISRAEL_MISCONCEPTION_ENTRIES.map((e) => ({ ...e, topic_slug: 'israel' })),
    ...JEWISH_RACE_MISCONCEPTION_ENTRIES.map((e) => ({ ...e, topic_slug: 'jewish-race' })),
  ]
  for (const e of allMisconceptionEntries) {
    const [r] = await conn.execute(
      'INSERT INTO misconception_entries (topic_slug, slug, title, summary, body_text, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [e.topic_slug, e.slug, e.title, e.summary || null, e.body_text || null, e.sort_order ?? 0]
    )
    const entryId = r.insertId
    let order = 0
    for (const s of e.sources || []) {
      await conn.execute(
        'INSERT INTO misconception_entry_sources (misconception_entry_id, label, url, sort_order) VALUES (?, ?, ?, ?)',
        [entryId, s.label, s.url || null, order++]
      )
    }
  }
  console.log(`  ${allMisconceptionEntries.length} misconception entries with sources.`)
}
