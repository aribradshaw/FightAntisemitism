import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const parentLabels = { conspiracies: 'Conspiracy', talmud: 'Talmud' }

export default function TagWithPopup({ tag, className = '', currentSlug, currentParent }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    const q = encodeURIComponent(tag)
    fetch(`/api/by-tag?tag=${q}`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        const list = Array.isArray(data.items) ? data.items : []
        const filtered = list.filter(
          (it) => !(currentSlug && currentParent && it.slug === currentSlug && it.parent === currentParent)
        )
        setItems(filtered)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [open, tag, currentSlug, currentParent])

  useEffect(() => {
    if (!open) return
    function handleClickOutside(ev) {
      if (wrapperRef.current && !wrapperRef.current.contains(ev.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <span ref={wrapperRef} className="tag-with-popup-wrapper">
      <button
        type="button"
        className={className}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Show posts tagged ${tag}`}
      >
        {tag}
      </button>
      {open && (
        <div className="tag-popover" role="dialog" aria-label={`Posts tagged ${tag}`}>
          {loading ? (
            <p className="tag-popover-loading">Loading…</p>
          ) : items.length === 0 ? (
            <p className="tag-popover-empty">No other posts with this tag.</p>
          ) : (
            <ul className="tag-popover-list">
              {items.map((it) => (
                <li key={`${it.parent}-${it.slug}`}>
                  <Link
                    to={it.parent === 'talmud' ? `/talmud/${it.slug}` : `/conspiracies/${it.slug}`}
                    onClick={() => setOpen(false)}
                  >
                    &ldquo;{it.title}&rdquo;
                    <span className="tag-popover-parent"> ({parentLabels[it.parent] || it.parent})</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </span>
  )
}
