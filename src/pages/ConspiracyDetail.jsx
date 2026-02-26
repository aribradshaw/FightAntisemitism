import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FALLBACK_CONSPIRACIES } from '../data/conspiracies'

export default function ConspiracyDetail() {
  const { slug } = useParams()
  const [conspiracy, setConspiracy] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/conspiracies')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) && data.length > 0 ? data : FALLBACK_CONSPIRACIES
        const item = list.find((c) => c.slug === slug) || null
        setConspiracy(item ? { ...item, body_text: item.body_text || item.summary || '', tags: item.tags || [], sources: item.sources || [] } : null)
      })
      .catch(() => {
        const item = FALLBACK_CONSPIRACIES.find((c) => c.slug === slug) || null
        setConspiracy(item ? { ...item, body_text: '', tags: [], sources: [] } : null)
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="conspiracy-detail">
        <p>Loading…</p>
      </div>
    )
  }

  if (!conspiracy) {
    return (
      <div className="conspiracy-detail">
        <p>Not found.</p>
      </div>
    )
  }

  return (
    <div className="conspiracy-detail">
      <h1 className="conspiracy-title">&ldquo;{conspiracy.title}&rdquo;</h1>
      {conspiracy.category && (
        <p className="conspiracy-category">
          <strong>Category:</strong> {conspiracy.category}
        </p>
      )}
      {conspiracy.tags && conspiracy.tags.length > 0 && (
        <div className="conspiracy-tags">
          <strong>Tags:</strong>{' '}
          {conspiracy.tags.map((t, i) => (
            <span key={i} className="conspiracy-tag">{t}</span>
          ))}
        </div>
      )}
      <div className="conspiracy-body">
        {conspiracy.body_text ? (
          typeof conspiracy.body_text === 'string' && conspiracy.body_text.startsWith('<') ? (
            <div dangerouslySetInnerHTML={{ __html: conspiracy.body_text }} />
          ) : (
            <p>{conspiracy.body_text}</p>
          )
        ) : conspiracy.summary ? (
          <p>{conspiracy.summary}</p>
        ) : null}
      </div>
      {conspiracy.sources && conspiracy.sources.length > 0 && (
        <section className="conspiracy-sources" aria-label="Sources">
          <h2>Sources &amp; further reading</h2>
          <ul>
            {conspiracy.sources.map((s, i) => (
              <li key={i}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
                ) : (
                  <span>{s.label}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
