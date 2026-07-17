import { NavLink } from 'react-router-dom'
import {
  IconLayoutDashboard,
  IconFileInvoice,
  IconFileText,
  IconUsers,
  IconSettings,
  IconRepeat,
} from '@tabler/icons-react'

const NAV_ITEMS = [
  { to: '/', icon: IconLayoutDashboard, label: 'Dashboard' },
  { to: '/invoice', icon: IconFileInvoice, label: 'Invoice' },
  { to: '/quote', icon: IconFileText, label: 'Penawaran' },
  { to: '/recurring', icon: IconRepeat, label: 'Berulang' },
  { to: '/clients', icon: IconUsers, label: 'Klien' },
  { to: '/settings', icon: IconSettings, label: 'Setelan' },
]

export function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex bg-[var(--color-surface)] border-t"
      style={{
        borderColor: 'var(--color-border)',
        borderWidth: '0.5px',
        paddingBottom: 'var(--safe-bottom)',
      }}
    >
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1.5 gap-0 text-[9px] font-medium transition-colors ${
              isActive
                ? 'text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-muted)]'
            }`
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
