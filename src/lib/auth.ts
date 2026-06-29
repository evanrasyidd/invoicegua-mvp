import { hashPassword, verifyPassword } from './crypto'
import { db } from '../db/database'

const SESSION_KEY = 'ig_session'
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000 // 8 jam

export interface AuthUser {
  username: string
  displayName: string
  loggedInAt: number
  expiresAt: number
}

export interface RegisterPayload {
  username: string
  displayName: string
  password: string
}

export interface LoginPayload {
  username: string
  password: string
}

// ─── Session ────────────────────────────────────────────────────────────────

export function getSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as AuthUser
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

function setSession(user: Omit<AuthUser, 'loggedInAt' | 'expiresAt'>): AuthUser {
  const session: AuthUser = {
    ...user,
    loggedInAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

// ─── Register ────────────────────────────────────────────────────────────────

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const username = payload.username.trim().toLowerCase()

  if (!username || username.length < 3) {
    throw new Error('Username minimal 3 karakter')
  }
  if (!/^[a-z0-9_]+$/.test(username)) {
    throw new Error('Username hanya boleh huruf, angka, dan underscore')
  }
  if (!payload.password || payload.password.length < 6) {
    throw new Error('Password minimal 6 karakter')
  }
  if (!payload.displayName.trim()) {
    throw new Error('Nama tampilan wajib diisi')
  }

  // Cek duplikat
  const existing = await db.settings.get(`auth:user:${username}`)
  if (existing) {
    throw new Error('Username sudah dipakai')
  }

  // Cek apakah sudah ada user (untuk MVP, batasi 1 akun per device)
  const userCount = await db.settings
    .filter((s) => s.key.startsWith('auth:user:'))
    .count()

  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
  if (isDemoMode && userCount > 0) {
    throw new Error('Registrasi dinonaktifkan di mode demo')
  }

  const { hash, salt } = await hashPassword(payload.password)

  const userRecord = {
    username,
    displayName: payload.displayName.trim(),
    hash,
    salt,
    createdAt: Date.now(),
  }

  await db.settings.put({
    key: `auth:user:${username}`,
    value: JSON.stringify(userRecord),
  })

  return setSession({ username, displayName: payload.displayName.trim() })
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const username = payload.username.trim().toLowerCase()

  const record = await db.settings.get(`auth:user:${username}`)
  if (!record) {
    // Intentionally vague — jangan kasih tau user mana yang tidak exist
    throw new Error('Username atau password salah')
  }

  const user = JSON.parse(record.value) as {
    username: string
    displayName: string
    hash: string
    salt: string
  }

  const valid = await verifyPassword(payload.password, user.hash, user.salt)
  if (!valid) {
    throw new Error('Username atau password salah')
  }

  return setSession({ username: user.username, displayName: user.displayName })
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export async function hasAnyUser(): Promise<boolean> {
  const count = await db.settings
    .filter((s) => s.key.startsWith('auth:user:'))
    .count()
  return count > 0
}

export async function changePassword(
  username: string,
  oldPassword: string,
  newPassword: string,
): Promise<void> {
  const record = await db.settings.get(`auth:user:${username}`)
  if (!record) throw new Error('User tidak ditemukan')

  const user = JSON.parse(record.value) as {
    username: string
    displayName: string
    hash: string
    salt: string
    createdAt: number
  }

  const valid = await verifyPassword(oldPassword, user.hash, user.salt)
  if (!valid) throw new Error('Password lama salah')

  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password baru minimal 6 karakter')
  }

  const { hash, salt } = await hashPassword(newPassword)
  await db.settings.put({
    key: `auth:user:${username}`,
    value: JSON.stringify({ ...user, hash, salt }),
  })
}
