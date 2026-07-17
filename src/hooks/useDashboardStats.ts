import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'

export function useDashboardStats() {
  return useLiveQuery(async () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime()
    const todayStr = now.toISOString().split('T')[0]

    const allDocs = await db.documents.where('type').equals('invoice').toArray()

    // Auto-mark overdue: sent + dueDate sudah lewat → overdue
    const toMarkOverdue = allDocs.filter(
      (d) => d.status === 'sent' && d.dueDate && d.dueDate < todayStr,
    )
    if (toMarkOverdue.length > 0) {
      await Promise.all(
        toMarkOverdue.map((d) =>
          db.documents.update(d.id!, { status: 'overdue', updatedAt: Date.now() }),
        ),
      )
      // Update local array supaya stats di bawah ikut benar
      toMarkOverdue.forEach((d) => { d.status = 'overdue' })
    }

    // Bulan ini: hanya status sent + paid (nilai yang sudah dikirimkan)
    const thisMonthDocs = allDocs.filter((d) => {
      const ts = new Date(d.issueDate).getTime()
      return (
        ts >= startOfMonth &&
        ts <= endOfMonth &&
        (d.status === 'sent' || d.status === 'paid' || d.status === 'overdue')
      )
    })
    const totalThisMonth = thisMonthDocs.reduce((sum, d) => sum + d.total, 0)

    const unpaidDocs = allDocs.filter((d) => d.status === 'sent' || d.status === 'overdue')
    const unpaidCount = unpaidDocs.length
    const unpaidTotal = unpaidDocs.reduce((sum, d) => sum + d.total, 0)

    // "Tagihan bulan ini" = invoice yang TERBIT bulan ini (issueDate),
    // bukan yang lunas bulan ini. Definisi ini sengaja dipakai supaya
    // angka konsisten dengan apa yang user kirimkan bulan berjalan.
    const paidDocs = allDocs.filter((d) => d.status === 'paid')
    const paidCount = paidDocs.length
    const paidTotal = paidDocs.reduce((sum, d) => sum + d.total, 0)

    const draftCount = allDocs.filter((d) => d.status === 'draft').length
    const overdueCount = allDocs.filter((d) => d.status === 'overdue').length
    const sentCount = allDocs.filter((d) => d.status === 'sent').length

    // ── Time-series 6 bulan terakhir (pakai issueDate, bukan label hardcoded)
    //    supaya lintas tahun (Des → Jan) tetap benar.
    const inRange = (doc: typeof allDocs[number], start: number, end: number) => {
      const ts = new Date(doc.issueDate).getTime()
      return ts >= start && ts <= end
    }

    const buildMonthly = (predicate: (d: typeof allDocs[number]) => boolean) =>
      Array.from({ length: 6 }, (_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - (5 - i))
        const start = new Date(d.getFullYear(), d.getMonth(), 1).getTime()
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).getTime()
        const label = d.toLocaleString('id', { month: 'short', year: '2-digit' })
        const total = allDocs
          .filter((doc) => inRange(doc, start, end) && predicate(doc))
          .reduce((sum, doc) => sum + doc.total, 0)
        return { label, total }
      })

    // Bar chart: revenue per bulan (paid saja) + toggle sent (sent+overdue)
    const monthlyPaid = buildMonthly((d) => d.status === 'paid')
    const monthlySent = buildMonthly((d) => d.status === 'sent' || d.status === 'overdue')

    // Line chart: tren unpaid vs paid (total nilai per bulan, 6 bulan)
    const trendPaid = buildMonthly((d) => d.status === 'paid')
    const trendUnpaid = buildMonthly((d) => d.status === 'sent' || d.status === 'overdue')

    // Donut: komposisi status invoice saat ini
    const statusData = [
      { label: 'Lunas', value: paidCount, color: '#10B981' },
      { label: 'Menunggu', value: sentCount, color: '#F59E0B' },
      { label: 'Terlambat', value: overdueCount, color: '#EF4444' },
      { label: 'Draft', value: draftCount, color: '#9CA3AF' },
    ].filter((s) => s.value > 0)

    const recent = await db.documents.orderBy('createdAt').reverse().limit(5).toArray()

    return {
      totalThisMonth,
      unpaidCount,
      unpaidTotal,
      paidCount,
      paidTotal,
      draftCount,
      overdueCount,
      monthlyPaid,
      monthlySent,
      trendPaid,
      trendUnpaid,
      statusData,
      recent,
    }
  })
}
