import Dexie, { type Table } from 'dexie'

export interface LineItem {
  name: string
  description?: string
  qty: number
  unit: string
  price: number
  subtotal: number
}

export interface ClientSnapshot {
  name: string
  company?: string
  email?: string
  phone?: string
  address?: string
}

export interface Document {
  id?: number
  type: 'invoice' | 'quote'
  number: string
  clientId: number
  clientSnapshot: ClientSnapshot
  items: LineItem[]
  subtotal: number
  discountType?: 'percent' | 'fixed'
  discountValue?: number
  discountAmount: number
  taxRate?: number
  taxAmount: number
  total: number
  dpPercent?: number
  dpAmount?: number
  notes?: string
  paymentTerms?: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issueDate: string
  dueDate?: string
  paidDate?: string
  createdAt: number
  updatedAt: number
}

export interface Client {
  id?: number
  name: string
  company?: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  createdAt: number
}

export interface ServiceTemplate {
  id?: number
  name: string
  description?: string
  defaultPrice: number
  unit: string
  order: number
}

export interface Settings {
  key: string
  value: string
}

class InvoiceGuaDB extends Dexie {
  documents!: Table<Document>
  clients!: Table<Client>
  serviceTemplates!: Table<ServiceTemplate>
  settings!: Table<Settings>

  constructor() {
    super('InvoiceGuaDB')
    this.version(1).stores({
      documents: '++id, type, number, clientId, status, issueDate, dueDate, createdAt',
      clients: '++id, name, company',
      serviceTemplates: '++id, name, order',
      settings: '&key',
    })
  }
}

export const db = new InvoiceGuaDB()
