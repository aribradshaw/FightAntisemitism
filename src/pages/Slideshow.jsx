import { Link } from 'react-router-dom'

export default function Slideshow() {
  return (
    <div className="slideshow-page">
      <Link to="/explore" className="slideshow-back">← Back to Explore</Link>
      <div className="slideshow-stage" role="region" aria-label="Presentation">
        <div className="slideshow-slide slideshow-slide--title">
          <h1 className="slideshow-slide-title">Coming soon</h1>
        </div>
      </div>
    </div>
  )
}
