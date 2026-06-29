import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'

export function useDashboardStats() {
  return useLiveQuery(async () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime()

    const allDocs = await db.documents.where('type').equals('invoice').toArray()

    const thisMonthDocs = allDocs.filter((d) => {
      const ts = new Date(d.issueDate).getTime()
      return ts >= startOfMonth && ts <= endOfMonth
    })

    const totalThisMonth = thisMonthDocs.reduce((sum, d) => sum + d.total, 0)
    const unpaidCount = allDocs.filter((d) => d.status === 'sent' || d.status === 'overdue').length
    const unpaidTotal = allDocs
      .filter((d) => d.status === 'sent' || d.status === 'overdue')
      .reduce((sum, d) => sum + d.total, 0)
    const paidCount = allDocs.filter((d) => d.status === 'paid').length
    const paidTotal = allDocs
      .filter((d) => d.status === 'paid')
      .reduce((sum, d) => sum + d.total, 0)
    const draftCount = allDocs.filter((d) => d.status === 'draft').length

    // Monthly revenue last 6 months
    const monthlyData: { label: string; total: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const start = new Date(d.getFullYear(), d.getMonth(), 1)
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0)
      const label = d.toLocaleDateString('id-ID', { month: 'short' })
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
      monthlyData,
      recent,
    }
  })
}
