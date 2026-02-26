import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const TOPIC_TITLES = { israel: 'Israel', 'jewish-race': 'The Jewish Race' }

export default function MisconceptionEntryDetail() {
  const { topic, slug } = useParams()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (topic !== 'israel' && topic !== 'jewish-race') {
      setEntry(null)
      setLoading(false)
      return
    }
    fetch(`/api/misconception-entries/${topic}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        const item = list.find((e) => e.slug === slug) || null
        setEntry(item ? { ...item, body_text: item.body_text || item.summary || '', sources: item.sources || [] } : null)
      })
      .catch(() => setEntry(null))
      .finally(() => setLoading(false))
  }, [topic, slug])

  if (topic !== 'israel' && topic !== 'jewish-race') {
    return (
      <div className="misconception-entry-detail">
        <p>Not found.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="misconception-entry-detail">
        <p>Loading…</p>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="misconception-entry-detail">
        <p>Not found.</p>
      </div>
    )
  }

  const topicTitle = TOPIC_TITLES[topic] || topic

  return (
    <div className="misconception-entry-detail detail-page-with-parent">
      <div className="corner-parent-ribbon" aria-hidden="true"><span>{topicTitle.toUpperCase()}</span></div>
      <h1 className="misconception-entry-title">&ldquo;{entry.title}&rdquo;</h1>
      <div className="misconception-entry-body">
        {entry.body_text ? (
          typeof entry.body_text === 'string' && entry.body_text.startsWith('<') ? (
            <div dangerouslySetInnerHTML={{ __html: entry.body_text }} />
          ) : (
            <p>{entry.body_text}</p>
          )
        ) : entry.summary ? (
          <p>{entry.summary}</p>
        ) : null}
      </div>
      {entry.sources && entry.sources.length > 0 && (
        <section className="misconception-entry-sources" aria-label="Sources">
          <h2>Sources &amp; further reading</h2>
          <ul>
            {entry.sources.map((s, i) => (
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
      <p className="misconception-entry-back">
        <Link to={`/misconceptions/${topic}`}>← Back to {topicTitle}</Link>
      </p>
    </div>
  )
}
