import { useState, useRef, useEffect, type MouseEvent } from 'react'
import { IconSearch, IconChevronDown, IconX } from '@tabler/icons-react'
import { useClients } from '../../hooks/useClients'
import type { Client } from '../../db/database'

interface ClientSelectorProps {
  value: number | null
  onChange: (client: Client | null) => void
  error?: string
}

export function ClientSelector({ value, onChange, error }: ClientSelectorProps) {
  const clients = useClients()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const selected = clients.find((c) => c.id === value) ?? null

  useEffect(() => {
    const handler = (e: globalThis.MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSelect = (client: Client) => {
    onChange(client)
    setOpen(false)
    setSearch('')
  }

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation()
    onChange(null)
  }

  return (
    <div ref={ref} className="relative">
      <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1">
        Klien *
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 bg-[var(--color-bg)] border text-sm rounded-[8px] px-[10px] py-[7px] text-left focus:outline-none focus:border-[var(--color-primary)] transition-colors cursor-pointer ${
          error ? 'border-red-400' : 'border-[var(--color-border)]'
        }`}
        style={{ borderWidth: '0.5px' }}
      >
        <span className={selected ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}>
          {selected ? selected.name : 'Pilih klien...'}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {selected && (
            <span
              onClick={handleClear}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer"
            >
              <IconX size={13} />
            </span>
          )}
          <IconChevronDown size={14} className="text-[var(--color-text-muted)]" />
        </div>
      </button>

      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[8px] shadow-lg z-20 overflow-hidden"
          style={{ borderWidth: '0.5px' }}
        >
          <div className="p-2 border-b border-[var(--color-border-light)]">
            <div className="flex items-center gap-2 bg-[var(--color-bg)] rounded-[6px] px-2.5 py-1.5">
              <IconSearch size={13} className="text-[var(--color-text-muted)] shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Cari klien..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-xs focus:outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-[var(--color-text-muted)]">
                Klien tidak ditemukan
              </div>
            ) : (
              filtered.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => handleSelect(client)}
                  className="w-full text-left px-3 py-2.5 hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
                >
                  <div className="text-xs font-medium text-[var(--color-text-primary)]">{client.name}</div>
                  {client.company && (
                    <div className="text-[10px] text-[var(--color-text-muted)]">{client.company}</div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
