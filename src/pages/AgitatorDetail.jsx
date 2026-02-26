import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AGITATORS as FALLBACK_AGITATORS } from '../data/agitators'

export default function AgitatorDetail() {
  const { slug } = useParams()
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/agitators')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) && data.length > 0 ? data : FALLBACK_AGITATORS
        setPerson(list.find((a) => a.slug === slug) || null)
      })
      .catch(() => setPerson(FALLBACK_AGITATORS.find((a) => a.slug === slug) || null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="agitator-detail">
        <p>Loading…</p>
      </div>
    )
  }

  if (!person) {
    return (
      <div className="agitator-detail">
        <p>Not found.</p>
      </div>
    )
  }

  return (
    <div className="agitator-detail">
      <div className="agitator-header">
        <div className="agitator-avatar">
          {person.image ? (
            <img src={person.image} alt="" />
          ) : (
            <span className="agitator-avatar-placeholder">{person.name.slice(0, 2)}</span>
          )}
        </div>
        <div>
          <h1>{person.name}</h1>
          <p className="agitator-subtitle">{person.subtitle}</p>
        </div>
      </div>
      <section className="agitator-description">
        <h2>Overview</h2>
        <p>{person.description}</p>
      </section>
      <section className="agitator-sources">
        <h2>Comments, actions &amp; sources</h2>
        <ul className="agitator-timeline">
          {person.sources.map((s, i) => (
            <li key={i} className="agitator-source-item">
              <div className="agitator-source-meta">
                <span className="agitator-date">{s.date}</span>
                {s.url && s.url !== '#' && (
                  <span className="agitator-source-action">
                    {s.url.startsWith('/')
                      ? <Link to={s.url} className="agitator-source-btn agitator-source-btn-internal">Open</Link>
                      : <a href={s.url} target="_blank" rel="noopener noreferrer" className="agitator-source-btn">Source</a>
                    }
                  </span>
                )}
              </div>
              <p className="agitator-source-text">
                {s.text && s.text.includes('Jewish deicide conspiracy theory') ? (
                  <>
                    {s.text.split('Jewish deicide conspiracy theory')[0]}
                    <Link to="/conspiracies/jews-killed-jesus">Jewish deicide conspiracy theory</Link>
                    {s.text.split('Jewish deicide conspiracy theory')[1]}
                  </>
                ) : (
                  s.text
                )}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
