import { motion, useReducedMotion } from 'framer-motion'
import { StatusBadge } from '../ui/StatusBadge'
import { formatIDR } from '../../lib/currency'

// Bukan ilustrasi dekoratif — ini contoh invoice yang dibangun dari
// komponen & format angka yang sama dengan produk aslinya (StatusBadge,
// formatIDR). Login screen langsung nunjukin apa yang bakal dihasilkan.
const SAMPLE_ITEMS = [
  { name: 'Desain Logo', qty: 1, unit: 'paket', price: 500_000 },
  { name: 'Landing Page', qty: 1, unit: 'halaman', price: 1_500_000 },
  { name: 'Revisi & Konsultasi', qty: 3, unit: 'jam', price: 150_000 },
]

const subtotal = SAMPLE_ITEMS.reduce((s, i) => s + i.qty * i.price, 0)

const VALUE_PROPS = [
  'Invoice & penawaran dalam hitungan detik',
  'Export PDF, kirim langsung ke WhatsApp',
  'Data 100% di device kamu — tanpa server',
]

export function SpecimenInvoicePanel() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="hidden lg:flex flex-col justify-between w-full h-full bg-[#0F0F0F] px-14 py-12 relative overflow-hidden">
      {/* Wordmark + tagline */}
      <div>
        <span className="font-mono text-lg font-semibold text-white tracking-tight">
          InvoiceGua
        </span>
        <p className="text-xs text-white/40 mt-1">
          Invoice & penawaran profesional, tanpa ribet
        </p>
      </div>

      {/* Specimen invoice card */}
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-[340px] mx-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-[#9CA3AF] mb-1">
              Contoh Invoice
            </p>
            <p className="font-mono text-xs text-[#6B7280]">INV-2025-014</p>
          </div>
          <StatusBadge status="paid" />
        </div>

        {/* Line items */}
        <div className="space-y-2.5 mb-3">
          {SAMPLE_ITEMS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={reduceMotion ? undefined : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.15 + i * 0.08 }}
              className="flex items-center justify-between text-[11px]"
            >
              <div className="min-w-0 pr-2">
                <p className="text-[#0F0F0F] font-medium truncate">{item.name}</p>
                <p className="text-[#9CA3AF] text-[10px]">{item.qty} {item.unit}</p>
              </div>
              <span className="text-[#374151] tabular-nums shrink-0">
                {formatIDR(item.qty * item.price)}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Perforation — garis sobekan struk, bukan hairline dekoratif kosong */}
        <div
          className="border-t border-dashed my-3"
          style={{ borderColor: '#D1D5DB' }}
          aria-hidden="true"
        />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#0F0F0F]">Total</span>
          <span className="text-sm font-semibold text-[#0F0F0F] tabular-nums">
            {formatIDR(subtotal)}
          </span>
        </div>
      </motion.div>

      {/* Value props */}
      <ul className="space-y-2.5">
        {VALUE_PROPS.map((text) => (
          <li key={text} className="flex items-start gap-2.5 text-xs text-white/60">
            <span className="w-1 h-1 rounded-full bg-white/40 mt-1.5 shrink-0" />
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}
