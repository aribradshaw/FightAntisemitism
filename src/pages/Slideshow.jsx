import { useEffect, useRef, useState } from 'react'
import { IoArrowBack, IoArrowForward } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import WritingText from '../components/WritingText'
import SlideshowSourcesModal from '../components/SlideshowSourcesModal'
import { SLIDES, SLIDESHOW_SOURCES } from '../data/slideshowSlides'
import { CHAPTER_ONE_SLIDES, CHAPTER_ONE_SOURCES } from '../data/slideshowChapterOne'
import '../slideshow.css'

const TIMELINE_START = -2000
const TIMELINE_END = new Date().getFullYear()
const STAGGER_MS = 52

const DECK = [
  ...CHAPTER_ONE_SLIDES,
  ...SLIDES.map((slide, index) => ({
    ...slide,
    id: slide.id || `history-${index}`,
    kind: slide.kind || 'article',
    chapter: slide.chapter || 'A people across time',
    timelineLabel: slide.timelineLabel || formatTimelineYear(slide.timelineYear, slide.timelineYear < 0),
  })),
]

const ALL_SOURCES = [...CHAPTER_ONE_SOURCES, ...SLIDESHOW_SOURCES]

function formatTimelineYear(year, approximate = false) {
  if (year < 0) {
    const num = (-year).toLocaleString()
    return approximate ? `c. ${num} BCE` : `${num} BCE`
  }
  return `${year} CE`
}

function getStepCount(slide) {
  if (slide.lines) return slide.lines.length
  if (slide.paragraphs) return slide.paragraphs.length
  return 0
}

function RevealLines({ lines, visibleCount, className = '' }) {
  return (
    <div className={`slideshow-reveal-lines ${className}`.trim()}>
      {lines.slice(0, visibleCount).map((line, index) => (
        <p className="slideshow-reveal-line" key={`${index}-${line}`}>
          <span className="slideshow-reveal-number" aria-hidden>{String(index + 1).padStart(2, '0')}</span>
          <span><WritingText staggerMs={STAGGER_MS}>{line}</WritingText></span>
        </p>
      ))}
    </div>
  )
}

function SlideFigure({ slide, className = '' }) {
  return (
    <figure className={`slideshow-figure ${className}`.trim()}>
      <img src={slide.image} alt={slide.imageAlt} />
      <figcaption>{slide.imageCaption}</figcaption>
    </figure>
  )
}

function OpeningSlide({ slide, step }) {
  return (
    <article className="slideshow-opening">
      <div className="slideshow-opening-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h1>{slide.title}</h1>
        <RevealLines lines={slide.lines} visibleCount={step} className="slideshow-opening-lines" />
      </div>
      <div className={`slideshow-opening-art${step >= 1 ? ' is-visible' : ''}`}>
        <SlideFigure slide={slide} />
        <span className="slideshow-orbit slideshow-orbit--one" aria-hidden />
        <span className="slideshow-orbit slideshow-orbit--two" aria-hidden />
      </div>
    </article>
  )
}

function StorySlide({ slide, step }) {
  return (
    <article className={`slideshow-story slideshow-story--${slide.kind}`}>
      <SlideFigure slide={slide} className="slideshow-story-figure" />
      <div className="slideshow-story-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
      </div>
    </article>
  )
}

function ExodusSlide({ slide, step }) {
  return (
    <article className="slideshow-exodus">
      <img className="slideshow-exodus-image" src={slide.image} alt={slide.imageAlt} />
      <div className="slideshow-exodus-wash" aria-hidden />
      <div className="slideshow-exodus-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <p className={`slideshow-method-note${step >= 3 ? ' is-visible' : ''}`}>
          Tradition and historical evidence are presented side by side throughout this slideshow.
        </p>
      </div>
      <p className="slideshow-image-credit">{slide.imageCaption}</p>
    </article>
  )
}

function EvidenceSlide({ slide, step }) {
  return (
    <article className="slideshow-evidence">
      <div className="slideshow-evidence-object">
        <SlideFigure slide={slide} />
        <div className="slideshow-evidence-date">
          <strong>{slide.stat}</strong>
          <span>{slide.statLabel}</span>
        </div>
      </div>
      <div className="slideshow-evidence-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className={`slideshow-inscription${step >= 3 ? ' is-visible' : ''}`} aria-label="The name Israel appears in the inscription">
          <span>Inscription</span>
          <strong>“ISRAEL”</strong>
        </div>
      </div>
    </article>
  )
}

function KingdomsSlide({ slide, step }) {
  return (
    <article className="slideshow-kingdoms">
      <div className="slideshow-kingdoms-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className={`slideshow-kingdom-cards${step >= 2 ? ' is-visible' : ''}`}>
          {slide.kingdoms.map((kingdom) => (
            <div className="slideshow-kingdom-card" key={kingdom.name}>
              <strong>{kingdom.name}</strong>
              <span>{kingdom.detail}</span>
            </div>
          ))}
        </div>
        <p className={`slideshow-evidence-chip${step >= 3 ? ' is-visible' : ''}`}>
          The ninth-century BCE Tel Dan Stele refers to the “House of David.”
        </p>
      </div>
      <SlideFigure slide={slide} className="slideshow-kingdoms-figure" />
    </article>
  )
}

function ArticleSlide({ slide, step }) {
  return (
    <article className="slideshow-article">
      <p className="slideshow-eyebrow">{slide.eyebrow || slide.chapter}</p>
      <h2>{slide.title}</h2>
      <RevealLines lines={slide.paragraphs} visibleCount={step} />
    </article>
  )
}

function SlideContent({ slide, step }) {
  if (slide.kind === 'opening') return <OpeningSlide slide={slide} step={step} />
  if (slide.kind === 'journey' || slide.kind === 'joseph') return <StorySlide slide={slide} step={step} />
  if (slide.kind === 'exodus') return <ExodusSlide slide={slide} step={step} />
  if (slide.kind === 'evidence') return <EvidenceSlide slide={slide} step={step} />
  if (slide.kind === 'kingdoms') return <KingdomsSlide slide={slide} step={step} />
  return <ArticleSlide slide={slide} step={step} />
}

export default function Slideshow() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [step, setStep] = useState(0)
  const [transitionPhase, setTransitionPhase] = useState('idle')
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const transitionTimerRef = useRef(null)
  const enterTimerRef = useRef(null)

  const slide = DECK[slideIndex]
  const stepCount = getStepCount(slide)
  const isLastMoment = slideIndex === DECK.length - 1 && step >= stepCount
  const timelineYear = slide.timelineYear ?? TIMELINE_END
  const timelinePosition = Math.max(0, Math.min(100,
    ((timelineYear - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100,
  ))

  const goToSlide = (nextIndex, nextStep = 0) => {
    if (transitionPhase !== 'idle') return
    const boundedIndex = Math.max(0, Math.min(DECK.length - 1, nextIndex))
    setTransitionPhase('out')
    clearTimeout(transitionTimerRef.current)
    clearTimeout(enterTimerRef.current)
    transitionTimerRef.current = setTimeout(() => {
      setSlideIndex(boundedIndex)
      setStep(nextStep)
      setTransitionPhase('in')
      enterTimerRef.current = setTimeout(() => setTransitionPhase('idle'), 40)
    }, 280)
  }

  const advance = () => {
    if (sourcesOpen || transitionPhase !== 'idle') return
    if (step < stepCount) {
      setStep((current) => current + 1)
      return
    }
    if (slideIndex < DECK.length - 1) {
      goToSlide(slideIndex + 1)
      return
    }
    goToSlide(0)
  }

  const goBack = () => {
    if (sourcesOpen || transitionPhase !== 'idle') return
    if (step > 0) {
      setStep((current) => current - 1)
      return
    }
    if (slideIndex > 0) {
      const previousIndex = slideIndex - 1
      goToSlide(previousIndex, getStepCount(DECK[previousIndex]))
    }
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      if (sourcesOpen) return
      const target = event.target
      const isInteractive = target instanceof HTMLElement && target.closest('button, a, input, textarea, select')
      if (isInteractive) return
      if (['ArrowRight', 'PageDown', 'Enter', ' '].includes(event.key)) {
        event.preventDefault()
        advance()
      }
      if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        goBack()
      }
      if (event.key === 'Home') {
        event.preventDefault()
        goToSlide(0)
      }
      if (event.key === 'End') {
        event.preventDefault()
        goToSlide(DECK.length - 1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  useEffect(() => () => {
    clearTimeout(transitionTimerRef.current)
    clearTimeout(enterTimerRef.current)
  }, [])

  const handleStageClick = (event) => {
    if (event.target.closest('button, a, [data-no-advance]')) return
    advance()
  }

  return (
    <div className={`slideshow-page slideshow-page--${slide.kind}`}>
      <header className="slideshow-chrome" data-no-advance>
        <Link className="slideshow-exit" to="/explore" aria-label="Exit story and return to Explore">
          <IoArrowBack aria-hidden />
          <span>Explore</span>
        </Link>
        <div className="slideshow-chapter-label">
          <span>{slide.chapter}</span>
          <strong>{slideIndex + 1} / {DECK.length}</strong>
        </div>
        <button
          type="button"
          className="slideshow-sources-btn"
          onClick={() => setSourcesOpen(true)}
        >
          Sources & image credits
        </button>
      </header>

      <div
        className="slideshow-timeline"
        role="img"
        aria-label={`Timeline position: ${slide.timelineLabel}`}
      >
        <span className="slideshow-timeline-start">2000 BCE</span>
        <div className="slideshow-timeline-track">
          <div className="slideshow-timeline-fill" style={{ width: `${timelinePosition}%` }} />
          <div className="slideshow-timeline-marker" style={{ left: `${timelinePosition}%` }}>
            <span className="slideshow-timeline-dot" />
          </div>
        </div>
        <span className="slideshow-timeline-end">Today</span>
        <p className="slideshow-timeline-date">{slide.timelineLabel}</p>
      </div>

      <main
        className={`slideshow-stage slideshow-stage--${slide.kind} slideshow-stage--${transitionPhase}`}
        onClick={handleStageClick}
        aria-live="polite"
        aria-label={`${slide.chapter}: ${slide.title}`}
      >
        <SlideContent key={slide.id} slide={slide} step={step} />
      </main>

      <footer className="slideshow-controls" data-no-advance>
        <button
          type="button"
          className="slideshow-nav-btn slideshow-nav-btn--back"
          onClick={goBack}
          disabled={slideIndex === 0 && step === 0}
          aria-label="Previous presentation moment"
        >
          <IoArrowBack aria-hidden />
          <span>Back</span>
        </button>
        <p className="slideshow-click-prompt" key={`${slide.id}-${step}`}>
          Click the stage or use the arrow keys
        </p>
        <button
          type="button"
          className="slideshow-nav-btn slideshow-nav-btn--next"
          onClick={advance}
        >
          <span>{isLastMoment ? 'Restart' : step < stepCount ? 'Continue' : 'Next'}</span>
          <IoArrowForward aria-hidden />
        </button>
      </footer>

      <SlideshowSourcesModal
        open={sourcesOpen}
        onClose={() => setSourcesOpen(false)}
        sources={ALL_SOURCES}
      />
    </div>
  )
}
