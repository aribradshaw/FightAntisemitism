import { useState } from 'react'

const QUESTIONS = [
  {
    q: 'Does Israel have the intent to destroy Palestinians as a people?',
    options: ['Yes', 'No'],
    correct: 1,
    explain: 'Israel’s stated aim is to defeat Hamas and free hostages, not to eliminate the Palestinian people. Evidence of intent to destroy the group is what defines genocide.',
  },
  {
    q: 'Is the Gaza war legally considered a genocide by international courts?',
    options: ['Yes, it has been ruled genocide', 'No definitive ruling of genocide'],
    correct: 1,
    explain: 'It is not genocide. Calling the Gaza war genocide is a lie—weaponized to harm Jews and to trivialize the Holocaust, the actual genocide that Jews suffered not long ago.',
  },
  {
    q: 'Which of these is widely recognized as genocide?',
    options: ['The Holocaust', 'The Gaza war (2023–present)'],
    correct: 0,
    explain: 'The Holocaust was genocide. Calling the Gaza war genocide is insane—it twists the term to attack Jews and erase the memory of the genocide they actually endured.',
  },
]

export default function GenocideInteractive() {
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showExplain, setShowExplain] = useState(false)
  const [phase, setPhase] = useState('quiz') // quiz | done

  const inQuiz = phase === 'quiz'
  const currentQ = QUESTIONS[quizIndex]
  const isCorrect = selected !== null && selected === currentQ?.correct

  const handleAnswer = (idx) => {
    if (showExplain) return
    setSelected(idx)
    setShowExplain(true)
  }

  const nextQuestion = () => {
    setSelected(null)
    setShowExplain(false)
    if (quizIndex < QUESTIONS.length - 1) setQuizIndex((i) => i + 1)
    else setPhase('done')
  }

  return (
    <div className="genocide-interactive">
      {inQuiz && currentQ && (
        <div className="genocide-quiz">
          <h3>Question {quizIndex + 1} of {QUESTIONS.length}</h3>
          <p className="genocide-quiz-q">{currentQ.q}</p>
          <div className="genocide-quiz-options">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                className={`genocide-opt ${selected === idx ? (isCorrect ? 'correct' : 'wrong') : ''} ${showExplain ? 'disabled' : ''}`}
                onClick={() => handleAnswer(idx)}
                disabled={showExplain}
              >
                {opt}
              </button>
            ))}
          </div>
          {showExplain && (
            <div className="genocide-explain">
              <p><strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong> {currentQ.explain}</p>
              <button type="button" onClick={nextQuestion} className="primary">
                {quizIndex < QUESTIONS.length - 1 ? 'Next question' : 'Finish'}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'done' && (
        <div className="genocide-done">
          <h3>You’ve completed the quiz</h3>
          <p>Use the term "genocide" carefully and accurately—it has a specific legal meaning and a devastating history.</p>
        </div>
      )}
    </div>
  )
}
