import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-content">
        <h1 className="landing-title">About Jews</h1>
        <p className="landing-subtitle">Who Are They And Why Is Everyone Talking About Them?</p>
        <Link to="/explore" className="landing-enter ghost">
          Enter
        </Link>
      </div>
    </div>
  )
}
