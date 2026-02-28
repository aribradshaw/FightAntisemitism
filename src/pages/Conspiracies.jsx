import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Conspiracies() {
  const [conspiracies, setConspiracies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/conspiracies')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setConspiracies(Array.isArray(data) ? data : [])
      })
      .catch(() => setConspiracies([]))
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
                "{c.title}"
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
