import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, type TooltipItem } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { formatIDRCompact } from '../../lib/currency'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

interface TrendChartProps {
  paid: { label: string; total: number }[]
  unpaid: { label: string; total: number }[]
}

export function TrendLine({ paid, unpaid }: TrendChartProps) {
  const labels = paid.map((d) => d.label)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Lunas',
        data: paid.map((d) => d.total),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16,185,129,0.08)',
        fill: true,
        tension: 0.35,
        pointRadius: 2,
        borderWidth: 2,
      },
      {
        label: 'Menunggu',
        data: unpaid.map((d) => d.total),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245,158,11,0.08)',
        fill: true,
        tension: 0.35,
        pointRadius: 2,
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#9CA3AF', font: { size: 11 }, boxWidth: 10 } },
      tooltip: {
        backgroundColor: '#0F0F0F',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (ctx: TooltipItem<'line'>) =>
            ` ${ctx.dataset.label}: ${formatIDRCompact(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#9CA3AF', font: { size: 11 } },
      },
      y: {
        grid: { color: '#F3F4F6' },
        border: { display: false },
        ticks: {
          color: '#9CA3AF',
          font: { size: 10 },
          callback: (v: number | string) => formatIDRCompact(Number(v)),
        },
      },
    },
  }

  return (
    <div style={{ height: 180 }}>
      <Line data={chartData} options={options} />
    </div>
  )
}
