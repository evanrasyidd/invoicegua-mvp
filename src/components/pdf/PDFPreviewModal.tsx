import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconX, IconDownload, IconLoader2 } from '@tabler/icons-react'
import type { Document } from '../../db/database'
import type { BusinessProfile, BankInfo } from '../../hooks/useBusinessProfile'
import { PDFPreview } from './PDFPreview'
import { PDFTemplate } from './PDFTemplate'
import { exportToPDF } from '../../lib/pdfExport'
import { useAppStore } from '../../store/useAppStore'

interface PDFPreviewModalProps {
  open: boolean
  onClose: () => void
  doc: Document
  business: BusinessProfile
  bank: BankInfo | null
  logo: string | null
}

export function PDFPreviewModal({
  open,
  onClose,
  doc,
  business,
  bank,
  logo,
}: PDFPreviewModalProps) {
  const { showToast } = useAppStore()
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      await exportToPDF(
        <PDFTemplate doc={doc} business={business} bank={bank} logo={logo} />,
        `${doc.number}.pdf`,
      )
      showToast('PDF berhasil diunduh', 'success')
      onClose()
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Gagal membuat PDF',
        'error',
      )
    } finally {
      setExporting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-light)] shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Preview PDF
                </h2>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                  {doc.number} · {doc.clientSnapshot.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex items-center gap-1.5 bg-[var(--color-primary)] text-[var(--color-surface)] text-xs font-medium px-3.5 py-2 rounded-[8px] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {exporting ? (
                    <IconLoader2 size={13} className="animate-spin" />
                  ) : (
                    <IconDownload size={13} />
                  )}
                  {exporting ? 'Membuat PDF...' : 'Unduh PDF'}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer rounded-[6px] hover:bg-[var(--color-bg)]"
                  aria-label="Tutup preview"
                >
                  <IconX size={16} />
                </button>
              </div>
            </div>

            {/* Preview scroll area */}
            <div className="overflow-y-auto p-5 bg-[var(--color-bg)]">
              {/* Profil bisnis warning */}
              {!business.name.trim() && (
                <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-[8px] text-xs text-amber-700" style={{ borderWidth: '0.5px' }}>
                  Nama bisnis belum diisi — PDF akan terlihat tidak lengkap.
                  Isi di Setelan → Profil Bisnis.
                </div>
              )}

              <div className="rounded-xl overflow-hidden shadow-sm">
                <PDFPreview
                  doc={doc}
                  business={business}
                  bank={bank}
                  logo={logo}
                />
              </div>

              <p className="text-center text-[10px] text-[var(--color-text-muted)] mt-3">
                Preview ini akurat. Klik "Unduh PDF" untuk mendapatkan file.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
