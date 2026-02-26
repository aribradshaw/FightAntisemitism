import { Link } from 'react-router-dom'

const TOPICS = [
  { slug: 'israel', title: 'Israel', to: '/misconceptions/israel', summary: 'Myths about Israel’s founding, “colonialism,” and the conflict.' },
  { slug: 'talmud', title: 'The Talmud', to: '/talmud', summary: 'Misquotes and false claims about what the Talmud says.' },
  { slug: 'jewish-race', title: 'The Jewish Race', summary: 'Facts about Jewish identity: ethnicity, religion, and race.' },
  { slug: 'conspiracy', title: 'Conspiracy Theories', to: '/conspiracies', summary: 'Classic antisemitic conspiracy myths and why they’re false.' },
]

export default function Misconceptions() {
  return (
    <div className="misconceptions-page">
      <h1 className="hub-title">Misconceptions</h1>
      <p className="misconceptions-intro">
        Common myths about Jews, Israel, and antisemitism—and the facts.
      </p>
      <div className="misconceptions-grid">
        {TOPICS.map((t) => (
          <Link key={t.slug} to={t.to ?? `/misconceptions/${t.slug}`} className="misconceptions-card">
            <h3>{t.title}</h3>
            <p>{t.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
