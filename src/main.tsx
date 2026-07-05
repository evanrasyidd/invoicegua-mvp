import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { App } from './App'
import { db } from './db/database'
import { DEFAULT_SERVICE_TEMPLATES, DEFAULT_SETTINGS } from './db/seeds'

async function initDB() {
  // Seed defaults only on first run (non-auth settings)
  const settingsCount = await db.settings
    .filter((s) => !s.key.startsWith('auth:'))
    .count()

  if (settingsCount === 0) {
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      await db.settings.put({ key, value })
    }
  }

  const templateCount = await db.serviceTemplates.count()
  if (templateCount === 0) {
    await db.serviceTemplates.bulkAdd(DEFAULT_SERVICE_TEMPLATES)
  }

  // Apply persisted theme
  const themeSetting = await db.settings.get('theme')
  const theme = themeSetting?.value ?? localStorage.getItem('theme') ?? 'light'
  document.documentElement.classList.toggle('dark', theme === 'dark')
  if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', theme)
  }
}

function mountApp() {
  const container = document.getElementById('root')!
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

  // React udah mount — fade-out splash screen statis dari index.html,
  // baru dihapus dari DOM setelah transisinya kelar.
  const splash = document.getElementById('splash')
  if (splash) {
    splash.classList.add('splash-hidden')
    setTimeout(() => splash.remove(), 300)
  }
}

initDB()
  .then(mountApp)
  .catch((err) => {
    // Jangan biarin splash nyangkut selamanya kalau IndexedDB gagal dibuka
    // (misal private browsing mode yang strict). Tetap coba mount app —
    // kemungkinan besar masih bisa jalan walau seed data gagal.
    console.error('initDB gagal:', err)
    mountApp()
  })
