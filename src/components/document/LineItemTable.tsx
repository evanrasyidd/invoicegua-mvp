import { IconPlus } from '@tabler/icons-react'
import type { LineItem, ServiceTemplate } from '../../db/database'
import { LineItemRow } from './LineItemRow'
import { Button } from '../ui/Button'

interface LineItemTableProps {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
  templates: ServiceTemplate[]
  invalidIndexes?: number[]
}

const emptyItem = (): LineItem => ({
  name: '',
  description: '',
  qty: 1,
  unit: 'item',
  price: 0,
  subtotal: 0,
})

export function LineItemTable({ items, onChange, templates, invalidIndexes = [] }: LineItemTableProps) {
  const handleChange = (index: number, item: LineItem) => {
    const next = [...items]
    next[index] = item
    onChange(next)
  }

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const addEmpty = () => {
    onChange([...items, emptyItem()])
  }

  const addFromTemplate = (t: ServiceTemplate) => {
    onChange([
      ...items,
      {
        name: t.name,
        description: t.description ?? '',
        qty: 1,
        unit: t.unit,
        price: t.defaultPrice,
        subtotal: t.defaultPrice,
      },
    ])
  }

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-[1fr_auto] px-3 py-2 bg-[var(--color-bg)] border-b border-[var(--color-border-light)]">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          Item / Layanan
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          Subtotal
        </span>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div className="py-8 text-center text-xs text-[var(--color-text-muted)]">
          Belum ada item. Tambahkan dari template atau manual.
        </div>
      ) : (
        items.map((item, i) => (
          <LineItemRow
            key={i}
            item={item}
            index={i}
            onChange={handleChange}
            onRemove={handleRemove}
            showNameError={invalidIndexes.includes(i)}
          />
        ))
      )}

      {/* Add actions */}
      <div className="p-3 border-t border-[var(--color-border-light)]">
        {templates.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => addFromTemplate(t)}
                className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              >
                + {t.name}
              </button>
            ))}
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={addEmpty}>
          <IconPlus size={13} />
          Tambah Baris
        </Button>
      </div>
    </div>
  )
}
