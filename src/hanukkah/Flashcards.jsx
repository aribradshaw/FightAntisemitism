import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DEFINITIONS } from '../data/definitions.js'

const DECK = DEFINITIONS.filter((d) =>
  ['jew', 'goy', 'talmud', 'torah', 'zionism', 'antisemitism', 'holocaust', 'israel', 'zog', 'genocide'].includes(d.slug),
)

export default function Flashcards({ unlockedThrough, lightCandle, markDone, done }) {
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = DECK[i]

  const next = () => {
    setFlipped(false)
    setI((n) => (n + 1) % DECK.length)
  }
  const prev = () => {
    setFlipped(false)
    setI((n) => (n - 1 + DECK.length) % DECK.length)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        if (!flipped) setFlipped(true)
        else next()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
      if (e.key === 'Enter') setFlipped((f) => !f)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flipped])

  const finish = () => {
    markDone('flashcards', { seen: DECK.length })
    if (unlockedThrough >= 4) lightCandle(4)
  }

  if (unlockedThrough < 4) {
    return (
      <div>
        <Link to="/hanukkah" className="hk-back">← Eight nights</Link>
        <div className="hk-panel"><p>Flashcards unlock on Night 4.</p></div>
      </div>
    )
  }

  return (
    <div>
      <Link to="/hanukkah" className="hk-back">← Eight nights</Link>
      <div className="hk-panel">
        <h2>Definition flashcards</h2>
        <p className="hk-note">
          {i + 1} / {DECK.length} · Space or → to flip / next · ← previous · Enter flips
        </p>
        <div className="hk-flash">
          <button
            type="button"
            className="hk-flash-card"
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? 'Show title' : 'Show definition'}
          >
            {!flipped ? (
              <h3>{card.title}</h3>
            ) : (
              <>
                <h3>{card.title}</h3>
                <p>{card.summary}</p>
                <p>
                  <Link to={`/definitions/${card.slug}`}>Full definition →</Link>
                </p>
              </>
            )}
          </button>
        </div>
        <div className="hk-actions">
          <button type="button" onClick={prev}>Previous</button>
          <button type="button" onClick={() => setFlipped((f) => !f)}>{flipped ? 'Hide' : 'Reveal'}</button>
          <button type="button" onClick={next}>Next</button>
          <button type="button" className="primary" onClick={finish}>
            {done.flashcards ? 'Done — candle lit' : 'Mark deck complete'}
          </button>
        </div>
      </div>
    </div>
  )
}
