import { useNavigate } from 'react-router-dom'
import type { Document } from '../../db/database'
import { StatusBadge } from '../ui/StatusBadge'
import { formatIDR } from '../../lib/currency'
import { formatDateShort } from '../../lib/dateUtils'
import { IconChevronRight } from '@tabler/icons-react'

interface RecentDocumentsProps {
  docs: Document[]
}

export function RecentDocuments({ docs }: RecentDocumentsProps) {
  const navigate = useNavigate()

  if (docs.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-[var(--color-text-muted)]">
        Belum ada dokumen
      </div>
    )
  }

  return (
    <div>
      {docs.map((doc) => (
        <div
          key={doc.id}
          onClick={() => navigate(doc.type === 'invoice' ? `/invoice/${doc.id}` : `/quote/${doc.id}`)}
          className="flex items-center justify-between gap-4 px-0 py-3 border-b border-[var(--color-border-light)] last:border-b-0 hover:opacity-70 transition-opacity cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono text-[10px] text-[var(--color-text-muted)] shrink-0 tabular-nums">
              {doc.number}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                {doc.clientSnapshot.name}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)]">{formatDateShort(doc.issueDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <StatusBadge status={doc.status} />
            <span className="text-sm font-medium tabular-nums">{formatIDR(doc.total)}</span>
            <IconChevronRight size={13} className="text-[var(--color-text-muted)]" />
          </div>
        </div>
      ))}
    </div>
  )
}
