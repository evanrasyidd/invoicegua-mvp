import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Client } from '../db/database'

export function useClients() {
  return useLiveQuery(() => db.clients.orderBy('name').toArray()) ?? []
}

export function useClient(id?: number) {
  return useLiveQuery(async () => {
    if (!id) return null
    return db.clients.get(id) ?? null
  }, [id])
}

export async function createClient(data: Omit<Client, 'id' | 'createdAt'>): Promise<number> {
  return db.clients.add({ ...data, createdAt: Date.now() })
}

export async function updateClient(id: number, data: Partial<Client>): Promise<void> {
  await db.clients.update(id, data)
}

export async function deleteClient(id: number): Promise<void> {
  await db.clients.delete(id)
}
