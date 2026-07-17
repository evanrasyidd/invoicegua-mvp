import { useNavigate } from 'react-router-dom'
import { IconPlus } from '@tabler/icons-react'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { useAuthStore } from '../store/useAuthStore'
import { StatCards } from '../components/dashboard/StatCards'
import { MonthlyChart } from '../components/dashboard/MonthlyChart'
import { StatusDonut } from '../components/dashboard/StatusDonut'
import { TrendLine } from '../components/dashboard/TrendLine'
import { RecentDocuments } from '../components/dashboard/RecentDocuments'
import { OnboardingBanner } from '../components/ui/OnboardingBanner'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function Dashboard() {
  const stats = useDashboardStats()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 11) return 'Selamat pagi'
    if (hour < 15) return 'Selamat siang'
    if (hour < 18) return 'Selamat sore'
    return 'Selamat malam'
  }

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto space-y-6">
      <OnboardingBanner />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {greeting()}{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Ini ringkasan bisnis kamu hari ini
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
        overdueCount={stats?.overdueCount ?? 0}
        loading={!stats}
      />

      {/* Overdue alert */}
      {(stats?.overdueCount ?? 0) > 0 && (
        <div
          className="flex items-center justify-between gap-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
          style={{ borderWidth: '0.5px' }}
          role="alert"
        >
          <div>
            <p className="text-xs font-medium text-red-700">
              {stats!.overdueCount} invoice melewati jatuh tempo
            </p>
            <p className="text-[10px] text-red-500 mt-0.5">
              Segera follow up ke klien yang bersangkutan
            </p>
          </div>
          <Button size="sm" variant="danger" onClick={() => navigate('/invoice')}>
            Lihat
          </Button>
        </div>
      )}

      {/* Revenue bar + status donut */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              Revenue 6 bulan terakhir
            </p>
          </div>
          {stats ? (
            <MonthlyChart paidData={stats.monthlyPaid} sentData={stats.monthlySent} />
          ) : (
            <div className="h-[180px] bg-[var(--color-bg)] rounded-lg animate-pulse" />
          )}
        </Card>

        <Card>
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-4">
            Komposisi Status
          </p>
          {stats ? (
            <StatusDonut data={stats.statusData} />
          ) : (
            <div className="h-[220px] bg-[var(--color-bg)] rounded-lg animate-pulse" />
          )}
        </Card>
      </div>

      {/* Trend line + recent docs */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        <Card>
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-4">
            Tren Lunas vs Menunggu
          </p>
          {stats ? (
            <TrendLine paid={stats.trendPaid} unpaid={stats.trendUnpaid} />
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
