import { useParams, Link } from 'react-router-dom'
import { AGITATORS } from '../data/agitators'

export default function AgitatorDetail() {
  const { slug } = useParams()
  const person = AGITATORS.find((a) => a.slug === slug)

  if (!person) {
    return (
      <div className="agitator-detail">
        <p>Not found.</p>
        <Link to="/agitators">Back to Agitators</Link>
      </div>
    )
  }

  return (
    <div className="agitator-detail">
      <Link to="/agitators" className="agitator-back">← Back to Agitators</Link>
      <div className="agitator-header">
        <div className="agitator-avatar">
          {person.image ? (
            <img src={person.image} alt="" />
          ) : (
            <span className="agitator-avatar-placeholder">{person.name.slice(0, 2)}</span>
          )}
        </div>
        <div>
          <h1>{person.name}</h1>
          <p className="agitator-subtitle">{person.subtitle}</p>
        </div>
      </div>
      <section className="agitator-description">
        <h2>Overview</h2>
        <p>{person.description}</p>
      </section>
      <section className="agitator-sources">
        <h2>Comments, actions &amp; sources</h2>
        <ul className="agitator-timeline">
          {person.sources.map((s, i) => (
            <li key={i}>
              <span className="agitator-date">{s.date}</span>
              <p>{s.text}</p>
              {s.url && s.url !== '#' && (
                <a href={s.url} target="_blank" rel="noopener noreferrer">Source</a>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
