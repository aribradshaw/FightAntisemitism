import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DREIDEL_ROUNDS } from '../data/hanukkahNights.js'

const FACES = ['נ', 'ג', 'ה', 'ש']

export default function DreidelMatch({ unlockedThrough, lightCandle, markDone, done }) {
  const [spinning, setSpinning] = useState(false)
  const [face, setFace] = useState('נ')
  const [round, setRound] = useState(0)
  const [picked, setPicked] = useState(null)
  const [show, setShow] = useState(false)
  const [score, setScore] = useState(0)
  const [doneAll, setDoneAll] = useState(Boolean(done.dreidel))

  if (unlockedThrough < 5) {
    return (
      <div>
        <Link to="/hanukkah" className="hk-back">← Eight nights</Link>
        <div className="hk-panel"><p>Dreidel match unlocks on Night 5.</p></div>
      </div>
    )
  }

  const item = DREIDEL_ROUNDS[round]

  const spin = () => {
    if (spinning || show) return
    setSpinning(true)
    setTimeout(() => {
      setFace(FACES[Math.floor(Math.random() * FACES.length)])
      setSpinning(false)
    }, 900)
  }

  const choose = (idx) => {
    if (show || doneAll) return
    setPicked(idx)
    setShow(true)
    if (item.choices[idx].correct) setScore((s) => s + 1)
  }

  const next = () => {
    if (round + 1 >= DREIDEL_ROUNDS.length) {
      markDone('dreidel', { score })
      lightCandle(5)
      setDoneAll(true)
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
        <h2>Dreidel match</h2>
        <p className="hk-note">Spin, then match the claim to the right reading. Round {round + 1} of {DREIDEL_ROUNDS.length}.</p>
        <button
          type="button"
          className={`hk-dreidel${spinning ? ' hk-dreidel--spin' : ''}`}
          onClick={spin}
          aria-label="Spin the dreidel"
        >
          {face}
        </button>
        {doneAll ? (
          <p>Finished with {done.dreidel?.score ?? score} correct. Candle 5 is lit.</p>
        ) : (
          <>
            <p style={{ fontWeight: 600 }}>{item.claim}</p>
            <div className="hk-choice-list">
              {item.choices.map((c, idx) => (
                <button
                  key={c.label}
                  type="button"
                  className={show ? (c.correct ? 'correct' : picked === idx ? 'wrong' : '') : ''}
                  onClick={() => choose(idx)}
                  disabled={show}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {show && (
              <div className="hk-explain">
                <p>{item.explain}</p>
                <p>
                  <Link to={item.href}>Read the full entry →</Link>
                </p>
                <div className="hk-actions">
                  <button type="button" className="primary" onClick={next}>
                    {round + 1 >= DREIDEL_ROUNDS.length ? 'Finish' : 'Next spin'}
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
