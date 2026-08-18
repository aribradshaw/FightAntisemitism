import { useEffect, useRef } from 'react'

export default function SlideshowSourcesModal({ open, onClose, sources }) {
  const modalRef = useRef(null)
  const closeRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    previousFocusRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 0)

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !modalRef.current) return
      const focusable = Array.from(modalRef.current.querySelectorAll('button, a[href]'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="slideshow-sources-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      role="presentation"
    >
      <div
        className="slideshow-sources-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="slideshow-sources-title"
        aria-describedby="slideshow-sources-description"
      >
        <div className="slideshow-sources-head">
          <div>
            <p className="slideshow-sources-kicker">Research & attribution</p>
            <h2 id="slideshow-sources-title">Sources and image credits</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="slideshow-sources-close"
            onClick={onClose}
            aria-label="Close sources"
          >
            ×
          </button>
        </div>
        <p id="slideshow-sources-description" className="slideshow-sources-description">
          The presentation separates sacred narrative, later tradition, and historical evidence. These are the references used for the current chapters.
        </p>
        <ol className="slideshow-sources-list">
          {sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>
              {source.note && <span className="slideshow-sources-note">{source.note}</span>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
