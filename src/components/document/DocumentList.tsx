import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconFileInvoice, IconFileText, IconPlus } from '@tabler/icons-react'
import { useDocuments } from '../../hooks/useDocuments'
import { DocumentRow } from './DocumentRow'
import { EmptyState } from '../ui/EmptyState'
import { SkeletonRow } from '../ui/Skeleton'
import { Button } from '../ui/Button'

interface DocumentListProps {
  type: 'invoice' | 'quote'
}

const STATUS_FILTERS = ['Semua', 'draft', 'sent', 'paid', 'overdue'] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

const STATUS_LABELS: Record<StatusFilter, string> = {
  Semua: 'Semua',
  draft: 'Draft',
  sent: 'Dikirim',
  paid: 'Lunas',
  overdue: 'Belum lunas',
}

export function DocumentList({ type }: DocumentListProps) {
  const docs = useDocuments(type)
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Semua')

  // useLiveQuery returns undefined while loading
  if (docs === undefined) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden" style={{ borderWidth: '0.5px' }}>
        {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
      </div>
    )
  }

  const filtered = statusFilter === 'Semua' ? docs : docs.filter((d) => d.status === statusFilter)

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex gap-1 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-[var(--color-primary)] text-[var(--color-surface)] border-[var(--color-primary)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-text-primary)]'
              }`}
              style={{ borderWidth: '0.5px' }}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          onClick={() => navigate(type === 'invoice' ? '/invoice/new' : '/quote/new')}
        >
          <IconPlus size={14} />
          {type === 'invoice' ? 'Invoice Baru' : 'Penawaran Baru'}
        </Button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden" style={{ borderWidth: '0.5px' }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={type === 'invoice' ? <IconFileInvoice size={32} /> : <IconFileText size={32} />}
            title={`Belum ada ${type === 'invoice' ? 'invoice' : 'penawaran'}`}
            description={`Buat ${type === 'invoice' ? 'invoice' : 'penawaran'} pertama untuk mulai mencatat transaksi`}
            action={{
              label: type === 'invoice' ? 'Buat Invoice' : 'Buat Penawaran',
              onClick: () => navigate(type === 'invoice' ? '/invoice/new' : '/quote/new'),
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-[minmax(80px,auto)_1fr_auto_minmax(120px,auto)_24px] items-center gap-4 px-5 py-2.5 bg-[var(--color-bg)] border-b border-[var(--color-border-light)]">
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Nomor</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Klien</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Status</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] text-right">Total</span>
              <span />
            </div>
            {filtered.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
