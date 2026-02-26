import { useState } from 'react'

const STEPS = [
  {
    title: 'What is genocide?',
    text: 'Under international law (UN Genocide Convention, 1948), genocide means acts committed with intent to destroy, in whole or in part, a national, ethnical, racial or religious group—including killing members, causing serious harm, deliberately inflicting conditions to destroy the group, preventing births, or forcibly transferring children.',
  },
  {
    title: 'Intent matters',
    text: 'The key is intent to destroy the group as such. War casualties, even high ones, do not by themselves constitute genocide. Israel is fighting Hamas, a terrorist organization that uses civilians as cover; its goal is not to destroy Palestinians as a people.',
  },
  {
    title: 'Examples that were genocide',
    text: 'The Holocaust: systematic murder of six million Jews with the explicit goal of eliminating Jewry. The Inquisition and expulsions targeted Jews (and others) with the aim of eliminating their presence and faith. These are clear cases of intent to destroy a group.',
  },
]

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
    explain: 'As of now, no binding international ruling has found Israel guilty of genocide. The ICJ issued provisional measures but did not order a ceasefire or conclude genocide.',
  },
  {
    q: 'Which of these is widely recognized as genocide?',
    options: ['The Holocaust', 'The Gaza war (2023–present)'],
    correct: 0,
    explain: 'The Holocaust is universally recognized as genocide. The Gaza war is contested; calling it genocide without a legal finding is a misuse of the term.',
  },
]

export default function GenocideInteractive() {
  const [step, setStep] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showExplain, setShowExplain] = useState(false)
  const [phase, setPhase] = useState('intro') // intro | quiz | done

  const inIntro = phase === 'intro'
  const inQuiz = phase === 'quiz'
  const currentQ = QUESTIONS[quizIndex]
  const isCorrect = selected !== null && selected === currentQ?.correct

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1)
    else setPhase('quiz')
  }
  const prevStep = () => {
    if (step > 0) setStep((s) => s - 1)
  }

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
      {inIntro && (
        <>
          <div className="genocide-steps">
            <h3>{STEPS[step].title}</h3>
            <p className="genocide-step-text">{STEPS[step].text}</p>
            <div className="genocide-step-nav">
              {step > 0 && (
                <button type="button" onClick={prevStep}>Previous</button>
              )}
              <button type="button" onClick={nextStep} className="primary">
                {step < STEPS.length - 1 ? 'Next' : 'Continue to quiz'}
              </button>
            </div>
          </div>
        </>
      )}

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
          <h3>You’ve completed the section</h3>
          <p>You’ve seen the legal definition of genocide, why intent matters, and how the Gaza war differs from the Holocaust and historical inquisitions. Use the term “genocide” carefully and accurately.</p>
        </div>
      )}
    </div>
  )
}
