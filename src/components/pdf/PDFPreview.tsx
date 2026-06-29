import type { Document } from '../../db/database'
import type { BusinessProfile, BankInfo } from '../../hooks/useBusinessProfile'
import { formatIDR } from '../../lib/currency'
import { formatDate } from '../../lib/dateUtils'

interface PDFPreviewProps {
  doc: Partial<Document>
  business: BusinessProfile | null
  bank: BankInfo | null
  logo: string | null
}

export function PDFPreview({ doc, business, bank, logo }: PDFPreviewProps) {
  const items = doc.items ?? []
  const subtotal = doc.subtotal ?? 0
  const total = doc.total ?? 0
  const discountAmount = doc.discountAmount ?? 0
  const taxAmount = doc.taxAmount ?? 0
  const dpAmount = doc.dpAmount ?? 0

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm"
      style={{ fontFamily: 'Inter, sans-serif', color: '#0F0F0F', fontSize: 11 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid #F3F4F6' }}>
        <div>
          {logo && <img src={logo} alt="logo" style={{ height: 28, marginBottom: 6, objectFit: 'contain' }} />}
          <div style={{ fontWeight: 500, fontSize: 12 }}>{business?.name || 'Nama Bisnis'}</div>
          <div style={{ color: '#6B7280', fontSize: 10 }}>{business?.email}</div>
          <div style={{ color: '#6B7280', fontSize: 10 }}>{business?.phone}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 4 }}>
            {doc.type === 'quote' ? 'PENAWARAN' : 'INVOICE'}
          </div>
          <div style={{ fontSize: 10, color: '#6B7280', fontFamily: 'monospace' }}>{doc.number || 'INV-2025-000'}</div>
          <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>{formatDate(doc.issueDate)}</div>
          {doc.dueDate && (
            <div style={{ fontSize: 10, color: '#EF4444', marginTop: 1 }}>Jatuh tempo: {formatDate(doc.dueDate)}</div>
          )}
        </div>
      </div>

      {/* Bill to */}
      {doc.clientSnapshot && (
        <div style={{ margin: '12px 24px', padding: '10px 12px', background: '#F9FAFB', borderRadius: 6 }}>
          <div style={{ fontSize: 8, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            Tagihan untuk
          </div>
          <div style={{ fontWeight: 500, fontSize: 11 }}>{doc.clientSnapshot.name}</div>
          {doc.clientSnapshot.company && (
            <div style={{ fontSize: 10, color: '#6B7280' }}>{doc.clientSnapshot.company}</div>
          )}
        </div>
      )}

      {/* Items */}
      <div style={{ padding: '0 24px 12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '5px 0', textAlign: 'left', fontSize: 8, color: '#9CA3AF', textTransform: 'uppercase' }}>Layanan</th>
              <th style={{ padding: '5px 0', textAlign: 'right', fontSize: 8, color: '#9CA3AF', textTransform: 'uppercase', width: 90 }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ padding: '10px 0', color: '#9CA3AF', fontSize: 10, textAlign: 'center' }}>
                  Belum ada item
                </td>
              </tr>
            ) : (
              items.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '7px 0' }}>
                    <div style={{ fontWeight: 500, fontSize: 10 }}>{item.name}</div>
                    {item.description && (
                      <div style={{ fontSize: 9, color: '#6B7280' }}>{item.description}</div>
                    )}
                    <div style={{ fontSize: 9, color: '#9CA3AF' }}>{item.qty} {item.unit} × {formatIDR(item.price)}</div>
                  </td>
                  <td style={{ padding: '7px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500, fontSize: 10 }}>
                    {formatIDR(item.subtotal)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <div style={{ width: 180 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
              <span style={{ fontSize: 10, color: '#6B7280' }}>Subtotal</span>
              <span style={{ fontSize: 10, fontVariantNumeric: 'tabular-nums' }}>{formatIDR(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                <span style={{ fontSize: 10, color: '#6B7280' }}>Diskon</span>
                <span style={{ fontSize: 10, color: '#EF4444', fontVariantNumeric: 'tabular-nums' }}>−{formatIDR(discountAmount)}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                <span style={{ fontSize: 10, color: '#6B7280' }}>PPN {doc.taxRate}%</span>
                <span style={{ fontSize: 10, fontVariantNumeric: 'tabular-nums' }}>{formatIDR(taxAmount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid #0F0F0F', marginTop: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600 }}>Total</span>
              <span style={{ fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatIDR(total)}</span>
            </div>
            {dpAmount > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span style={{ fontSize: 9, color: '#6B7280' }}>DP ({doc.dpPercent}%)</span>
                  <span style={{ fontSize: 9, fontVariantNumeric: 'tabular-nums' }}>{formatIDR(dpAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span style={{ fontSize: 9, color: '#6B7280' }}>Sisa</span>
                  <span style={{ fontSize: 9, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{formatIDR(total - dpAmount)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      {doc.notes && (
        <div style={{ margin: '0 24px 12px', padding: '8px 10px', background: '#F9FAFB', borderRadius: 4 }}>
          <div style={{ fontSize: 8, color: '#9CA3AF', marginBottom: 3 }}>Catatan</div>
          <div style={{ fontSize: 9, color: '#374151' }}>{doc.notes}</div>
        </div>
      )}

      {/* Bank info */}
      {bank && (
        <div style={{ padding: '10px 24px 20px', borderTop: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 4 }}>Informasi pembayaran</div>
          <div style={{ fontWeight: 500, fontSize: 10 }}>{bank.bankName} · {bank.accountNumber}</div>
          <div style={{ fontSize: 9, color: '#6B7280' }}>a.n. {bank.accountHolder}</div>
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: 8, color: '#9CA3AF', padding: '8px 24px 16px' }}>
        Terima kasih atas kepercayaan Anda! — {business?.name ?? ''}
      </div>
    </div>
  )
}
