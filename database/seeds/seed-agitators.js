import { AGITATORS } from '../data/agitators.js'

export async function run(conn) {
  await conn.execute('SET FOREIGN_KEY_CHECKS = 0')
  await conn.execute('TRUNCATE TABLE agitator_sources')
  await conn.execute('TRUNCATE TABLE agitators')
  await conn.execute('SET FOREIGN_KEY_CHECKS = 1')
  for (let i = 0; i < AGITATORS.length; i++) {
    const a = AGITATORS[i]
    const priority = a.priority != null ? a.priority : i + 1
    const [r] = await conn.execute(
      'INSERT INTO agitators (slug, name, subtitle, description, image_url, priority) VALUES (?, ?, ?, ?, ?, ?)',
      [a.slug, a.name, a.subtitle, a.description, a.image_url || null, priority]
    )
    const agitatorId = r.insertId
    let order = 0
    for (const s of a.sources) {
      await conn.execute(
        'INSERT INTO agitator_sources (agitator_id, date_label, text, url, sort_order) VALUES (?, ?, ?, ?, ?)',
        [agitatorId, s.date_label, s.text, s.url || null, order++]
      )
    }
  }
  console.log(`  ${AGITATORS.length} agitators with sources.`)
}
