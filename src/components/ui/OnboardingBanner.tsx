import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconSettings, IconX, IconAlertCircle } from '@tabler/icons-react'
import { useBusinessProfile, useBankInfo } from '../../hooks/useBusinessProfile'
import { Button } from './Button'

export function OnboardingBanner() {
  const navigate = useNavigate()
  const business = useBusinessProfile()
  const bank = useBankInfo()
  const [dismissed, setDismissed] = useState(false)

  // Reset dismiss kalau profil masih kosong
  useEffect(() => {
    const stored = localStorage.getItem('onboarding_dismissed')
    if (stored) setDismissed(true)
  }, [])

  // Masih loading
  if (business === undefined) return null

  const profileEmpty = !business || !business.name.trim()
  const bankEmpty = !bank || !bank.bankName.trim() || !bank.accountNumber.trim()

  if ((!profileEmpty && !bankEmpty) || dismissed) return null

  const issues: string[] = []
  if (profileEmpty) issues.push('profil bisnis')
  if (bankEmpty) issues.push('info rekening')

  const handleDismiss = () => {
    localStorage.setItem('onboarding_dismissed', '1')
    setDismissed(true)
  }

  return (
    <div
      className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6"
      style={{ borderWidth: '0.5px' }}
      role="alert"
    >
      <IconAlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-amber-800">
          Lengkapi {issues.join(' dan ')} dulu
        </p>
        <p className="text-[10px] text-amber-600 mt-0.5">
          {profileEmpty && 'Nama bisnis diperlukan agar PDF terlihat profesional. '}
          {bankEmpty && 'Info rekening ditampilkan di PDF supaya klien bisa transfer.'}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" onClick={() => navigate('/settings')}>
          <IconSettings size={13} />
          Setelan
        </Button>
        <button
          onClick={handleDismiss}
          className="text-amber-400 hover:text-amber-600 cursor-pointer"
          aria-label="Tutup"
        >
          <IconX size={14} />
        </button>
      </div>
    </div>
  )
}
