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

    const paidDocs = allDocs.filter((d) => d.status === 'paid')
    const paidCount = paidDocs.length
    const paidTotal = paidDocs.reduce((sum, d) => sum + d.total, 0)

    const draftCount = allDocs.filter((d) => d.status === 'draft').length
    const overdueCount = allDocs.filter((d) => d.status === 'overdue').length

    // Monthly revenue (paid only) — 6 bulan terakhir
    const monthLabels = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
    const monthlyData: { label: string; total: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const start = new Date(d.getFullYear(), d.getMonth(), 1)
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
      const label = monthLabels[d.getMonth()]
      const total = allDocs
        .filter((doc) => {
          const ts = new Date(doc.issueDate).getTime()
          return ts >= start.getTime() && ts <= end.getTime() && doc.status === 'paid'
        })
        .reduce((sum, doc) => sum + doc.total, 0)
      monthlyData.push({ label, total })
    }

    const recent = await db.documents.orderBy('createdAt').reverse().limit(5).toArray()

    return {
      totalThisMonth,
      unpaidCount,
      unpaidTotal,
      paidCount,
      paidTotal,
      draftCount,
      overdueCount,
      monthlyData,
      recent,
    }
  })
}
