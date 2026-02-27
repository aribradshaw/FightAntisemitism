/**
 * One-time script to extract seed data into database/data/*.js
 * Run: node database/extract-data.js
 */
import fs from 'fs'

const seed = fs.readFileSync(new URL('./seed.js', import.meta.url), 'utf8')

// DEFINITION_FURTHER_READING (ends before MISCONCEPTION_FURTHER_READING) + DEFINITIONS
const startDefRead = seed.indexOf('const DEFINITION_FURTHER_READING = ')
const endDefRead = seed.indexOf('}\nconst MISCONCEPTION_FURTHER_READING', startDefRead) + 1
const defReadBlock = seed.slice(startDefRead, endDefRead).replace('const DEFINITION_FURTHER_READING = ', 'export const DEFINITION_FURTHER_READING = ')

const startDef = seed.indexOf('const DEFINITIONS = [')
const endDef = seed.indexOf(']\n\n// Agitators') + 1
const defBlock = seed.slice(startDef, endDef).replace('const DEFINITIONS = ', 'export const DEFINITIONS = ')

const definitionsContent = `import { HASHEM } from './shared.js'

${defReadBlock}

// Definitions (from app)
${defBlock}
`
fs.writeFileSync(new URL('./data/definitions.js', import.meta.url), definitionsContent)
console.log('Wrote data/definitions.js')

// AGITATORS
const startAg = seed.indexOf('const AGITATORS = [')
const endAg = seed.indexOf(']\n\n// Conspiracy theories')
const agBlock = seed.slice(startAg, endAg + 1).replace('const AGITATORS = ', 'export const AGITATORS = ')
fs.writeFileSync(new URL('./data/agitators.js', import.meta.url), agBlock)
console.log('Wrote data/agitators.js')

// CONSPIRACIES (uses HASHEM)
const startCon = seed.indexOf('const CONSPIRACIES = [')
const endCon = seed.indexOf(']\n\n// Talmud entries')
const conBlock = seed.slice(startCon, endCon + 1).replace('const CONSPIRACIES = ', 'export const CONSPIRACIES = ')
const conContent = `import { HASHEM } from './shared.js'

${conBlock}
`
fs.writeFileSync(new URL('./data/conspiracies.js', import.meta.url), conContent)
console.log('Wrote data/conspiracies.js')

// TALMUD_ENTRIES (uses TALMUD_BASE)
const startTalmud = seed.indexOf('const TALMUD_BASE = ')
const endTalmud = seed.indexOf(']\n\n// Misconceptions (hub)')
const talmudBlock = seed.slice(startTalmud, endTalmud + 1)
  .replace('const TALMUD_BASE = ', 'export const TALMUD_BASE = ')
  .replace('const TALMUD_ENTRIES = ', 'export const TALMUD_ENTRIES = ')
fs.writeFileSync(new URL('./data/talmud.js', import.meta.url), talmudBlock)
console.log('Wrote data/talmud.js')

// MISCONCEPTION_FURTHER_READING + MISCONCEPTIONS + MISCONCEPTION_TOPICS + ISRAEL_* + JEWISH_RACE_*
const startMisFR = seed.indexOf('const MISCONCEPTION_FURTHER_READING = ')
const endMisFR = seed.indexOf('}\n\n// Definitions (from app)') + 1
const misFRBlock = seed.slice(startMisFR, endMisFR + 1).replace('const MISCONCEPTION_FURTHER_READING = ', 'export const MISCONCEPTION_FURTHER_READING = ')

const startMis = seed.indexOf('const MISCONCEPTIONS = [')
const endMis = seed.indexOf(']\n\nasync function run()')
const misBlock = seed.slice(startMis, endMis + 1)
  .replace('const MISCONCEPTIONS = ', 'export const MISCONCEPTIONS = ')
  .replace('const MISCONCEPTION_TOPICS = ', 'export const MISCONCEPTION_TOPICS = ')
  .replace('const ISRAEL_MISCONCEPTION_ENTRIES = ', 'export const ISRAEL_MISCONCEPTION_ENTRIES = ')
  .replace('const JEWISH_RACE_MISCONCEPTION_ENTRIES = ', 'export const JEWISH_RACE_MISCONCEPTION_ENTRIES = ')

const misContent = `import { HASHEM } from './shared.js'

${misFRBlock}

${misBlock}
`
fs.writeFileSync(new URL('./data/misconceptions.js', import.meta.url), misContent)
console.log('Wrote data/misconceptions.js')

console.log('Done.')
