import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'whatsapp'
  size?: 'sm' | 'md'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, disabled, className = '', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-[8px]'

    const variants: Record<string, string> = {
      primary: 'bg-[#0F0F0F] text-white hover:bg-[#2a2a2a] border border-[#0F0F0F] dark:bg-white dark:text-[#0F0F0F] dark:hover:bg-[#e5e5e5] dark:border-white',
      ghost: 'bg-white text-[#0F0F0F] border border-[#E5E7EB] hover:bg-[#F9FAFB] dark:bg-[#111] dark:text-white dark:border-[#1F1F1F] dark:hover:bg-[#1a1a1a]',
      danger: 'bg-white text-red-600 border border-[#E5E7EB] hover:bg-red-50 dark:bg-[#111] dark:border-[#1F1F1F]',
      whatsapp: 'bg-[#25D366] text-white hover:bg-[#1db954] border border-[#25D366]',
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
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
