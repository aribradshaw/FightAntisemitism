import { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { FaUserCircle } from 'react-icons/fa'
import { useTransitionState } from '../context/TransitionContext'
import { useAuth } from '../context/AuthContext'

function getInitials(user) {
  const first = (user?.first_name || '').trim()
  const last = (user?.last_name || '').trim()
  if (first || last) return `${first[0] || ''}${last[0] || ''}`.toUpperCase()

  const handle = (user?.username || user?.email || '').trim()
  if (!handle) return 'U'

  const base = handle.includes('@') ? handle.split('@')[0] : handle
  const cleaned = base.replace(/[^a-z0-9]+/gi, ' ').trim()
  if (!cleaned) return 'U'

  const parts = cleaned.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return cleaned.slice(0, 2).toUpperCase()
}

function getParentPath(pathname) {
  // Detail pages → list page
  if (/^\/definitions\/[^/]+$/.test(pathname)) return '/definitions'
  if (/^\/agitators\/[^/]+$/.test(pathname)) return '/agitators'
  if (/^\/misconceptions\/[^/]+\/[^/]+$/.test(pathname)) return pathname.replace(/\/[^/]+$/, '') // e.g. /misconceptions/israel/uss-liberty → /misconceptions/israel
  if (/^\/misconceptions\/[^/]+$/.test(pathname)) return '/misconceptions'
  if (/^\/conspiracies\/[^/]+$/.test(pathname)) return '/conspiracies'
  // List/top-level sections → hub
  if (/^\/(definitions|agitators|misconceptions|conspiracies|timeline|stylesheet)$/.test(pathname)) return '/explore'
  // Hub → landing
  if (pathname === '/explore') return '/'
  return '/explore'
}

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const isExplore = pathname === '/explore'
  const parentPath = getParentPath(pathname)
  const isAtTop = pathname === '/explore'
  const transitionState = useTransitionState()
  const { user, authLoading, login, register, getAgeScreen, submitAgeScreen, logout } = useAuth()
  const [enterActive, setEnterActive] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState(null) // "login" | "register" | null
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authForm, setAuthForm] = useState({ username: '', password: '' })
  // Sign-up starts with a neutral birth-date step; the server decides and remembers the result.
  const [ageStep, setAgeStep] = useState('checking') // "checking" | "date" | "form" | "blocked"
  const [birthDate, setBirthDate] = useState('')
  const [blockedMessage, setBlockedMessage] = useState('')
  const menuRef = useRef(null)

  useEffect(() => {
    if (transitionState === 'entering') {
      const id = requestAnimationFrame(() => setEnterActive(true))
      return () => cancelAnimationFrame(id)
    }
    setEnterActive(false)
  }, [transitionState])

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const transitionClass =
    transitionState === 'exiting'
      ? 'page-transition page-transition--exiting'
      : transitionState === 'entering'
        ? `page-transition page-transition--entering${enterActive ? ' page-transition--enter-active' : ''}`
        : 'page-transition'
  const profileInitials = getInitials(user)

  const openRegister = async () => {
    setAuthModalMode('register')
    setMenuOpen(false)
    setAuthError('')
    setBirthDate('')
    setAgeStep('checking')
    const status = await getAgeScreen().catch(() => 'unknown')
    setAgeStep(status === 'eligible' ? 'form' : status === 'blocked' ? 'blocked' : 'date')
  }

  const closeAuthModal = () => {
    setAuthModalMode(null)
    setBirthDate('')
  }

  const ageScreenStep = authModalMode === 'register' && ageStep !== 'form'

  return (
    <div className={`layout ${isExplore ? 'layout--explore' : ''}`}>
      <div className="layout-profile" ref={menuRef}>
        <button
          type="button"
          className="layout-profile-trigger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Profile and account menu"
          aria-expanded={menuOpen}
        >
          {user?.profile_image_url ? (
            <img src={user.profile_image_url} alt="" className="layout-profile-avatar" />
          ) : user ? (
            <span className="layout-profile-initials" aria-hidden>{profileInitials}</span>
          ) : (
            <FaUserCircle aria-hidden />
          )}
        </button>
        {menuOpen && (
          <div className="layout-profile-menu" role="menu">
            {!authLoading && !user && (
              <>
                <button type="button" onClick={() => { setAuthModalMode('login'); setMenuOpen(false); setAuthError('') }}>Log in</button>
                <button type="button" onClick={openRegister}>Register</button>
              </>
            )}
            {!authLoading && user && (
              <>
                <button type="button" onClick={() => { navigate('/profile'); setMenuOpen(false) }}>My profile</button>
                <button type="button" onClick={() => { logout(); setMenuOpen(false) }}>Log out</button>
              </>
            )}
          </div>
        )}
      </div>
      <button
        type="button"
        className="layout-back"
        onClick={() => navigate(parentPath)}
        aria-label={isAtTop ? 'Go to home' : 'Go back'}
      >
        <IoReturnUpBackOutline aria-hidden />
      </button>
      <main className="layout-main">
        <div className={transitionClass} aria-busy={transitionState !== 'idle'}>
          <Outlet />
        </div>
      </main>
      {authModalMode && (
        <div className="layout-auth-overlay" onClick={() => (!authBusy ? closeAuthModal() : null)}>
          <div className="layout-auth-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <h2 id="auth-title">{authModalMode === 'register' ? 'Create account' : 'Log in'}</h2>
            {ageScreenStep && ageStep === 'checking' && <p className="layout-auth-note">Please wait…</p>}
            {ageScreenStep && ageStep === 'blocked' && (
              <div className="layout-auth-form">
                <p className="layout-auth-note" role="status">{blockedMessage || "Sorry, we can't create an account for you right now."}</p>
                <div className="layout-auth-actions">
                  <button type="button" className="primary" onClick={closeAuthModal}>Close</button>
                </div>
              </div>
            )}
            {ageScreenStep && ageStep === 'date' && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setAuthBusy(true)
                  setAuthError('')
                  try {
                    const status = await submitAgeScreen(birthDate)
                    setBirthDate('')
                    if (status === 'eligible') setAgeStep('form')
                    else {
                      setBlockedMessage('')
                      setAgeStep('blocked')
                    }
                  } catch (err) {
                    setAuthError(err.message || 'Request failed.')
                  } finally {
                    setAuthBusy(false)
                  }
                }}
                className="layout-auth-form"
              >
                <label htmlFor="auth-birth-date">Date of birth</label>
                <input
                  id="auth-birth-date"
                  type="date"
                  name="birthDate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  autoComplete="off"
                  required
                />
                {authError && <p className="layout-auth-error">{authError}</p>}
                <div className="layout-auth-actions">
                  <button type="button" className="ghost" disabled={authBusy} onClick={closeAuthModal}>Cancel</button>
                  <button type="submit" className="primary" disabled={authBusy || !birthDate}>
                    {authBusy ? 'Please wait…' : 'Continue'}
                  </button>
                </div>
              </form>
            )}
            {!ageScreenStep && (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setAuthBusy(true)
                setAuthError('')
                try {
                  const payload = { username: authForm.username.trim(), password: authForm.password }
                  if (authModalMode === 'register') await register(payload)
                  else await login(payload)
                  closeAuthModal()
                  setAuthForm({ username: '', password: '' })
                } catch (err) {
                  // The server refuses sign-up without a current age screen (it lasts 30 minutes).
                  if (err.code === 'age_blocked') {
                    setBlockedMessage(err.message)
                    setAgeStep('blocked')
                  } else if (err.code === 'age_screen_required') {
                    setAgeStep('date')
                  } else {
                    setAuthError(err.message || 'Request failed.')
                  }
                } finally {
                  setAuthBusy(false)
                }
              }}
              className="layout-auth-form"
            >
              <label htmlFor="auth-username">Username or email</label>
              <input
                id="auth-username"
                name="username"
                value={authForm.username}
                onChange={(e) => setAuthForm((p) => ({ ...p, username: e.target.value }))}
                autoComplete="username"
                required
                minLength={3}
                maxLength={254}
              />
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                name="password"
                value={authForm.password}
                onChange={(e) => setAuthForm((p) => ({ ...p, password: e.target.value }))}
                autoComplete={authModalMode === 'register' ? 'new-password' : 'current-password'}
                required
                minLength={8}
              />
              {authError && <p className="layout-auth-error">{authError}</p>}
              <div className="layout-auth-actions">
                <button type="button" className="ghost" disabled={authBusy} onClick={closeAuthModal}>Cancel</button>
                <button type="submit" className="primary" disabled={authBusy}>
                  {authBusy ? 'Please wait…' : authModalMode === 'register' ? 'Register' : 'Log in'}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
