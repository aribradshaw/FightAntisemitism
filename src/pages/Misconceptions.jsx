import { Link } from 'react-router-dom'
import { FaBook, FaExclamationTriangle } from 'react-icons/fa'
import { PiStarOfDavid } from 'react-icons/pi'

const ISRAEL_ICON_URL = 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Mandatory_Palestine_Silhouette_Template.svg'

const TOPICS = [
  { slug: 'israel', title: 'Israel', to: '/misconceptions/israel', imageUrl: ISRAEL_ICON_URL, summary: 'Myths about Israel’s founding, “colonialism,” and the conflict.' },
  { slug: 'talmud', title: 'The Talmud', to: '/talmud', Icon: FaBook, summary: 'Misquotes and false claims about what the Talmud says.' },
  { slug: 'jewish-race', title: 'The Jewish Race', Icon: PiStarOfDavid, summary: 'Facts about Jewish identity: ethnicity, religion, and race.' },
  { slug: 'conspiracy', title: 'Conspiracy Theories', to: '/conspiracies', Icon: FaExclamationTriangle, summary: 'Classic antisemitic conspiracy myths and why they’re false.' },
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
            <span className="misconceptions-card-icon">
              {t.imageUrl ? (
                <img src={t.imageUrl} alt="" className="misconceptions-card-icon-img" />
              ) : (
                <t.Icon aria-hidden />
              )}
            </span>
            <h3>{t.title}</h3>
            <p>{t.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
