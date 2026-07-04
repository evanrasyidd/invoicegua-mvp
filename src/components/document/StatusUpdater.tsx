import { useState } from 'react'
import { IconChevronDown } from '@tabler/icons-react'
import { updateDocumentStatus } from '../../hooks/useDocuments'
import { useAppStore } from '../../store/useAppStore'
import type { Document } from '../../db/database'
import { StatusBadge } from '../ui/StatusBadge'

interface StatusUpdaterProps {
  docId: number
  current: Document['status']
}

type Status = Document['status']

const STATUS_OPTIONS: { value: Status; label: string; desc: string }[] = [
  { value: 'draft',   label: 'Draft',     desc: 'Belum dikirim' },
  { value: 'sent',    label: 'Dikirim',   desc: 'Sudah dikirim ke klien' },
  { value: 'overdue', label: 'Terlambat', desc: 'Melewati jatuh tempo' },
  { value: 'paid',    label: 'Lunas',     desc: 'Pembayaran diterima' },
]

export function StatusUpdater({ docId, current }: StatusUpdaterProps) {
  const { showToast } = useAppStore()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSelect = async (status: Status) => {
    if (status === current) { setOpen(false); return }
    setLoading(true)
    try {
      await updateDocumentStatus(docId, status)
      showToast('Status diperbarui', 'success')
    } catch {
      showToast('Gagal memperbarui status', 'error')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        aria-label="Ubah status"
        aria-expanded={open}
      >
        <StatusBadge status={current} />
        <IconChevronDown
          size={12}
          className={`text-[var(--color-text-muted)] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full left-0 mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[8px] shadow-lg z-20 overflow-hidden min-w-[160px]"
            style={{ borderWidth: '0.5px' }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-3 py-2.5 transition-colors cursor-pointer hover:bg-[var(--color-bg)] ${
                  opt.value === current
                    ? 'bg-[var(--color-bg)]'
                    : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <StatusBadge status={opt.value} />
                  {opt.value === current && (
                    <span className="text-[9px] text-[var(--color-text-muted)]">aktif</span>
                  )}
                </div>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
