import { useState, useMemo } from 'react'

// Sample timeline events (you can expand with real data)
const EVENTS = [
  { year: -1000, label: 'Kingdom of Israel', region: 'levant', desc: 'United monarchy under David and Solomon.' },
  { year: 70, label: 'Destruction of Second Temple', region: 'levant', desc: 'Romans destroy the Temple in Jerusalem.' },
  { year: 135, label: 'Bar Kokhba revolt', region: 'levant', desc: 'Jewish revolt against Rome; diaspora widens.' },
  { year: 1096, label: 'First Crusade', region: 'europe', desc: 'Pogroms against Jewish communities in Europe.' },
  { year: 1492, label: 'Expulsion from Spain', region: 'europe', desc: 'Alhambra Decree; Jews expelled from Spain.' },
  { year: 1897, label: 'First Zionist Congress', region: 'europe', desc: 'Basel; founding of modern political Zionism.' },
  { year: 1948, label: 'State of Israel', region: 'levant', desc: 'Declaration of independence; modern Israel founded.' },
  { year: 1967, label: 'Six-Day War', region: 'levant', desc: 'Israel gains control of Gaza, West Bank, Sinai, Golan.' },
  { year: 2023, label: 'Oct 7 attacks', region: 'levant', desc: 'Hamas attack on Israel; war in Gaza.' },
]

const MIN_YEAR = -1500
const MAX_YEAR = 2030

export default function Timeline() {
  const [year, setYear] = useState(1948)
  const [yearInput, setYearInput] = useState('1948')

  const clampedYear = Math.max(MIN_YEAR, Math.min(MAX_YEAR, year))
  const filtered = useMemo(() => 
    EVENTS.filter(e => Math.abs(e.year - clampedYear) <= 200).sort((a, b) => a.year - b.year),
    [clampedYear]
  )

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

  return (
    <div className="timeline-page">
      <h1 className="timeline-page-title">Timeline</h1>
      <p className="timeline-page-intro">Drag the timeline or enter a year to explore Jewish and Israeli history.</p>

      <div className="timeline-controls">
        <form onSubmit={handleYearSubmit} className="timeline-year-form">
          <label htmlFor="year-input">Year</label>
          <input
            id="year-input"
            type="number"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value)}
          />
          <button type="submit">Go</button>
        </form>
        <div className="timeline-slider-wrap">
          <span className="timeline-year-label">{MIN_YEAR}</span>
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={clampedYear}
            onChange={handleSlider}
            className="timeline-slider"
          />
          <span className="timeline-year-label">{MAX_YEAR}</span>
        </div>
        <p className="timeline-current-year">Showing events near: <strong>{clampedYear}</strong></p>
      </div>

      <div className="timeline-layout">
        <aside className="timeline-map">
          <div className="timeline-map-placeholder">
            <svg viewBox="0 0 400 240" className="timeline-map-svg" aria-hidden="true">
              <ellipse cx="200" cy="120" rx="180" ry="100" fill="none" stroke="var(--border-strong)" strokeWidth="1" />
              <text x="200" y="70" textAnchor="middle" fill="var(--text-muted)" fontSize="12">Europe</text>
              <text x="200" y="140" textAnchor="middle" fill="var(--text-muted)" fontSize="12">Mediterranean</text>
              <circle cx="200" cy="115" r="8" fill="var(--accent-gold-muted)" stroke="var(--accent-gold)" strokeWidth="1.5" />
              <text x="200" y="118" textAnchor="middle" fill="var(--accent-gold)" fontSize="10">Levant</text>
            </svg>
            <p className="timeline-map-hint">Mediterranean &amp; Europe — key regions for Jewish history</p>
          </div>
        </aside>
        <section className="timeline-content">
          <h2>Events near {clampedYear}</h2>
          {filtered.length === 0 ? (
            <p className="timeline-empty">No events in this range. Try moving the slider.</p>
          ) : (
            <ul className="timeline-events">
              {filtered.map((ev, i) => (
                <li key={`${ev.year}-${i}`} className="timeline-event">
                  <span className="timeline-event-year">{ev.year}</span>
                  <div>
                    <strong>{ev.label}</strong>
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
