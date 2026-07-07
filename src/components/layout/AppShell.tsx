import { type ReactNode, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Toast } from '../ui/Toast'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()

  // Reset scroll ke atas tiap ganti halaman — tanpa ini, pindah dari halaman
  // yang di-scroll jauh ke bawah bikin halaman baru nongol di posisi scroll
  // yang sama (kerasa aneh, gak kayak native app). window.scrollTo() gak
  // ngefek di sini karena scroll container-nya <main> ini, bukan window.
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar />
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto pb-[calc(64px+var(--safe-bottom))] md:pb-0"
      >
        {children}
      </main>
      <BottomNav />
      <Toast />
    </div>
  )
}
