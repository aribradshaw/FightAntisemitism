import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FALLBACK_TALMUD_ENTRIES } from '../data/talmud'

export default function Talmud() {
  const [entries, setEntries] = useState(FALLBACK_TALMUD_ENTRIES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/talmud')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setEntries(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="talmud-page">
      <h1 className="hub-title">The Talmud</h1>
      <p className="talmud-intro">
        Misquotes and false claims about what the Talmud says—and the real truth.
      </p>
      {loading ? (
        <p className="talmud-intro">Loading…</p>
      ) : (
        <ul className="talmud-masonry">
          {entries.map((e) => (
            <li key={e.slug}>
              <Link to={`/talmud/${e.slug}`} className="talmud-card">
                <span className="talmud-card-title">&ldquo;{e.title}&rdquo;</span>
                {e.reference && <span className="talmud-card-reference">{e.reference}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
