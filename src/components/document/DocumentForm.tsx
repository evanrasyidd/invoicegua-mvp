import { useState, useCallback, useEffect, useRef } from 'react'
import type { Document, LineItem, Client } from '../../db/database'
import { ClientSelector } from '../client/ClientSelector'
import { LineItemTable } from './LineItemTable'
import { TotalsSection } from './TotalsSection'
import { calculateDocument } from '../../lib/calculations'
import { toISODate, addDays } from '../../lib/dateUtils'
import { useServiceTemplates } from '../../hooks/useServiceTemplates'
import { useSetting } from '../../hooks/useBusinessProfile'
import { Button } from '../ui/Button'

interface DocumentFormProps {
  type: 'invoice' | 'quote'
  initial?: Partial<Document>
  onSubmit: (data: Omit<Document, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel?: () => void
  onPreviewChange?: (doc: Partial<Document>) => void
  loading?: boolean
}

export function DocumentForm({
  type,
  initial,
  onSubmit,
  onCancel,
  onPreviewChange,
  loading,
}: DocumentFormProps) {
  const templates = useServiceTemplates()
  const defaultDueDaysRaw = useSetting('defaultDueDays')
  const defaultTaxRateRaw = useSetting('defaultTaxRate')
  const defaultPaymentTermsRaw = useSetting('defaultPaymentTerms')

  const defaultDueDays = parseInt(defaultDueDaysRaw ?? '3')
  const defaultTaxRate = parseInt(defaultTaxRateRaw ?? '0')
  const defaultPaymentTerms = defaultPaymentTermsRaw ?? ''

  const today = toISODate()

  const [clientId, setClientId] = useState<number | null>(initial?.clientId ?? null)
  const [clientSnapshot, setClientSnapshot] = useState(initial?.clientSnapshot ?? null)
  const [items, setItems] = useState<LineItem[]>(initial?.items ?? [])
  const [issueDate, setIssueDate] = useState(initial?.issueDate ?? today)
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? addDays(today, defaultDueDays))
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [paymentTerms, setPaymentTerms] = useState(initial?.paymentTerms ?? defaultPaymentTerms)
  const [discountType, setDiscountType] = useState<'percent' | 'fixed' | undefined>(initial?.discountType)
  const [discountValue, setDiscountValue] = useState(initial?.discountValue ?? 0)
  const [taxRate, setTaxRate] = useState(initial?.taxRate ?? defaultTaxRate)
  const [dpPercent, setDpPercent] = useState(initial?.dpPercent ?? 0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const calc = calculateDocument(items, discountType, discountValue, taxRate, dpPercent)

  // Stable ref for onPreviewChange to avoid stale closure
  const onPreviewChangeRef = useRef(onPreviewChange)
  useEffect(() => { onPreviewChangeRef.current = onPreviewChange }, [onPreviewChange])

  useEffect(() => {
    onPreviewChangeRef.current?.({
      type,
      number: initial?.number,
      clientSnapshot: clientSnapshot ?? undefined,
      items,
      issueDate,
      dueDate,
      subtotal: calc.subtotal,
      discountType,
      discountValue,
      discountAmount: calc.discountAmount,
      taxRate,
      taxAmount: calc.taxAmount,
      total: calc.total,
      dpPercent,
      dpAmount: calc.dpAmount,
      notes,
    })
  }, [
    type, clientSnapshot, items, issueDate, dueDate,
    discountType, discountValue, taxRate, dpPercent, notes,
    calc.subtotal, calc.discountAmount, calc.taxAmount, calc.total, calc.dpAmount,
    initial?.number,
  ])

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
  }, [])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!clientId) errs.client = 'Pilih klien terlebih dahulu'
    if (items.length === 0) errs.items = 'Tambahkan minimal satu item'
    return errs
  }

  const handleSubmit = async (status: 'draft' | 'sent') => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    if (!clientSnapshot || !clientId) return

    await onSubmit({
      type,
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
      status,
      issueDate,
      dueDate: dueDate || undefined,
      paidDate: undefined,
    })
  }

  const inputCls =
    'bg-[var(--color-bg)] border border-[var(--color-border)] text-sm rounded-[8px] px-[10px] py-[7px] w-full focus:outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]'

  return (
    <div className="space-y-5">
      <ClientSelector value={clientId} onChange={handleClientChange} error={errors.client} />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">Tanggal Terbit</label>
          <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className={inputCls} style={{ borderWidth: '0.5px' }} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">
            {type === 'invoice' ? 'Jatuh Tempo' : 'Berlaku Hingga'}
          </label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputCls} style={{ borderWidth: '0.5px' }} />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-2">Item / Layanan</label>
        <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)]" style={{ borderWidth: '0.5px' }}>
          <LineItemTable items={items} onChange={setItems} templates={templates} />
        </div>
        {errors.items && <span className="text-xs text-red-500 mt-1 block">{errors.items}</span>}
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
            className="bg-[var(--color-bg)] border border-[var(--color-border)] text-sm rounded-[8px] px-[10px] py-[7px] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] resize-none"
            style={{ borderWidth: '0.5px' }}
          />
        </div>
        {type === 'invoice' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">Syarat Pembayaran</label>
            <input
              type="text"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="Transfer dalam 3 hari kerja..."
              className={inputCls}
              style={{ borderWidth: '0.5px' }}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <Button onClick={() => handleSubmit('sent')} loading={loading} className="flex-1">
          {initial ? 'Simpan Perubahan' : type === 'invoice' ? 'Buat Invoice' : 'Buat Penawaran'}
        </Button>
        <Button variant="ghost" onClick={() => handleSubmit('draft')} loading={loading}>
          Simpan Draft
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>Batal</Button>
        )}
      </div>
    </div>
  )
}
