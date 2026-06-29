import { DocumentList } from '../components/document/DocumentList'

export function InvoiceList() {
  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Invoice</h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Kelola semua invoice kamu
        </p>
      </div>
      <DocumentList type="invoice" />
    </div>
  )
}
