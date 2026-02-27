import { TALMUD_ENTRIES } from '../data/talmud.js'

export async function run(conn) {
  await conn.execute('SET FOREIGN_KEY_CHECKS = 0')
  await conn.execute('TRUNCATE TABLE talmud_sources')
  await conn.execute('TRUNCATE TABLE talmud_entries')
  await conn.execute('SET FOREIGN_KEY_CHECKS = 1')
  for (const t of TALMUD_ENTRIES) {
    const [r] = await conn.execute(
      'INSERT INTO talmud_entries (slug, title, reference, summary, body_text, category, tags, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [t.slug, t.title, t.reference || null, t.summary || null, t.body_text || null, t.category || null, t.tags ? JSON.stringify(t.tags) : null, t.sort_order ?? 0]
    )
    const entryId = r.insertId
    let order = 0
    for (const s of t.sources || []) {
      await conn.execute(
        'INSERT INTO talmud_sources (talmud_entry_id, label, url, sort_order) VALUES (?, ?, ?, ?)',
        [entryId, s.label, s.url || null, order++]
      )
    }
  }
  console.log(`  ${TALMUD_ENTRIES.length} talmud entries with sources.`)
}
