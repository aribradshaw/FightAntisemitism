import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AGITATORS as FALLBACK_AGITATORS } from '../data/agitators'
import useMarkRead from '../hooks/useMarkRead'

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

  useMarkRead({
    category: 'agitators',
    itemSlug: slug,
    enabled: Boolean(slug) && !loading && Boolean(person),
  })

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

  const avatarUrl = person.image_url || person.image
  const showQatarModule = slug === 'tucker-carlson'

  return (
    <div className="agitator-detail">
      <div className={showQatarModule ? 'agitator-detail-top-row' : undefined}>
        <div className="agitator-detail-main">
          <div className="agitator-header">
            <div className="agitator-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" />
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
        </div>
        {showQatarModule && (
          <div className="agitator-qatar-module">
            <a href="https://qatarlson.com" target="_blank" rel="noopener noreferrer" className="agitator-qatar-link">
              <img src="/agitators/tucker-qatar.jpg" alt="" className="agitator-qatar-img" />
              <div className="agitator-qatar-text">
                <h3 className="agitator-qatar-title">Qatar connections</h3>
                <p className="agitator-qatar-cta">Learn more about Tucker Carlson's Qatar &amp; Islamist Connections</p>
            </div>
          </a>
        </div>
      )}
      <section className="agitator-sources">
        <h2>Comments, actions &amp; sources</h2>
        <ul className="agitator-timeline">
          {(person.sources || []).map((s, i) => {
            const actionEl =
              s.url && s.url !== '#'
                ? (
                    <span className="agitator-source-action">
                      {s.url.startsWith('/')
                        ? <Link to={s.url} className="agitator-source-btn agitator-source-btn-internal">Open</Link>
                        : <a href={s.url} target="_blank" rel="noopener noreferrer" className="agitator-source-btn">Source</a>}
                    </span>
                  )
                : null
            const textEl = s.text && s.text.includes('Jewish deicide conspiracy theory')
              ? <>
                  {s.text.split('Jewish deicide conspiracy theory')[0]}
                  <Link to="/conspiracies/jews-killed-jesus">Jewish deicide conspiracy theory</Link>
                  {s.text.split('Jewish deicide conspiracy theory')[1]}
                </>
              : s.text
            return (
              <li key={i} className="agitator-source-item">
                <div className="agitator-source-meta">
                  <span className="agitator-date">{s.date || s.date_label}</span>
                  {actionEl}
                </div>
                <p className="agitator-source-text">{textEl}</p>
              </li>
            )
          })}
        </ul>
      </section>
      </div>
    </div>
  )
}
