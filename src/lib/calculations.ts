import type { LineItem } from '../db/database'

export function calculateLineItem(qty: number, price: number): number {
  return qty * price
}

export function calculateDocument(
  items: LineItem[],
  discountType?: 'percent' | 'fixed',
  discountValue?: number,
  taxRate?: number,
  dpPercent?: number,
) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)

  let discountAmount = 0
  if (discountType === 'percent' && discountValue) {
    discountAmount = Math.round(subtotal * discountValue / 100)
  } else if (discountType === 'fixed' && discountValue) {
    discountAmount = discountValue
  }

  const afterDiscount = subtotal - discountAmount
  const taxAmount = taxRate ? Math.round(afterDiscount * taxRate / 100) : 0
  const total = afterDiscount + taxAmount
  const dpAmount = dpPercent ? Math.round(total * dpPercent / 100) : 0

  return { subtotal, discountAmount, taxAmount, total, dpAmount }
}
