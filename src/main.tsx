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

initDB().then(() => {
  const container = document.getElementById('root')!
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
