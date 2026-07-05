import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
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
  return (
    <AuthGuard>
      <AppShell>
        <Routes>
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
