import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { DocumentForm } from '../components/document/DocumentForm'
import { PDFPreview } from '../components/pdf/PDFPreview'
import { createDocument } from '../hooks/useDocuments'
import { useBusinessProfile, useBankInfo, useLogoBase64 } from '../hooks/useBusinessProfile'
import { useAppStore } from '../store/useAppStore'
import type { Document } from '../db/database'

export function QuoteCreate() {
  const navigate = useNavigate()
  const { showToast } = useAppStore()
  const business = useBusinessProfile()
  const bank = useBankInfo()
  const logo = useLogoBase64()
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  const [previewDoc, setPreviewDoc] = useState<Partial<Document>>({
    type: 'quote',
    items: [],
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0,
  })

  const handleSubmit = async (data: Omit<Document, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true)
    try {
      const id = await createDocument(data)
      showToast('Penawaran berhasil dibuat', 'success')
      navigate(`/quote/${id}`)
    } catch {
      showToast('Gagal membuat penawaran', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-5 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Penawaran Baru</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Isi form di bawah untuk membuat penawaran
          </p>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="hidden md:flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
        >
          {showPreview ? <IconEyeOff size={14} /> : <IconEye size={14} />}
          {showPreview ? 'Sembunyikan preview' : 'Tampilkan preview'}
        </button>
      </div>

      <div className={`grid gap-6 ${showPreview ? 'md:grid-cols-[1fr_380px]' : ''}`}>
        <div>
          <DocumentForm
            type="quote"
            onSubmit={handleSubmit}
            onCancel={() => navigate('/quote')}
            onPreviewChange={setPreviewDoc}
            loading={loading}
          />
        </div>

        {showPreview && business && (
          <div className="hidden md:block">
            <div className="sticky top-5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                Preview PDF
              </p>
              <PDFPreview
                doc={previewDoc}
                business={business}
                bank={bank ?? null}
                logo={logo ?? null}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
