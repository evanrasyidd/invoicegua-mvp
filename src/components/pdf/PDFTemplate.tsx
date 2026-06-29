import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer'
import type { Document as InvoiceDoc } from '../../db/database'
import type { BusinessProfile, BankInfo } from '../../hooks/useBusinessProfile'
import { formatIDR } from '../../lib/currency'
import { formatDate } from '../../lib/dateUtils'

// Font dari Google Fonts CDN — di-load saat PDF di-generate.
// CSP di vercel.json sudah mengizinkan fonts.gstatic.com.
// Kalau butuh offline-first, ganti src ke file lokal di /public/fonts/
Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2',
      fontWeight: 500,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2',
      fontWeight: 600,
    },
  ],
})

// Fallback ke Helvetica kalau font gagal load (offline / CSP block)
Font.registerHyphenationCallback((word) => [word])

const s = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#0F0F0F',
    padding: '40px 48px',
    backgroundColor: '#FFFFFF',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  logo: { width: 64, height: 32, objectFit: 'contain', marginBottom: 6 },
  businessName: { fontSize: 11, fontWeight: 500 },
  businessMeta: { fontSize: 9, color: '#6B7280', marginTop: 2 },
  docType: { fontSize: 22, fontWeight: 600, letterSpacing: 1.5, textAlign: 'right', marginBottom: 6 },
  docNumber: { fontSize: 10, color: '#6B7280', fontFamily: 'Courier', textAlign: 'right' },
  docDate: { fontSize: 9, color: '#6B7280', textAlign: 'right', marginTop: 2 },
  docDue: { fontSize: 9, color: '#EF4444', textAlign: 'right', marginTop: 2 },
  billBox: { backgroundColor: '#F9FAFB', padding: '12px 14px', borderRadius: 6, marginBottom: 24 },
  billLabel: { fontSize: 8, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 },
  billName: { fontSize: 11, fontWeight: 500 },
  billMeta: { fontSize: 9, color: '#6B7280', marginTop: 2 },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 6,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
    paddingTop: 7,
    paddingBottom: 7,
  },
  colName: { flex: 1 },
  colQty: { width: 64, textAlign: 'center' },
  colPrice: { width: 100, textAlign: 'right' },
  colTotal: { width: 100, textAlign: 'right' },
  thText: { fontSize: 8, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 },
  tdName: { fontSize: 10, fontWeight: 500 },
  tdDesc: { fontSize: 8, color: '#6B7280', marginTop: 1 },
  tdMid: { fontSize: 10, color: '#374151' },
  tdAmount: { fontSize: 10, fontWeight: 500 },
  totalsSection: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  totalsBox: { width: 240 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 4, paddingBottom: 4 },
  totalLabel: { fontSize: 10, color: '#6B7280' },
  totalValue: { fontSize: 10 },
  grandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#0F0F0F',
    paddingTop: 8,
    marginTop: 4,
  },
  grandLabel: { fontSize: 12, fontWeight: 600 },
  grandValue: { fontSize: 12, fontWeight: 600 },
  notesBox: { backgroundColor: '#F9FAFB', padding: '10px 12px', borderRadius: 5, marginTop: 20 },
  notesLabel: { fontSize: 8, color: '#9CA3AF', marginBottom: 4 },
  notesText: { fontSize: 9, color: '#374151' },
  bankSection: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 16, marginTop: 20 },
  bankLabel: { fontSize: 8, color: '#9CA3AF', marginBottom: 5 },
  bankName: { fontSize: 11, fontWeight: 500 },
  bankMeta: { fontSize: 9, color: '#6B7280', marginTop: 2 },
  bankTerms: { fontSize: 9, color: '#6B7280', marginTop: 6 },
  footer: { textAlign: 'center', fontSize: 8, color: '#9CA3AF', marginTop: 40 },
})

interface PDFTemplateProps {
  doc: InvoiceDoc
  business: BusinessProfile
  bank: BankInfo | null
  logo: string | null
}

export function PDFTemplate({ doc, business, bank, logo }: PDFTemplateProps) {
  return (
    <Document title={doc.number} author={business.name} creator="InvoiceGua">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            {logo && <Image src={logo} style={s.logo} />}
            <Text style={s.businessName}>{business.name}</Text>
            {business.email ? <Text style={s.businessMeta}>{business.email}</Text> : null}
            {business.phone ? <Text style={s.businessMeta}>{business.phone}</Text> : null}
            {business.address ? <Text style={s.businessMeta}>{business.address}</Text> : null}
            {business.city ? <Text style={s.businessMeta}>{business.city}</Text> : null}
          </View>
          <View>
            <Text style={s.docType}>
              {doc.type === 'invoice' ? 'INVOICE' : 'PENAWARAN'}
            </Text>
            <Text style={s.docNumber}>{doc.number}</Text>
            <Text style={s.docDate}>{formatDate(doc.issueDate)}</Text>
            {doc.dueDate ? (
              <Text style={s.docDue}>
                {doc.type === 'invoice' ? 'Jatuh tempo' : 'Berlaku hingga'}: {formatDate(doc.dueDate)}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Bill to */}
        <View style={s.billBox}>
          <Text style={s.billLabel}>Tagihan untuk</Text>
          <Text style={s.billName}>{doc.clientSnapshot.name}</Text>
          {doc.clientSnapshot.company ? <Text style={s.billMeta}>{doc.clientSnapshot.company}</Text> : null}
          {doc.clientSnapshot.address ? <Text style={s.billMeta}>{doc.clientSnapshot.address}</Text> : null}
          {doc.clientSnapshot.email ? <Text style={s.billMeta}>{doc.clientSnapshot.email}</Text> : null}
        </View>

        {/* Table */}
        <View style={s.tableHeader}>
          <Text style={[s.thText, s.colName]}>Layanan</Text>
          <Text style={[s.thText, s.colQty]}>Qty</Text>
          <Text style={[s.thText, s.colPrice]}>Harga</Text>
          <Text style={[s.thText, s.colTotal]}>Subtotal</Text>
        </View>

        {doc.items.map((item, i) => (
          <View key={i} style={s.tableRow}>
            <View style={s.colName}>
              <Text style={s.tdName}>{item.name}</Text>
              {item.description ? <Text style={s.tdDesc}>{item.description}</Text> : null}
            </View>
            <Text style={[s.tdMid, s.colQty]}>{item.qty} {item.unit}</Text>
            <Text style={[s.tdMid, s.colPrice]}>{formatIDR(item.price)}</Text>
            <Text style={[s.tdAmount, s.colTotal]}>{formatIDR(item.subtotal)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={s.totalsSection}>
          <View style={s.totalsBox}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Subtotal</Text>
              <Text style={s.totalValue}>{formatIDR(doc.subtotal)}</Text>
            </View>
            {doc.discountAmount > 0 ? (
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>
                  Diskon{doc.discountType === 'percent' ? ` ${doc.discountValue}%` : ''}
                </Text>
                <Text style={[s.totalValue, { color: '#EF4444' }]}>
                  -{formatIDR(doc.discountAmount)}
                </Text>
              </View>
            ) : null}
            {doc.taxAmount > 0 ? (
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>PPN {doc.taxRate}%</Text>
                <Text style={s.totalValue}>{formatIDR(doc.taxAmount)}</Text>
              </View>
            ) : null}
            <View style={s.grandRow}>
              <Text style={s.grandLabel}>Total</Text>
              <Text style={s.grandValue}>{formatIDR(doc.total)}</Text>
            </View>
            {doc.dpAmount && doc.dpAmount > 0 ? (
              <>
                <View style={s.totalRow}>
                  <Text style={s.totalLabel}>DP ({doc.dpPercent}%)</Text>
                  <Text style={s.totalValue}>{formatIDR(doc.dpAmount)}</Text>
                </View>
                <View style={s.totalRow}>
                  <Text style={s.totalLabel}>Sisa pembayaran</Text>
                  <Text style={[s.totalValue, { fontWeight: 500 }]}>
                    {formatIDR(doc.total - doc.dpAmount)}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </View>

        {/* Notes */}
        {doc.notes ? (
          <View style={s.notesBox}>
            <Text style={s.notesLabel}>Catatan</Text>
            <Text style={s.notesText}>{doc.notes}</Text>
          </View>
        ) : null}

        {/* Bank */}
        {bank ? (
          <View style={s.bankSection}>
            <Text style={s.bankLabel}>Informasi pembayaran</Text>
            <Text style={s.bankName}>{bank.bankName} · {bank.accountNumber}</Text>
            <Text style={s.bankMeta}>a.n. {bank.accountHolder}</Text>
            {doc.paymentTerms ? <Text style={s.bankTerms}>{doc.paymentTerms}</Text> : null}
          </View>
        ) : null}

        <Text style={s.footer}>
          Terima kasih atas kepercayaan Anda! — {business.name}
        </Text>
      </Page>
    </Document>
  )
}
