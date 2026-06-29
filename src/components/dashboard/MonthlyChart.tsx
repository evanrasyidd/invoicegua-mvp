import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { formatIDRCompact } from '../../lib/currency'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

interface MonthlyChartProps {
  data: { label: string; total: number }[]
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
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
        ticks: {
          color: '#9CA3AF',
          font: { size: 11, family: 'Inter, sans-serif' },
        },
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
    <div style={{ height: 180 }}>
      <Bar data={chartData} options={options} />
    </div>
  )
}
