// ─── Browser (pakai Intl API) ─────────────────────────────────────────────────

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function parseIDR(formatted: string): number {
  return parseInt(formatted.replace(/[^0-9]/g, '')) || 0
}

export function formatIDRCompact(amount: number): string {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}M`
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}jt`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}rb`
  return formatIDR(amount)
}

// ─── PDF-safe (pure string, tanpa Intl API) ───────────────────────────────────
// @react-pdf/renderer pakai custom JS engine — Intl.NumberFormat tidak tersedia.

export function formatIDRPdf(amount: number): string {
  const rounded = Math.round(amount)
  const str = rounded.toString()
  // Insert titik sebagai separator ribuan dari kanan
  const parts: string[] = []
  let i = str.length
  while (i > 0) {
    parts.unshift(str.slice(Math.max(0, i - 3), i))
    i -= 3
  }
  return `Rp ${parts.join('.')}`
}
