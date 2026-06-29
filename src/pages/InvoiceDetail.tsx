import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  IconDownload,
  IconBrandWhatsapp,
  IconPencil,
  IconTrash,
  IconArrowLeft,
  IconCheck,
} from '@tabler/icons-react'
import { useDocument, updateDocument, deleteDocument } from '../hooks/useDocuments'
import { useBusinessProfile, useBankInfo, useLogoBase64 } from '../hooks/useBusinessProfile'
import { useAppStore } from '../store/useAppStore'
import { StatusUpdater } from '../components/document/StatusUpdater'
import { DocumentForm } from '../components/document/DocumentForm'
import { PDFTemplate } from '../components/pdf/PDFTemplate'
import { PDFPreview } from '../components/pdf/PDFPreview'
import { Button } from '../components/ui/Button'
import { formatIDR } from '../lib/currency'
import { formatDate } from '../lib/dateUtils'
import { exportToPDF } from '../lib/pdfExport'
import { buildWAMessage, openWA } from '../lib/whatsapp'
import { Skeleton } from '../components/ui/Skeleton'
import type { Document } from '../db/database'

export function InvoiceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useAppStore()
  const doc = useDocument(id ? parseInt(id) : undefined)
  const business = useBusinessProfile()
  const bank = useBankInfo()
  const logo = useLogoBase64()
  const [editing, setEditing] = useState(false)
  const [exporting, setExporting] = useState(false)

  if (doc === undefined) {
    return (
      <div className="p-5 md:p-8 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">Dokumen tidak ditemukan</p>
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => navigate('/invoice')}>
          Kembali
        </Button>
      </div>
    )
  }

  const handleExportPDF = async () => {
    if (!business) {
      showToast('Lengkapi profil bisnis di Setelan dulu', 'error')
      return
    }
    setExporting(true)
    try {
      await exportToPDF(
        <PDFTemplate doc={doc} business={business} bank={bank ?? null} logo={logo ?? null} />,
        `${doc.number}.pdf`,
      )
      showToast('PDF berhasil diunduh', 'success')
    } catch {
      showToast('Gagal membuat PDF', 'error')
    } finally {
      setExporting(false)
    }
  }

  const handleSendWA = () => {
    if (!doc.clientSnapshot.phone) {
      showToast('Nomor HP klien tidak tersedia', 'error')
      return
    }
    const msg = buildWAMessage(doc, business?.name ?? 'EgaxDev Studios')
    openWA(doc.clientSnapshot.phone, msg)
  }

  const handleDelete = async () => {
    if (!confirm('Hapus invoice ini? Tindakan ini tidak bisa dibatalkan.')) return
    await deleteDocument(doc.id!)
    showToast('Invoice dihapus', 'info')
    navigate('/invoice')
  }

  const handleUpdate = async (data: Omit<Document, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => {
    await updateDocument(doc.id!, data)
    showToast('Invoice diperbarui', 'success')
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="p-5 md:p-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setEditing(false)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer"
          >
            <IconArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-semibold">Edit Invoice</h1>
        </div>
        <DocumentForm
          type="invoice"
          initial={doc}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/invoice')}
          className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
        >
          <IconArrowLeft size={15} />
          Invoice
        </button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <IconPencil size={13} />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSendWA}>
            <IconBrandWhatsapp size={13} />
            WA
          </Button>
          <Button size="sm" onClick={handleExportPDF} loading={exporting}>
            <IconDownload size={13} />
            PDF
          </Button>
          <button
            onClick={handleDelete}
            className="p-2 text-[var(--color-text-muted)] hover:text-red-500 transition-colors cursor-pointer rounded-[6px] hover:bg-red-50"
          >
            <IconTrash size={14} />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        {/* Left: detail */}
        <div className="space-y-4">
          {/* Meta card */}
          <div
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5"
            style={{ borderWidth: '0.5px' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-mono text-sm text-[var(--color-text-muted)]">{doc.number}</p>
                <p className="text-base font-semibold mt-0.5">{doc.clientSnapshot.name}</p>
                {doc.clientSnapshot.company && (
                  <p className="text-xs text-[var(--color-text-muted)]">{doc.clientSnapshot.company}</p>
                )}
              </div>
              <StatusUpdater docId={doc.id!} current={doc.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border-light)]">
              <div>
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                  Diterbitkan
                </p>
                <p className="text-sm">{formatDate(doc.issueDate)}</p>
              </div>
              {doc.dueDate && (
                <div>
                  <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                    Jatuh tempo
                  </p>
                  <p className="text-sm">{formatDate(doc.dueDate)}</p>
                </div>
              )}
              {doc.paidDate && (
                <div className="flex items-center gap-1.5">
                  <IconCheck size={13} className="text-green-500" />
                  <div>
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">
                      Dibayar
                    </p>
                    <p className="text-sm">{formatDate(doc.paidDate)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Items table */}
          <div
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden"
            style={{ borderWidth: '0.5px' }}
          >
            <div className="grid grid-cols-[1fr_80px_130px_130px] gap-2 px-4 py-2.5 bg-[var(--color-bg)] border-b border-[var(--color-border-light)]">
              {['Layanan', 'Qty', 'Harga', 'Subtotal'].map((h, i) => (
                <span
                  key={h}
                  className={`text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] ${i > 1 ? 'text-right' : ''}`}
                >
                  {h}
                </span>
              ))}
            </div>

            {doc.items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_80px_130px_130px] gap-2 px-4 py-3 border-b border-[var(--color-border-light)] last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-[var(--color-text-muted)]">{item.description}</p>
                  )}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {item.qty} {item.unit}
                </p>
                <p className="text-sm tabular-nums text-right">{formatIDR(item.price)}</p>
                <p className="text-sm font-medium tabular-nums text-right">{formatIDR(item.subtotal)}</p>
              </div>
            ))}

            {/* Totals */}
            <div className="px-4 py-4 border-t border-[var(--color-border)]">
              <div className="flex flex-col gap-1.5 items-end">
                <div className="flex justify-between w-56">
                  <span className="text-sm text-[var(--color-text-muted)]">Subtotal</span>
                  <span className="text-sm tabular-nums">{formatIDR(doc.subtotal)}</span>
                </div>
                {doc.discountAmount > 0 && (
                  <div className="flex justify-between w-56">
                    <span className="text-sm text-[var(--color-text-muted)]">
                      Diskon{doc.discountType === 'percent' ? ` ${doc.discountValue}%` : ''}
                    </span>
                    <span className="text-sm tabular-nums text-red-500">
                      −{formatIDR(doc.discountAmount)}
                    </span>
                  </div>
                )}
                {doc.taxAmount > 0 && (
                  <div className="flex justify-between w-56">
                    <span className="text-sm text-[var(--color-text-muted)]">PPN {doc.taxRate}%</span>
                    <span className="text-sm tabular-nums">{formatIDR(doc.taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between w-56 pt-2 border-t border-[var(--color-border)]">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-sm font-semibold tabular-nums">{formatIDR(doc.total)}</span>
                </div>
                {doc.dpAmount && doc.dpAmount > 0 ? (
                  <>
                    <div className="flex justify-between w-56">
                      <span className="text-xs text-[var(--color-text-muted)]">DP {doc.dpPercent}%</span>
                      <span className="text-xs tabular-nums">{formatIDR(doc.dpAmount)}</span>
                    </div>
                    <div className="flex justify-between w-56">
                      <span className="text-xs text-[var(--color-text-muted)]">Sisa</span>
                      <span className="text-xs font-medium tabular-nums">
                        {formatIDR(doc.total - doc.dpAmount)}
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* Notes */}
          {doc.notes && (
            <div
              className="bg-[var(--color-bg)] border border-[var(--color-border-light)] rounded-xl p-4"
              style={{ borderWidth: '0.5px' }}
            >
              <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Catatan
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">{doc.notes}</p>
            </div>
          )}
        </div>

        {/* Right: PDF preview (HTML live preview, bukan react-pdf) */}
        <div className="hidden md:block">
          <div className="sticky top-5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
              Preview PDF
            </p>
            {business && (
              <PDFPreview
                doc={doc}
                business={business}
                bank={bank ?? null}
                logo={logo ?? null}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
