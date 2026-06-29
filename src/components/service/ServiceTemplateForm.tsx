import { useState } from 'react'
import type { ServiceTemplate } from '../../db/database'
import { createServiceTemplate, updateServiceTemplate } from '../../hooks/useServiceTemplates'
import { useAppStore } from '../../store/useAppStore'
import { Button } from '../ui/Button'
import { CurrencyInput } from '../ui/CurrencyInput'

interface ServiceTemplateFormProps {
  initial?: ServiceTemplate
  onDone: () => void
  nextOrder?: number
}

const UNITS = ['project', 'halaman', 'jam', 'item', 'bulan', 'tahun', 'kali', 'paket']

export function ServiceTemplateForm({ initial, onDone, nextOrder = 1 }: ServiceTemplateFormProps) {
  const { showToast } = useAppStore()
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [defaultPrice, setDefaultPrice] = useState(initial?.defaultPrice ?? 0)
  const [unit, setUnit] = useState(initial?.unit ?? 'project')
  const [loading, setLoading] = useState(false)
  const [nameError, setNameError] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) { setNameError('Nama layanan wajib diisi'); return }
    setLoading(true)
    try {
      if (initial?.id) {
        await updateServiceTemplate(initial.id, { name, description, defaultPrice, unit })
        showToast('Template diperbarui', 'success')
      } else {
        await createServiceTemplate({ name, description, defaultPrice, unit, order: nextOrder })
        showToast('Template ditambahkan', 'success')
      }
      onDone()
    } catch {
      showToast('Terjadi kesalahan', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[var(--color-text-secondary)]">Nama Layanan *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setNameError('') }}
          placeholder="cth: Landing Page"
          className={`bg-[var(--color-bg)] border text-sm rounded-[8px] px-[10px] py-[7px] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-text-primary)] ${nameError ? 'border-red-400' : 'border-[var(--color-border)]'}`}
          style={{ borderWidth: '0.5px' }}
        />
        {nameError && <span className="text-xs text-red-500">{nameError}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[var(--color-text-secondary)]">Deskripsi</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi singkat layanan..."
          className="bg-[var(--color-bg)] border border-[var(--color-border)] text-sm rounded-[8px] px-[10px] py-[7px] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
          style={{ borderWidth: '0.5px' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CurrencyInput label="Harga Default" value={defaultPrice} onChange={setDefaultPrice} />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">Satuan</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="bg-[var(--color-bg)] border border-[var(--color-border)] text-sm rounded-[8px] px-[10px] py-[7px] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-text-primary)] cursor-pointer"
            style={{ borderWidth: '0.5px' }}
          >
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button onClick={handleSubmit} loading={loading} className="flex-1">
          {initial ? 'Simpan' : 'Tambah Template'}
        </Button>
        <Button variant="ghost" onClick={onDone}>Batal</Button>
      </div>
    </div>
  )
}
