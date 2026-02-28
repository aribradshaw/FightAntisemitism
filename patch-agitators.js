const fs = require('fs')
const path = 'src/data/agitators.js'
let s = fs.readFileSync(path, 'utf8')
const newLine = "      { date: '2025', text: '36 Falsehoods in One Huckabee Interview: Tucker Carlson Fact-Checked — catalog of 36 distinct falsehoods from the Huckabee interview.', url: '/agitators/tucker-carlson/36-falsehoods' },"
// Find the 2024 line (Continued rhetoric) and insert after it
const marker = "url: '#' },\n    ],\n  },\n  {\n    slug: 'thomas-massie'"
const idx = s.indexOf(marker)
if (idx !== -1) {
  s = s.slice(0, idx) + "url: '#' },\n" + newLine + "\n    ],\n  },\n  {\n    slug: 'thomas-massie'" + s.slice(idx + marker.length)
  fs.writeFileSync(path, s)
  console.log('Inserted new source line.')
} else {
  // Try without \n exact match
  const idx2 = s.indexOf("slug: 'thomas-massie'")
  const before = s.lastIndexOf("url: '#' },", idx2)
  if (before !== -1) {
    const end = before + "url: '#' },".length
    s = s.slice(0, end) + '\n' + newLine + s.slice(end)
    fs.writeFileSync(path, s)
    console.log('Inserted new source line (alt).')
  } else {
    console.log('Could not find insertion point.')
  }
}
