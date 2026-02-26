import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SLIDES = [
  { title: 'About Jews / Fight Antisemitism', subtitle: 'Ari Daniel Bradshaw', type: 'title' },
  { title: 'Explore', body: 'Timeline · Definitions · Agitators · Misconceptions (Israel, Talmud, Jewish race, Conspiracy Theories)', type: 'content' },
  { title: 'Timeline', body: 'Jewish and Israeli history from origins to the present.', type: 'content' },
  { title: 'Definitions', body: 'Jew, Talmud, Genocide, Antisemitism, Zionism—clearly defined.', type: 'content' },
  { title: 'Misconceptions', body: 'Myths about Israel, the Talmud, Jewish identity, and conspiracy theories—with facts and sources.', type: 'content' },
  { title: 'Thank you', subtitle: 'This site is for educational purposes.', type: 'title' },
]

export default function Slideshow() {
  const [index, setIndex] = useState(0)
  const slide = SLIDES[index]

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        setIndex((i) => (i + 1) % SLIDES.length)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)
      } else if (e.key === 'Escape') {
        setIndex(0)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="slideshow-page">
      <Link to="/explore" className="slideshow-back">← Back to Explore</Link>
      <div
        className="slideshow-stage"
        role="region"
        aria-label="Presentation"
        onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
      >
        <div className={`slideshow-slide slideshow-slide--${slide.type}`}>
          <h1 className="slideshow-slide-title">{slide.title}</h1>
          {slide.subtitle && <p className="slideshow-slide-subtitle">{slide.subtitle}</p>}
          {slide.body && <p className="slideshow-slide-body">{slide.body}</p>}
        </div>
      </div>
      <div className="slideshow-controls">
        <button
          type="button"
          className="slideshow-btn"
          onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length); }}
          aria-label="Previous slide"
        >
          Previous
        </button>
        <span className="slideshow-progress" aria-live="polite">
          {index + 1} / {SLIDES.length}
        </span>
        <button
          type="button"
          className="slideshow-btn"
          onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % SLIDES.length); }}
          aria-label="Next slide"
        >
          Next
        </button>
      </div>
    </div>
  )
}
