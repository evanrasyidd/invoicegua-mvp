import { useState } from 'react'
import { IconPencil, IconTrash, IconPlus, IconTemplate } from '@tabler/icons-react'
import { useServiceTemplates, deleteServiceTemplate } from '../../hooks/useServiceTemplates'
import type { ServiceTemplate } from '../../db/database'
import { Modal } from '../ui/Modal'
import { ServiceTemplateForm } from './ServiceTemplateForm'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { formatIDR } from '../../lib/currency'
import { useAppStore } from '../../store/useAppStore'

export function ServiceTemplateList() {
  const templates = useServiceTemplates()
  const { showToast } = useAppStore()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<ServiceTemplate | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus template ini?')) return
    await deleteServiceTemplate(id)
    showToast('Template dihapus', 'info')
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setAdding(true)}>
          <IconPlus size={14} />
          Tambah Template
        </Button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden" style={{ borderWidth: '0.5px' }}>
        {templates.length === 0 ? (
          <EmptyState
            icon={<IconTemplate size={32} />}
            title="Belum ada template"
            description="Buat template layanan untuk mempercepat pembuatan invoice"
            action={{ label: 'Tambah Template', onClick: () => setAdding(true) }}
          />
        ) : (
          templates.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--color-border-light)] last:border-b-0 hover:bg-[var(--color-bg)] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{t.name}</p>
                {t.description && (
                  <p className="text-xs text-[var(--color-text-muted)] truncate">{t.description}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium tabular-nums text-[var(--color-text-primary)]">
                    {formatIDR(t.defaultPrice)}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">per {t.unit}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing(t)}
                    className="p-1.5 rounded-[6px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
                  >
                    <IconPencil size={14} />
                  </button>
                  <button
                    onClick={() => t.id && handleDelete(t.id)}
                    className="p-1.5 rounded-[6px] text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <IconTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Tambah Template Layanan">
        <ServiceTemplateForm
          onDone={() => setAdding(false)}
          nextOrder={(templates[templates.length - 1]?.order ?? 0) + 1}
        />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Template">
        {editing && <ServiceTemplateForm initial={editing} onDone={() => setEditing(null)} />}
      </Modal>
    </div>
  )
}
