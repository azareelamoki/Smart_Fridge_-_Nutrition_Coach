import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, getStoredToken, setUnauthorizedHandler, storeToken } from '../services/api'
import type { Session } from '../types/User'
import { decodeJwtExp } from '../utils/format'
import { readJson, writeJson } from '../utils/storage'
import { AuthContext, type AuthContextValue } from './contexts'

const USERNAME_KEY = 'sf.username'

function restoreSession(): Session | null {
  const token = getStoredToken()
  const username = readJson<string | null>(USERNAME_KEY, null)
  if (!token || !username) return null
  const exp = decodeJwtExp(token)
  if (exp !== null && exp < Date.now()) {
    storeToken(null)
    return null
  }
  return { token, username }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(restoreSession)

  const logout = useCallback(() => {
    storeToken(null)
    writeJson(USERNAME_KEY, null)
    setSession(null)
  }, [])

  // Déconnexion automatique quand le serveur rejette le jeton ou qu'il expire.
  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  useEffect(() => {
    if (!session) return
    const exp = decodeJwtExp(session.token)
    if (exp === null) return
    const timer = window.setTimeout(logout, Math.max(0, exp - Date.now()))
    return () => window.clearTimeout(timer)
  }, [session, logout])

  const login = useCallback(async (username: string, password: string, remember: boolean) => {
    const { access_token } = await api.login(username, password)
    storeToken(access_token, remember)
    writeJson(USERNAME_KEY, username)
    setSession({ token: access_token, username })
  }, [])

  const register = useCallback(
    async (username: string, password: string) => {
      await api.register(username, password)
      await login(username, password, true)
    },
    [login],
  )

  const value = useMemo<AuthContextValue>(
    () => ({ session, login, register, logout }),
    [session, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
