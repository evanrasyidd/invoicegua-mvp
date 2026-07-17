import { useState, useCallback } from 'react'
import type { Client, LineItem, RecurringFrequency } from '../../db/database'
import { ClientSelector } from '../client/ClientSelector'
import { LineItemTable } from '../document/LineItemTable'
import { TotalsSection } from '../document/TotalsSection'
import { calculateDocument } from '../../lib/calculations'
import { toISODate, addDays } from '../../lib/dateUtils'
import { useServiceTemplates } from '../../hooks/useServiceTemplates'
import { Button } from '../ui/Button'
import type { RecurringFormInput } from '../../hooks/useRecurring'

interface RecurringFormProps {
  initial?: Partial<RecurringFormInput> & { id?: number }
  onSubmit: (data: RecurringFormInput) => Promise<void>
  loading?: boolean
}

const FREQ_OPTIONS: { value: RecurringFrequency; label: string }[] = [
  { value: 'weekly', label: 'Mingguan' },
  { value: 'monthly', label: 'Bulanan' },
  { value: 'quarterly', label: 'Triwulanan' },
]

export function RecurringForm({ initial, onSubmit, loading }: RecurringFormProps) {
  const templates = useServiceTemplates()

  const today = toISODate()
  const [clientId, setClientId] = useState<number | null>(initial?.clientId ?? null)
  const [clientSnapshot, setClientSnapshot] = useState(initial?.clientSnapshot ?? null)
  const [items, setItems] = useState<LineItem[]>(initial?.items ?? [])
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [paymentTerms, setPaymentTerms] = useState(initial?.paymentTerms ?? '')
  const [discountType, setDiscountType] = useState<'percent' | 'fixed' | undefined>(initial?.discountType)
  const [discountValue, setDiscountValue] = useState(initial?.discountValue ?? 0)
  const [taxRate, setTaxRate] = useState(initial?.taxRate ?? 0)
  const [dpPercent, setDpPercent] = useState(initial?.dpPercent ?? 0)
  const [frequency, setFrequency] = useState<RecurringFrequency>(initial?.frequency ?? 'monthly')
  const [nextRunDate, setNextRunDate] = useState(initial?.nextRunDate ?? addDays(today, 1))
  const [autoSend, setAutoSend] = useState(initial?.autoSend ?? false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [invalidItemIndexes, setInvalidItemIndexes] = useState<number[]>([])

  const calc = calculateDocument(items, discountType, discountValue, taxRate, dpPercent)

  const handleClientChange = useCallback((client: Client | null) => {
    if (!client) {
      setClientId(null)
      setClientSnapshot(null)
    } else {
      setClientId(client.id ?? null)
      setClientSnapshot({
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        address: client.address,
      })
    }
  }, [setClientId, setClientSnapshot])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!clientId) errs.client = 'Pilih klien terlebih dahulu'
    if (items.length === 0) errs.items = 'Tambahkan minimal satu item'
    const emptyIdx = items.map((i, idx) => (i.name.trim() === '' ? idx : -1)).filter((i) => i !== -1)
    if (emptyIdx.length > 0) {
      errs.itemNames = 'Semua item harus memiliki nama'
      setInvalidItemIndexes(emptyIdx)
    } else setInvalidItemIndexes([])
    if (!nextRunDate) errs.nextRunDate = 'Tentukan tanggal jalan pertama'
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    if (!clientSnapshot || !clientId) return
    await onSubmit({
      clientId,
      clientSnapshot,
      items,
      subtotal: calc.subtotal,
      discountType,
      discountValue: discountValue || undefined,
      discountAmount: calc.discountAmount,
      taxRate: taxRate || undefined,
      taxAmount: calc.taxAmount,
      total: calc.total,
      dpPercent: dpPercent || undefined,
      dpAmount: calc.dpAmount || undefined,
      notes: notes || undefined,
      paymentTerms: paymentTerms || undefined,
      frequency,
      nextRunDate,
      autoSend,
      active: true,
    })
  }

  const inputCls =
    'bg-[var(--color-bg)] border border-[var(--color-border)] text-sm rounded-[8px] px-[10px] py-[7px] w-full focus:outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]'

  return (
    <div className="space-y-5 pb-24 md:pb-0">
      <ClientSelector value={clientId} onChange={handleClientChange} error={errors.client} />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">Frekuensi</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
            className={inputCls}
            style={{ borderWidth: '0.5px' }}
          >
            {FREQ_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">Jalan pertama</label>
          <input
            type="date"
            value={nextRunDate}
            onChange={(e) => setNextRunDate(e.target.value)}
            className={inputCls}
            style={{ borderWidth: '0.5px' }}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={autoSend}
          onChange={(e) => setAutoSend(e.target.checked)}
          className="w-4 h-4 accent-[var(--color-primary)]"
        />
        <span className="text-xs text-[var(--color-text-secondary)]">
          Langsung kirim (status "Dikirim") saat dibuat otomatis
        </span>
      </label>

      <div>
        <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-2">
          Item / Layanan
        </label>
        <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)]" style={{ borderWidth: '0.5px' }}>
          <LineItemTable
            items={items}
            onChange={(next) => {
              setItems(next)
              if (errors.items || errors.itemNames) {
                setErrors((e) => { const n = { ...e }; delete n['items']; delete n['itemNames']; return n })
              }
              setInvalidItemIndexes([])
            }}
            templates={templates}
            invalidIndexes={invalidItemIndexes}
          />
        </div>
        {(errors.items || errors.itemNames) && (
          <span className="text-xs text-red-500 mt-1 block">{errors.items ?? errors.itemNames}</span>
        )}
      </div>

      <div className="border border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-surface)]" style={{ borderWidth: '0.5px' }}>
        <TotalsSection
          subtotal={calc.subtotal}
          discountType={discountType}
          discountValue={discountValue}
          discountAmount={calc.discountAmount}
          taxRate={taxRate}
          taxAmount={calc.taxAmount}
          total={calc.total}
          dpPercent={dpPercent}
          dpAmount={calc.dpAmount}
          onDiscountTypeChange={setDiscountType}
          onDiscountValueChange={setDiscountValue}
          onTaxRateChange={setTaxRate}
          onDpPercentChange={setDpPercent}
        />
      </div>

      <div className="grid gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">Catatan</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan yang akan muncul di PDF..."
            rows={2}
            className="bg-[var(--color-bg)] border border-[var(--color-border)] text-sm rounded-[8px] px-[10px] py-[7px] focus:outline-none focus:border-[var(--color-primary)] resize-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
            style={{ borderWidth: '0.5px' }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">Syarat Pembayaran</label>
          <input
            type="text"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            placeholder="Transfer dalam 14 hari kerja..."
            className={inputCls}
            style={{ borderWidth: '0.5px' }}
          />
        </div>
      </div>

      <div className="hidden md:flex gap-2 pt-1">
        <Button onClick={handleSubmit} loading={loading} className="flex-1">{initial ? 'Simpan Perubahan' : 'Buat Recurring'}</Button>
      </div>
      <div className="md:hidden fixed left-0 right-0 z-20 px-4 py-3 bg-[var(--color-surface)] border-t border-[var(--color-border)]" style={{ borderWidth: '0.5px', bottom: 'calc(64px + var(--safe-bottom))' }}>
        <Button onClick={handleSubmit} loading={loading} className="flex-1 w-full" size="sm">{initial ? 'Simpan' : 'Buat Recurring'}</Button>
      </div>
    </div>
  )
}
