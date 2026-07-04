// ─── Browser (pakai Intl API) ─────────────────────────────────────────────────

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateShort(dateStr?: string): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ─── PDF-safe (pure string, tanpa Intl/toLocaleDateString) ───────────────────
// @react-pdf/renderer pakai custom JS engine — locale date formatting tidak tersedia.

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export function formatDatePdf(dateStr?: string): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '—'
  const day = date.getDate()
  const month = MONTHS_ID[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

// ─── Shared utils ─────────────────────────────────────────────────────────────

export function toISODate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

export function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

export function getMonthYear(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
}
