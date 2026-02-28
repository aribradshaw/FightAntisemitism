import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-content">
        <h1 className="landing-title">
          About Jews &amp;
          <br />
          <span className="landing-title-line2">Addressing Modern Antisemitism</span>
        </h1>
        <p className="landing-subtitle">A fact-based guide to Jewish identity, history, and the modern myths, conspiracies, and propaganda used to spread antisemitism.</p>
        <Link to="/explore" className="landing-enter ghost">
          Enter
        </Link>
      </div>
    </div>
  )
}
