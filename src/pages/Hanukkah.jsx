import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { HANUKKAH_NIGHTS } from '../data/hanukkahNights.js'
import { formatUnlockLocal, setPreviewThrough, unlockedThrough } from '../hanukkah/unlock.js'
import { useHanukkahProgress } from '../hanukkah/useProgress.js'
import Menorah from '../hanukkah/Menorah.jsx'
import MapStory from '../hanukkah/MapStory.jsx'
import CandleQuiz from '../hanukkah/CandleQuiz.jsx'
import Flashcards from '../hanukkah/Flashcards.jsx'
import DreidelMatch from '../hanukkah/DreidelMatch.jsx'
import SourceHunt from '../hanukkah/SourceHunt.jsx'
import AskNight from '../hanukkah/AskNight.jsx'
import Scrapbook from '../hanukkah/Scrapbook.jsx'
import '../hanukkah.css'

function HubHome({ through, lit, done, lightCandle }) {
  const displayLit = through >= 1 && !lit.includes(1) ? [...lit, 1] : lit

  return (
    <>
      <div className="hk-hero">
        <h1>Eight nights on HaShem.Faith</h1>
        <p>
          Each evening of Hanukkah unlocks a new experience — menorah, map, quiz, flashcards, dreidel,
          source hunt, questions, and a scrapbook. Agitators stay off this campaign.
        </p>
      </div>
      <Menorah
        litNights={displayLit}
        unlockedThrough={through}
        onLight={(n) => lightCandle(n)}
        shamashLit={through >= 1}
      />
      <div className="hk-grid">
        {HANUKKAH_NIGHTS.map((n) => {
          const open = n.night <= through
          const completed = lit.includes(n.night) || done[n.slug]
          const body = (
            <>
              <span className="hk-card-kicker">Night {n.night} · {n.dateLabel}</span>
              <h2>{n.title}</h2>
              <p>{n.blurb}</p>
              <span className={`hk-badge${open ? ' hk-badge--open' : ''}`}>
                {!open ? `Unlocks ${formatUnlockLocal(n.unlockAt)}` : completed ? 'Lit' : 'Open now'}
              </span>
            </>
          )
          if (!open) {
            return (
              <div key={n.night} className="hk-card hk-card--locked" aria-disabled="true">
                {body}
              </div>
            )
          }
          return (
            <Link key={n.night} to={n.path} className="hk-card">
              {body}
            </Link>
          )
        })}
      </div>
      <p className="hk-note" style={{ textAlign: 'center' }}>
        Also explore the year-round library:{' '}
        <Link to="/explore">Explore</Link> · <Link to="/slideshow">Slideshow</Link> ·{' '}
        <Link to="/timeline">Timeline</Link>
      </p>
    </>
  )
}

function Locked({ night }) {
  const meta = HANUKKAH_NIGHTS.find((n) => n.night === night)
  return (
    <div>
      <Link to="/hanukkah" className="hk-back">← Eight nights</Link>
      <div className="hk-panel">
        <h2>{meta?.title || `Night ${night}`}</h2>
        <p>This unlocks {meta ? formatUnlockLocal(meta.unlockAt) : 'later'} (America/Phoenix).</p>
        <p className="hk-note">For UAT, open with ?preview={night} or ?preview=all.</p>
      </div>
    </div>
  )
}

function FeatureGate({ night, through, children }) {
  if (through < night) return <Locked night={night} />
  return children
}

export default function Hanukkah() {
  const location = useLocation()
  const [now, setNow] = useState(() => new Date())
  const through = useMemo(() => unlockedThrough(now, location.search), [now, location.search])
  const { lit, done, lightCandle, markDone, reset } = useHanukkahProgress()
  const preview = new URLSearchParams(location.search).get('preview')

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const shared = { unlockedThrough: through, lit, done, lightCandle, markDone }

  return (
    <div className="hk-page">
      {(preview != null || through < 8) && (
        <div className="hk-preview-bar">
          <span>
            Unlocked through night <strong>{through}</strong>
            {preview != null ? ' (preview)' : ' (calendar)'}
          </span>
          <button type="button" onClick={() => { setPreviewThrough(8); window.location.search = '?preview=all' }}>
            Preview all
          </button>
          <button type="button" onClick={() => { setPreviewThrough(null); window.location.search = '' }}>
            Clear preview
          </button>
          <button type="button" onClick={reset}>Reset my candles</button>
        </div>
      )}

      <nav className="hk-actions" aria-label="Hanukkah sections" style={{ marginBottom: '0.75rem' }}>
        <NavLink to="/hanukkah" end style={{ fontSize: '0.9rem' }}>Hub</NavLink>
        {HANUKKAH_NIGHTS.filter((n) => n.night > 1 && n.night <= through).map((n) => (
          <NavLink key={n.slug} to={n.path} style={{ fontSize: '0.9rem' }}>
            {n.title}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route index element={<HubHome through={through} lit={lit} done={done} lightCandle={lightCandle} />} />
        <Route path="map" element={<FeatureGate night={2} through={through}><MapStory {...shared} /></FeatureGate>} />
        <Route path="quiz" element={<FeatureGate night={3} through={through}><CandleQuiz {...shared} /></FeatureGate>} />
        <Route path="flashcards" element={<FeatureGate night={4} through={through}><Flashcards {...shared} /></FeatureGate>} />
        <Route path="dreidel" element={<FeatureGate night={5} through={through}><DreidelMatch {...shared} /></FeatureGate>} />
        <Route path="hunt" element={<FeatureGate night={6} through={through}><SourceHunt {...shared} /></FeatureGate>} />
        <Route path="ask" element={<FeatureGate night={7} through={through}><AskNight {...shared} /></FeatureGate>} />
        <Route path="scrapbook" element={<FeatureGate night={8} through={through}><Scrapbook {...shared} /></FeatureGate>} />
      </Routes>
    </div>
  )
}
