import { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { FaQuestionCircle } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

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

export default function ContactFAB({ visibilityClass = 'contact-fab--visible', inline = false, triggerLabel = 'Have More Questions?' }) {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { user, refreshMe } = useAuth()
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', question: '', category: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setMessage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    const { first_name, last_name, email, password, question, category } = form
    if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !question?.trim()) {
      setMessage({ type: 'error', text: 'Please fill in first name, last name, email, and question.' })
      return
    }
    if (!category) {
      setMessage({ type: 'error', text: 'Please select a category.' })
      return
    }
    if (!user && (!password || password.length < 8)) {
      setMessage({ type: 'error', text: 'Create a password (8+ chars) to create your account.' })
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
      } catch {
        // Retry once (Google sometimes returns 401 then succeeds on retry)
        recaptchaToken = await getTokenWithTimeout(executeRecaptcha)
      }
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), CONTACT_API_TIMEOUT_MS)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify({
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          email: email.trim(),
          question: question.trim(),
          category,
          password: user ? undefined : password,
          recaptchaToken,
        }),
      }).finally(() => clearTimeout(timeoutId))
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Something went wrong. Please try again.' })
        return
      }
      await refreshMe().catch(() => {})
      setMessage({ type: 'success', text: 'Thanks! Your question has been sent.' })
      setForm({ first_name: '', last_name: '', email: '', password: '', question: '', category: '' })
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
        className={`contact-fab ${inline ? 'contact-fab--inline-trigger primary' : 'contact-fab--ghost'} ${visibilityClass}`.trim()}
        onClick={() => setOpen(true)}
        aria-label="Have more questions? Open contact form"
      >
        <FaQuestionCircle className="contact-fab-icon" aria-hidden />
        <span>{triggerLabel}</span>
      </button>

      {open && (
        <div className="contact-fab-overlay" onClick={handleClose}>
          <div className="contact-fab-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="contact-form-title">
            <div className="contact-fab-modal-head">
              <h2 id="contact-form-title">Have More Questions?</h2>
              <button type="button" className="contact-fab-close" onClick={handleClose} aria-label="Close">×</button>
            </div>
            <form className="contact-fab-form" onSubmit={handleSubmit}>
              <div className="contact-fab-name-row">
                <div>
                  <label htmlFor="contact-first-name">First name *</label>
                  <input
                    id="contact-first-name"
                    name="first_name"
                    type="text"
                    required
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="First name"
                    autoComplete="given-name"
                    disabled={sending}
                  />
                </div>
                <div>
                  <label htmlFor="contact-last-name">Last name *</label>
                  <input
                    id="contact-last-name"
                    name="last_name"
                    type="text"
                    required
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Last name"
                    autoComplete="family-name"
                    disabled={sending}
                  />
                </div>
              </div>
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
              {!user && (
                <>
                  <label htmlFor="contact-password">Create password *</label>
                  <input
                    id="contact-password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    disabled={sending}
                  />
                </>
              )}
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
                rows={3}
                value={form.question}
                onChange={handleChange}
                placeholder="Your question…"
                disabled={sending}
              />
              {message && (
                <p className={`contact-fab-message contact-fab-message--${message.type}`}>{message.text}</p>
              )}
              <p className="contact-fab-account-notice">
                By submitting a question, you are creating an account on hashem.faith.
              </p>
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
