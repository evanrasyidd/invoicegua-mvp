import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '../db/database'
import { generateDocumentNumber } from '../lib/documentNumber'

describe('generateDocumentNumber', () => {
  beforeEach(async () => {
    await db.documents.clear()
    await db.settings.clear()
  })

  it('generates first invoice number INV-YYYY-001', async () => {
    const n = await generateDocumentNumber('invoice')
    const year = new Date().getFullYear()
    expect(n).toBe(`INV-${year}-001`)
  })

  it('increments counter for sequential invoices', async () => {
    const a = await generateDocumentNumber('invoice')
    const b = await generateDocumentNumber('invoice')
    expect(a).toBe(`INV-${new Date().getFullYear()}-001`)
    expect(b).toBe(`INV-${new Date().getFullYear()}-002`)
  })

  it('separate counters for quote vs invoice', async () => {
    await generateDocumentNumber('invoice')
    await generateDocumentNumber('invoice')
    const q = await generateDocumentNumber('quote')
    expect(q).toBe(`QUO-${new Date().getFullYear()}-001`)
  })

  it('no duplicate numbers within same year', async () => {
    const nums = new Set<string>()
    for (let i = 0; i < 20; i++) {
      const n = await generateDocumentNumber('invoice')
      expect(nums.has(n)).toBe(false)
      nums.add(n)
    }
    expect(nums.size).toBe(20)
  })
})
