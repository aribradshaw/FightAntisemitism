import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

export default function Definitions() {
  const [definitions, setDefinitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/definitions')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setDefinitions(Array.isArray(data) ? data : []))
      .catch(() => setDefinitions([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return definitions
    const q = search.trim().toLowerCase()
    return definitions.filter(
      (d) =>
        (d.title && d.title.toLowerCase().includes(q)) ||
        (d.summary && d.summary.toLowerCase().includes(q)) ||
        (d.slug && d.slug.toLowerCase().includes(q))
    )
  }, [definitions, search])

  if (loading) {
    return (
      <div className="definitions-page">
        <h1>Definitions</h1>
        <p className="definitions-intro">Clear definitions for terms you often hear—with context and sources.</p>
        <p>Loading…</p>
      </div>
    )
  }

  return (
    <div className="definitions-page">
      <h1>Definitions</h1>
      <p className="definitions-intro">Clear definitions for terms you often hear—with context and sources.</p>
      <div className="definitions-search-wrap">
        <input
          type="search"
          className="definitions-search"
          placeholder="Search definitions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search definitions"
        />
      </div>
      <ul className="definitions-list">
        {filtered.map((d) => (
          <li key={d.slug}>
            <Link to={`/definitions/${d.slug}`} className="definitions-card">
              <h3>{d.title}</h3>
              <p>{d.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="definitions-search-empty">No definitions match your search.</p>
      )}
    </div>
  )
}
