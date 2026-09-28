import { useContext } from 'react'
import { AuthContext, UserDataContext } from '../context/contexts'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>')
  return ctx
}

export function useUserData() {
  const ctx = useContext(UserDataContext)
  if (!ctx) throw new Error('useUserData doit être utilisé dans <UserDataProvider>')
  return ctx
}
