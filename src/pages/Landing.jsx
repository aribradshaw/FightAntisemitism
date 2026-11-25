import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-content">
        <h1 className="landing-title">
          About Jews &amp;{' '}
          <span className="landing-title-line2">Addressing Modern Antisemitism</span>
        </h1>
        <p className="landing-subtitle">A fact-based guide to Jewish identity, history, and the modern myths, conspiracies, and propaganda used to spread antisemitism.</p>
        <Link to="/explore" className="landing-enter ghost">
          Enter
        </Link>
        <Link to="/hanukkah" className="landing-enter ghost" style={{ marginTop: '0.75rem' }}>
          Eight nights of Hanukkah
        </Link>
      </div>
    </div>
  )
}
