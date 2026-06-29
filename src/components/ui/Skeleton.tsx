interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[var(--color-border)] rounded-md ${className}`}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 space-y-3" style={{ borderWidth: '0.5px' }}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-[var(--color-border-light)]">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-36 flex-1" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-4 w-24" />
    </div>
  )
}
