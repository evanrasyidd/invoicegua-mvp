import { IconTrendingUp, IconClock, IconCircleCheck, IconAlertTriangle } from '@tabler/icons-react'
import { Card } from '../ui/Card'
import { formatIDRCompact } from '../../lib/currency'
import { SkeletonCard } from '../ui/Skeleton'

interface StatCardsProps {
  totalThisMonth: number
  unpaidTotal: number
  unpaidCount: number
  paidTotal: number
  paidCount: number
  overdueCount: number
  loading?: boolean
}

export function StatCards({
  totalThisMonth,
  unpaidTotal,
  unpaidCount,
  paidTotal,
  paidCount,
  overdueCount,
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
    accent?: 'warning' | 'danger'
  }[] = [
    {
      label: 'Tagihan bulan ini',
      value: formatIDRCompact(totalThisMonth),
      icon: IconTrendingUp,
      sub: 'Invoice dikirim + lunas bulan ini',
    },
    {
      label: 'Menunggu bayar',
      value: formatIDRCompact(unpaidTotal),
      icon: IconClock,
      sub: `${unpaidCount} invoice belum lunas`,
      accent: unpaidCount > 0 ? 'warning' : undefined,
    },
    {
      label: 'Terlambat',
      value: String(overdueCount),
      icon: IconAlertTriangle,
      sub: overdueCount > 0 ? 'Perlu ditindaklanjuti' : 'Semua on time',
      accent: overdueCount > 0 ? 'danger' : undefined,
    },
    {
      label: 'Total lunas',
      value: formatIDRCompact(paidTotal),
      icon: IconCircleCheck,
      sub: `${paidCount} invoice terbayar`,
    },
  ]

  const accentStyles = {
    warning: { bg: 'bg-amber-50 dark:bg-amber-950/30', icon: 'text-amber-500' },
    danger: { bg: 'bg-red-50 dark:bg-red-950/30', icon: 'text-red-500' },
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ label, value, icon: Icon, sub, accent }) => {
        const style = accent ? accentStyles[accent] : null
        return (
          <Card key={label}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-[var(--color-text-muted)] font-medium leading-snug pr-2">{label}</span>
              <div className={`p-1.5 rounded-[6px] shrink-0 ${style ? style.bg : 'bg-[var(--color-bg)]'}`}>
                <Icon size={14} className={style ? style.icon : 'text-[var(--color-text-muted)]'} />
              </div>
            </div>
            <p className="text-xl font-semibold tabular-nums text-[var(--color-text-primary)] mb-0.5">
              {value}
            </p>
            <p className="text-[10px] text-[var(--color-text-muted)]">{sub}</p>
          </Card>
        )
      })}
    </div>
  )
}
