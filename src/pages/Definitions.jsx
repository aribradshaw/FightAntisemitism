import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Definitions() {
  const [definitions, setDefinitions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/definitions')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setDefinitions(Array.isArray(data) ? data : []))
      .catch(() => setDefinitions([]))
      .finally(() => setLoading(false))
  }, [])

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
      <ul className="definitions-list">
        {definitions.map((d) => (
          <li key={d.slug}>
            <Link to={`/definitions/${d.slug}`} className="definitions-card">
              <h3>{d.title}</h3>
              <p>{d.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
