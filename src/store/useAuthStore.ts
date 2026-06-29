import { create } from 'zustand'
import { getSession, clearSession, type AuthUser } from '../lib/auth'

interface AuthStore {
  user: AuthUser | null
  ready: boolean
  setUser: (user: AuthUser | null) => void
  logout: () => void
  init: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  ready: false,

  init: () => {
    const session = getSession()
    set({ user: session, ready: true })
  },

  setUser: (user) => set({ user }),

  logout: () => {
    clearSession()
    set({ user: null })
  },
}))
