import { describe, it, expect } from 'vitest'
import { addInterval, addDays } from '../lib/dateUtils'

describe('dateUtils.addInterval', () => {
  it('monthly crosses year boundary (Dec -> Jan)', () => {
    expect(addInterval('2025-12-15', 'monthly')).toBe('2026-01-15')
  })

  it('quarterly crosses year boundary', () => {
    expect(addInterval('2025-11-10', 'quarterly')).toBe('2026-02-10')
  })

  it('weekly adds 7 days', () => {
    expect(addInterval('2026-01-01', 'weekly')).toBe('2026-01-08')
  })

  it('monthly handles month overflow (JS Date clamp)', () => {
    // 31 Jan + 1 bulan = 31 Feb yang di-clamp JS ke 3 Mar (native behavior)
    expect(addInterval('2026-01-31', 'monthly')).toBe('2026-03-03')
  })
})

describe('dateUtils.addDays', () => {
  it('adds days', () => {
    expect(addDays('2026-01-30', 5)).toBe('2026-02-04')
  })
})
