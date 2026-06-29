/**
 * Hash password pakai Web Crypto API (SHA-256 + random 16-byte salt)
 * Zero external dependency — native browser API
 */

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function hexToBuffer(hex: string): Uint8Array {
  const pairs = hex.match(/.{1,2}/g) ?? []
  return new Uint8Array(pairs.map((b) => parseInt(b, 16)))
}

export async function hashPassword(
  password: string,
  salt?: string,
): Promise<{ hash: string; salt: string }> {
  // Generate random salt kalau tidak ada
  const saltBytes = new Uint8Array(16)
  const usedSalt = salt ?? bufferToHex(crypto.getRandomValues(saltBytes).buffer)

  const encoder = new TextEncoder()
  const data = encoder.encode(password + usedSalt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return { hash: bufferToHex(hashBuffer), salt: usedSalt }
}

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string,
): Promise<boolean> {
  const result = await hashPassword(password, salt)
  // Constant-time byte comparison — cegah timing attack
  const a = hexToBuffer(result.hash)
  const b = hexToBuffer(hash)
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}
