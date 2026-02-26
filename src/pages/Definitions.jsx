import { Link } from 'react-router-dom'
import { DEFINITIONS } from '../data/definitions'

export default function Definitions() {
  return (
    <div className="definitions-page">
      <h1>Definitions</h1>
      <p className="definitions-intro">Clear definitions for terms you often hear—with context and sources.</p>
      <ul className="definitions-list">
        {DEFINITIONS.map((d) => (
          <li key={d.slug}>
            <Link to={`/definitions/${d.slug}`} className="definitions-card">
              <h3>{d.title}</h3>
              <p>{d.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
