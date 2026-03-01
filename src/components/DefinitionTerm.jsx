import { useState, useId, useEffect } from 'react'
import { HASHEM_FAITH_LABEL } from '../data/hashemFaithSources'

/**
 * Renders a term with dotted underline and heavier weight.
 * Fetches the short definition from the API; tooltip shows summary + "Read full definition".
 * Clicking the button opens a popup with the long definition and sources.
 */
export default function DefinitionTerm({ slug, children }) {
  const [hover, setHover] = useState(false)
  const [definition, setDefinition] = useState(null)
  const [loading, setLoading] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const tooltipId = useId()

  // Fetch definition from API when tooltip is shown (hover)
  useEffect(() => {
    if (!slug || !hover) return
    if (definition && definition.slug === slug) return
    setLoading(true)
    fetch(`/api/definitions/${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setDefinition(data || null))
      .catch(() => setDefinition(null))
      .finally(() => setLoading(false))
  }, [slug, hover, definition?.slug])

  const summary = definition?.summary ?? ''
  const hasLong = definition && (definition.body_text?.trim() || definition.further_reading?.length > 0)
  const furtherReading = definition?.further_reading?.length > 0 ? definition.further_reading : []

  const openPopup = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setPopupOpen(true)
  }

  const closePopup = (e) => {
    if (e) e.stopPropagation()
    setPopupOpen(false)
  }

  useEffect(() => {
    if (!popupOpen) return
    const onKey = (e) => { if (e.key === 'Escape') closePopup(e) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [popupOpen])

  return (
    <>
      <span
        className="definition-term"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => e.stopPropagation()}
        aria-describedby={hover && (summary || loading) ? tooltipId : undefined}
      >
        {children}
        {hover && (
          <span
            id={tooltipId}
            className="definition-term-tooltip"
            role="tooltip"
            onClick={(e) => e.stopPropagation()}
          >
            {loading ? (
              <span className="definition-term-tooltip-loading">Loading…</span>
            ) : (
              <>
                {summary && <span className="definition-term-tooltip-summary">{summary}</span>}
                {hasLong && (
                  <button
                    type="button"
                    className="definition-term-tooltip-btn"
                    onClick={openPopup}
                  >
                    Read full definition
                  </button>
                )}
              </>
            )}
          </span>
        )}
      </span>

      {popupOpen && definition && (
        <div
          className="definition-term-popup-overlay"
          onClick={closePopup}
          role="dialog"
          aria-modal="true"
          aria-labelledby="definition-term-popup-title"
        >
          <div
            className="definition-term-popup-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="definition-term-popup-head">
              <h2 id="definition-term-popup-title" className="definition-term-popup-title">
                {definition.title}
              </h2>
              <button
                type="button"
                className="definition-term-popup-close"
                onClick={closePopup}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="definition-term-popup-body">
              {definition.body_text?.trim() ? (
                <div className="definition-body">
                  {definition.body_text.trim().startsWith('<') ? (
                    <div dangerouslySetInnerHTML={{ __html: definition.body_text }} />
                  ) : (
                    <p>{definition.body_text}</p>
                  )}
                </div>
              ) : (
                <p className="definition-short">{definition.summary}</p>
              )}
              {furtherReading.length > 0 && (
                <section className="definition-sources" aria-label="Sources and further reading">
                  <h2>Sources &amp; further reading</h2>
                  {furtherReading.every((s) => s.url && s.url.includes('hashem.faith')) && (
                    <p className="definition-sources-attribution">
                      From <a href="https://hashem.faith/" target="_blank" rel="noopener noreferrer">{HASHEM_FAITH_LABEL}</a>:
                    </p>
                  )}
                  <ul>
                    {furtherReading.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
