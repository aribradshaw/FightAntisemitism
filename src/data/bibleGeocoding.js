// OpenBible.info Bible Geocoding – https://www.openbible.info/geo/
// Files in public/geo/. License: CC BY (credit OpenBible.info).
// startYear/endYear = approximate period of events or composition (BCE = negative).

const GEO = '/geo'
const MAPS = '/maps'

// Israel borders (incl. Gaza & Judea and Samaria) – show for modern period (1948+)
export const ISRAEL_LAYER = {
  id: 'israel',
  name: 'Israel',
  url: `${MAPS}/israel.kml`,
  startYear: 1948,
  endYear: new Date().getFullYear() + 1,
}

export const BIBLE_GEOCOMPLETE = [
  { id: 'all', name: 'Complete Bible', url: `${GEO}/all.kmz`, type: 'kmz' },
  { id: 'all-books', name: 'Complete Bible (by book)', url: `${GEO}/all-books.kmz`, type: 'kmz' },
  { id: 'all-chapters', name: 'Complete Bible (by chapter)', url: `${GEO}/all-chapters.kmz`, type: 'kmz' },
  { id: 'all-most-likely', name: 'Most likely location per place', url: `${GEO}/all-most-likely.kmz`, type: 'kmz' },
]

// startYear, endYear: when the book's events or composition are most likely set (BCE = negative)
export const BIBLE_GEO_OT = [
  { id: 'gen', name: 'Genesis', url: `${GEO}/gen.kml`, startYear: -2000, endYear: -1680 },
  { id: 'exod', name: 'Exodus', url: `${GEO}/exod.kml`, startYear: -1446, endYear: -1440 },
  { id: 'lev', name: 'Leviticus', url: `${GEO}/lev.kml`, startYear: -1440, endYear: -1406 },
  { id: 'num', name: 'Numbers', url: `${GEO}/num.kml`, startYear: -1440, endYear: -1406 },
  { id: 'deut', name: 'Deuteronomy', url: `${GEO}/deut.kml`, startYear: -1406, endYear: -1400 },
  { id: 'josh', name: 'Joshua', url: `${GEO}/josh.kml`, startYear: -1400, endYear: -1380 },
  { id: 'judg', name: 'Judges', url: `${GEO}/judg.kml`, startYear: -1380, endYear: -1050 },
  { id: 'ruth', name: 'Ruth', url: `${GEO}/ruth.kml`, startYear: -1100, endYear: -1050 },
  { id: '1sam', name: '1 Samuel', url: `${GEO}/1sam.kml`, startYear: -1050, endYear: -1010 },
  { id: '2sam', name: '2 Samuel', url: `${GEO}/2sam.kml`, startYear: -1010, endYear: -970 },
  { id: '1kgs', name: '1 Kings', url: `${GEO}/1kgs.kml`, startYear: -970, endYear: -850 },
  { id: '2kgs', name: '2 Kings', url: `${GEO}/2kgs.kml`, startYear: -850, endYear: -560 },
  { id: '1chr', name: '1 Chronicles', url: `${GEO}/1chr.kml`, startYear: -450, endYear: -430 },
  { id: '2chr', name: '2 Chronicles', url: `${GEO}/2chr.kml`, startYear: -450, endYear: -430 },
  { id: 'ezra', name: 'Ezra', url: `${GEO}/ezra.kml`, startYear: -458, endYear: -430 },
  { id: 'neh', name: 'Nehemiah', url: `${GEO}/neh.kml`, startYear: -445, endYear: -420 },
  { id: 'esth', name: 'Esther', url: `${GEO}/esth.kml`, startYear: -480, endYear: -450 },
  { id: 'job', name: 'Job', url: `${GEO}/job.kml`, startYear: -2000, endYear: -1500 },
  { id: 'ps', name: 'Psalms', url: `${GEO}/ps.kml`, startYear: -1000, endYear: -450 },
  { id: 'prov', name: 'Proverbs', url: `${GEO}/prov.kml`, startYear: -950, endYear: -700 },
  { id: 'eccl', name: 'Ecclesiastes', url: `${GEO}/eccl.kml`, startYear: -930, endYear: -200 },
  { id: 'song', name: 'Song of Solomon', url: `${GEO}/song.kml`, startYear: -970, endYear: -930 },
  { id: 'isa', name: 'Isaiah', url: `${GEO}/isa.kml`, startYear: -740, endYear: -680 },
  { id: 'jer', name: 'Jeremiah', url: `${GEO}/jer.kml`, startYear: -627, endYear: -580 },
  { id: 'lam', name: 'Lamentations', url: `${GEO}/lam.kml`, startYear: -586, endYear: -580 },
  { id: 'ezek', name: 'Ezekiel', url: `${GEO}/ezek.kml`, startYear: -593, endYear: -570 },
  { id: 'dan', name: 'Daniel', url: `${GEO}/dan.kml`, startYear: -605, endYear: -530 },
  { id: 'hos', name: 'Hosea', url: `${GEO}/hos.kml`, startYear: -755, endYear: -715 },
  { id: 'joel', name: 'Joel', url: `${GEO}/joel.kml`, startYear: -835, endYear: -800 },
  { id: 'amos', name: 'Amos', url: `${GEO}/amos.kml`, startYear: -760, endYear: -750 },
  { id: 'obad', name: 'Obadiah', url: `${GEO}/obad.kml`, startYear: -585, endYear: -550 },
  { id: 'jonah', name: 'Jonah', url: `${GEO}/jonah.kml`, startYear: -780, endYear: -750 },
  { id: 'mic', name: 'Micah', url: `${GEO}/mic.kml`, startYear: -735, endYear: -700 },
  { id: 'nah', name: 'Nahum', url: `${GEO}/nah.kml`, startYear: -660, endYear: -612 },
  { id: 'hab', name: 'Habakkuk', url: `${GEO}/hab.kml`, startYear: -609, endYear: -598 },
  { id: 'zeph', name: 'Zephaniah', url: `${GEO}/zeph.kml`, startYear: -640, endYear: -620 },
  { id: 'hag', name: 'Haggai', url: `${GEO}/hag.kml`, startYear: -520, endYear: -520 },
  { id: 'zech', name: 'Zechariah', url: `${GEO}/zech.kml`, startYear: -520, endYear: -480 },
  { id: 'mal', name: 'Malachi', url: `${GEO}/mal.kml`, startYear: -430, endYear: -400 },
]

export const BIBLE_GEO_NT = [
  { id: 'matt', name: 'Matthew', url: `${GEO}/matt.kml`, startYear: 30, endYear: 70 },
  { id: 'mark', name: 'Mark', url: `${GEO}/mark.kml`, startYear: 30, endYear: 70 },
  { id: 'luke', name: 'Luke', url: `${GEO}/luke.kml`, startYear: 30, endYear: 80 },
  { id: 'john', name: 'John', url: `${GEO}/john.kml`, startYear: 30, endYear: 100 },
  { id: 'acts', name: 'Acts', url: `${GEO}/acts.kml`, startYear: 33, endYear: 65 },
  { id: 'rom', name: 'Romans', url: `${GEO}/rom.kml`, startYear: 57, endYear: 57 },
  { id: '1cor', name: '1 Corinthians', url: `${GEO}/1cor.kml`, startYear: 55, endYear: 55 },
  { id: '2cor', name: '2 Corinthians', url: `${GEO}/2cor.kml`, startYear: 56, endYear: 56 },
  { id: 'gal', name: 'Galatians', url: `${GEO}/gal.kml`, startYear: 48, endYear: 55 },
  { id: 'eph', name: 'Ephesians', url: `${GEO}/eph.kml`, startYear: 60, endYear: 62 },
  { id: 'phil', name: 'Philippians', url: `${GEO}/phil.kml`, startYear: 60, endYear: 62 },
  { id: 'col', name: 'Colossians', url: `${GEO}/col.kml`, startYear: 60, endYear: 62 },
  { id: '1thess', name: '1 Thessalonians', url: `${GEO}/1thess.kml`, startYear: 51, endYear: 51 },
  { id: '2thess', name: '2 Thessalonians', url: `${GEO}/2thess.kml`, startYear: 52, endYear: 52 },
  { id: '1tim', name: '1 Timothy', url: `${GEO}/1tim.kml`, startYear: 62, endYear: 65 },
  { id: '2tim', name: '2 Timothy', url: `${GEO}/2tim.kml`, startYear: 64, endYear: 67 },
  { id: 'titus', name: 'Titus', url: `${GEO}/titus.kml`, startYear: 62, endYear: 65 },
  { id: 'heb', name: 'Hebrews', url: `${GEO}/heb.kml`, startYear: 65, endYear: 70 },
  { id: '1pet', name: '1 Peter', url: `${GEO}/1pet.kml`, startYear: 62, endYear: 65 },
  { id: '2pet', name: '2 Peter', url: `${GEO}/2pet.kml`, startYear: 65, endYear: 68 },
  { id: 'jude', name: 'Jude', url: `${GEO}/jude.kml`, startYear: 65, endYear: 80 },
  { id: 'rev', name: 'Revelation', url: `${GEO}/rev.kml`, startYear: 90, endYear: 100 },
]

const ALL_BOOKS = [...BIBLE_GEO_OT, ...BIBLE_GEO_NT]

export function getBookForYear(year) {
  const y = Number(year)
  return ALL_BOOKS.find((b) => b.startYear != null && b.endYear != null && y >= b.startYear && y <= b.endYear) || null
}

/** Returns the map layer to show for a given year: Bible book for ancient/classical years, Israel (borders) for 1948+. */
export function getMapLayerForYear(year) {
  const y = Number(year)
  const book = getBookForYear(y)
  if (book) return book
  if (y >= ISRAEL_LAYER.startYear && y <= ISRAEL_LAYER.endYear) return ISRAEL_LAYER
  return null
}
