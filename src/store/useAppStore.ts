import { create } from 'zustand'

interface AppStore {
  theme: 'light' | 'dark'
  toast: { message: string; type: 'success' | 'error' | 'info' } | null
  toastTimer: ReturnType<typeof setTimeout> | null
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  toast: null,
  toastTimer: null,

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
    // Clear timeout sebelumnya biar toast berturut-turut gak saling potong
    const prev = get().toastTimer
    if (prev) clearTimeout(prev as Parameters<typeof clearTimeout>[0])
    set({ toast: { message, type } })
    const timer = setTimeout(() => {
      set({ toast: null, toastTimer: null })
    }, 3500)
    set({ toastTimer: timer })
  },

  clearToast: () => {
    const prev = get().toastTimer
    if (prev) clearTimeout(prev as Parameters<typeof clearTimeout>[0])
    set({ toast: null, toastTimer: null })
  },
}))
