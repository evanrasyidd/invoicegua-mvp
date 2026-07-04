import { useState } from 'react'
import { IconPencil, IconTrash, IconUsers, IconPlus, IconChevronDown, IconFileInvoice } from '@tabler/icons-react'
import { useClients, deleteClient } from '../../hooks/useClients'
import type { Client } from '../../db/database'
import { Modal } from '../ui/Modal'
import { ClientForm } from './ClientForm'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { useAppStore } from '../../store/useAppStore'
import { ClientDocumentHistory } from './ClientDocumentHistory'

export function ClientList() {
  const clients = useClients()
  const { showToast } = useAppStore()
  const [editing, setEditing] = useState<Client | null>(null)
  const [adding, setAdding] = useState(false)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = async (client: Client) => {
    if (!confirm(
      `Hapus "${client.name}"?\n\nInvoice yang sudah dibuat untuk klien ini tidak akan terhapus.`
    )) return
    await deleteClient(client.id!)
    showToast('Klien dihapus', 'info')
    if (expandedId === client.id) setExpandedId(null)
  }

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari klien..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] text-sm rounded-[8px] px-[10px] py-[7px] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
          style={{ borderWidth: '0.5px', maxWidth: 260 }}
        />
        <Button size="sm" onClick={() => setAdding(true)}>
          <IconPlus size={14} />
          Tambah Klien
        </Button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden" style={{ borderWidth: '0.5px' }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<IconUsers size={32} />}
            title="Belum ada klien"
            description="Tambahkan klien pertama untuk mulai membuat invoice"
            action={{ label: 'Tambah Klien', onClick: () => setAdding(true) }}
          />
        ) : (
          <div>
            <div className="grid grid-cols-[1fr_1fr_auto] px-4 py-2.5 border-b border-[var(--color-border-light)] bg-[var(--color-bg)]">
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Nama</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Kontak</span>
              <span />
            </div>

            {filtered.map((client) => (
              <div key={client.id} className="border-b border-[var(--color-border-light)] last:border-b-0">
                {/* Client row */}
                <div className="grid grid-cols-[1fr_1fr_auto] items-center px-4 py-3.5 hover:bg-[var(--color-bg)] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{client.name}</p>
                    {client.company && (
                      <p className="text-xs text-[var(--color-text-muted)]">{client.company}</p>
                    )}
                  </div>
                  <div>
                    {client.phone && (
                      <p className="text-xs text-[var(--color-text-secondary)]">{client.phone}</p>
                    )}
                    {client.email && (
                      <p className="text-xs text-[var(--color-text-muted)]">{client.email}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleExpand(client.id!)}
                      className="p-1.5 rounded-[6px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
                      aria-label="Lihat riwayat"
                      title="Riwayat dokumen"
                    >
                      <IconFileInvoice size={14} />
                    </button>
                    <button
                      onClick={() => setEditing(client)}
                      className="p-1.5 rounded-[6px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
                      aria-label="Edit klien"
                    >
                      <IconPencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(client)}
                      className="p-1.5 rounded-[6px] text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      aria-label="Hapus klien"
                    >
                      <IconTrash size={14} />
                    </button>
                    <button
                      onClick={() => toggleExpand(client.id!)}
                      className="p-1.5 rounded-[6px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                      aria-label="Expand"
                    >
                      <IconChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${expandedId === client.id ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* History panel */}
                {expandedId === client.id && (
                  <div className="px-4 pb-4 pt-2 bg-[var(--color-bg)] border-t border-[var(--color-border-light)]">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                      Riwayat Dokumen
                    </p>
                    <ClientDocumentHistory clientId={client.id!} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Tambah Klien">
        <ClientForm onDone={() => setAdding(false)} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Klien">
        {editing && <ClientForm initial={editing} onDone={() => setEditing(null)} />}
      </Modal>
    </div>
  )
}
