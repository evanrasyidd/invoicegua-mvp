import { useNavigate } from 'react-router-dom'
import { IconPlus } from '@tabler/icons-react'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { StatCards } from '../components/dashboard/StatCards'
import { MonthlyChart } from '../components/dashboard/MonthlyChart'
import { RecentDocuments } from '../components/dashboard/RecentDocuments'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function Dashboard() {
  const stats = useDashboardStats()
  const navigate = useNavigate()

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Dashboard</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Ringkasan keuangan bisnis kamu
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => navigate('/quote/new')}>
            <IconPlus size={13} />
            Penawaran
          </Button>
          <Button size="sm" onClick={() => navigate('/invoice/new')}>
            <IconPlus size={13} />
            Invoice
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <StatCards
        totalThisMonth={stats?.totalThisMonth ?? 0}
        unpaidTotal={stats?.unpaidTotal ?? 0}
        unpaidCount={stats?.unpaidCount ?? 0}
        paidTotal={stats?.paidTotal ?? 0}
        paidCount={stats?.paidCount ?? 0}
        draftCount={stats?.draftCount ?? 0}
        loading={!stats}
      />

      {/* Revenue chart + recent docs */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Revenue 6 bulan terakhir</p>
            <span className="text-[10px] text-[var(--color-text-muted)] bg-[var(--color-bg)] px-2 py-0.5 rounded">Lunas saja</span>
          </div>
          {stats ? (
            <MonthlyChart data={stats.monthlyData} />
          ) : (
            <div className="h-[180px] bg-[var(--color-bg)] rounded-lg animate-pulse" />
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Terbaru</p>
            <button
              onClick={() => navigate('/invoice')}
              className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            >
              Lihat semua
            </button>
          </div>
          <RecentDocuments docs={stats?.recent ?? []} />
        </Card>
      </div>
    </div>
  )
}
