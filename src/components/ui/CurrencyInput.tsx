import { useRef, type InputHTMLAttributes, type ChangeEvent } from 'react'
import { formatIDR, parseIDR } from '../../lib/currency'

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number
  onChange: (value: number) => void
  label?: string
  error?: string
}

export function CurrencyInput({ value, onChange, label, error, className = '', ...props }: CurrencyInputProps) {
  const ref = useRef<HTMLInputElement>(null)

  const displayValue = value === 0 ? '' : formatIDR(value).replace('Rp\u00a0', 'Rp ')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseIDR(e.target.value))
  }

  const handleFocus = () => {
    setTimeout(() => ref.current?.select(), 0)
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-[var(--color-text-secondary)]">{label}</label>
      )}
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder="Rp 0"
        className={`bg-[var(--color-bg)] border text-sm text-[var(--color-text-primary)] rounded-[8px] px-[10px] py-[7px] w-full focus:outline-none focus:border-[var(--color-primary)] transition-colors tabular-nums ${
          error ? 'border-red-400' : 'border-[var(--color-border)]'
        } ${className}`}
        style={{ borderWidth: '0.5px' }}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
