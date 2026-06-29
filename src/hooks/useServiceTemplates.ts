import { useLiveQuery } from 'dexie-react-hooks'
import { db, type ServiceTemplate } from '../db/database'

export function useServiceTemplates() {
  return useLiveQuery(() => db.serviceTemplates.orderBy('order').toArray()) ?? []
}

export async function createServiceTemplate(data: Omit<ServiceTemplate, 'id'>): Promise<number> {
  return db.serviceTemplates.add(data)
}

export async function updateServiceTemplate(id: number, data: Partial<ServiceTemplate>): Promise<void> {
  await db.serviceTemplates.update(id, data)
}

export async function deleteServiceTemplate(id: number): Promise<void> {
  await db.serviceTemplates.delete(id)
}
