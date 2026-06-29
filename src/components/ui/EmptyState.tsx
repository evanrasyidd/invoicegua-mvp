import { type ReactNode } from 'react'
import { Button } from './Button'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-[var(--color-text-muted)] mb-4">{icon}</div>
      <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">{title}</p>
      <p className="text-xs text-[var(--color-text-muted)] mb-5 max-w-xs">{description}</p>
      {action && (
        <Button size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
