import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconFileInvoice, IconFileText, IconPlus,
  IconSearch, IconX, IconArrowUp, IconArrowDown,
} from '@tabler/icons-react'
import { useDocuments } from '../../hooks/useDocuments'
import { DocumentRow } from './DocumentRow'
import { EmptyState } from '../ui/EmptyState'
import { SkeletonRow } from '../ui/Skeleton'
import { Button } from '../ui/Button'
import { formatIDR } from '../../lib/currency'
import type { Document } from '../../db/database'

interface DocumentListProps {
  type: 'invoice' | 'quote'
}

const STATUS_FILTERS = ['Semua', 'draft', 'sent', 'paid', 'overdue'] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

const STATUS_LABELS: Record<StatusFilter, string> = {
  Semua: 'Semua', draft: 'Draft', sent: 'Dikirim', paid: 'Lunas', overdue: 'Terlambat',
}

type SortKey = 'date' | 'total' | 'client'
type SortDir = 'asc' | 'desc'

// Komponen kecil di LUAR DocumentList — tidak bikin hook order issue
function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <IconArrowDown size={10} className="text-[var(--color-text-muted)] opacity-30" />
  return dir === 'asc'
    ? <IconArrowUp size={10} className="text-[var(--color-text-primary)]" />
    : <IconArrowDown size={10} className="text-[var(--color-text-primary)]" />
}

function sortDocs(docs: Document[], key: SortKey, dir: SortDir): Document[] {
  return [...docs].sort((a, b) => {
    let cmp = 0
    if (key === 'date') cmp = new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
    if (key === 'total') cmp = a.total - b.total
    if (key === 'client') cmp = a.clientSnapshot.name.localeCompare(b.clientSnapshot.name, 'id')
    return dir === 'asc' ? cmp : -cmp
  })
}

export function DocumentList({ type }: DocumentListProps) {
  const rawDocs = useDocuments(type)
  const navigate = useNavigate()

  // Semua useState di atas, tidak ada early return sebelum ini
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Semua')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const filtered = useMemo(() => {
    const docs = rawDocs ?? []
    const base = docs.filter((d) => {
      const matchStatus = statusFilter === 'Semua' || d.status === statusFilter
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        d.number.toLowerCase().includes(q) ||
        d.clientSnapshot.name.toLowerCase().includes(q) ||
        (d.clientSnapshot.company ?? '').toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
    return sortDocs(base, sortKey, sortDir)
  }, [rawDocs, statusFilter, search, sortKey, sortDir])

  const filteredTotal = useMemo(
    () => filtered.reduce((sum, d) => sum + d.total, 0),
    [filtered],
  )

  // Early return SETELAH semua hooks
  if (rawDocs === undefined) {
    return (
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden"
        style={{ borderWidth: '0.5px' }}
      >
        {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
      </div>
    )
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const newPath = type === 'invoice' ? '/invoice/new' : '/quote/new'
  const label = type === 'invoice' ? 'invoice' : 'penawaran'

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <IconSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Cari nomor atau klien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs rounded-[8px] pl-8 pr-8 py-[7px] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
            style={{ borderWidth: '0.5px' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer"
              aria-label="Hapus pencarian"
            >
              <IconX size={12} />
            </button>
          )}
        </div>

        <div className="flex gap-1 flex-wrap flex-1">
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

        <Button size="sm" onClick={() => navigate(newPath)} className="shrink-0">
          <IconPlus size={14} />
          {type === 'invoice' ? 'Invoice Baru' : 'Penawaran Baru'}
        </Button>
      </div>

      {/* List */}
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden"
        style={{ borderWidth: '0.5px' }}
      >
        {filtered.length === 0 ? (
          search || statusFilter !== 'Semua' ? (
            <EmptyState
              icon={<IconSearch size={28} />}
              title="Tidak ditemukan"
              description={`Tidak ada ${label} yang cocok`}
              action={{
                label: 'Reset filter',
                onClick: () => { setSearch(''); setStatusFilter('Semua') },
              }}
            />
          ) : (
            <EmptyState
              icon={type === 'invoice' ? <IconFileInvoice size={32} /> : <IconFileText size={32} />}
              title={`Belum ada ${label}`}
              description={`Buat ${label} pertama untuk mulai mencatat transaksi`}
              action={{
                label: type === 'invoice' ? 'Buat Invoice' : 'Buat Penawaran',
                onClick: () => navigate(newPath),
              }}
            />
          )
        ) : (
          <>
            {/* Header */}
            <div className="grid grid-cols-[minmax(80px,auto)_1fr_auto_minmax(120px,auto)_24px] items-center gap-4 px-5 py-2.5 bg-[var(--color-bg)] border-b border-[var(--color-border-light)]">
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Nomor
              </span>
              <button
                onClick={() => handleSort('client')}
                className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer text-left"
              >
                Klien <SortIcon active={sortKey === 'client'} dir={sortDir} />
              </button>
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Status
              </span>
              <button
                onClick={() => handleSort('total')}
                className="flex items-center justify-end gap-1 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer w-full"
              >
                <SortIcon active={sortKey === 'total'} dir={sortDir} /> Total
              </button>
              <span />
            </div>

            {filtered.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-2.5 border-t border-[var(--color-border-light)] bg-[var(--color-bg)]">
              <span className="text-[10px] text-[var(--color-text-muted)]">
                {filtered.length} {label}
                {(search || statusFilter !== 'Semua') && ' (difilter)'}
              </span>
              {filtered.length > 1 && (
                <span className="text-[10px] font-medium text-[var(--color-text-primary)] tabular-nums">
                  Total: {formatIDR(filteredTotal)}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
