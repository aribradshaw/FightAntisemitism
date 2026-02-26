import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AGITATORS as FALLBACK_AGITATORS } from '../data/agitators'

export default function Agitators() {
  const [agitators, setAgitators] = useState(FALLBACK_AGITATORS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/agitators')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setAgitators(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="agitators-page">
      <h1>Agitators</h1>
      <p className="agitators-intro">
        Public figures who have promoted antisemitic ideas, tropes, or conspiracy theories. Click for details and sources.
      </p>
      {loading ? (
        <p className="agitators-intro">Loading…</p>
      ) : (
        <ul className="agitators-list">
          {agitators.map((a) => (
            <li key={a.slug}>
              <Link to={`/agitators/${a.slug}`} className="agitators-card">
                <div className="agitators-avatar">
                  {a.image ? (
                    <img src={a.image} alt="" />
                  ) : (
                    <span className="agitators-avatar-placeholder">{a.name.slice(0, 2)}</span>
                  )}
                </div>
                <div className="agitators-info">
                  <h3>{a.name}</h3>
                  <p className="agitators-subtitle">{a.subtitle}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
