import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { formatIDRCompact } from '../../lib/currency'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend)

interface MonthlyChartProps {
  paidData: { label: string; total: number }[]
  sentData: { label: string; total: number }[]
}

type Mode = 'paid' | 'sent'

export function MonthlyChart({ paidData, sentData }: MonthlyChartProps) {
  const [mode, setMode] = useState<Mode>('paid')
  const data = mode === 'paid' ? paidData : sentData

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: mode === 'paid' ? 'Lunas' : 'Terkirim',
        data: data.map((d) => d.total),
        backgroundColor: '#0F0F0F',
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown }) => ` ${formatIDRCompact(ctx.raw as number)}`,
        },
        backgroundColor: '#0F0F0F',
        titleColor: 'rgba(255,255,255,0.6)',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
      },
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#9CA3AF', font: { size: 11, family: 'Inter, sans-serif' } },
      },
      y: {
        grid: { color: '#F3F4F6' },
        border: { display: false },
        ticks: {
          color: '#9CA3AF',
          font: { size: 10, family: 'Inter, sans-serif' },
          callback: (v: number | string) => formatIDRCompact(Number(v)),
        },
      },
    },
  }

  return (
    <div>
      <div className="flex items-center gap-1 mb-3">
        <button
          onClick={() => setMode('paid')}
          className={`text-[10px] px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
            mode === 'paid'
              ? 'bg-[var(--color-text-primary)] text-[var(--color-surface)]'
              : 'bg-[var(--color-bg)] text-[var(--color-text-muted)]'
          }`}
        >
          Lunas
        </button>
        <button
          onClick={() => setMode('sent')}
          className={`text-[10px] px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
            mode === 'sent'
              ? 'bg-[var(--color-text-primary)] text-[var(--color-surface)]'
              : 'bg-[var(--color-bg)] text-[var(--color-text-muted)]'
          }`}
        >
          Terkirim
        </button>
      </div>
      <div style={{ height: 180 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
