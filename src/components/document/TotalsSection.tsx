import { CurrencyInput } from '../ui/CurrencyInput'
import { formatIDR } from '../../lib/currency'

interface TotalsSectionProps {
  subtotal: number
  discountType: 'percent' | 'fixed' | undefined
  discountValue: number
  discountAmount: number
  taxRate: number
  taxAmount: number
  total: number
  dpPercent: number
  dpAmount: number
  onDiscountTypeChange: (t: 'percent' | 'fixed' | undefined) => void
  onDiscountValueChange: (v: number) => void
  onTaxRateChange: (r: number) => void
  onDpPercentChange: (p: number) => void
}

export function TotalsSection({
  subtotal,
  discountType,
  discountValue,
  discountAmount,
  taxRate,
  taxAmount,
  total,
  dpPercent,
  dpAmount,
  onDiscountTypeChange,
  onDiscountValueChange,
  onTaxRateChange,
  onDpPercentChange,
}: TotalsSectionProps) {
  const row = (label: string, value: string, accent = false) => (
    <div className={`flex justify-between items-center py-1.5 ${accent ? 'border-t border-[var(--color-border)] mt-1 pt-3' : ''}`}>
      <span className={`text-sm ${accent ? 'font-semibold text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
        {label}
      </span>
      <span className={`tabular-nums text-sm ${accent ? 'font-semibold text-[var(--color-text-primary)]' : 'text-[var(--color-text-primary)]'}`}>
        {value}
      </span>
    </div>
  )

  return (
    <div className="space-y-3">
      {/* Discount toggle */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-[var(--color-text-secondary)] w-24 shrink-0">Diskon</label>
        <div className="flex rounded-[6px] border border-[var(--color-border)] overflow-hidden" style={{ borderWidth: '0.5px' }}>
          {(['none', 'percent', 'fixed'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onDiscountTypeChange(opt === 'none' ? undefined : opt)}
              className={`text-xs px-3 py-1.5 transition-colors cursor-pointer ${
                (opt === 'none' && !discountType) || opt === discountType
                  ? 'bg-[var(--color-primary)] text-[var(--color-surface)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]'
              }`}
            >
              {opt === 'none' ? 'Tidak' : opt === 'percent' ? 'Persen %' : 'Nominal'}
            </button>
          ))}
        </div>
        {discountType === 'percent' && (
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              max="100"
              value={discountValue}
              onChange={(e) => onDiscountValueChange(parseFloat(e.target.value) || 0)}
              className="w-16 bg-[var(--color-bg)] border border-[var(--color-border)] text-sm rounded-[6px] px-2 py-1.5 text-center focus:outline-none tabular-nums text-[var(--color-text-primary)]"
              style={{ borderWidth: '0.5px' }}
            />
            <span className="text-sm text-[var(--color-text-muted)]">%</span>
          </div>
        )}
        {discountType === 'fixed' && (
          <div className="flex-1 max-w-[180px]">
            <CurrencyInput value={discountValue} onChange={onDiscountValueChange} />
          </div>
        )}
      </div>

      {/* Tax */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-[var(--color-text-secondary)] w-24 shrink-0">PPN</label>
        <div className="flex rounded-[6px] border border-[var(--color-border)] overflow-hidden" style={{ borderWidth: '0.5px' }}>
          {[0, 11].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onTaxRateChange(r)}
              className={`text-xs px-3 py-1.5 transition-colors cursor-pointer ${
                taxRate === r
                  ? 'bg-[var(--color-primary)] text-[var(--color-surface)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]'
              }`}
            >
              {r === 0 ? 'Tidak' : `${r}%`}
            </button>
          ))}
        </div>
      </div>

      {/* DP */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-[var(--color-text-secondary)] w-24 shrink-0">Uang muka</label>
        <div className="flex rounded-[6px] border border-[var(--color-border)] overflow-hidden" style={{ borderWidth: '0.5px' }}>
          {[0, 30, 50].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onDpPercentChange(dpPercent === p ? 0 : p)}
              className={`text-xs px-3 py-1.5 transition-colors cursor-pointer ${
                dpPercent === p
                  ? 'bg-[var(--color-primary)] text-[var(--color-surface)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]'
              }`}
            >
              {p === 0 ? 'Tidak' : `${p}%`}
            </button>
          ))}
        </div>
        {dpPercent > 0 && (
          <span className="text-xs text-[var(--color-text-muted)]">= {formatIDR(dpAmount)}</span>
        )}
      </div>

      {/* Summary */}
      <div className="border-t border-[var(--color-border-light)] pt-3 mt-2">
        {row('Subtotal', formatIDR(subtotal))}
        {discountAmount > 0 && row(`Diskon${discountType === 'percent' ? ` ${discountValue}%` : ''}`, `−${formatIDR(discountAmount)}`)}
        {taxAmount > 0 && row(`PPN ${taxRate}%`, formatIDR(taxAmount))}
        {row('Total', formatIDR(total), true)}
        {dpAmount > 0 && (
          <>
            {row(`DP ${dpPercent}%`, formatIDR(dpAmount))}
            {row('Sisa pembayaran', formatIDR(total - dpAmount))}
          </>
        )}
      </div>
    </div>
  )
}
