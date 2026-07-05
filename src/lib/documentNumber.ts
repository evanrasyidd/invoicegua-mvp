import { db } from '../db/database'

/**
 * Generate nomor dokumen berikutnya (INV-2025-001 / QUO-2025-001).
 *
 * Dibungkus Dexie transaction ('rw', documents + settings) supaya atomic —
 * tanpa ini, buka 2 tab terus submit invoice barengan bisa menghasilkan
 * nomor yang sama persis (race condition: kedua tab baca counter yang sama
 * sebelum salah satunya sempat nulis balik).
 */
export async function generateDocumentNumber(type: 'invoice' | 'quote'): Promise<string> {
  const key = type === 'invoice' ? 'invoiceCounter' : 'quoteCounter'
  const prefix = type === 'invoice' ? 'INV' : 'QUO'
  const year = new Date().getFullYear()
  const yearPrefix = `${prefix}-${year}-`

  return db.transaction('rw', [db.documents, db.settings], async () => {
    // Ambil counter tertinggi dari dokumen yang sudah ada untuk tahun ini
    // (fallback penting supaya restore backup tidak bikin nomor duplikat)
    const existingDocs = await db.documents.where('type').equals(type).toArray()

    const maxFromDocs = existingDocs
      .map((d) => {
        if (!d.number.startsWith(yearPrefix)) return 0
        return parseInt(d.number.replace(yearPrefix, '')) || 0
      })
      .reduce((max, n) => Math.max(max, n), 0)

    const setting = await db.settings.get(key)
    const counterFromSettings = parseInt(setting?.value ?? '0')

    const next = Math.max(maxFromDocs, counterFromSettings) + 1
    await db.settings.put({ key, value: next.toString() })

    return `${prefix}-${year}-${String(next).padStart(3, '0')}`
  })
}
