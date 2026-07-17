import { describe, it, expect } from 'vitest'
import { calculateDocument, calculateLineItem } from '../lib/calculations'
import type { LineItem } from '../db/database'

const item = (qty: number, price: number): LineItem => ({
  name: 'Item',
  qty,
  unit: 'item',
  price,
  subtotal: qty * price,
})

describe('calculateDocument', () => {
  it('subtotal = sum of line items', () => {
    const r = calculateDocument([item(2, 1000), item(1, 500)])
    expect(r.subtotal).toBe(2500)
  })

  it('percent discount', () => {
    const r = calculateDocument([item(2, 1000)], 'percent', 10)
    expect(r.discountAmount).toBe(200)
    expect(r.total).toBe(1800)
  })

  it('fixed discount', () => {
    const r = calculateDocument([item(2, 1000)], 'fixed', 300)
    expect(r.discountAmount).toBe(300)
    expect(r.total).toBe(1700)
  })

  it('tax applied after discount', () => {
    const r = calculateDocument([item(2, 1000)], 'percent', 10, 11)
    expect(r.taxAmount).toBe(Math.round(1800 * 11 / 100))
    expect(r.total).toBe(1800 + r.taxAmount)
  })

  it('dp percent of total', () => {
    const r = calculateDocument([item(2, 1000)], undefined, undefined, undefined, 50)
    expect(r.dpAmount).toBe(1000)
  })

  it('no tax when rate is 0', () => {
    const r = calculateDocument([item(1, 1000)], undefined, undefined, 0)
    expect(r.taxAmount).toBe(0)
    expect(r.total).toBe(1000)
  })

  it('calculateLineItem multiplies qty and price', () => {
    expect(calculateLineItem(3, 250)).toBe(750)
  })
})
