import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface StatusDatum {
  label: string
  value: number
  color: string
}

interface StatusDonutProps {
  data: StatusDatum[]
}

export function StatusDonut({ data }: StatusDonutProps) {
  if (data.length === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center text-xs text-[var(--color-text-muted)]">
        Belum ada invoice
      </div>
    )
  }

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => d.color),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#9CA3AF', font: { size: 11 }, boxWidth: 10, padding: 12 },
      },
      tooltip: {
        backgroundColor: '#0F0F0F',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (ctx: { label?: string; parsed: number }) =>
            ` ${ctx.label}: ${ctx.parsed} invoice`,
        },
      },
    },
  }

  return (
    <div style={{ height: 220 }}>
      <Doughnut data={chartData} options={options} />
    </div>
  )
}
