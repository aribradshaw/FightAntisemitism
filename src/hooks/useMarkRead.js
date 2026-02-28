import { useEffect, useRef } from 'react'

const markedKeys = new Set()

export default function useMarkRead({ category, itemSlug, enabled, delayMs = 10000 }) {
  const timerRef = useRef(null)
  const key = `${category}:${itemSlug || ''}`

  useEffect(() => {
    if (!enabled || !category || !itemSlug) return
    if (markedKeys.has(key)) return

    timerRef.current = setTimeout(() => {
      fetch('/api/progress/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ category, item_slug: itemSlug }),
      })
        .then((res) => {
          if (res.ok) markedKeys.add(key)
        })
        .catch(() => {})
    }, delayMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [enabled, category, itemSlug, delayMs, key])
}
