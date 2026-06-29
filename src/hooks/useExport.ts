import { db } from '../db/database'
import type { Document, Client, ServiceTemplate, Settings } from '../db/database'
import { DEFAULT_SERVICE_TEMPLATES, DEFAULT_SETTINGS } from '../db/seeds'

export async function exportBackup(): Promise<void> {
  const [documents, clients, serviceTemplates, settings] = await Promise.all([
    db.documents.toArray(),
    db.clients.toArray(),
    db.serviceTemplates.toArray(),
    // Exclude auth data — jangan expose hash/salt ke file backup
    db.settings.filter((s) => !s.key.startsWith('auth:')).toArray(),
  ])

  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: { documents, clients, serviceTemplates, settings },
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `invoicegua-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

interface BackupData {
  version?: number
  data: {
    documents?: unknown[]
    clients?: unknown[]
    serviceTemplates?: unknown[]
    settings?: unknown[]
  }
}

export async function importBackup(file: File): Promise<void> {
  let backup: BackupData
  try {
    const text = await file.text()
    const parsed = JSON.parse(text) as unknown
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('data' in parsed) ||
      typeof (parsed as Record<string, unknown>).data !== 'object'
    ) {
      throw new Error('Format backup tidak valid')
    }
    backup = parsed as BackupData
  } catch (err) {
    throw err instanceof Error ? err : new Error('File tidak dapat dibaca atau bukan JSON valid')
  }

  const { documents, clients, serviceTemplates, settings } = backup.data

  await db.transaction('rw', [db.documents, db.clients, db.serviceTemplates, db.settings], async () => {
    await db.documents.clear()
    await db.clients.clear()
    await db.serviceTemplates.clear()

    // Hapus hanya non-auth settings — pertahankan akun yang sedang login
    const nonAuthKeys = await db.settings
      .filter((s) => !s.key.startsWith('auth:'))
      .primaryKeys()
    if (nonAuthKeys.length) await db.settings.bulkDelete(nonAuthKeys as string[])

    if (Array.isArray(documents) && documents.length) {
      await db.documents.bulkAdd(documents as Document[])
    }
    if (Array.isArray(clients) && clients.length) {
      await db.clients.bulkAdd(clients as Client[])
    }
    if (Array.isArray(serviceTemplates) && serviceTemplates.length) {
      await db.serviceTemplates.bulkAdd(serviceTemplates as ServiceTemplate[])
    }
    if (Array.isArray(settings) && settings.length) {
      // Filter dan cast — jangan restore auth keys dari file luar
      const safeSettings = (settings as Settings[]).filter(
        (s) => typeof s?.key === 'string' && !s.key.startsWith('auth:'),
      )
      if (safeSettings.length) await db.settings.bulkAdd(safeSettings)
    }
  })
}

export async function factoryReset(): Promise<void> {
  await db.transaction('rw', [db.documents, db.clients, db.serviceTemplates, db.settings], async () => {
    await db.documents.clear()
    await db.clients.clear()
    await db.serviceTemplates.clear()

    // Hapus semua non-auth settings — pertahankan akun
    const nonAuthKeys = await db.settings
      .filter((s) => !s.key.startsWith('auth:'))
      .primaryKeys()
    if (nonAuthKeys.length) await db.settings.bulkDelete(nonAuthKeys as string[])

    await db.serviceTemplates.bulkAdd(DEFAULT_SERVICE_TEMPLATES)
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      await db.settings.put({ key, value })
    }
  })
}
