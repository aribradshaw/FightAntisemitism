import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { HASHEM_FAITH_LABEL } from '../data/hashemFaithSources'
import GazaGenocideModal from '../components/GazaGenocideModal'
import ZionismQuizModal from '../components/ZionismQuizModal'

function DefinitionDetail() {
  const { slug } = useParams()
  const [definition, setDefinition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLong, setShowLong] = useState(false)
  const [showGazaModal, setShowGazaModal] = useState(false)
  const [showZionismModal, setShowZionismModal] = useState(false)

  useEffect(() => {
    if (!slug) {
      setDefinition(null)
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/definitions/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) return null
        return res.json()
      })
      .then((data) => setDefinition(data || null))
      .catch(() => setDefinition(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="definition-detail">
        <p>Loading…</p>
      </div>
    )
  }

  if (!definition) {
    return (
      <div className="definition-detail">
        <p>Definition not found.</p>
      </div>
    )
  }

  const hasLong = (definition.body_text && definition.body_text.trim() !== '') || slug === 'genocide'
  const furtherReading = definition.further_reading && definition.further_reading.length > 0 ? definition.further_reading : []

  return (
    <div className={`definition-detail ${hasLong ? 'definition-detail--expanded' : ''}`}>
      <div className="definition-detail-inner">
        <div className="definition-detail-header">
          <h1>{definition.title}</h1>
          {slug === 'genocide' && (
            <button
              type="button"
              className="definition-gaza-cta primary"
              onClick={() => setShowGazaModal(true)}
            >
              Is The Gaza War a Genocide?
            </button>
          )}
          {slug === 'talmud' && (
            <Link to="/talmud" className="definition-talmud-cta primary">
              Talmud misconceptions &amp; misquotes
            </Link>
          )}
          {slug === 'zionism' && (
            <button
              type="button"
              className="definition-gaza-cta primary"
              onClick={() => setShowZionismModal(true)}
            >
              What Is Zionism?
            </button>
          )}
        </div>
        <p className="definition-short">{definition.summary}</p>
        {hasLong && (
          <>
            <button
              type="button"
              className="definition-toggle primary"
              onClick={() => setShowLong((v) => !v)}
              aria-expanded={showLong}
            >
              {showLong ? 'Show less' : 'Read full definition'}
            </button>
            <div className={`definition-long-collapse ${showLong ? 'definition-long-collapse--open' : ''}`} aria-hidden={!showLong}>
              <div className="definition-long-collapse-inner">
                <div className="definition-long">
                  {slug === 'genocide' ? (
                    definition.body_text && definition.body_text.trim() ? (
                      <div className="definition-body">
                        {typeof definition.body_text === 'string' && definition.body_text.trim().startsWith('<') ? (
                          <div dangerouslySetInnerHTML={{ __html: definition.body_text }} />
                        ) : (
                          <p>{definition.body_text}</p>
                        )}
                      </div>
                    ) : null
                  ) : definition.body_text ? (
                    <div className="definition-body">
                      {typeof definition.body_text === 'string' && definition.body_text.trim().startsWith('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: definition.body_text }} />
                      ) : (
                        <p>{definition.body_text}</p>
                      )}
                    </div>
                  ) : null}
                  {furtherReading.length > 0 && (
                    <section className="definition-sources" aria-label="Sources and further reading">
                      <h2>Sources &amp; further reading</h2>
                      {furtherReading.every((s) => s.url && s.url.includes('hashem.faith')) && (
                        <p className="definition-sources-attribution">From <a href="https://hashem.faith/" target="_blank" rel="noopener noreferrer">{HASHEM_FAITH_LABEL}</a>:</p>
                      )}
                      <ul>
                        {furtherReading.map((s) => (
                          <li key={s.url}>
                            <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {slug === 'genocide' && (
        <GazaGenocideModal open={showGazaModal} onClose={() => setShowGazaModal(false)} />
      )}
      {slug === 'zionism' && (
        <ZionismQuizModal open={showZionismModal} onClose={() => setShowZionismModal(false)} />
      )}
    </div>
  )
}

export default DefinitionDetail
