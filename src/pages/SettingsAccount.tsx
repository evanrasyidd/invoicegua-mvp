import { useNavigate } from 'react-router-dom'
import { IconArrowLeft } from '@tabler/icons-react'
import { AccountSection } from '../components/auth/AccountSection'
import { Button } from '../components/ui/Button'

export function SettingsAccount() {
  const navigate = useNavigate()
  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="shrink-0">
          <IconArrowLeft size={15} />
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Akun</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Kelola password dan sesi login
          </p>
        </div>
      </div>
      <AccountSection />
    </div>
  )
}
