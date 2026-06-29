import { create } from 'zustand'

interface AppStore {
  theme: 'light' | 'dark'
  toast: { message: string; type: 'success' | 'error' | 'info' } | null
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  toast: null,

  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    set({ theme })
  },

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    get().setTheme(next)
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type } })
    setTimeout(() => set({ toast: null }), 3500)
  },

  clearToast: () => set({ toast: null }),
}))
