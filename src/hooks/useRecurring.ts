import { useLiveQuery } from 'dexie-react-hooks'
import { db, type RecurringInvoice, type Document, type RecurringFrequency, type LineItem } from '../db/database'
import { generateDocumentNumber } from '../lib/documentNumber'
import { addInterval, toISODate } from '../lib/dateUtils'

export function useRecurring() {
  return useLiveQuery(async () => {
    const all = await db.recurring.orderBy('nextRunDate').toArray()
    return all
  })
}

export function useActiveRecurring() {
  return useLiveQuery(async () => {
    return db.recurring.filter((r) => r.active).toArray()
  })
}

export async function createRecurring(
  data: Omit<RecurringInvoice, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<number> {
  const now = Date.now()
  return db.recurring.add({ ...data, createdAt: now, updatedAt: now })
}

export async function updateRecurring(id: number, data: Partial<RecurringInvoice>): Promise<void> {
  await db.recurring.update(id, { ...data, updatedAt: Date.now() })
}

export async function deleteRecurring(id: number): Promise<void> {
  await db.recurring.delete(id)
}

export async function toggleRecurringActive(id: number, active: boolean): Promise<void> {
  await db.recurring.update(id, { active, updatedAt: Date.now() })
}

/**
 * Generate invoice untuk semua recurring yang jatuh tempo (nextRunDate <= today).
 * Tiap generate: buat document (status sent/draft), lalu geser nextRunDate ke
 * interval berikutnya. Return jumlah invoice yang dibuat.
 */
export async function generateDueRecurring(): Promise<number> {
  const today = toISODate()
  const due = await db.recurring
    .filter((r) => r.active && r.nextRunDate <= today)
    .toArray()

  let created = 0
  for (const r of due) {
    const number = await generateDocumentNumber('invoice')
    const issueDate = today
    const dueDays = parseInt((await db.settings.get('defaultDueDays'))?.value ?? '14') || 14
    const dueDate = addIntervalFixed(issueDate, dueDays)

    const docData: Omit<Document, 'id' | 'number' | 'createdAt' | 'updatedAt'> = {
      type: 'invoice',
      clientId: r.clientId,
      clientSnapshot: r.clientSnapshot,
      items: r.items,
      subtotal: r.subtotal,
      discountType: r.discountType,
      discountValue: r.discountValue,
      discountAmount: r.discountAmount,
      taxRate: r.taxRate,
      taxAmount: r.taxAmount,
      total: r.total,
      dpPercent: r.dpPercent,
      dpAmount: r.dpAmount,
      notes: r.notes,
      paymentTerms: r.paymentTerms,
      status: r.autoSend ? 'sent' : 'draft',
      issueDate,
      dueDate,
      paidDate: undefined,
    }

    const docId = await db.documents.add({ ...docData, number, createdAt: Date.now(), updatedAt: Date.now() })

    const nextRunDate = addInterval(r.nextRunDate, r.frequency)
    await db.recurring.update(r.id!, {
      nextRunDate,
      lastGeneratedId: docId,
      updatedAt: Date.now(),
    })
    created++
  }
  return created
}

// Helper lokal: due date = issue + N hari
function addIntervalFixed(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

// Tipe data yang dibutuhkan form recurring
export interface RecurringFormInput {
  clientId: number
  clientSnapshot: RecurringInvoice['clientSnapshot']
  items: LineItem[]
  subtotal: number
  discountType?: 'percent' | 'fixed'
  discountValue?: number
  discountAmount: number
  taxRate?: number
  taxAmount: number
  total: number
  dpPercent?: number
  dpAmount?: number
  notes?: string
  paymentTerms?: string
  frequency: RecurringFrequency
  nextRunDate: string
  autoSend: boolean
  active: boolean
}
