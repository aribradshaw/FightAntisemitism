import { useState, useMemo, useEffect } from 'react'
import { TbBook2, TbExternalLink } from 'react-icons/tb'
import TimelineMap from '../components/TimelineMap'
import { getMapLayerForYear } from '../data/bibleGeocoding'

const MIN_YEAR = -1500
const MAX_YEAR = new Date().getFullYear()

export default function Timeline() {
  const [year, setYear] = useState(1948)
  const [yearInput, setYearInput] = useState('1948')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch('/api/timeline-events')
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText || 'Failed to load')
        return res.json()
      })
      .then((rows) => {
        if (!cancelled) {
          setEvents(rows || [])
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load timeline.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const clampedYear = Math.max(MIN_YEAR, Math.min(MAX_YEAR, year))
  const filtered = useMemo(() => {
    const get = (obj, key) => {
      const k = Object.keys(obj || {}).find((x) => x.toLowerCase() === key.toLowerCase())
      return k ? obj[k] : undefined
    }
    const list = events.map((e) => {
      const rawUrl = e.source_url ?? e.source_URL ?? get(e, 'source_url')
      const url = typeof rawUrl === 'string' && rawUrl.trim() ? rawUrl.trim() : null
      const rawLabel = e.source_label ?? e.source_Label ?? get(e, 'source_label')
      const label = rawLabel != null && rawLabel !== '' ? (typeof rawLabel === 'string' ? rawLabel.trim() : String(rawLabel)) : null
      return {
        id: e.id,
        year: e.year,
        label: e.label,
        region: e.region,
        desc: e.description ?? '',
        source_label: label,
        source_url: url,
      }
    })
    return list
      .filter((e) => Math.abs(e.year - clampedYear) <= 200)
      .sort((a, b) => a.year - b.year)
  }, [events, clampedYear])

  const handleSlider = (e) => {
    const v = Number(e.target.value)
    setYear(v)
    setYearInput(String(v))
  }

  const handleYearSubmit = (e) => {
    e.preventDefault()
    const n = parseInt(yearInput, 10)
    if (!Number.isNaN(n)) {
      const v = Math.max(MIN_YEAR, Math.min(MAX_YEAR, n))
      setYear(v)
      setYearInput(String(v))
    }
  }

  const mapLayer = getMapLayerForYear(clampedYear)
  const mapBookLabel = mapLayer && mapLayer.id !== 'israel' ? mapLayer.name : '—'

  return (
    <div className="timeline-page">
      <h1 className="timeline-page-title">Timeline</h1>
      <p className="timeline-page-intro">Drag the timeline or enter a year to explore Jewish and Israeli history.</p>

      <div className="timeline-controls">
        <div className="timeline-slider-row">
          <span className="timeline-year-label">{MIN_YEAR}</span>
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={clampedYear}
            onChange={handleSlider}
            className="timeline-slider"
            aria-label="Timeline year"
          />
          <span className="timeline-year-label">{MAX_YEAR}</span>
          <form onSubmit={handleYearSubmit} className="timeline-year-form">
            <label htmlFor="year-input" className="timeline-year-form-label">Year</label>
            <input
              id="year-input"
              type="number"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={yearInput}
              onChange={(e) => setYearInput(e.target.value)}
              aria-label="Year"
            />
            <button type="submit">Go</button>
          </form>
        </div>
        <div className="timeline-year-and-map">
          <span className="timeline-current-year">Showing events near: <strong>{clampedYear}</strong></span>
          {mapBookLabel !== '—' && (
            <span className="timeline-map-layer">Map by Bible book: <strong>{mapBookLabel}</strong></span>
          )}
        </div>
      </div>

      <div className="timeline-layout">
        <aside className="timeline-map">
          <TimelineMap currentYear={clampedYear} />
        </aside>
        <section className="timeline-content">
          <h2>Events near {clampedYear}</h2>
          {error && <p className="timeline-map-error">{error}</p>}
          {loading && (
            <div className="timeline-loading" role="status" aria-live="polite" aria-label="Loading timeline">
              <div className="timeline-loading-spinner" aria-hidden />
              <p className="timeline-loading-text">Loading timeline…</p>
              <ul className="timeline-loading-list" aria-hidden>
                <li className="timeline-loading-item">
                  <span className="timeline-loading-year" />
                  <div className="timeline-loading-lines">
                    <span className="timeline-loading-line timeline-loading-line--lg" />
                    <span className="timeline-loading-line timeline-loading-line--md" />
                  </div>
                </li>
                <li className="timeline-loading-item">
                  <span className="timeline-loading-year" />
                  <div className="timeline-loading-lines">
                    <span className="timeline-loading-line timeline-loading-line--lg" />
                    <span className="timeline-loading-line timeline-loading-line--sm" />
                  </div>
                </li>
                <li className="timeline-loading-item">
                  <span className="timeline-loading-year" />
                  <div className="timeline-loading-lines">
                    <span className="timeline-loading-line timeline-loading-line--md" />
                    <span className="timeline-loading-line timeline-loading-line--sm" />
                  </div>
                </li>
              </ul>
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <p className="timeline-empty">No events in this range. Try moving the slider.</p>
          )}
          {!loading && !error && filtered.length > 0 && (
            <ul className="timeline-events">
              {filtered.map((ev, i) => (
                <li key={ev.id ?? `${ev.year}-${i}`} className="timeline-event">
                  <span className="timeline-event-year">{ev.year}</span>
                  <div className="timeline-event-body">
                    <div className="timeline-event-header">
                      <strong>{ev.label}</strong>
                      {(ev.source_label || ev.source_url) && (
                        <span className="timeline-event-source" title={ev.source_label ? `Source: ${ev.source_label}` : 'Source'}>
                          {ev.source_url ? (
                            <a
                              className="timeline-event-source-link"
                              href={ev.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Source: ${ev.source_label || 'Link'} (opens in new tab)`}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                window.open(ev.source_url, '_blank', 'noopener,noreferrer')
                              }}
                            >
                              <TbBook2 aria-hidden />
                              {ev.source_label && <span>{ev.source_label}</span>}
                              <TbExternalLink aria-hidden className="timeline-event-source-external" />
                            </a>
                          ) : (
                            <>
                              <TbBook2 aria-hidden />
                              {ev.source_label && <span>{ev.source_label}</span>}
                            </>
                          )}
                        </span>
                      )}
                    </div>
                    <p className="timeline-event-desc">{ev.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
