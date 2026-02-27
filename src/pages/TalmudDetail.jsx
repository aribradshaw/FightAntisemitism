import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FALLBACK_TALMUD_ENTRIES } from '../data/talmud'
import TagWithPopup from '../components/TagWithPopup'

export default function TalmudDetail() {
  const { slug } = useParams()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/talmud')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) && data.length > 0 ? data : FALLBACK_TALMUD_ENTRIES
        const item = list.find((e) => e.slug === slug) || null
        setEntry(item ? { ...item, body_text: item.body_text || item.summary || '', tags: item.tags || [], sources: item.sources || [] } : null)
      })
      .catch(() => {
        const item = FALLBACK_TALMUD_ENTRIES.find((e) => e.slug === slug) || null
        setEntry(item ? { ...item, body_text: '', tags: [], sources: [] } : null)
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="talmud-detail">
        <p>Loading…</p>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="talmud-detail">
        <p>Not found.</p>
      </div>
    )
  }

  return (
    <div className="talmud-detail detail-page-with-parent">
      <div className="corner-parent-ribbon" aria-hidden="true"><span>TALMUD</span></div>
      <h1 className="talmud-title">&ldquo;{entry.title}&rdquo;</h1>
      {entry.reference && (
        <p className="talmud-reference" aria-label="Talmud reference addressed">{entry.reference}</p>
      )}
      {entry.category && (
        <span className="talmud-category-pill">{entry.category}</span>
      )}
      <div className="talmud-body">
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
      {entry.tags && entry.tags.length > 0 && (
        <div className="talmud-tags" aria-label="Tags">
          {entry.tags.map((t, i) => (
            <TagWithPopup
              key={i}
              tag={t}
              className="talmud-tag"
              currentSlug={entry.slug}
              currentParent="talmud"
            />
          ))}
        </div>
      )}
      {entry.sources && entry.sources.length > 0 && (
        <section className="talmud-sources" aria-label="Sources">
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
    </div>
  )
}
