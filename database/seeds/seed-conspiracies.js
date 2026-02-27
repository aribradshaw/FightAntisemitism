import { CONSPIRACIES } from '../data/conspiracies.js'

export async function run(conn) {
  await conn.execute('SET FOREIGN_KEY_CHECKS = 0')
  await conn.execute('TRUNCATE TABLE conspiracy_sources')
  await conn.execute('TRUNCATE TABLE conspiracies')
  await conn.execute('SET FOREIGN_KEY_CHECKS = 1')
  for (const c of CONSPIRACIES) {
    const [r] = await conn.execute(
      'INSERT INTO conspiracies (slug, title, summary, body_text, category, tags, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [c.slug, c.title, c.summary || null, c.body_text || null, c.category || null, c.tags ? JSON.stringify(c.tags) : null, c.sort_order ?? 0]
    )
    const conspiracyId = r.insertId
    let order = 0
    for (const s of c.sources || []) {
      await conn.execute(
        'INSERT INTO conspiracy_sources (conspiracy_id, label, url, sort_order) VALUES (?, ?, ?, ?)',
        [conspiracyId, s.label, s.url || null, order++]
      )
    }
  }
  console.log(`  ${CONSPIRACIES.length} conspiracies with sources.`)
}
