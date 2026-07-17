import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { db, type Document } from '../db/database'
import { toISODate } from '../lib/dateUtils'

function makeDoc(over: Partial<Document>): Document {
  return {
    type: 'invoice',
    number: 'INV-2026-001',
    clientId: 1,
    clientSnapshot: { name: 'Test' },
    items: [],
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0,
    status: 'sent',
    issueDate: '2026-01-01',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...over,
  }
}

// Logika yang identik dengan useDashboardStats: auto-mark overdue
async function autoMarkOverdue() {
  const todayStr = toISODate()
  const docs = await db.documents.where('type').equals('invoice').toArray()
  const due = docs.filter((d) => d.status === 'sent' && d.dueDate && d.dueDate < todayStr)
  await Promise.all(due.map((d) => db.documents.update(d.id!, { status: 'overdue', updatedAt: Date.now() })))
  return due.length
}

describe('dashboard overdue auto-marking', () => {
  beforeEach(async () => {
    await db.documents.clear()
  })

  it('marks sent invoice with past dueDate as overdue', async () => {
    await db.documents.add(makeDoc({ id: 1, status: 'sent', dueDate: '2000-01-01' }))
    const count = await autoMarkOverdue()
    expect(count).toBe(1)
    const updated = await db.documents.get(1)
    expect(updated?.status).toBe('overdue')
  })

  it('does not mark paid or future-due invoices', async () => {
    await db.documents.add(makeDoc({ id: 2, status: 'paid', dueDate: '2000-01-01' }))
    await db.documents.add(makeDoc({ id: 3, status: 'sent', dueDate: toISODate() }))
    const count = await autoMarkOverdue()
    expect(count).toBe(0)
  })
})
