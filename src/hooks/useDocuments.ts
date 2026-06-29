import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Document } from '../db/database'
import { generateDocumentNumber } from '../lib/documentNumber'

// Returns undefined while loading, then the array
export function useDocuments(type?: 'invoice' | 'quote') {
  return useLiveQuery(async () => {
    if (type) {
      return db.documents.where('type').equals(type).reverse().sortBy('createdAt')
    }
    return db.documents.orderBy('createdAt').reverse().toArray()
  }, [type])
}

export function useDocument(id?: number) {
  return useLiveQuery(async () => {
    if (!id) return null
    return db.documents.get(id) ?? null
  }, [id])
}

export async function createDocument(
  data: Omit<Document, 'id' | 'number' | 'createdAt' | 'updatedAt'>,
): Promise<number> {
  const number = await generateDocumentNumber(data.type)
  const now = Date.now()
  return db.documents.add({ ...data, number, createdAt: now, updatedAt: now })
}

export async function updateDocument(id: number, data: Partial<Document>): Promise<void> {
  await db.documents.update(id, { ...data, updatedAt: Date.now() })
}

export async function deleteDocument(id: number): Promise<void> {
  await db.documents.delete(id)
}

export async function updateDocumentStatus(
  id: number,
  status: Document['status'],
): Promise<void> {
  const update: Partial<Document> = { status, updatedAt: Date.now() }
  if (status === 'paid') update.paidDate = new Date().toISOString().split('T')[0]
  await db.documents.update(id, update)
}
