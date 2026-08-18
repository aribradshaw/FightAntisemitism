import { useEffect, useRef, useState } from 'react'
import { IoArrowBack, IoArrowForward } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import WritingText from '../components/WritingText'
import SlideshowSourcesModal from '../components/SlideshowSourcesModal'
import { SLIDES, SLIDESHOW_SOURCES } from '../data/slideshowSlides'
import { CHAPTER_ONE_SLIDES, CHAPTER_ONE_SOURCES } from '../data/slideshowChapterOne'
import { CHAPTER_TWO_SLIDES, CHAPTER_TWO_SOURCES } from '../data/slideshowChapterTwo'
import { CHAPTER_THREE_SLIDES, CHAPTER_THREE_SOURCES } from '../data/slideshowChapterThree'
import { CHAPTER_FOUR_SLIDES, CHAPTER_FOUR_SOURCES } from '../data/slideshowChapterFour'
import { CHAPTER_FIVE_SLIDES, CHAPTER_FIVE_SOURCES } from '../data/slideshowChapterFive'
import '../slideshow.css'

const TIMELINE_START = -2000
const TIMELINE_END = new Date().getFullYear()
const STAGGER_MS = 52

const DECK = [
  ...CHAPTER_ONE_SLIDES,
  ...CHAPTER_TWO_SLIDES,
  ...CHAPTER_THREE_SLIDES,
  ...CHAPTER_FOUR_SLIDES,
  ...CHAPTER_FIVE_SLIDES,
  ...SLIDES.map((slide, index) => ({
    ...slide,
    id: slide.id || `history-${index}`,
    kind: slide.kind || 'article',
    chapter: slide.chapter || 'A people across time',
    timelineLabel: slide.timelineLabel || formatTimelineYear(slide.timelineYear, slide.timelineYear < 0),
  })),
]

const ALL_SOURCES = [
  ...CHAPTER_ONE_SOURCES,
  ...CHAPTER_TWO_SOURCES,
  ...CHAPTER_THREE_SOURCES,
  ...CHAPTER_FOUR_SOURCES,
  ...CHAPTER_FIVE_SOURCES,
  ...SLIDESHOW_SOURCES,
]

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

function EmpireSlide({ slide, step }) {
  return (
    <article className="slideshow-empire">
      <SlideFigure slide={slide} className="slideshow-empire-figure" />
      <div className="slideshow-empire-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className="slideshow-empire-events" aria-label="Assyrian campaign milestones">
          {slide.events.map((event, index) => (
            <div className={step > index ? 'is-visible' : ''} key={`${event.year}-${event.label}`}>
              <strong>{event.year}</strong>
              <span>{event.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function RuptureSlide({ slide, step }) {
  return (
    <article className="slideshow-rupture">
      <div className="slideshow-rupture-year" aria-hidden>{slide.stat}</div>
      <div className="slideshow-rupture-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className="slideshow-rupture-consequences" aria-label="Consequences of the Babylonian conquest">
          {slide.consequences.map((consequence, index) => (
            <span className={step > index ? 'is-visible' : ''} key={consequence}>{consequence}</span>
          ))}
        </div>
      </div>
    </article>
  )
}

function ReturnSlide({ slide, step }) {
  return (
    <article className="slideshow-return">
      <div className="slideshow-return-object">
        <SlideFigure slide={slide} />
        <p className={`slideshow-artifact-note${step >= 2 ? ' is-visible' : ''}`}>
          The Cylinder does not name Judeans. Its restoration policy helps explain the world behind the biblical return accounts.
        </p>
      </div>
      <div className="slideshow-return-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className={`slideshow-return-branches${step >= 3 ? ' is-visible' : ''}`}>
          {slide.branches.map((branch) => (
            <div key={branch.name}>
              <strong>{branch.name}</strong>
              <span>{branch.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function ResistanceSlide({ slide, step }) {
  return (
    <article className="slideshow-resistance">
      <div className="slideshow-resistance-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className={`slideshow-era-track${step >= 2 ? ' is-visible' : ''}`} aria-label="Second Temple era political timeline">
          {slide.eras.map((era) => (
            <div key={era.year}>
              <strong>{era.year}</strong>
              <span>{era.label}</span>
            </div>
          ))}
        </div>
      </div>
      <SlideFigure slide={slide} className="slideshow-resistance-figure" />
    </article>
  )
}

function TransformationSlide({ slide, step }) {
  return (
    <article className="slideshow-transformation">
      <SlideFigure slide={slide} className="slideshow-transformation-figure" />
      <div className="slideshow-transformation-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className={`slideshow-shift-grid${step >= 3 ? ' is-visible' : ''}`}>
          {slide.shifts.map((shift) => (
            <div key={shift.from}>
              <span>{shift.from}</span>
              <IoArrowForward aria-hidden />
              <strong>{shift.to}</strong>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function DialogueSlide({ slide, step }) {
  return (
    <article className="slideshow-dialogue">
      <div className="slideshow-dialogue-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className={`slideshow-text-layers${step >= 3 ? ' is-visible' : ''}`} aria-label="Rabbinic text chronology">
          {slide.layers.map((layer) => (
            <div key={layer.name}>
              <span>{layer.date}</span>
              <strong>{layer.name}</strong>
            </div>
          ))}
        </div>
      </div>
      <SlideFigure slide={slide} className="slideshow-dialogue-figure" />
    </article>
  )
}

function IlluminationSlide({ slide, step }) {
  return (
    <article className="slideshow-illumination">
      <SlideFigure slide={slide} className="slideshow-illumination-figure" />
      <div className="slideshow-illumination-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className={`slideshow-field-grid${step >= 3 ? ' is-visible' : ''}`} aria-label="Fields of Sephardi cultural life">
          {slide.fields.map((field) => <span key={field}>{field}</span>)}
        </div>
      </div>
    </article>
  )
}

function CommunitiesSlide({ slide, step }) {
  return (
    <article className="slideshow-communities">
      <SlideFigure slide={slide} className="slideshow-communities-figure" />
      <div className="slideshow-communities-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className={`slideshow-city-network${step >= 2 ? ' is-visible' : ''}`} aria-label="ShUM city network">
          {slide.cities.map((city) => (
            <div key={city.name}>
              <strong>{city.name}</strong>
              <span>{city.role}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function DispersionSlide({ slide, step }) {
  return (
    <article className="slideshow-dispersion">
      <img className="slideshow-dispersion-image" src={slide.image} alt={slide.imageAlt} />
      <div className="slideshow-dispersion-wash" aria-hidden />
      <div className="slideshow-dispersion-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className={`slideshow-route-list${step >= 3 ? ' is-visible' : ''}`} aria-label="Major destinations of Sephardi refugees">
          <span className="slideshow-route-origin">Iberia</span>
          {slide.routes.map((route) => (
            <span key={route}><IoArrowForward aria-hidden />{route}</span>
          ))}
        </div>
      </div>
      <p className="slideshow-image-credit">{slide.imageCaption}</p>
    </article>
  )
}

function EmancipationSlide({ slide, step }) {
  return (
    <article className="slideshow-emancipation">
      <div className="slideshow-emancipation-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
      </div>
      <div className="slideshow-rights-panel" aria-label="Areas affected by Jewish emancipation">
        <div className="slideshow-rights-year">
          <span>France</span>
          <strong>1791</strong>
          <small>one early national milestone</small>
        </div>
        <div className={`slideshow-rights-grid${step >= 2 ? ' is-visible' : ''}`}>
          {slide.rights.map((right, index) => (
            <div style={{ '--right-index': index }} key={right.label}>
              <span>{right.label}</span>
              <strong>{right.status}</strong>
            </div>
          ))}
        </div>
        <p className={`slideshow-rights-caveat${step >= 3 ? ' is-visible' : ''}`}>
          Legal equality advanced by fits and starts. Social acceptance never automatically followed.
        </p>
      </div>
    </article>
  )
}

function MigrationSlide({ slide, step }) {
  return (
    <article className="slideshow-migration">
      <div className="slideshow-migration-visual">
        <SlideFigure slide={slide} className="slideshow-migration-figure" />
        <div className={`slideshow-migration-flow${step >= 2 ? ' is-visible' : ''}`} aria-label="Destinations of Jewish migrants from eastern Europe">
          <span className="slideshow-migration-origin">Eastern Europe</span>
          <div>
            {slide.destinations.map((destination) => (
              <span key={destination}><IoArrowForward aria-hidden />{destination}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="slideshow-migration-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
      </div>
    </article>
  )
}

function ResponsesSlide({ slide, step }) {
  return (
    <article className="slideshow-responses">
      <div className="slideshow-responses-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className={`slideshow-response-grid${step >= 2 ? ' is-visible' : ''}`} aria-label="Jewish responses to modern insecurity">
          {slide.responses.map((response) => (
            <div className={response.highlight && step >= 3 ? 'is-highlighted' : ''} key={response.name}>
              <strong>{response.name}</strong>
              <span>{response.detail}</span>
            </div>
          ))}
        </div>
      </div>
      <SlideFigure slide={slide} className="slideshow-responses-figure" />
    </article>
  )
}

function PersecutionSlide({ slide, step }) {
  return (
    <article className="slideshow-persecution">
      <SlideFigure slide={slide} className="slideshow-persecution-figure" />
      <div className="slideshow-persecution-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className={`slideshow-persecution-track${step >= 2 ? ' is-visible' : ''}`} aria-label="Escalation of Nazi persecution">
          {slide.events.map((event) => (
            <div key={event.year}>
              <strong>{event.year}</strong>
              <span>{event.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function ShoahSlide({ slide, step }) {
  return (
    <article className="slideshow-shoah">
      <img className="slideshow-shoah-image" src={slide.image} alt={slide.imageAlt} />
      <div className="slideshow-shoah-wash" aria-hidden />
      <div className="slideshow-shoah-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <div className={`slideshow-shoah-stat${step >= 1 ? ' is-visible' : ''}`}>
          <strong>{slide.stat}</strong>
          <span>Jews murdered</span>
        </div>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className={`slideshow-shoah-systems${step >= 2 ? ' is-visible' : ''}`} aria-label="Systems used in the Holocaust">
          {slide.systems.map((system) => <span key={system}>{system}</span>)}
        </div>
      </div>
      <p className="slideshow-image-credit">{slide.imageCaption}</p>
    </article>
  )
}

function StatehoodSlide({ slide, step }) {
  return (
    <article className="slideshow-statehood">
      <div className="slideshow-statehood-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <div className={`slideshow-declaration-principles${step >= 2 ? ' is-visible' : ''}`} aria-label="Principles in Israel’s Declaration of Independence">
          {slide.principles.map((principle) => (
            <div key={principle.name}>
              <strong>{principle.name}</strong>
              <span>{principle.detail}</span>
            </div>
          ))}
        </div>
      </div>
      <SlideFigure slide={slide} className="slideshow-statehood-figure" />
    </article>
  )
}

function LivingSlide({ slide, step }) {
  return (
    <article className="slideshow-living">
      <div className="slideshow-living-copy">
        <p className="slideshow-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.title}</h2>
        <RevealLines lines={slide.lines} visibleCount={step} />
        <p className={`slideshow-living-closing${step >= 3 ? ' is-visible' : ''}`}>{slide.closing}</p>
      </div>
      <div className="slideshow-population-panel">
        <div className={`slideshow-population-total${step >= 1 ? ' is-visible' : ''}`}>
          <strong>{slide.total}</strong>
          <span>{slide.totalLabel}</span>
        </div>
        <div className={`slideshow-population-bars${step >= 2 ? ' is-visible' : ''}`} aria-label="Estimated core Jewish population by location in 2024">
          {slide.populations.map((population) => (
            <div key={population.name}>
              <p><strong>{population.name}</strong><span>{population.value}</span></p>
              <div><span style={{ width: `${population.share}%` }} /></div>
              <small>{population.share}% of world Jewry</small>
            </div>
          ))}
        </div>
        <p className="slideshow-population-source">DellaPergola, World Jewish Population 2024</p>
      </div>
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
  if (slide.kind === 'empire') return <EmpireSlide slide={slide} step={step} />
  if (slide.kind === 'rupture') return <RuptureSlide slide={slide} step={step} />
  if (slide.kind === 'return') return <ReturnSlide slide={slide} step={step} />
  if (slide.kind === 'resistance') return <ResistanceSlide slide={slide} step={step} />
  if (slide.kind === 'transformation') return <TransformationSlide slide={slide} step={step} />
  if (slide.kind === 'dialogue') return <DialogueSlide slide={slide} step={step} />
  if (slide.kind === 'illumination') return <IlluminationSlide slide={slide} step={step} />
  if (slide.kind === 'communities') return <CommunitiesSlide slide={slide} step={step} />
  if (slide.kind === 'dispersion') return <DispersionSlide slide={slide} step={step} />
  if (slide.kind === 'emancipation') return <EmancipationSlide slide={slide} step={step} />
  if (slide.kind === 'migration') return <MigrationSlide slide={slide} step={step} />
  if (slide.kind === 'responses') return <ResponsesSlide slide={slide} step={step} />
  if (slide.kind === 'persecution') return <PersecutionSlide slide={slide} step={step} />
  if (slide.kind === 'shoah') return <ShoahSlide slide={slide} step={step} />
  if (slide.kind === 'statehood') return <StatehoodSlide slide={slide} step={step} />
  if (slide.kind === 'living') return <LivingSlide slide={slide} step={step} />
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
