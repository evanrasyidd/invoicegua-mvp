interface SpinnerProps {
  size?: number
  className?: string
}

// Dot-pulse, bukan ring-spin generic — 3 titik yang "napas" bergantian
// kerasa lebih hidup buat inline loading state (tombol, dsb).
export function Spinner({ size = 16, className = '' }: SpinnerProps) {
  const dotSize = Math.max(3, Math.round(size / 4.5))
  const gap = Math.max(2, Math.round(size / 8))

  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ height: size, gap }}
      role="status"
      aria-label="Memuat"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="rounded-full bg-current animate-dot-pulse shrink-0"
          style={{ width: dotSize, height: dotSize, animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}
