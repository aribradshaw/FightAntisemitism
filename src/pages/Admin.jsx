import { useEffect, useMemo, useState } from 'react'

export default function Admin() {
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [admin, setAdmin] = useState(null)
  const [entries, setEntries] = useState([])
  const [draftAnswers, setDraftAnswers] = useState({})
  const [form, setForm] = useState({ email: 'aribradshawaz@gmail.com', password: '' })

  const refreshAdmin = async () => {
    setChecking(true)
    try {
      const res = await fetch('/api/admin/me', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      setAdmin(data?.admin || null)
    } finally {
      setChecking(false)
      setLoading(false)
    }
  }

  const refreshEntries = async () => {
    const res = await fetch('/api/admin/contact-entries?limit=250', { credentials: 'include' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data?.error || 'Failed to load entries')
    setEntries(Array.isArray(data?.entries) ? data.entries : [])
    setDraftAnswers((prev) => {
      const next = { ...prev }
      for (const row of Array.isArray(data?.entries) ? data.entries : []) {
        if (typeof next[row.id] !== 'string') next[row.id] = row.answer_text || ''
      }
      return next
    })
  }

  useEffect(() => {
    refreshAdmin().catch(() => setAdmin(null))
  }, [])

  useEffect(() => {
    if (!admin) return
    refreshEntries().catch((err) => setError(err.message || 'Failed to load entries'))
  }, [admin])

  const onLogin = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Login failed')
      setAdmin(data?.admin || null)
      setForm((prev) => ({ ...prev, password: '' }))
      await refreshEntries()
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  const onLogout = async () => {
    setBusy(true)
    setError('')
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
      setAdmin(null)
      setEntries([])
    } finally {
      setBusy(false)
    }
  }

  const stats = useMemo(() => {
    const total = entries.length
    const answered = entries.filter((row) => !!row.answered_at).length
    const categoryCounts = entries.reduce((acc, row) => {
      const key = row?.category || 'other'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    return { total, answered, categoryCounts }
  }, [entries])

  const saveAnswer = async (entryId) => {
    setBusy(true)
    setError('')
    try {
      const answerText = (draftAnswers[entryId] || '').trim()
      const res = await fetch(`/api/admin/contact-entries/${entryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ answer_text: answerText }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to save answer')
      await refreshEntries()
    } catch (err) {
      setError(err.message || 'Failed to save answer')
    } finally {
      setBusy(false)
    }
  }

  if (loading || checking) {
    return (
      <div className="admin-page">
        <h1>Admin Dashboard</h1>
        <p>Loading…</p>
      </div>
    )
  }

  if (!admin) {
    return (
      <div className="admin-page">
        <h1>Admin Dashboard</h1>
        <p>Log in with your admin email account.</p>
        <form className="admin-login-form" onSubmit={onLogin}>
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            autoComplete="username"
            required
          />
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            autoComplete="current-password"
            required
          />
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="primary" disabled={busy}>
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Signed in as {admin.email}</p>
        </div>
        <div className="admin-head-actions">
          <button
            type="button"
            className="ghost"
            onClick={() => refreshEntries().catch((err) => setError(err.message || 'Failed to load entries'))}
            disabled={busy}
          >
            Refresh
          </button>
          <button type="button" className="ghost" onClick={onLogout} disabled={busy}>
            Log out
          </button>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <section className="admin-stats">
        <p><strong>Total submissions:</strong> {stats.total}</p>
        <p><strong>Answered:</strong> {stats.answered} / {stats.total}</p>
        <p>
          <strong>By category:</strong>{' '}
          {Object.entries(stats.categoryCounts).map(([k, v]) => `${k} (${v})`).join(', ') || 'none'}
        </p>
      </section>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Name</th>
              <th>Email</th>
              <th>Category</th>
              <th>Question</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((row) => (
              <tr key={row.id}>
                <td>{row.created_at ? new Date(row.created_at).toLocaleString() : '—'}</td>
                <td>{row.name}</td>
                <td><a href={`mailto:${row.email}`}>{row.email}</a></td>
                <td>{row.category}</td>
                <td className="admin-question-cell">{row.question}</td>
                <td className="admin-answer-cell">
                  <p className={row.answered_at ? 'admin-answer-status answered' : 'admin-answer-status pending'}>
                    {row.answered_at ? `Answered ${new Date(row.answered_at).toLocaleString()}` : 'Pending'}
                  </p>
                  <textarea
                    value={draftAnswers[row.id] || ''}
                    onChange={(e) => setDraftAnswers((prev) => ({ ...prev, [row.id]: e.target.value }))}
                    rows={4}
                    placeholder="Write answer to show on user profile..."
                    disabled={busy}
                  />
                  <button type="button" className="ghost" onClick={() => saveAnswer(row.id)} disabled={busy}>
                    Save answer
                  </button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={6}>No submissions yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}
