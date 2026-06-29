import { useNavigate } from 'react-router-dom'
import { IconChevronRight } from '@tabler/icons-react'
import type { Document } from '../../db/database'
import { StatusBadge } from '../ui/StatusBadge'
import { formatIDR } from '../../lib/currency'
import { formatDateShort } from '../../lib/dateUtils'

interface DocumentRowProps {
  doc: Document
}

export function DocumentRow({ doc }: DocumentRowProps) {
  const navigate = useNavigate()
  const path = doc.type === 'invoice' ? `/invoice/${doc.id}` : `/quote/${doc.id}`

  return (
    <div
      onClick={() => navigate(path)}
      className="grid grid-cols-[minmax(80px,auto)_1fr_auto_minmax(120px,auto)_24px] items-center gap-4 px-5 py-3.5 border-b border-[var(--color-border-light)] last:border-b-0 hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
    >
      <span className="font-mono text-xs text-[var(--color-text-muted)] tabular-nums shrink-0">
        {doc.number}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
          {doc.clientSnapshot.name}
        </p>
        {doc.clientSnapshot.company && (
          <p className="text-xs text-[var(--color-text-muted)] truncate">{doc.clientSnapshot.company}</p>
        )}
      </div>
      <StatusBadge status={doc.status} />
      <div className="text-right">
        <p className="text-sm font-medium tabular-nums text-[var(--color-text-primary)]">
          {formatIDR(doc.total)}
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)]">{formatDateShort(doc.issueDate)}</p>
      </div>
      <IconChevronRight size={14} className="text-[var(--color-text-muted)]" />
    </div>
  )
}
