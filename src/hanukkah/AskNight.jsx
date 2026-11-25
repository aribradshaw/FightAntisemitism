import { Link } from 'react-router-dom'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import ContactFAB from '../components/ContactFAB'
import { ASK_PROMPTS } from '../data/hanukkahNights.js'

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeGO3ssAAAAAKvcDYfhTPVFEKDjjNLhjiWq9apa'

export default function AskNight({ unlockedThrough, lightCandle, markDone, done }) {
  if (unlockedThrough < 7) {
    return (
      <div>
        <Link to="/hanukkah" className="hk-back">← Eight nights</Link>
        <div className="hk-panel"><p>Ask unlocks on Night 7.</p></div>
      </div>
    )
  }

  const prompt = ASK_PROMPTS[Math.min(unlockedThrough, ASK_PROMPTS.length) - 1] || ASK_PROMPTS[0]

  const complete = () => {
    markDone('ask', true)
    lightCandle(7)
  }

  return (
    <div>
      <Link to="/hanukkah" className="hk-back">← Eight nights</Link>
      <div className="hk-panel">
        <h2>Ask tonight’s question</h2>
        <p>{prompt}</p>
        <p className="hk-note">
          Accounts are for ages 13 and up. The birth-date screen is checked by the server and is not saved on your profile.
          Signed-in readers can follow question status from <Link to="/profile">Profile</Link>.
        </p>
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
          <ContactFAB inline triggerLabel="Open the question form" />
        </GoogleReCaptchaProvider>
        <div className="hk-actions" style={{ marginTop: '1.25rem' }}>
          <button type="button" className="primary" onClick={complete}>
            {done.ask ? 'Candle 7 lit' : 'I’ve sent a question — light candle 7'}
          </button>
        </div>
      </div>
    </div>
  )
}
