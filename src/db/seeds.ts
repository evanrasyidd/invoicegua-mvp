import type { ServiceTemplate } from './database'

// Template ini hanya muncul saat pertama kali install.
// User bisa hapus/edit semua dari Setelan → Template Layanan.
// Sengaja dibuat generic — cocok untuk semua jenis usaha.
export const DEFAULT_SERVICE_TEMPLATES: Omit<ServiceTemplate, 'id'>[] = [
  { name: 'Jasa / Layanan', description: 'Isi sesuai jenis pekerjaan', defaultPrice: 500000, unit: 'item', order: 1 },
  { name: 'Produk', description: 'Barang atau produk fisik', defaultPrice: 100000, unit: 'item', order: 2 },
  { name: 'Biaya Berlangganan', description: 'Biaya rutin per periode', defaultPrice: 300000, unit: 'bulan', order: 3 },
  { name: 'Konsultasi', description: 'Sesi konsultasi atau pertemuan', defaultPrice: 200000, unit: 'jam', order: 4 },
  { name: 'Biaya Perjalanan', description: 'Transportasi dan akomodasi', defaultPrice: 150000, unit: 'item', order: 5 },
]

export const DEFAULT_SETTINGS: Record<string, string> = {
  invoiceCounter: '0',
  quoteCounter: '0',
  theme: 'light',
  defaultDueDays: '14',
  defaultTaxRate: '0',
  defaultPaymentTerms: 'Transfer dalam 14 hari kerja ke rekening di bawah',
}
