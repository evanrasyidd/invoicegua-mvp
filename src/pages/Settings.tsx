import { useNavigate } from 'react-router-dom'
import { IconChevronRight, IconUser, IconBuildingStore, IconDatabase } from '@tabler/icons-react'
import { Card } from '../components/ui/Card'
import { useAuthStore } from '../store/useAuthStore'

interface MenuEntry {
  to: string
  icon: typeof IconUser
  title: string
  desc: string
  danger?: boolean
}

export function Settings() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const entries: MenuEntry[] = [
    {
      to: '/settings/akun',
      icon: IconUser,
      title: 'Akun',
      desc: user ? `@${user.username} · ganti password & keluar` : 'Kelola akun',
    },
    {
      to: '/settings/bisnis',
      icon: IconBuildingStore,
      title: 'Bisnis',
      desc: 'Profil, info rekening, template layanan',
    },
    {
      to: '/settings/data',
      icon: IconDatabase,
      title: 'Data',
      desc: 'Backup, restore, zona bahaya',
      danger: true,
    },
  ]

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Setelan</h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Kelola akun, bisnis, dan data kamu
        </p>
      </div>

      <div className="space-y-3">
        {entries.map(({ to, icon: Icon, title, desc, danger }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="w-full text-left cursor-pointer group"
            aria-label={title}
          >
            <Card className="flex items-center gap-4 hover:border-[var(--color-primary)] transition-colors">
              <div
                className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 ${
                  danger ? 'bg-red-50 dark:bg-red-950/30' : 'bg-[var(--color-bg)]'
                }`}
              >
                <Icon size={18} className={danger ? 'text-red-500' : 'text-[var(--color-text-secondary)]'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${danger ? 'text-red-500' : 'text-[var(--color-text-primary)]'}`}>
                  {title}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{desc}</p>
              </div>
              <IconChevronRight
                size={16}
                className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors shrink-0"
              />
            </Card>
          </button>
        ))}
      </div>

      <div className="text-center pb-4">
        <p className="text-[10px] text-[var(--color-text-muted)]">
          InvoiceGua — dibuat oleh{' '}
          <a href="https://github.com/evanrasyidd" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-text-primary)] transition-colors">
            evanrasyidd
          </a>
        </p>
      </div>
    </div>
  )
}
