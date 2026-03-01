import { useState, useEffect, useRef } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import DefinitionTerm from '../components/DefinitionTerm'
import WritingText, { WritingWord } from '../components/WritingText'
import SlideshowSourcesModal from '../components/SlideshowSourcesModal'
import { SLIDES, SLIDESHOW_SOURCES } from '../data/slideshowSlides'

const TIMELINE_START = -2000
const TIMELINE_END = new Date().getFullYear()
const TOTAL_SLIDES = 4 + SLIDES.length // intro, map, egypt, slavery, then content slides

const STAGGER_MS = 90

const FIRST_JEWS_LINES = [
  'Abraham was born Abram in the city of Ur.',
  'His story, catalogued in Genesis, leads him to eventually settle and die in Canaan.',
  'His son, Isaac, is the father of the Jewish people.',
  'His other son, Ishmael, is the father of the Arabic people.',
  'Abraham means Father of Nations.',
]

const EGYPT_LINES = [
  "Isaac's grandson, Joseph, was sold into slavery by his brothers.",
  'While in Egypt, he rose in status by interpreting dreams of the pharoah.',
  "When a famine hit the modern day land of Israel where Jacob's family lived, they came to Egypt for refuge.",
  'The Pharoah and Jacob secured them land for the next 400 years.',
]

function formatTimelineYear(year, approximate = false) {
  if (year < 0) {
    const num = (-year).toLocaleString()
    return approximate ? `~${num} BC` : `${num} BC`
  }
  return String(year)
}

export default function Slideshow() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [introStep, setIntroStep] = useState(0)
  const [mapPhase, setMapPhase] = useState(0)
  const [mapContentStep, setMapContentStep] = useState(0)
  const [egyptContentStep, setEgyptContentStep] = useState(0)
  const [slaveryContentStep, setSlaveryContentStep] = useState(0)
  const [promptVisible, setPromptVisible] = useState(false)
  const [transitioningToMap, setTransitioningToMap] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState(null)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const mapPhaseDoneRef = useRef(false)

  useEffect(() => {
    if (slideIndex !== 0) return
    const t = setTimeout(() => setPromptVisible(true), 2500)
    return () => clearTimeout(t)
  }, [slideIndex])

  useEffect(() => {
    if (!transitioningToMap) return
    setTransitionPhase('timeline')
  }, [transitioningToMap])
  useEffect(() => {
    if (transitionPhase !== 'timeline') return
    const t = setTimeout(() => setTransitionPhase('fade-out'), 800)
    return () => clearTimeout(t)
  }, [transitionPhase])
  useEffect(() => {
    if (transitionPhase !== 'fade-out') return
    const t = setTimeout(() => {
      setSlideIndex(1)
      setTransitioningToMap(false)
      setTransitionPhase(null)
    }, 700)
    return () => clearTimeout(t)
  }, [transitionPhase])

  useEffect(() => {
    if (slideIndex !== 1 || mapPhaseDoneRef.current) return
    mapPhaseDoneRef.current = true
    const t = setTimeout(() => setMapPhase(1), 1800)
    return () => clearTimeout(t)
  }, [slideIndex])

  useEffect(() => {
    if (!sourcesOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setSourcesOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sourcesOpen])

  const handleClick = (e) => {
    if (e?.target?.closest?.('.slideshow-sources-btn')) return
    if (slideIndex === 0) {
      if (introStep < 4) {
        setIntroStep((s) => s + 1)
        if (introStep === 3) setTransitioningToMap(true)
      }
      return
    }
    if (slideIndex === 1 && mapPhase === 1) {
      if (mapContentStep < FIRST_JEWS_LINES.length) {
        setMapContentStep((s) => s + 1)
        return
      }
      setSlideIndex(2)
      return
    }
    if (slideIndex === 2) {
      if (egyptContentStep < EGYPT_LINES.length) {
        setEgyptContentStep((s) => s + 1)
        return
      }
      setSlideIndex(3)
      return
    }
    if (slideIndex === 3) {
      setSlideIndex(4)
      return
    }
    if (slideIndex >= 1 && slideIndex < TOTAL_SLIDES - 1) {
      setSlideIndex((i) => i + 1)
    }
  }

  const canGoBack = slideIndex >= 1 || (slideIndex === 0 && introStep > 0) || transitioningToMap
  const handleBack = (e) => {
    e.stopPropagation()
    if (transitioningToMap) {
      setTransitioningToMap(false)
      setTransitionPhase(null)
      setIntroStep(2)
      return
    }
    if (slideIndex >= 1) {
      if (slideIndex === 1 && mapContentStep > 0) {
        setMapContentStep((s) => s - 1)
        return
      }
      if (slideIndex === 2 && egyptContentStep > 0) {
        setEgyptContentStep((s) => s - 1)
        return
      }
      setSlideIndex((i) => i - 1)
      if (slideIndex === 1) {
        setMapPhase(0)
        setMapContentStep(0)
        mapPhaseDoneRef.current = false
      }
      if (slideIndex === 2) setEgyptContentStep(0)
    } else if (slideIndex === 0 && introStep > 0) {
      setIntroStep((s) => s - 1)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  const showClickPrompt =
    slideIndex === 0 ? promptVisible
    : slideIndex === 1 ? mapPhase >= 1
    : true

  const firstJewsStartIndex = (() => {
    let n = 0
    return FIRST_JEWS_LINES.map((line) => {
      const start = n
      n += line.trim().split(/\s+/).length
      return start
    })
  })()
  const egyptLineStartIndex = (() => {
    let n = 0
    return EGYPT_LINES.map((line) => {
      const start = n
      n += line.trim().split(/\s+/).length
      return start
    })
  })()

  const showTimeline = slideIndex >= 1 || transitioningToMap
  const timelineYearForSlide =
    slideIndex === 1 ? -2000
    : slideIndex === 2 ? -1600
    : slideIndex === 3 ? -1250
    : SLIDES[slideIndex - 4]?.timelineYear ?? TIMELINE_END
  const timelineYear = showTimeline ? timelineYearForSlide : TIMELINE_END
  const timelinePosition =
    ((timelineYear - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100

  return (
    <div className="slideshow-page" onClick={handleClick} role="button" tabIndex={0} onKeyDown={handleKeyDown}>
      {canGoBack && (
        <button
          type="button"
          className="slideshow-back"
          onClick={handleBack}
          aria-label="Previous slide"
        >
          <IoArrowBack aria-hidden />
        </button>
      )}

      <button
        type="button"
        className="slideshow-sources-btn"
        onClick={(e) => { e.stopPropagation(); setSourcesOpen(true) }}
        aria-label="View sources"
      >
        Sources
      </button>

      {showTimeline && (
        <div className={`slideshow-timeline ${transitioningToMap ? 'slideshow-timeline--fade-in' : ''}`} aria-hidden="true">
          <div className="slideshow-timeline-bar" />
          <div className="slideshow-timeline-marker" style={{ left: `${timelinePosition}%` }}>
            <span className="slideshow-timeline-dot" />
            <span className="slideshow-timeline-date">
              {formatTimelineYear(timelineYear, timelineYear < 0)}
            </span>
          </div>
        </div>
      )}

      <div className={`slideshow-stage${slideIndex === 1 ? ' slideshow-stage--map' : ''}${(slideIndex === 2 || slideIndex === 3) ? ' slideshow-stage--panel-image' : ''}${slideIndex >= 4 ? ' slideshow-stage--content' : ''}`} role="region" aria-label="Presentation">
        {slideIndex === 0 && (
          <div className={`slideshow-slide slideshow-slide--intro${transitionPhase === 'fade-out' ? ' slideshow-slide--intro-out' : ''}`}>
            <div className={`slideshow-intro-image-slot${introStep >= 1 ? ' slideshow-intro-image-slot--visible' : ''}`}>
              <img
                src="/slideshow/abraham-angels.jpg"
                alt="Abraham and the Angels by Aert de Gelder"
                className="slideshow-intro-image"
              />
            </div>
            <p className="slideshow-intro-headline slideshow-fade-in">3,000 years ago...</p>
            <div className={`slideshow-intro-line-slot${introStep >= 1 ? ' slideshow-intro-line-slot--visible' : ''}`}>
              <p className="slideshow-intro-line">
                <WritingText staggerMs={90}>A man named Abraham roamed the Earth.</WritingText>
              </p>
            </div>
            <div className={`slideshow-intro-line-slot${introStep >= 2 ? ' slideshow-intro-line-slot--visible' : ''}`}>
              <p className="slideshow-intro-line">
                <WritingText staggerMs={90}>He lived and died in the land we today call</WritingText>
                {' '}
                <WritingWord index={10} staggerMs={90}><DefinitionTerm slug="israel">Israel</DefinitionTerm></WritingWord>
                <WritingText startIndex={11} staggerMs={90}>.</WritingText>
              </p>
            </div>
            <div className={`slideshow-intro-line-slot${introStep >= 3 ? ' slideshow-intro-line-slot--visible' : ''}`}>
              <p className="slideshow-intro-line">
                <WritingText staggerMs={90}>He was the first</WritingText>
                {' '}
                <WritingWord index={4} staggerMs={90}><DefinitionTerm slug="jew">Jew</DefinitionTerm></WritingWord>
                <WritingText startIndex={5} staggerMs={90}>.</WritingText>
              </p>
            </div>
          </div>
        )}

        {slideIndex === 1 && (
          <div className={`slideshow-slide slideshow-slide--map slideshow-map-phase-${mapPhase} slideshow-slide--map-in`}>
            <div className="slideshow-map-wrap">
              <img src="/slideshow/abraham-map.webp" alt="Map of the region" className="slideshow-map-img" />
            </div>
            <aside className="slideshow-sidebar">
              <h2 className="slideshow-sidebar-title">The First Jews</h2>
              {mapContentStep >= 1 && (
                <div className="slideshow-sidebar-body">
                  {FIRST_JEWS_LINES.slice(0, mapContentStep).map((line, i) => (
                    <p key={i} className="slideshow-sidebar-para">
                      <WritingText staggerMs={STAGGER_MS} startIndex={firstJewsStartIndex[i]}>
                        {line}
                      </WritingText>
                    </p>
                  ))}
                </div>
              )}
            </aside>
          </div>
        )}

        {slideIndex === 2 && (
          <div className="slideshow-slide slideshow-slide--panel-image slideshow-slide--panel-left slideshow-slide--map-in">
            <aside className="slideshow-sidebar slideshow-sidebar--left">
              <h2 className="slideshow-sidebar-title">How The Jews Got To Egypt According To The Bible</h2>
              <div className="slideshow-sidebar-body">
                {EGYPT_LINES.slice(0, egyptContentStep).map((line, i) => (
                  <p key={i} className="slideshow-sidebar-para">
                    <WritingText staggerMs={STAGGER_MS} startIndex={egyptLineStartIndex[i]}>
                      {line}
                    </WritingText>
                  </p>
                ))}
              </div>
            </aside>
            <div className="slideshow-panel-image-wrap">
              <img src="/slideshow/genesis-joseph.jpg" alt="Joseph and his brothers, Book of Genesis" className="slideshow-panel-img" />
            </div>
          </div>
        )}

        {slideIndex === 3 && (
          <div className="slideshow-slide slideshow-slide--panel-image slideshow-slide--panel-left slideshow-slide--map-in">
            <aside className="slideshow-sidebar slideshow-sidebar--left">
              <h2 className="slideshow-sidebar-title">Slavery and Exodus</h2>
              <div className="slideshow-sidebar-body">
                {/* Placeholder: photo and content to be added */}
              </div>
            </aside>
            <div className="slideshow-panel-image-wrap slideshow-panel-image-wrap--placeholder" aria-hidden="true">
              <div className="slideshow-panel-img-placeholder" />
            </div>
          </div>
        )}

        {slideIndex >= 4 && (() => {
          const slide = SLIDES[slideIndex - 4]
          let wordOffset = 0
          return (
            <div className="slideshow-slide slideshow-slide--content slideshow-slide--map-in">
              <h2 className="slideshow-content-title">{slide.title}</h2>
              <div className="slideshow-content-body">
                {slide.paragraphs.map((para, i) => {
                  const startIndex = wordOffset
                  wordOffset += para.trim().split(/\s+/).length
                  return (
                    <p key={i} className="slideshow-content-para">
                      <WritingText staggerMs={STAGGER_MS} startIndex={startIndex}>{para}</WritingText>
                    </p>
                  )
                })}
              </div>
            </div>
          )
        })()}
      </div>

      {showClickPrompt && (
        <p className="slideshow-click-prompt slideshow-fade-in-slow" aria-hidden="true">
          Click anywhere to proceed
        </p>
      )}

      <SlideshowSourcesModal
        open={sourcesOpen}
        onClose={() => setSourcesOpen(false)}
        sources={SLIDESHOW_SOURCES}
      />
    </div>
  )
}
