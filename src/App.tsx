import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AppShell } from './components/layout/AppShell'
import { AuthGuard } from './components/auth/AuthGuard'
import { LoginPage } from './components/auth/LoginPage'
import { Dashboard } from './pages/Dashboard'
import { InvoiceList } from './pages/InvoiceList'
import { InvoiceCreate } from './pages/InvoiceCreate'
import { InvoiceDetail } from './pages/InvoiceDetail'
import { QuoteList } from './pages/QuoteList'
import { QuoteCreate } from './pages/QuoteCreate'
import { QuoteDetail } from './pages/QuoteDetail'
import { Clients } from './pages/Clients'
import { Settings } from './pages/Settings'
import { useAuthStore } from './store/useAuthStore'
import { PWAUpdatePrompt } from './components/ui/PWAUpdatePrompt'
import { ConfirmDialog } from './components/ui/ConfirmDialog'

function ProtectedApp() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  return (
    <AuthGuard>
      <AppShell>
        {/* Page transition — biar pindah halaman kerasa kayak native app
            (slide+fade halus), bukan instant cut kayak web biasa.
            mode="wait" + key={pathname} supaya tiap ganti route dianggap
            elemen baru oleh AnimatePresence, trigger exit lama lalu enter baru. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/invoice" element={<InvoiceList />} />
              <Route path="/invoice/new" element={<InvoiceCreate />} />
              <Route path="/invoice/:id" element={<InvoiceDetail />} />
              <Route path="/quote" element={<QuoteList />} />
              <Route path="/quote/new" element={<QuoteCreate />} />
              <Route path="/quote/:id" element={<QuoteDetail />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-screen gap-3">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">Halaman tidak ditemukan</p>
                  <a href="/" className="text-xs text-[var(--color-text-muted)] underline">Kembali ke dashboard</a>
                </div>
              } />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </AppShell>
    </AuthGuard>
  )
}

export function App() {
  const { init } = useAuthStore()

  useEffect(() => {
    init()
  }, [init])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <PWAUpdatePrompt />
      <ConfirmDialog />
    </BrowserRouter>
  )
}
