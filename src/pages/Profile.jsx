import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CATEGORY_LABELS = {
  definitions: 'Definitions',
  agitators: 'Agitators',
  conspiracies: 'Conspiracy Theories',
  talmud: 'Talmud',
  misconceptions: 'Misconceptions',
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, authLoading, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [message, setMessage] = useState(null)
  const [summary, setSummary] = useState({ overall: { completed: 0, total: 0, percent: 0 }, byCategory: [] })
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [questionsError, setQuestionsError] = useState('')
  const [form, setForm] = useState({
    profile_image_url: '',
    first_name: '',
    last_name: '',
    zip_code: '',
  })

  useEffect(() => {
    if (!authLoading && !user) navigate('/explore')
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (!user) return
    setForm({
      profile_image_url: user.profile_image_url || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      zip_code: user.zip_code || '',
    })
  }, [user])

  useEffect(() => {
    if (!user) return
    setQuestionsLoading(true)
    setQuestionsError('')
    fetch('/api/my/questions', { credentials: 'include' })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.error || 'Failed to load questions.')
        return data
      })
      .then((data) => setQuestions(Array.isArray(data?.questions) ? data.questions : []))
      .catch((err) => setQuestionsError(err.message || 'Failed to load questions.'))
      .finally(() => setQuestionsLoading(false))
  }, [user])

  useEffect(() => {
    if (!user) return
    fetch('/api/progress/summary', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { overall: { completed: 0, total: 0, percent: 0 }, byCategory: [] }))
      .then((data) => setSummary({
        overall: data?.overall || { completed: 0, total: 0, percent: 0 },
        byCategory: Array.isArray(data?.byCategory) ? data.byCategory : [],
      }))
      .catch(() => {})
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setMessage(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      await updateProfile({
        profile_image_url: form.profile_image_url.trim(),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        zip_code: form.zip_code.trim(),
      })
      setMessage({ type: 'success', text: 'Profile updated.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' })
    } finally {
      setSaving(false)
    }
  }

  const initial = useMemo(() => {
    if (!user?.username) return '?'
    return user.username[0].toUpperCase()
  }, [user])

  if (authLoading) {
    return (
      <div className="profile-page">
        <p>Loading…</p>
      </div>
    )
  }

  if (!user) return null

  const overall = summary.overall || { completed: 0, total: 0, percent: 0 }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-tabs" role="tablist" aria-label="Profile sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'profile'}
          className={activeTab === 'profile' ? 'profile-tab profile-tab--active' : 'profile-tab'}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'questions'}
          className={activeTab === 'questions' ? 'profile-tab profile-tab--active' : 'profile-tab'}
          onClick={() => setActiveTab('questions')}
        >
          My Questions
        </button>
      </div>
      <div className="profile-header">
        <div className="profile-avatar-lg" aria-hidden>
          {form.profile_image_url ? (
            <img src={form.profile_image_url} alt="" />
          ) : (
            <span>{initial}</span>
          )}
        </div>
        <div>
          <p className="profile-username">@{user.username}</p>
          <p className="profile-created">{user.email || 'No account email set yet'}</p>
          <p className="profile-created">Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</p>
        </div>
      </div>

      {activeTab === 'profile' && (
        <>
          <form className="profile-form" onSubmit={handleSave}>
            <label htmlFor="profile-image-url">Profile image URL</label>
            <input id="profile-image-url" name="profile_image_url" value={form.profile_image_url} onChange={handleChange} placeholder="https://example.com/photo.jpg" />

            <div className="profile-name-row">
              <div>
                <label htmlFor="profile-first-name">First name</label>
                <input id="profile-first-name" name="first_name" value={form.first_name} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="profile-last-name">Last name</label>
                <input id="profile-last-name" name="last_name" value={form.last_name} onChange={handleChange} />
              </div>
            </div>

            <label htmlFor="profile-zip-code">ZIP code</label>
            <input id="profile-zip-code" name="zip_code" value={form.zip_code} onChange={handleChange} />

            {message && <p className={`profile-message profile-message--${message.type}`}>{message.text}</p>}

            <button type="submit" className="primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </form>

          <section className="profile-progress">
            <h2>Reading Progress</h2>
            <p className="profile-progress-meta">{overall.completed} of {overall.total} pages read</p>
            <div className="profile-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={overall.percent}>
              <span style={{ width: `${overall.percent}%` }} />
            </div>
            <p className="profile-progress-percent">{overall.percent}% complete</p>

            <button type="button" className="ghost profile-progress-toggle" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Hide category breakdown' : 'Show category breakdown'}
            </button>

            {expanded && (
              <ul className="profile-progress-categories">
                {(summary.byCategory || []).map((row) => (
                  <li key={row.category}>
                    <div className="profile-progress-category-head">
                      <strong>{CATEGORY_LABELS[row.category] || row.category}</strong>
                      <span>{row.completed}/{row.total} ({row.percent}%)</span>
                    </div>
                    <div className="profile-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={row.percent}>
                      <span style={{ width: `${row.percent}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {activeTab === 'questions' && (
        <section className="profile-questions">
          <h2>My Questions</h2>
          {questionsLoading && <p>Loading questions…</p>}
          {!questionsLoading && questionsError && <p className="profile-message profile-message--error">{questionsError}</p>}
          {!questionsLoading && !questionsError && questions.length === 0 && (
            <p>You have not submitted any questions yet.</p>
          )}
          {!questionsLoading && !questionsError && questions.length > 0 && (
            <ul className="profile-question-list">
              {questions.map((q) => (
                <li key={q.id} className="profile-question-item">
                  <div className="profile-question-head">
                    <strong>{q.category || 'other'}</strong>
                    <span>{q.created_at ? new Date(q.created_at).toLocaleString() : '—'}</span>
                  </div>
                  <p className="profile-question-body">{q.question}</p>
                  <p className={q.answered_at ? 'profile-question-status answered' : 'profile-question-status pending'}>
                    {q.answered_at ? `Answered ${new Date(q.answered_at).toLocaleString()}` : 'Pending answer'}
                  </p>
                  {q.answer_text && <p className="profile-question-answer">{q.answer_text}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
