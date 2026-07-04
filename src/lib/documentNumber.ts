import { db } from '../db/database'

export async function generateDocumentNumber(type: 'invoice' | 'quote'): Promise<string> {
  const key = type === 'invoice' ? 'invoiceCounter' : 'quoteCounter'
  const prefix = type === 'invoice' ? 'INV' : 'QUO'
  const year = new Date().getFullYear()

  // Ambil counter tertinggi dari dokumen yang sudah ada untuk tahun ini
  // supaya restore backup tidak bikin nomor duplikat
  const existingDocs = await db.documents
    .where('type').equals(type)
    .toArray()

  const yearPrefix = `${prefix}-${year}-`
  const maxFromDocs = existingDocs
    .map((d) => {
      if (!d.number.startsWith(yearPrefix)) return 0
      return parseInt(d.number.replace(yearPrefix, '')) || 0
    })
    .reduce((max, n) => Math.max(max, n), 0)

  const setting = await db.settings.get(key)
  const counterFromSettings = parseInt(setting?.value ?? '0')

  // Pakai yang lebih besar antara counter settings vs actual docs
  const next = Math.max(maxFromDocs, counterFromSettings) + 1
  await db.settings.put({ key, value: next.toString() })

  return `${prefix}-${year}-${String(next).padStart(3, '0')}`
}
