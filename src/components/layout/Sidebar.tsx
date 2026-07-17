import { NavLink, useNavigate } from 'react-router-dom'
import {
  IconLayoutDashboard,
  IconFileInvoice,
  IconFileText,
  IconUsers,
  IconSettings,
  IconRepeat,
  IconSun,
  IconMoon,
} from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'
import { UserMenu } from '../auth/UserMenu'

const NAV_ITEMS = [
  { to: '/', icon: IconLayoutDashboard, label: 'Dashboard' },
  { to: '/invoice', icon: IconFileInvoice, label: 'Invoice' },
  { to: '/quote', icon: IconFileText, label: 'Penawaran' },
  { to: '/recurring', icon: IconRepeat, label: 'Berulang' },
  { to: '/clients', icon: IconUsers, label: 'Klien' },
  { to: '/settings', icon: IconSettings, label: 'Setelan' },
]

export function Sidebar() {
  const { theme, toggleTheme } = useAppStore()
  const navigate = useNavigate()

  return (
    <aside
      className="hidden md:flex flex-col"
      style={{
        width: 160,
        minWidth: 160,
        background: 'var(--color-sidebar-bg)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        className="px-5 pt-5 pb-6 cursor-pointer"
        onClick={() => navigate('/')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
      >
        <span className="font-mono text-white text-sm font-semibold tracking-tight">
          InvoiceGua
        </span>
        <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-sidebar-text)' }}>
          EgaxDev Studios
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors duration-150 ${
                isActive ? 'text-white' : 'hover:text-white'
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? 'var(--color-sidebar-item-active)' : 'transparent',
              color: isActive ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text)',
            })}
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className="px-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-[6px] text-xs font-medium transition-colors duration-150 cursor-pointer hover:text-white"
          style={{ color: 'var(--color-sidebar-text)' }}
          aria-label="Toggle tema"
        >
          {theme === 'dark' ? <IconSun size={15} /> : <IconMoon size={15} />}
          {theme === 'dark' ? 'Terang' : 'Gelap'}
        </button>
      </div>

      {/* User menu */}
      <UserMenu />
    </aside>
  )
}
