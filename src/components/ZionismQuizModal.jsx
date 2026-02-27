import { useState, useEffect } from 'react'

const QUESTIONS = [
  {
    q: 'So what is that movement—and what does it stand for?',
    options: ['Jewish self-determination and a national home in their ancestral homeland', 'A conspiracy to control the world'],
    correct: 0,
    explain: 'Zionism is exactly that: the movement for the Jewish people’s right to self-determination and a national home in the land of Israel. It’s not a conspiracy.',
  },
  {
    q: 'So is Zionism best described as…',
    options: ['European colonialism—an outside power taking someone else’s land', 'A people (including many who never left or were indigenous to the region) returning or finding refuge in their ancestral homeland'],
    correct: 1,
    explain: 'Colonialism is when an external power subjugates another people’s land. Zionism is a people returning to their own—and roughly half of Israel’s Jews are Mizrahim who were already in the Middle East and came as refugees from Arab and Muslim-majority countries, not even from Europe.',
  },
  {
    q: 'What does that tell you?',
    options: ['Zionism is racism', 'The international community rejected the idea that Zionism is racism'],
    correct: 1,
    explain: 'Resolution 46/86 (1991) revoked the 1975 equation of Zionism with racism. Zionism is national liberation and self-determination for the Jewish people, not racial supremacy.',
  },
  {
    q: 'What kind of claim is that?',
    options: ['A factual claim with evidence', 'An antisemitic conspiracy myth—the same as "Jews control the world," with "Zionist" as a stand-in for Jews'],
    correct: 1,
    explain: 'There is no evidence that "Zionists" or Jews control the media, banks, or governments. The claim recycles an ancient antisemitic myth used to blame Jews and justify hatred.',
  },
  {
    q: 'So, what is Zionism?',
    options: ['A conspiracy or form of racism', 'Jewish self-determination in the ancestral homeland, Israel'],
    correct: 1,
    explain: 'Zionism is the movement for Jewish self-determination and a national home in the Jewish people’s ancestral homeland. Not colonialism, not racism, not a conspiracy.',
  },
]

const STEPS = [
  {
    type: 'info',
    title: 'A movement is born',
    text: 'In the late 1800s, Jews across Europe faced pogroms and had no state to protect them. A movement grew for a <strong>national home</strong> in the only place Jews had ever had a kingdom: the land of Israel.',
  },
  { type: 'question', questionIndex: 0 },
  {
    type: 'info',
    title: 'Who actually came to Israel?',
    text: '<p>Roughly <strong>half</strong> of Israel’s Jews are <strong>Mizrahim</strong>—their families lived in the Middle East for millennia. And Jews have <strong>never fully left</strong> the land: there have always been Jewish communities in Jerusalem, Hebron, Safed, Tiberias.</p><p>Who came in the modern movement? From the late 1800s onward: Ashkenazi Jews fleeing pogroms and antisemitism in Europe, and later Holocaust survivors. In the mid-20th century: Mizrahim who were already in the Middle East and came as refugees from Arab and Muslim-majority countries. They were refugees and indigenous people returning—not colonizers from the outside.</p>',
  },
  { type: 'question', questionIndex: 1 },
  {
    type: 'info',
    title: 'What the UN did',
    text: 'In 1975 the UN General Assembly passed a resolution that <strong>equated Zionism with racism</strong>. It was widely condemned. In <strong>1991</strong> the same body <strong>revoked it</strong> (Resolution 46/86).',
  },
  { type: 'question', questionIndex: 2 },
  {
    type: 'info',
    title: 'Something you might hear',
    text: 'Someone says: <em>"Zionists control the media and the banks."</em>',
  },
  { type: 'question', questionIndex: 3 },
  { type: 'question', questionIndex: 4 },
  { type: 'done' },
]

function StepContent({ step, question, selected, showExplain, isCorrect, onAnswer }) {
  if (step.type === 'info') {
    return (
      <div className="gaza-modal-step gaza-modal-info-step">
        {step.title && <h3 className="gaza-modal-info-title">{step.title}</h3>}
        <div className="gaza-modal-info-text" dangerouslySetInnerHTML={{ __html: step.text }} />
      </div>
    )
  }
  if (step.type === 'question' && question) {
    return (
      <div className="gaza-modal-step gaza-modal-question-step">
        <p className="gaza-modal-quiz-q">{question.q}</p>
        <div className="gaza-modal-quiz-options">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              className={`gaza-modal-opt ${selected === idx ? (isCorrect ? 'correct' : 'wrong') : ''} ${showExplain ? 'disabled' : ''}`}
              onClick={() => onAnswer(idx)}
              disabled={showExplain}
            >
              {opt}
            </button>
          ))}
        </div>
        {showExplain && (
          <div className="gaza-modal-explain">
            <p><strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong> {question.explain}</p>
          </div>
        )}
      </div>
    )
  }
  if (step.type === 'done') {
    return (
      <div className="gaza-modal-step gaza-modal-done-step">
        <h3 className="gaza-modal-done-heading">So, what is Zionism?</h3>
        <p>Jewish self-determination and the right to a national home in the ancestral homeland, Israel. Not colonialism, not racism, not a conspiracy.</p>
      </div>
    )
  }
  return null
}

export default function ZionismQuizModal({ open, onClose }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showExplain, setShowExplain] = useState(false)
  const [animKey, setAnimKey] = useState(0)

  const steps = STEPS
  const currentStep = steps[stepIndex]
  const currentQuestion = currentStep?.type === 'question' ? QUESTIONS[currentStep.questionIndex] : null
  const isCorrect = currentQuestion && selected !== null && selected === currentQuestion.correct

  useEffect(() => {
    if (open) {
      setStepIndex(0)
      setSelected(null)
      setShowExplain(false)
      setAnimKey((k) => k + 1)
    }
  }, [open])

  useEffect(() => {
    setAnimKey((k) => k + 1)
  }, [stepIndex])

  const goNext = () => {
    if (currentStep?.type === 'question' && !showExplain) return
    setSelected(null)
    setShowExplain(false)
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      onClose()
    }
  }

  const goPrev = () => {
    if (stepIndex > 0) {
      setSelected(null)
      setShowExplain(false)
      setStepIndex((i) => i - 1)
    }
  }

  const handleAnswer = (idx) => {
    if (currentStep?.type !== 'question' || showExplain) return
    setSelected(idx)
    setShowExplain(true)
  }

  const canGoNext = currentStep?.type !== 'question' || showExplain
  const isDoneStep = currentStep?.type === 'done'
  const nextLabel = isDoneStep ? 'Close' : stepIndex === steps.length - 2 ? 'Finish' : 'Next'

  if (!open) return null

  return (
    <div className="gaza-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="What is Zionism? quiz">
      <div className="gaza-modal-backdrop" aria-hidden="true" />
      <div className="gaza-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="gaza-modal-header">
          <button type="button" className="gaza-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="gaza-modal-body">
          <div key={animKey} className="gaza-modal-step-wrap">
            <StepContent
              step={currentStep}
              question={currentQuestion}
              selected={selected}
              showExplain={showExplain}
              isCorrect={isCorrect}
              onAnswer={handleAnswer}
            />
          </div>
        </div>
        <div className="gaza-modal-footer">
          <div className="gaza-modal-footer-left">
            {stepIndex > 0 && currentStep?.type !== 'done' ? (
              <button type="button" className="gaza-modal-btn gaza-modal-btn-secondary" onClick={goPrev}>
                Back
              </button>
            ) : (
              <span className="gaza-modal-footer-spacer" aria-hidden="true" />
            )}
          </div>
          <div className="gaza-modal-dots" role="tablist" aria-label="Progress">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`gaza-modal-dot ${i === stepIndex ? 'active' : ''}`}
                aria-current={i === stepIndex ? 'step' : undefined}
              />
            ))}
          </div>
          <div className="gaza-modal-footer-right">
            {canGoNext && (
              <button type="button" className="gaza-modal-btn primary" onClick={goNext}>
                {nextLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
