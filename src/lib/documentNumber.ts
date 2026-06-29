import { db } from '../db/database'

export async function generateDocumentNumber(type: 'invoice' | 'quote'): Promise<string> {
  const key = type === 'invoice' ? 'invoiceCounter' : 'quoteCounter'
  const prefix = type === 'invoice' ? 'INV' : 'QUO'
  const year = new Date().getFullYear()

  const setting = await db.settings.get(key)
  const current = parseInt(setting?.value ?? '0')
  const next = current + 1

  await db.settings.put({ key, value: next.toString() })

  return `${prefix}-${year}-${String(next).padStart(3, '0')}`
}
