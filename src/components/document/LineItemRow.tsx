import { IconTrash, IconGripVertical } from '@tabler/icons-react'
import type { LineItem } from '../../db/database'
import { CurrencyInput } from '../ui/CurrencyInput'
import { calculateLineItem } from '../../lib/calculations'
import { formatIDR } from '../../lib/currency'

interface LineItemRowProps {
  item: LineItem
  index: number
  onChange: (index: number, item: LineItem) => void
  onRemove: (index: number) => void
  showNameError?: boolean
}

const UNITS = [
  'item', 'pcs', 'unit', 'buah',
  'jam', 'hari', 'minggu', 'bulan', 'tahun',
  'kg', 'gram', 'liter', 'meter', 'm²',
  'project', 'paket', 'kali', 'sesi', 'lembar',
]

export function LineItemRow({ item, index, onChange, onRemove, showNameError }: LineItemRowProps) {
  const update = (patch: Partial<LineItem>) => {
    const updated = { ...item, ...patch }
    if ('qty' in patch || 'price' in patch) {
      updated.subtotal = calculateLineItem(updated.qty, updated.price)
    }
    onChange(index, updated)
  }

  return (
    <div className={`group grid gap-2 p-3 border-b border-[var(--color-border-light)] last:border-b-0 hover:bg-[var(--color-bg)] transition-colors ${showNameError ? 'bg-red-50/40' : ''}`}>
      {/* Row 1: drag handle + name + delete */}
      <div className="flex items-start gap-2">
        <div className="mt-[9px] text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
          <IconGripVertical size={14} />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={item.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Nama item / layanan"
            className={`w-full bg-transparent text-sm font-medium placeholder:text-[var(--color-text-muted)] focus:outline-none ${
              showNameError ? 'text-red-500 placeholder:text-red-300' : 'text-[var(--color-text-primary)]'
            }`}
          />
          {showNameError && (
            <span className="text-[10px] text-red-500">Nama item wajib diisi</span>
          )}
          <input
            type="text"
            value={item.description ?? ''}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Deskripsi (opsional)"
            className="w-full bg-transparent text-xs text-[var(--color-text-muted)] placeholder:text-[var(--color-text-muted)] focus:outline-none mt-0.5"
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="mt-1 p-1 text-[var(--color-text-muted)] hover:text-red-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Hapus baris"
        >
          <IconTrash size={14} />
        </button>
      </div>

      {/* Row 2: qty, unit, price, subtotal */}
      <div className="grid grid-cols-[60px_120px_1fr_1fr] gap-2 pl-5">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-[var(--color-text-muted)]">Qty</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={item.qty}
            onChange={(e) => update({ qty: parseFloat(e.target.value) || 1 })}
            className="bg-[var(--color-bg)] border border-[var(--color-border)] text-sm rounded-[6px] px-2 py-[5px] w-full focus:outline-none focus:border-[var(--color-primary)] tabular-nums text-[var(--color-text-primary)]"
            style={{ borderWidth: '0.5px' }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-[var(--color-text-muted)]">Satuan</label>
          <select
            value={item.unit}
            onChange={(e) => update({ unit: e.target.value })}
            className="bg-[var(--color-bg)] border border-[var(--color-border)] text-sm rounded-[6px] px-2 py-[5px] w-full focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)] cursor-pointer"
            style={{ borderWidth: '0.5px' }}
          >
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <CurrencyInput
          label="Harga / unit"
          value={item.price}
          onChange={(v) => update({ price: v })}
        />
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-[var(--color-text-muted)]">Subtotal</label>
          <div className="bg-[var(--color-bg)] border border-[var(--color-border-light)] text-sm rounded-[6px] px-[10px] py-[7px] tabular-nums text-[var(--color-text-primary)] font-medium">
            {formatIDR(item.subtotal)}
          </div>
        </div>
      </div>
    </div>
  )
}
