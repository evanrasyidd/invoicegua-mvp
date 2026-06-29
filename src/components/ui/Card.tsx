import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean
}

export function Card({ children, padding = true, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl ${padding ? 'p-5' : ''} ${className}`}
      style={{ borderWidth: '0.5px' }}
      {...props}
    >
      {children}
    </div>
  )
}
