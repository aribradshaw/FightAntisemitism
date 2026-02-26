import { Link } from 'react-router-dom'
import { AGITATORS } from '../data/agitators'

export default function Agitators() {
  return (
    <div className="agitators-page">
      <h1>Agitators</h1>
      <p className="agitators-intro">
        Public figures who have promoted antisemitic ideas, tropes, or conspiracy theories. Click for details and sources.
      </p>
      <ul className="agitators-list">
        {AGITATORS.map((a) => (
          <li key={a.slug}>
            <Link to={`/agitators/${a.slug}`} className="agitators-card">
              <div className="agitators-avatar">
                {a.image ? (
                  <img src={a.image} alt="" />
                ) : (
                  <span className="agitators-avatar-placeholder">{a.name.slice(0, 2)}</span>
                )}
              </div>
              <div className="agitators-info">
                <h3>{a.name}</h3>
                <p className="agitators-subtitle">{a.subtitle}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
