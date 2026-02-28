import { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { FaUserCircle } from 'react-icons/fa'
import { useTransitionState } from '../context/TransitionContext'
import { useAuth } from '../context/AuthContext'

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
  const { user, authLoading, login, register, logout } = useAuth()
  const [enterActive, setEnterActive] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState(null) // "login" | "register" | null
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authForm, setAuthForm] = useState({ username: '', password: '' })
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
          ) : (
            <FaUserCircle aria-hidden />
          )}
        </button>
        {menuOpen && (
          <div className="layout-profile-menu" role="menu">
            {!authLoading && !user && (
              <>
                <button type="button" onClick={() => { setAuthModalMode('login'); setMenuOpen(false); setAuthError('') }}>Log in</button>
                <button type="button" onClick={() => { setAuthModalMode('register'); setMenuOpen(false); setAuthError('') }}>Register</button>
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
        <div className="layout-auth-overlay" onClick={() => (!authBusy ? setAuthModalMode(null) : null)}>
          <div className="layout-auth-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <h2 id="auth-title">{authModalMode === 'register' ? 'Create account' : 'Log in'}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setAuthBusy(true)
                setAuthError('')
                try {
                  const payload = { username: authForm.username.trim(), password: authForm.password }
                  if (authModalMode === 'register') await register(payload)
                  else await login(payload)
                  setAuthModalMode(null)
                  setAuthForm({ username: '', password: '' })
                } catch (err) {
                  setAuthError(err.message || 'Request failed.')
                } finally {
                  setAuthBusy(false)
                }
              }}
              className="layout-auth-form"
            >
              <label htmlFor="auth-username">Username</label>
              <input
                id="auth-username"
                name="username"
                value={authForm.username}
                onChange={(e) => setAuthForm((p) => ({ ...p, username: e.target.value }))}
                autoComplete="username"
                required
                minLength={3}
                maxLength={32}
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
                <button type="button" className="ghost" disabled={authBusy} onClick={() => setAuthModalMode(null)}>Cancel</button>
                <button type="submit" className="primary" disabled={authBusy}>
                  {authBusy ? 'Please wait…' : authModalMode === 'register' ? 'Register' : 'Log in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
