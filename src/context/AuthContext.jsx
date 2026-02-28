import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

async function jsonOrError(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error || 'Request failed')
  }
  return data
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const refreshMe = async () => {
    const res = await fetch('/api/auth/me', { credentials: 'include' })
    const data = await jsonOrError(res)
    setUser(data.user || null)
    return data.user || null
  }

  useEffect(() => {
    refreshMe().catch(() => setUser(null)).finally(() => setAuthLoading(false))
  }, [])

  const register = async ({ username, password }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    })
    const data = await jsonOrError(res)
    setUser(data.user || null)
    return data.user || null
  }

  const login = async ({ username, password }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ identifier: username, password }),
    })
    const data = await jsonOrError(res)
    setUser(data.user || null)
    return data.user || null
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
    setUser(null)
  }

  const updateProfile = async (payload) => {
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    const data = await jsonOrError(res)
    setUser(data.user || null)
    return data.user || null
  }

  const value = useMemo(() => ({
    user,
    authLoading,
    register,
    login,
    logout,
    refreshMe,
    updateProfile,
  }), [user, authLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
