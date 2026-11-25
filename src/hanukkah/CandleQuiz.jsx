import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QUIZ_BY_NIGHT } from '../data/hanukkahNights.js'

function quizPack(unlockedThrough) {
  for (let n = Math.min(unlockedThrough, 8); n >= 3; n -= 1) {
    if (QUIZ_BY_NIGHT[n]) return { night: n, list: QUIZ_BY_NIGHT[n] }
  }
  return null
}

export default function CandleQuiz({ unlockedThrough, lightCandle, markDone, done }) {
  const pack = quizPack(unlockedThrough)

  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showExplain, setShowExplain] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(Boolean(done.quiz))

  if (!pack) {
    return (
      <div>
        <Link to="/hanukkah" className="hk-back">← Eight nights</Link>
        <div className="hk-panel"><p>The quiz unlocks on Night 3.</p></div>
      </div>
    )
  }

  const q = pack.list[idx]
  const isCorrect = selected === q.correct

  const answer = (i) => {
    if (showExplain || finished) return
    setSelected(i)
    setShowExplain(true)
    if (i === q.correct) setScore((s) => s + 1)
  }

  const advance = () => {
    const nextScore = score
    if (idx + 1 >= pack.list.length) {
      markDone('quiz', { night: pack.night, score: nextScore })
      if (unlockedThrough >= pack.night) lightCandle(pack.night)
      setFinished(true)
      return
    }
    setIdx((i) => i + 1)
    setSelected(null)
    setShowExplain(false)
  }

  return (
    <div>
      <Link to="/hanukkah" className="hk-back">← Eight nights</Link>
      <div className="hk-panel">
        <h2>Candle of the night</h2>
        <p className="hk-note">
          Night {pack.night} · {finished ? 'Complete' : `Question ${idx + 1} of ${pack.list.length}`}
        </p>
        {finished ? (
          <>
            <p>
              {done.quiz?.score != null
                ? `Saved score: ${done.quiz.score} of ${pack.list.length}.`
                : `You got ${score} of ${pack.list.length}.`}{' '}
              Tonight’s candle is ready on the menorah.
            </p>
            <div className="hk-actions">
              <Link to="/hanukkah" className="primary" style={{ padding: '0.6em 1.2em', color: '#fff', textDecoration: 'none' }}>
                Back to the menorah
              </Link>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{q.q}</p>
            <div className="hk-quiz-options">
              {q.options.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  className={showExplain ? (i === q.correct ? 'correct' : selected === i ? 'wrong' : '') : ''}
                  onClick={() => answer(i)}
                  disabled={showExplain}
                >
                  {opt}
                </button>
              ))}
            </div>
            {showExplain && (
              <div className="hk-explain">
                <p>
                  <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong> {q.explain}
                </p>
                {q.source?.url && (
                  <p>
                    <a href={q.source.url}>{q.source.label}</a>
                  </p>
                )}
                <div className="hk-actions">
                  <button type="button" className="primary" onClick={advance}>
                    {idx + 1 >= pack.list.length ? 'Finish' : 'Next'}
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
