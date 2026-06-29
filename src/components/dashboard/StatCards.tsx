import { IconTrendingUp, IconClock, IconCircleCheck, IconFile } from '@tabler/icons-react'
import { Card } from '../ui/Card'
import { formatIDRCompact } from '../../lib/currency'
import { SkeletonCard } from '../ui/Skeleton'

interface StatCardsProps {
  totalThisMonth: number
  unpaidTotal: number
  unpaidCount: number
  paidTotal: number
  paidCount: number
  draftCount: number
  loading?: boolean
}

export function StatCards({
  totalThisMonth,
  unpaidTotal,
  unpaidCount,
  paidTotal,
  paidCount,
  draftCount,
  loading,
}: StatCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  const cards: {
    label: string
    value: string
    icon: typeof IconTrendingUp
    sub: string
    accent?: boolean
  }[] = [
    {
      label: 'Invoice bulan ini',
      value: formatIDRCompact(totalThisMonth),
      icon: IconTrendingUp,
      sub: 'Total nilai invoice diterbitkan',
    },
    {
      label: 'Belum lunas',
      value: formatIDRCompact(unpaidTotal),
      icon: IconClock,
      sub: `${unpaidCount} invoice menunggu pembayaran`,
      accent: unpaidCount > 0,
    },
    {
      label: 'Sudah lunas',
      value: formatIDRCompact(paidTotal),
      icon: IconCircleCheck,
      sub: `${paidCount} invoice terbayar`,
    },
    {
      label: 'Draft',
      value: String(draftCount),
      icon: IconFile,
      sub: 'Menunggu dikirim',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ label, value, icon: Icon, sub, accent }) => (
        <Card key={label}>
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-[var(--color-text-muted)] font-medium">{label}</span>
            <div className={`p-1.5 rounded-[6px] ${accent ? 'bg-red-50' : 'bg-[var(--color-bg)]'}`}>
              <Icon size={14} className={accent ? 'text-red-500' : 'text-[var(--color-text-muted)]'} />
            </div>
          </div>
          <p className="text-xl font-semibold tabular-nums text-[var(--color-text-primary)] mb-0.5">
            {value}
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)]">{sub}</p>
        </Card>
      ))}
    </div>
  )
}
