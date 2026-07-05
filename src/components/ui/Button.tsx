import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'whatsapp'
  size?: 'sm' | 'md'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, disabled, className = '', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-[8px]'

    // Pakai CSS variable (bukan hex hardcode) supaya otomatis kebalik warnanya
    // pas ganti tema, dan bg-nya sengaja beda dari --color-surface (warna Card)
    // supaya ghost/danger button ga nyatu sama container-nya di light maupun dark mode.
    const variants: Record<string, string> = {
      primary:
        'bg-[var(--color-primary)] text-[var(--color-surface)] border border-[var(--color-primary)] hover:opacity-85',
      ghost:
        'bg-[var(--color-bg)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)] hover:bg-[var(--color-border-light)]',
      danger:
        'bg-[var(--color-bg)] text-red-600 border border-[var(--color-border-strong)] hover:bg-red-50 dark:hover:bg-red-950/30',
      whatsapp:
        'bg-[#25D366] text-white border border-[#25D366] hover:bg-[#1db954]',
    }

    const sizes: Record<string, string> = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading ? <Spinner size={14} /> : null}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
