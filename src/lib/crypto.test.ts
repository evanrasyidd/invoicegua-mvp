import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../lib/crypto'

describe('crypto', () => {
  it('hash produces salt + hash', async () => {
    const { hash, salt } = await hashPassword('secret123')
    expect(hash).toBeTruthy()
    expect(salt).toBeTruthy()
    expect(hash).not.toBe('secret123')
  })

  it('same password + different salt = different hash', async () => {
    const a = await hashPassword('secret123')
    const b = await hashPassword('secret123')
    expect(a.hash).not.toBe(b.hash)
    expect(a.salt).not.toBe(b.salt)
  })

  it('verifyPassword true for correct password', async () => {
    const { hash, salt } = await hashPassword('secret123')
    expect(await verifyPassword('secret123', hash, salt)).toBe(true)
  })

  it('verifyPassword false for wrong password', async () => {
    const { hash, salt } = await hashPassword('secret123')
    expect(await verifyPassword('wrong', hash, salt)).toBe(false)
  })
})
