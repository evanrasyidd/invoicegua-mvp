import { useState } from 'react'
import { IconPlus, IconPencil, IconTrash, IconRepeat, IconClock } from '@tabler/icons-react'
import {
  useRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
  toggleRecurringActive,
  generateDueRecurring,
  type RecurringFormInput,
} from '../hooks/useRecurring'
import { RecurringForm } from '../components/recurring/RecurringForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { formatIDR } from '../lib/currency'
import { formatDateShort } from '../lib/dateUtils'
import { useAppStore } from '../store/useAppStore'
import { confirmDialog } from '../store/useConfirmStore'

const FREQ_LABEL: Record<string, string> = {
  weekly: 'Mingguan',
  monthly: 'Bulanan',
  quarterly: 'Triwulanan',
}

export function Recurring() {
  const { showToast } = useAppStore()
  const recurring = useRecurring()
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: RecurringFormInput) => {
    setLoading(true)
    try {
      if (editingId != null) {
        await updateRecurring(editingId, data)
        showToast('Recurring diperbarui', 'success')
      } else {
        await createRecurring(data)
        showToast('Recurring dibuat', 'success')
      }
      setAdding(false)
      setEditingId(null)
    } catch {
      showToast('Gagal menyimpan', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    const ok = await confirmDialog({
      title: `Hapus recurring "${name}"?`,
      description: 'Invoice yang sudah dibuat tidak akan terhapus.',
      variant: 'danger',
      confirmLabel: 'Hapus',
    })
    if (!ok) return
    await deleteRecurring(id)
    showToast('Recurring dihapus', 'info')
  }

  const handleToggle = async (id: number, active: boolean) => {
    await toggleRecurringActive(id, !active)
  }

  const handleRunNow = async () => {
    const n = await generateDueRecurring()
    showToast(n > 0 ? `${n} invoice dibuat` : 'Tidak ada yang jatuh tempo', n > 0 ? 'success' : 'info')
  }

  const editing = recurring?.find((r) => r.id === editingId) ?? null

  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Invoice Berulang</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Buat invoice otomatis tiap periode
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={handleRunNow}>Jalankan Sekarang</Button>
          <Button size="sm" onClick={() => setAdding(true)}>
            <IconPlus size={14} />
            Baru
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {!recurring ? (
          <div className="h-20 bg-[var(--color-bg)] rounded-xl animate-pulse" />
        ) : recurring.length === 0 ? (
          <EmptyState
            icon={<IconRepeat size={32} />}
            title="Belum ada invoice berulang"
            description="Buat template invoice yang dibuat otomatis tiap minggu/bulan/triwulan"
            action={{ label: 'Buat Recurring', onClick: () => setAdding(true) }}
          />
        ) : (
          recurring.map((r) => (
            <div
              key={r.id}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 flex items-center gap-4"
              style={{ borderWidth: '0.5px' }}
            >
              <div className="p-2 rounded-[8px] bg-[var(--color-bg)] shrink-0">
                <IconRepeat size={18} className="text-[var(--color-text-muted)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {r.clientSnapshot.name}
                  </p>
                  {!r.active && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)]">
                      Pause
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  {FREQ_LABEL[r.frequency]} · {formatIDR(r.total)}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-[var(--color-text-muted)]">
                  <IconClock size={11} />
                  Jalan berikutnya: {formatDateShort(r.nextRunDate)}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggle(r.id!, r.active)}
                  className={`text-[10px] px-2 py-1 rounded-full cursor-pointer ${
                    r.active
                      ? 'bg-green-50 text-green-600 dark:bg-green-950/30'
                      : 'bg-[var(--color-bg)] text-[var(--color-text-muted)]'
                  }`}
                >
                  {r.active ? 'Aktif' : 'Pause'}
                </button>
                <button
                  onClick={() => setEditingId(r.id!)}
                  className="p-1.5 rounded-[6px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] cursor-pointer"
                  aria-label="Edit"
                >
                  <IconPencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(r.id!, r.clientSnapshot.name)}
                  className="p-1.5 rounded-[6px] text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 cursor-pointer"
                  aria-label="Hapus"
                >
                  <IconTrash size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Buat Invoice Berulang">
        <RecurringForm onSubmit={handleSubmit} loading={loading} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditingId(null)} title="Edit Invoice Berulang">
        {editing && (
          <RecurringForm
            initial={{
              id: editing.id,
              clientId: editing.clientId,
              clientSnapshot: editing.clientSnapshot,
              items: editing.items,
              discountType: editing.discountType,
              discountValue: editing.discountValue,
              taxRate: editing.taxRate,
              dpPercent: editing.dpPercent,
              notes: editing.notes,
              paymentTerms: editing.paymentTerms,
              frequency: editing.frequency,
              nextRunDate: editing.nextRunDate,
              autoSend: editing.autoSend,
            }}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </Modal>
    </div>
  )
}
