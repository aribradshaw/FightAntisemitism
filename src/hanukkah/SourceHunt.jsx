import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HUNT_ROUNDS } from '../data/hanukkahNights.js'

function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function SourceHunt({ unlockedThrough, lightCandle, markDone, done }) {
  const [round, setRound] = useState(0)
  const [picked, setPicked] = useState(null)
  const [show, setShow] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(Boolean(done.hunt))

  const item = HUNT_ROUNDS[round]
  const options = useMemo(() => {
    if (!item) return []
    return shuffle([
      { ...item.correct, real: true },
      ...item.decoys.map((d) => ({ ...d, real: false })),
    ])
    // reshuffle when round changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  if (unlockedThrough < 6) {
    return (
      <div>
        <Link to="/hanukkah" className="hk-back">← Eight nights</Link>
        <div className="hk-panel"><p>Source hunt unlocks on Night 6.</p></div>
      </div>
    )
  }

  const choose = (idx) => {
    if (show || finished) return
    setPicked(idx)
    setShow(true)
    if (options[idx].real) setScore((s) => s + 1)
  }

  const next = () => {
    if (round + 1 >= HUNT_ROUNDS.length) {
      markDone('hunt', { score })
      lightCandle(6)
      setFinished(true)
      return
    }
    setRound((r) => r + 1)
    setPicked(null)
    setShow(false)
  }

  return (
    <div>
      <Link to="/hanukkah" className="hk-back">← Eight nights</Link>
      <div className="hk-panel">
        <h2>Source hunt</h2>
        <p className="hk-note">Find the real citation. Round {round + 1} of {HUNT_ROUNDS.length}.</p>
        {finished ? (
          <p>Done — {done.hunt?.score ?? score} correct. Candle 6 is lit.</p>
        ) : (
          <>
            <p style={{ fontWeight: 600 }}>{item.claim}</p>
            <div className="hk-choice-list">
              {options.map((opt, idx) => (
                <button
                  key={`${opt.label}-${idx}`}
                  type="button"
                  className={show ? (opt.real ? 'correct' : picked === idx ? 'wrong' : '') : ''}
                  onClick={() => choose(idx)}
                  disabled={show}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {show && (
              <div className="hk-explain">
                <p>
                  {options[picked]?.real
                    ? 'Yes — that is a real, citable source.'
                    : 'That one was a decoy. Prefer archives, museums, and primary documents.'}
                </p>
                {item.correct.url && item.correct.url !== '#' && (
                  <p>
                    <a href={item.correct.url} target="_blank" rel="noopener noreferrer">
                      Open the real source →
                    </a>
                  </p>
                )}
                <div className="hk-actions">
                  <button type="button" className="primary" onClick={next}>
                    {round + 1 >= HUNT_ROUNDS.length ? 'Finish' : 'Next claim'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
