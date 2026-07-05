import { type ReactNode, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/useAuthStore'
import { Spinner } from '../ui/Spinner'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, ready } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!ready) return
    if (!user) {
      navigate('/login', { replace: true, state: { from: location.pathname } })
    }
  }, [user, ready, navigate, location.pathname])

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--color-bg)]">
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-mono text-sm font-semibold text-[var(--color-text-primary)] tracking-tight"
        >
          InvoiceGua
        </motion.span>
        <Spinner size={14} className="text-[var(--color-text-muted)]" />
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
