import { useState, useEffect } from 'react'

const QUESTIONS = [
  {
    q: 'Are Palestinians a distinct ethnic, racial, or religious group under the genocide convention?',
    options: ['Yes', 'No'],
    correct: 1,
    explain: 'No. Palestinians are Arab (ethnic/racial), Muslim (religion shared with many others)—not a distinct protected category. Palestinian national identity emerged after Israel was established, as a political and Islamist tool to mobilize people against Israel.',
  },
  {
    q: 'Is the Gaza war legally considered a genocide by international courts?',
    options: ['Yes, it has been ruled genocide', 'No definitive ruling of genocide'],
    correct: 1,
    explain: 'It is not genocide. Calling the Gaza war genocide is a lie—weaponized to harm Jews and to trivialize the Holocaust, the actual genocide that Jews suffered not long ago.',
  },
  {
    q: 'Did the Arab conquest of the Levant destroy or displace the original population (Jews, Christians, and others) as distinct groups?',
    options: ['Yes', 'No'],
    correct: 0,
    explain: 'Yes. The conquest killed, displaced, and subjugated the indigenous population. The region’s pre-existing peoples were massacred, driven out, or forced to submit. Modern Palestinian Arab identity traces to the conquerors, not to the biblical-era Jews or the Christian and Jewish communities that were destroyed or diminished.',
  },
  {
    q: "Was October 7th an act of genocide towards Jews?",
    options: ['Yes', 'No'],
    correct: 0,
    explain: 'Yes. Hamas targeted Jews as Jews with intent to kill and destroy them in whole or in part—mass murder, rape, and kidnapping of civilians. That fits the legal definition of genocide.',
  },
  {
    q: 'So, is the Gaza War a Genocide?',
    options: ['Yes', 'No'],
    correct: 1,
    explain: 'No. Under the legal definition, the Gaza war is not genocide. Use the term carefully—it has a specific meaning and a devastating history.',
  },
  {
    q: 'What is the crucial element that defines genocide under international law?',
    options: ['Intent to destroy the group', 'Number of casualties'],
    correct: 0,
    explain: 'Intent to destroy the group. The UN Genocide Convention requires intent to destroy, in whole or in part, a protected group. The scale of casualties alone does not define genocide.',
  },
  {
    q: 'Who administered the Levant before the British took over?',
    options: ['The Ottoman Turks', 'Arab rulers'],
    correct: 0,
    explain: 'The Ottoman Turks. The region was under Ottoman rule for hundreds of years; there was no Arab self-rule. The British took over from the Ottomans, not from any Arab administration.',
  },
  {
    q: 'So, was the Arab conquest of the Levant a genocide of the Jewish and Christian population who lived there?',
    options: ['Yes', 'No'],
    correct: 0,
    explain: 'The Arab conquest targeted and destroyed the Jewish and Christian populations of the Levant—it was genocide. Palestinians are descended from those conquerors who did in fact commit genocide.',
  },
]

// Interleaved: teach a bit, ask a question, repeat. At least one question between each info panel.
const STEPS = [
  {
    type: 'info',
    title: 'What genocide means',
    text: 'Under international law (UN Genocide Convention, 1948), genocide means acts committed with intent to destroy, in whole or in part, a national, ethnical, racial or religious group. <strong>The crucial element is intent to destroy the group as such.</strong>',
  },
  { type: 'question', questionIndex: 5 },
  {
    type: 'info',
    title: 'Who counts as a protected group?',
    text: 'The convention protects <strong>national, ethnical, racial, or religious</strong> groups. The definition requires asking: are Palestinians a distinct ethnic group? No—they are Arab. A distinct racial group? No—they are Arab. A distinct religious group? No—they are Muslim (a religion shared by hundreds of millions). Palestinian <em>national</em> identity, as it is known today, did not exist before Israel was established. It was forged largely after 1948 as a political and Islamist tool to propagandize people against Israel and to reject Jewish statehood.',
  },
  { type: 'question', questionIndex: 0 },
  {
    type: 'info',
    title: 'Origin of Palestinian national identity',
    text: 'Arabs conquered the Levant in the 7th century, killing and subjugating the local population. The region then remained under Ottoman rule for hundreds of years—the Turks administered the land and the Arab population; there was no Arab self-rule. So when the Ottoman Empire collapsed after World War I and Britain began administering the territory, the Brits (and later Jewish governance) did not take over from any Arab administration; they took over from the Ottomans. By then, Jews had already been living in the land in large numbers—Jewish return and settlement had intensified during Ottoman times and continued under British administration.',
  },
  { type: 'question', questionIndex: 6 },
  {
    type: 'info',
    title: 'The Arab conquest and the original population',
    text: 'The 7th-century Arab conquest did not only subjugate the Levant—it systematically killed, displaced, and Islamized the local population. The indigenous inhabitants were Jews, Christians, and others who had lived there for millennia. They were massacred, driven out, or forced to submit. The Arabs who settled and ruled the region replaced the original peoples; modern Palestinian Arab identity traces to those conquerors, not to the biblical-era Jews or the Christian and Jewish communities that were destroyed or diminished by the conquest.',
  },
  { type: 'question', questionIndex: 2 },
  { type: 'question', questionIndex: 7 },
  {
    type: 'info',
    title: 'Hamas and genocidal intent',
    text: 'Hamas’s founding charter (1988) is explicitly genocidal toward Jews. It cites a hadith: “The Day of Judgment will not come until Muslims fight the Jews and kill them.” It calls for the elimination of Israel and the killing of Jews. Although Hamas issued a new document in 2017, the group has never renounced the charter’s goals and has repeatedly acted on them—nowhere more clearly than on October 7, 2023, when it carried out mass murder, rape, and kidnapping of Israeli civilians with the stated aim of destroying the Jewish state and killing Jews.',
  },
  { type: 'question', questionIndex: 3 },
  {
    type: 'info',
    title: "What's happening on the ground",
    text: 'The war in Gaza followed Hamas\'s 7 October 2023 attack on Israel. U.S. sources, as confirmed by President Trump, indicate that roughly 58,000 of the 67,000 total deaths in Gaza were Hamas combatants—a civilian-to-combatant ratio of about 0.16 to 1. The UN estimates the global average in modern conflict is nine civilians to one combatant. Israel has achieved the lowest proportion of civilian casualties in history while establishing evacuation zones and issuing repeated alerts to protect noncombatants.',
  },
  { type: 'question', questionIndex: 1 },
  { type: 'question', questionIndex: 4 },
  { type: 'done' },
]

function StepContent({ step, question, selected, showExplain, isCorrect, onAnswer, onNext }) {
  if (step.type === 'title') {
    return (
      <div className="gaza-modal-step gaza-modal-title-step">
        <h2 className="gaza-modal-heading">{step.text}</h2>
      </div>
    )
  }
  if (step.type === 'info') {
    return (
      <div className="gaza-modal-step gaza-modal-info-step">
        {step.title && <h3 className="gaza-modal-info-title">{step.title}</h3>}
        <p className="gaza-modal-info-text" dangerouslySetInnerHTML={{ __html: step.text }} />
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
        <h3 className="gaza-modal-done-heading">So, is the Gaza War a Genocide?</h3>
        <p>Use the term “genocide” carefully and accurately—it has a specific legal meaning and a devastating history.</p>
      </div>
    )
  }
  return null
}

export default function GazaGenocideModal({ open, onClose }) {
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
    if (currentStep?.type === 'question' && stepIndex === steps.length - 2 && !isCorrect) {
      setStepIndex(0)
      return
    }
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
  const showNext = canGoNext
  const isLastQuestionWrong = currentStep?.type === 'question' && stepIndex === steps.length - 2 && showExplain && !isCorrect
  const nextLabel = isDoneStep ? 'Close' : isLastQuestionWrong ? 'Retake quiz' : stepIndex === steps.length - 2 ? 'Finish' : 'Next'

  if (!open) return null

  return (
    <div className="gaza-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Gaza war genocide guide">
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
              onNext={goNext}
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
            {showNext && (
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
