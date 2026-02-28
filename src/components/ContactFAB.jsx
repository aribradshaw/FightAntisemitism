import { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { FaQuestionCircle } from 'react-icons/fa'

const CATEGORIES = [
  { value: '', label: 'Select a category…' },
  { value: 'definitions', label: 'Definitions' },
  { value: 'agitators', label: 'Agitators' },
  { value: 'conspiracy-theories', label: 'Conspiracy Theories' },
  { value: 'talmud', label: 'Talmud' },
  { value: 'misconceptions-israel', label: 'Misconceptions (Israel)' },
  { value: 'misconceptions-jewish-identity', label: 'Misconceptions (Jewish Identity)' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'other', label: 'Other' },
]

const RECAPTCHA_TIMEOUT_MS = 20000
const CONTACT_API_TIMEOUT_MS = 15000

function getTokenWithTimeout(executeRecaptcha) {
  return Promise.race([
    executeRecaptcha('contact'),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('reCAPTCHA_TIMEOUT')), RECAPTCHA_TIMEOUT_MS)
    ),
  ])
}

export default function ContactFAB({ visibilityClass = 'contact-fab--visible' }) {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', question: '', category: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setMessage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    const { name, email, question, category } = form
    if (!name?.trim() || !email?.trim() || !question?.trim()) {
      setMessage({ type: 'error', text: 'Please fill in name, email, and question.' })
      return
    }
    if (!category) {
      setMessage({ type: 'error', text: 'Please select a category.' })
      return
    }
    if (!executeRecaptcha) {
      setMessage({ type: 'error', text: 'reCAPTCHA is still loading. Please try again in a moment.' })
      return
    }
    setSending(true)
    try {
      let recaptchaToken
      try {
        recaptchaToken = await getTokenWithTimeout(executeRecaptcha)
      } catch (firstErr) {
        // Retry once (Google sometimes returns 401 then succeeds on retry)
        recaptchaToken = await getTokenWithTimeout(executeRecaptcha)
      }
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), CONTACT_API_TIMEOUT_MS)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          question: question.trim(),
          category,
          recaptchaToken,
        }),
      }).finally(() => clearTimeout(timeoutId))
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Something went wrong. Please try again.' })
        return
      }
      setMessage({ type: 'success', text: 'Thanks! Your question has been sent.' })
      setForm({ name: '', email: '', question: '', category: '' })
      setTimeout(() => {
        setOpen(false)
        setMessage(null)
      }, 2000)
    } catch (err) {
      const isTimeout = err?.message === 'reCAPTCHA_TIMEOUT'
      const isApiTimeout = err?.name === 'AbortError'
      const isRecaptcha = err?.message?.includes('recaptcha') || err?.message?.includes('RECAPTCHA')
      setMessage({
        type: 'error',
        text: isApiTimeout
          ? 'Request timed out. Please try again.'
          : isTimeout || isRecaptcha
          ? 'Verification failed or timed out. Please try again.'
          : 'Failed to send. Please try again.',
      })
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    if (!sending) {
      setOpen(false)
      setMessage(null)
    }
  }

  return (
    <>
      <button
        type="button"
        className={`contact-fab contact-fab--ghost ${visibilityClass}`.trim()}
        onClick={() => setOpen(true)}
        aria-label="Have more questions? Open contact form"
      >
        <FaQuestionCircle className="contact-fab-icon" aria-hidden />
        <span>Have More Questions?</span>
      </button>

      {open && (
        <div className="contact-fab-overlay" onClick={handleClose}>
          <div className="contact-fab-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="contact-form-title">
            <div className="contact-fab-modal-head">
              <h2 id="contact-form-title">Have More Questions?</h2>
              <button type="button" className="contact-fab-close" onClick={handleClose} aria-label="Close">×</button>
            </div>
            <form className="contact-fab-form" onSubmit={handleSubmit}>
              <label htmlFor="contact-name">Name *</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                disabled={sending}
              />
              <label htmlFor="contact-email">Email *</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                autoComplete="email"
                disabled={sending}
              />
              <label htmlFor="contact-category">Category *</label>
              <select
                id="contact-category"
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                disabled={sending}
              >
                {CATEGORIES.map((opt) => (
                  <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <label htmlFor="contact-question">Question *</label>
              <textarea
                id="contact-question"
                name="question"
                required
                rows={4}
                value={form.question}
                onChange={handleChange}
                placeholder="Your question…"
                disabled={sending}
              />
              {message && (
                <p className={`contact-fab-message contact-fab-message--${message.type}`}>{message.text}</p>
              )}
              <button type="submit" className="contact-fab-submit primary" disabled={sending}>
                {sending ? 'Sending…' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
