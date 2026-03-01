import { useEffect, useMemo, useState } from 'react'

export default function Admin() {
  const [activeDb, setActiveDb] = useState('submissions')
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [admin, setAdmin] = useState(null)
  const [entries, setEntries] = useState([])
  const [users, setUsers] = useState([])
  const [pageViews, setPageViews] = useState([])
  const [includeArchived, setIncludeArchived] = useState(false)
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
    const q = includeArchived ? '1' : '0'
    const res = await fetch(`/api/admin/contact-entries?limit=250&archived=${q}`, { credentials: 'include' })
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

  const refreshUsers = async () => {
    const res = await fetch('/api/admin/users?limit=500', { credentials: 'include' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data?.error || 'Failed to load users')
    setUsers(Array.isArray(data?.users) ? data.users : [])
  }

  const refreshPageViews = async () => {
    const res = await fetch('/api/admin/page-views?limit=250', { credentials: 'include' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data?.error || 'Failed to load page views')
    setPageViews(Array.isArray(data?.pageViews) ? data.pageViews : [])
  }

  useEffect(() => {
    refreshAdmin().catch(() => setAdmin(null))
  }, [])

  useEffect(() => {
    if (!admin) return
    if (activeDb === 'submissions') {
      refreshEntries().catch((err) => setError(err.message || 'Failed to load entries'))
      return
    }
    if (activeDb === 'users') {
      refreshUsers().catch((err) => setError(err.message || 'Failed to load users'))
      return
    }
    refreshPageViews().catch((err) => setError(err.message || 'Failed to load page views'))
  }, [admin, activeDb, includeArchived])

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
      await refreshUsers()
      await refreshPageViews()
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
    const archived = entries.filter((row) => !!row.archived_at).length
    const categoryCounts = entries.reduce((acc, row) => {
      const key = row?.category || 'other'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    return { total, answered, archived, categoryCounts }
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

  const setArchived = async (entryId, archived) => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/contact-entries/${entryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ archived }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to update archive state')
      await refreshEntries()
    } catch (err) {
      setError(err.message || 'Failed to update archive state')
    } finally {
      setBusy(false)
    }
  }

  const deleteSubmission = async (entryId) => {
    if (!window.confirm('Delete this submission permanently?')) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/contact-entries/${entryId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to delete submission')
      await refreshEntries()
    } catch (err) {
      setError(err.message || 'Failed to delete submission')
    } finally {
      setBusy(false)
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user account permanently?')) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to delete user')
      await refreshUsers()
      if (activeDb === 'submissions') await refreshEntries()
    } catch (err) {
      setError(err.message || 'Failed to delete user')
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
        <section className="admin-login-panel">
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">Secure access for site moderation and data management.</p>
          <form className="admin-login-form" onSubmit={onLogin}>
            <label htmlFor="admin-email">Admin email</label>
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
        </section>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">Signed in as {admin.email}</p>
        </div>
        <div className="admin-head-actions">
          <button
            type="button"
            className="ghost"
            onClick={() => {
              const refresher =
                activeDb === 'submissions'
                  ? refreshEntries
                  : activeDb === 'users'
                    ? refreshUsers
                    : refreshPageViews
              refresher().catch((err) => setError(err.message || 'Failed to refresh'))
            }}
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

      <div className="admin-db-tabs" role="tablist" aria-label="Admin databases">
        <button
          type="button"
          role="tab"
          aria-selected={activeDb === 'submissions'}
          className={activeDb === 'submissions' ? 'admin-db-tab admin-db-tab--active' : 'admin-db-tab'}
          onClick={() => setActiveDb('submissions')}
        >
          Submissions Database
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeDb === 'users'}
          className={activeDb === 'users' ? 'admin-db-tab admin-db-tab--active' : 'admin-db-tab'}
          onClick={() => setActiveDb('users')}
        >
          Users Database
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeDb === 'views'}
          className={activeDb === 'views' ? 'admin-db-tab admin-db-tab--active' : 'admin-db-tab'}
          onClick={() => setActiveDb('views')}
        >
          Page Views
        </button>
      </div>

      {activeDb === 'submissions' && (
        <>
          <section className="admin-stats">
            <p><strong>Total shown:</strong> {stats.total}</p>
            <p><strong>Answered:</strong> {stats.answered} / {stats.total}</p>
            <p><strong>Archived in list:</strong> {stats.archived}</p>
            <p>
              <strong>By category:</strong>{' '}
              {Object.entries(stats.categoryCounts).map(([k, v]) => `${k} (${v})`).join(', ') || 'none'}
            </p>
            <label className="admin-toggle">
              <input
                type="checkbox"
                checked={includeArchived}
                onChange={(e) => setIncludeArchived(e.target.checked)}
              />
              Include archived submissions
            </label>
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
                  <th>Actions</th>
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
                    <td className="admin-actions-cell">
                      <button
                        type="button"
                        className="ghost"
                        onClick={() => setArchived(row.id, !row.archived_at)}
                        disabled={busy}
                      >
                        {row.archived_at ? 'Unarchive' : 'Archive'}
                      </button>
                      <button
                        type="button"
                        className="ghost admin-danger"
                        onClick={() => deleteSubmission(row.id)}
                        disabled={busy}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={7}>No submissions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </>
      )}

      {activeDb === 'users' && (
        <section className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Joined</th>
                <th>Username</th>
                <th>Email</th>
                <th>Name</th>
                <th>Submissions</th>
                <th>Last submission</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleString() : '—'}</td>
                  <td>{u.username}</td>
                  <td>{u.email || '—'}</td>
                  <td>{[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}</td>
                  <td>{u.submissions_count || 0}</td>
                  <td>{u.last_submission_at ? new Date(u.last_submission_at).toLocaleString() : '—'}</td>
                  <td className="admin-actions-cell">
                    <button
                      type="button"
                      className="ghost admin-danger"
                      onClick={() => deleteUser(u.id)}
                      disabled={busy}
                    >
                      Delete user
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {activeDb === 'views' && (
        <section className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Overall views</th>
                <th>Registered-user views</th>
                <th>Guest views</th>
                <th>Last viewed</th>
              </tr>
            </thead>
            <tbody>
              {pageViews.map((row) => (
                <tr key={row.page_path}>
                  <td>{row.page_path}</td>
                  <td>{Number(row.total_views || 0).toLocaleString()}</td>
                  <td>{Number(row.registered_views || 0).toLocaleString()}</td>
                  <td>{Number(row.guest_views || 0).toLocaleString()}</td>
                  <td>{row.last_viewed_at ? new Date(row.last_viewed_at).toLocaleString() : '—'}</td>
                </tr>
              ))}
              {pageViews.length === 0 && (
                <tr>
                  <td colSpan={5}>No page views tracked yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}
