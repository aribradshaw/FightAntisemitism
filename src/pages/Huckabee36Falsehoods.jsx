import { Link } from 'react-router-dom'
import {
  HUCKABEE_36_ORIGINAL_URL,
  HUCKABEE_36_INTRO,
  HUCKABEE_36_OUTRO,
  HUCKABEE_36_FALSEHOODS,
} from '../data/huckabee36Falsehoods'

export default function Huckabee36Falsehoods() {
  return (
    <article className="huckabee-36-falsehoods">
      <header className="huckabee-36-header">
        <p className="huckabee-36-back">
          <Link to="/agitators/tucker-carlson">← Tucker Carlson</Link>
        </p>
        <h1 className="huckabee-36-title">
          36 Falsehoods in One Huckabee Interview: Tucker Carlson Fact-Checked
        </h1>
        <p className="huckabee-36-original">
          <a
            href={HUCKABEE_36_ORIGINAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ghost"
          >
            Read original article on 𝕏 →
          </a>
        </p>
      </header>

      <section className="huckabee-36-intro" aria-label="Introduction">
        {HUCKABEE_36_INTRO.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </section>

      <ol className="huckabee-36-list" start={1}>
        {HUCKABEE_36_FALSEHOODS.map((item) => (
          <li key={item.number} className="huckabee-36-item" id={`falsehood-${item.number}`}>
            <h2 className="huckabee-36-item-title">
              <span className="huckabee-36-num">{item.number}.</span> {item.title}
            </h2>
            <p className="huckabee-36-item-body">{item.body}</p>
          </li>
        ))}
      </ol>

      <section className="huckabee-36-outro" aria-label="Additional falsehoods">
        <p>{HUCKABEE_36_OUTRO}</p>
      </section>

      <footer className="huckabee-36-footer">
        <a
          href={HUCKABEE_36_ORIGINAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="huckabee-36-cta ghost"
        >
          Original article on 𝕏
        </a>
      </footer>
    </article>
  )
}
