import { useNavigate } from 'react-router-dom'
import { IconFileInvoice, IconFileText, IconChevronRight } from '@tabler/icons-react'
import { useClientDocuments } from '../../hooks/useDocuments'
import { StatusBadge } from '../ui/StatusBadge'
import { formatIDR } from '../../lib/currency'
import { formatDateShort } from '../../lib/dateUtils'
import { Skeleton } from '../ui/Skeleton'

interface ClientDocumentHistoryProps {
  clientId: number
}

export function ClientDocumentHistory({ clientId }: ClientDocumentHistoryProps) {
  const docs = useClientDocuments(clientId)
  const navigate = useNavigate()

  if (!docs.length) {
    return (
      <p className="text-xs text-[var(--color-text-muted)] py-4 text-center">
        Belum ada dokumen untuk klien ini
      </p>
    )
  }

  const totalPaid = docs
    .filter((d) => d.status === 'paid')
    .reduce((s, d) => s + d.total, 0)

  const totalUnpaid = docs
    .filter((d) => d.status === 'sent' || d.status === 'overdue')
    .reduce((s, d) => s + d.total, 0)

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[var(--color-bg)] rounded-[8px] px-3 py-2">
          <p className="text-[10px] text-[var(--color-text-muted)]">Total lunas</p>
          <p className="text-sm font-semibold tabular-nums text-green-600">{formatIDR(totalPaid)}</p>
        </div>
        <div className="bg-[var(--color-bg)] rounded-[8px] px-3 py-2">
          <p className="text-[10px] text-[var(--color-text-muted)]">Belum lunas</p>
          <p className="text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">{formatIDR(totalUnpaid)}</p>
        </div>
      </div>

      {/* Doc list */}
      <div className="border border-[var(--color-border)] rounded-[8px] overflow-hidden" style={{ borderWidth: '0.5px' }}>
        {docs.map((doc) => (
          <button
            key={doc.id}
            onClick={() => navigate(doc.type === 'invoice' ? `/invoice/${doc.id}` : `/quote/${doc.id}`)}
            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--color-bg)] transition-colors border-b border-[var(--color-border-light)] last:border-b-0 cursor-pointer text-left"
          >
            {doc.type === 'invoice'
              ? <IconFileInvoice size={14} className="text-[var(--color-text-muted)] shrink-0" />
              : <IconFileText size={14} className="text-[var(--color-text-muted)] shrink-0" />
            }
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--color-text-primary)] font-mono">{doc.number}</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">{formatDateShort(doc.issueDate)}</p>
            </div>
            <StatusBadge status={doc.status} />
            <p className="text-xs font-medium tabular-nums text-[var(--color-text-primary)] ml-2">
              {formatIDR(doc.total)}
            </p>
            <IconChevronRight size={13} className="text-[var(--color-text-muted)] shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}

export function ClientDocumentHistorySkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
    </div>
  )
}
