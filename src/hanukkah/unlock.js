import { HANUKKAH_NIGHTS } from '../data/hanukkahNights.js'

const PREVIEW_KEY = 'hanukkahPreviewThrough'

export function readPreviewThrough(search = typeof window !== 'undefined' ? window.location.search : '') {
  const params = new URLSearchParams(search)
  const q = params.get('preview')
  if (q === 'all') return 8
  const n = Number(q)
  if (Number.isFinite(n) && n >= 0 && n <= 8) return Math.floor(n)
  try {
    const stored = Number(localStorage.getItem(PREVIEW_KEY))
    if (Number.isFinite(stored) && stored >= 0 && stored <= 8) return Math.floor(stored)
  } catch {
    /* ignore */
  }
  return null
}

export function setPreviewThrough(n) {
  try {
    if (n == null) localStorage.removeItem(PREVIEW_KEY)
    else localStorage.setItem(PREVIEW_KEY, String(n))
  } catch {
    /* ignore */
  }
}

/** Highest night unlocked at `now` (Date), respecting optional preview override. */
export function unlockedThrough(now = new Date(), search) {
  const preview = readPreviewThrough(search)
  if (preview != null) return preview
  let through = 0
  for (const night of HANUKKAH_NIGHTS) {
    if (now.getTime() >= Date.parse(night.unlockAt)) through = night.night
    else break
  }
  return through
}

export function isNightUnlocked(night, now = new Date(), search) {
  return night <= unlockedThrough(now, search)
}

export function nightBySlug(slug) {
  return HANUKKAH_NIGHTS.find((n) => n.slug === slug) || null
}

export function formatUnlockLocal(iso) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Phoenix',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}
