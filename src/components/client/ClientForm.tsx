import { useState } from 'react'
import { IconUser } from '@tabler/icons-react'
import type { Client } from '../../db/database'
import { createClient, updateClient } from '../../hooks/useClients'
import { useAppStore } from '../../store/useAppStore'
import { Button } from '../ui/Button'

interface ClientFormProps {
  initial?: Client
  onDone: () => void
}

type FormState = Omit<Client, 'id' | 'createdAt'>

const empty: FormState = { name: '', company: '', email: '', phone: '', address: '', notes: '' }

// Regex simpel — cukup buat nangkep typo jelas ("asdasd", "budi.com"),
// bukan RFC 5322 lengkap. Validasi ketat malah nolak email valid yang jarang.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ClientForm({ initial, onDone }: ClientFormProps) {
  const { showToast } = useAppStore()
  const [form, setForm] = useState<FormState>(
    initial ? { name: initial.name, company: initial.company ?? '', email: initial.email ?? '', phone: initial.phone ?? '', address: initial.address ?? '', notes: initial.notes ?? '' } : empty,
  )
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [loading, setLoading] = useState(false)

  const set = (key: keyof FormState, val: string) => {
    setForm((f) => ({ ...f, [key]: val }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = () => {
    const errs: Partial<FormState> = {}
    if (!form.name.trim()) errs.name = 'Nama wajib diisi'

    if (form.email?.trim() && !EMAIL_RE.test(form.email.trim())) {
      errs.email = 'Format email tidak valid'
    }

    if (form.phone?.trim()) {
      const digitCount = form.phone.replace(/\D/g, '').length
      if (digitCount < 8) {
        // Nomor HP dipakai buat tombol kirim WA — kalau formatnya rusak,
        // link WA jadi kosong/gagal tanpa pemberitahuan apapun ke user.
        errs.phone = 'Nomor HP tidak valid (minimal 8 digit)'
      }
    }

    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      if (initial?.id) {
        await updateClient(initial.id, form)
        showToast('Klien berhasil diperbarui', 'success')
      } else {
        await createClient(form)
        showToast('Klien berhasil ditambahkan', 'success')
      }
      onDone()
    } catch {
      showToast('Terjadi kesalahan', 'error')
    } finally {
      setLoading(false)
    }
  }

  const field = (
    key: keyof FormState,
    label: string,
    placeholder: string,
    required = false,
    inputType = 'text',
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[var(--color-text-secondary)]">
        {label} {required && '*'}
      </label>
      <input
        type={inputType}
        value={form[key] as string}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className={`bg-[var(--color-bg)] border text-sm rounded-[8px] px-[10px] py-[7px] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] ${
          errors[key] ? 'border-red-400' : 'border-[var(--color-border)]'
        }`}
        style={{ borderWidth: '0.5px' }}
      />
      {errors[key] && <span className="text-xs text-red-500">{errors[key]}</span>}
    </div>
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <IconUser size={16} className="text-[var(--color-text-muted)]" />
        <span className="text-sm font-medium">{initial ? 'Edit Klien' : 'Tambah Klien Baru'}</span>
      </div>
      {field('name', 'Nama', 'Budi Santoso', true)}
      {field('company', 'Perusahaan', 'PT Maju Jaya')}
      {field('email', 'Email', 'budi@majujaya.com', false, 'email')}
      {field('phone', 'No. HP', '08123456789', false, 'tel')}
      {field('address', 'Alamat', 'Jl. Sudirman No. 1, Jakarta')}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[var(--color-text-secondary)]">Catatan</label>
        <textarea
          value={form.notes ?? ''}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Catatan internal tentang klien ini..."
          rows={3}
          className="bg-[var(--color-bg)] border border-[var(--color-border)] text-sm rounded-[8px] px-[10px] py-[7px] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] resize-none"
          style={{ borderWidth: '0.5px' }}
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button onClick={handleSubmit} loading={loading} className="flex-1">
          {initial ? 'Simpan Perubahan' : 'Tambah Klien'}
        </Button>
        <Button variant="ghost" onClick={onDone}>
          Batal
        </Button>
      </div>
    </div>
  )
}
