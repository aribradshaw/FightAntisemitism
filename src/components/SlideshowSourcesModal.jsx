export default function SlideshowSourcesModal({ open, onClose, sources }) {
  if (!open) return null
  return (
    <div
      className="slideshow-sources-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="slideshow-sources-title"
    >
      <div className="slideshow-sources-modal" onClick={(e) => e.stopPropagation()}>
        <div className="slideshow-sources-head">
          <h2 id="slideshow-sources-title">Sources</h2>
          <button
            type="button"
            className="slideshow-sources-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <ul className="slideshow-sources-list">
          {sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
              {s.note && <span className="slideshow-sources-note">{s.note}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
