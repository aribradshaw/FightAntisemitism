import { useCallback, useState } from 'react'

const KEY = 'hanukkahProgress.v1'

function load() {
  if (typeof window === 'undefined') return { lit: [], done: {} }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { lit: [], done: {} }
    const parsed = JSON.parse(raw)
    return {
      lit: Array.isArray(parsed.lit) ? parsed.lit.filter((n) => n >= 1 && n <= 8) : [],
      done: parsed.done && typeof parsed.done === 'object' ? parsed.done : {},
    }
  } catch {
    return { lit: [], done: {} }
  }
}

export function useHanukkahProgress() {
  const [state, setState] = useState(load)

  const persist = useCallback((next) => {
    setState(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }, [])

  const lightCandle = useCallback((night) => {
    setState((prev) => {
      if (prev.lit.includes(night)) return prev
      const next = { ...prev, lit: [...prev.lit, night].sort((a, b) => a - b) }
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const markDone = useCallback((slug, payload = true) => {
    setState((prev) => {
      const next = { ...prev, done: { ...prev.done, [slug]: payload } }
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const reset = useCallback(() => persist({ lit: [], done: {} }), [persist])

  return { lit: state.lit, done: state.done, lightCandle, markDone, reset }
}
