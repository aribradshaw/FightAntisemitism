import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

export default function Agitators() {
  const [agitators, setAgitators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setError(null)
    fetch('/api/agitators')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then((data) => {
        setAgitators(Array.isArray(data) ? data : [])
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = !q
      ? agitators
      : agitators.filter(
          (a) =>
            (a.name && a.name.toLowerCase().includes(q)) ||
            (a.subtitle && a.subtitle.toLowerCase().includes(q)) ||
            (a.slug && a.slug.toLowerCase().includes(q)) ||
            (a.description && a.description.toLowerCase().includes(q))
        )
    return [...list].sort((a, b) => {
      const p = (x) => {
        const v = x.priority ?? x.Priority ?? x.PRIORITY
        return (v != null && v !== '') ? Number(v) : 999
      }
      const pa = p(a)
      const pb = p(b)
      if (pa !== pb) return pa - pb
      return (a.name || '').localeCompare(b.name || '')
    })
  }, [agitators, search])

  return (
    <div className="agitators-page">
      <h1>Agitators</h1>
      <p className="agitators-intro">
        Public figures who have promoted antisemitic ideas, tropes, or conspiracy theories. Click for details and sources.
      </p>
      {!loading && (
        <div className="agitators-search-wrap">
          <input
            type="search"
            className="agitators-search"
            placeholder="Search agitators…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search agitators"
          />
        </div>
      )}
      {loading ? (
        <p className="agitators-intro">Loading…</p>
      ) : error ? (
        <p className="agitators-search-empty">Failed to load agitators. Make sure the server is running and try again.</p>
      ) : (
        <>
          <ul className="agitators-list">
            {filtered.map((a) => (
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
          {filtered.length === 0 && (
            <p className="agitators-search-empty">
              {search.trim() ? 'No agitators match your search.' : 'No agitators loaded.'}
            </p>
          )}
        </>
      )}
    </div>
  )
}
