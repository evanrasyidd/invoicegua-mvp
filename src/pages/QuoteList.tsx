import { DocumentList } from '../components/document/DocumentList'

export function QuoteList() {
  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Penawaran</h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Kelola semua penawaran kamu
        </p>
      </div>
      <DocumentList type="quote" />
    </div>
  )
}
