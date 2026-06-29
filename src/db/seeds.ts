import type { ServiceTemplate } from './database'

export const DEFAULT_SERVICE_TEMPLATES: Omit<ServiceTemplate, 'id'>[] = [
  { name: 'Landing Page', description: 'Halaman utama website dengan desain custom', defaultPrice: 2500000, unit: 'project', order: 1 },
  { name: 'Company Profile', description: 'Website profil perusahaan 5-7 halaman', defaultPrice: 4500000, unit: 'project', order: 2 },
  { name: 'Toko Online', description: 'Website e-commerce dengan fitur keranjang', defaultPrice: 7500000, unit: 'project', order: 3 },
  { name: 'Logo Design', description: 'Desain logo + panduan warna', defaultPrice: 500000, unit: 'project', order: 4 },
  { name: 'UI/UX Design', description: 'Desain antarmuka aplikasi (per halaman)', defaultPrice: 350000, unit: 'halaman', order: 5 },
  { name: 'Revisi Desain', description: 'Revisi dari deliverable yang sudah ada', defaultPrice: 150000, unit: 'kali', order: 6 },
  { name: 'Domain + Hosting', description: 'Setup domain dan hosting 1 tahun', defaultPrice: 300000, unit: 'tahun', order: 7 },
  { name: 'Maintenance Bulanan', description: 'Pemeliharaan dan update website', defaultPrice: 500000, unit: 'bulan', order: 8 },
  { name: 'Konsultasi', description: 'Konsultasi teknis atau bisnis', defaultPrice: 200000, unit: 'jam', order: 9 },
]

export const DEFAULT_SETTINGS: Record<string, string> = {
  invoiceCounter: '0',
  quoteCounter: '0',
  theme: 'light',
  defaultDueDays: '3',
  defaultTaxRate: '0',
  defaultPaymentTerms: 'Transfer dalam 3 hari kerja ke rekening di bawah',
}
