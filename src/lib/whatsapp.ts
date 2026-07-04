import type { Document } from '../db/database'
import { formatIDR } from './currency'
import { formatDate } from './dateUtils'

export function buildWAMessage(doc: Document, businessName: string): string {
  const type = doc.type === 'invoice' ? 'Invoice' : 'Penawaran'
  const dateLabel = doc.type === 'invoice' ? 'Jatuh tempo' : 'Berlaku hingga'
  // Fallback ke string netral kalau profil belum diisi
  const from = businessName.trim() || 'kami'

  const lines = [
    `Halo ${doc.clientSnapshot.name},`,
    ``,
    `Berikut ${type} dari ${from}:`,
    ``,
    `Nomor  : ${doc.number}`,
    `Tanggal: ${formatDate(doc.issueDate)}`,
    doc.dueDate ? `${dateLabel}: ${formatDate(doc.dueDate)}` : null,
    `Total  : ${formatIDR(doc.total)}`,
    doc.dpAmount && doc.dpAmount > 0 ? `DP     : ${formatIDR(doc.dpAmount)}` : null,
    doc.dpAmount && doc.dpAmount > 0 ? `Sisa   : ${formatIDR(doc.total - doc.dpAmount)}` : null,
    ``,
    `PDF sudah kami kirimkan terpisah.`,
    ``,
    `Terima kasih!`,
  ]

  return lines.filter((l): l is string => l !== null).join('\n')
}

export function openWA(phone: string, message: string): void {
  const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '62')
  const encoded = encodeURIComponent(message)
  window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank')
}
