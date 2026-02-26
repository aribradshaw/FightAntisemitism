import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FALLBACK_CONSPIRACIES } from '../data/conspiracies'

export default function Conspiracies() {
  const [conspiracies, setConspiracies] = useState(FALLBACK_CONSPIRACIES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/conspiracies')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setConspiracies(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="conspiracies-page">
      <h1 className="hub-title">Conspiracy Theories</h1>
      {loading ? (
        <p className="conspiracies-loading">Loading…</p>
      ) : (
        <ul className="conspiracies-masonry">
          {conspiracies.map((c) => (
            <li key={c.slug}>
              <Link to={`/conspiracies/${c.slug}`} className="conspiracies-card">
                &ldquo;{c.title}&rdquo;
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
