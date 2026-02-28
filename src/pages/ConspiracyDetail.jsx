import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TagWithPopup from '../components/TagWithPopup'
import useMarkRead from '../hooks/useMarkRead'

export default function ConspiracyDetail() {
  const { slug } = useParams()
  const [conspiracy, setConspiracy] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/conspiracies')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        const item = list.find((c) => c.slug === slug) || null
        setConspiracy(item ? { ...item, body_text: item.body_text || item.summary || '', tags: item.tags || [], sources: item.sources || [] } : null)
      })
      .catch(() => setConspiracy(null))
      .finally(() => setLoading(false))
  }, [slug])

  useMarkRead({
    category: 'conspiracies',
    itemSlug: slug,
    enabled: Boolean(slug) && !loading && Boolean(conspiracy),
  })

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
    <div className="conspiracy-detail detail-page-with-parent">
      <div className="corner-parent-ribbon" aria-hidden="true"><span>CONSPIRACIES</span></div>
      <h1 className="conspiracy-title">{conspiracy.title}</h1>
      {conspiracy.category && (
        <span className="conspiracy-category-pill">{conspiracy.category}</span>
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
      {conspiracy.tags && conspiracy.tags.length > 0 && (
        <div className="conspiracy-tags" aria-label="Tags">
          {conspiracy.tags.map((t, i) => (
            <TagWithPopup
              key={i}
              tag={t}
              className="conspiracy-tag"
              currentSlug={conspiracy.slug}
              currentParent="conspiracies"
            />
          ))}
        </div>
      )}
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
