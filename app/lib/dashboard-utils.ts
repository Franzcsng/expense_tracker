import type { Receipt, Item, Period, ChartDataPoint, CategoryDataPoint, DashboardStats } from './types'

export function getDateRange(period: Period, ref: Date): { start: Date; end: Date } {
  const start = new Date(ref)
  const end = new Date(ref)

  switch (period) {
    case 'week': {
      const day = start.getDay()
      const diff = day === 0 ? -6 : 1 - day
      start.setDate(start.getDate() + diff)
      end.setDate(start.getDate() + 6)
      break
    }
    case 'month':
      start.setDate(1)
      end.setMonth(end.getMonth() + 1, 0)
      break
    case 'quarter': {
      const q = Math.floor(start.getMonth() / 3)
      start.setMonth(q * 3, 1)
      end.setMonth(q * 3 + 3, 0)
      break
    }
    case 'year':
      start.setMonth(0, 1)
      end.setMonth(11, 31)
      break
  }

  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export function computeStats(receipts: Receipt[], items: Item[]): DashboardStats {
  const total = receipts.reduce((sum, r) => sum + Number(r.total_amount ?? 0), 0)
  const count = receipts.length
  const average = count > 0 ? total / count : 0

  const categoryTotals: Record<string, number> = {}
  for (const item of items) {
    const cat = item.category ?? 'Uncategorized'
    categoryTotals[cat] = (categoryTotals[cat] ?? 0) + Number(item.amount ?? 0)
  }

  let topCategory: string | null = null
  let topValue = 0
  for (const [cat, val] of Object.entries(categoryTotals)) {
    if (val > topValue) { topCategory = cat; topValue = val }
  }

  return { total, count, average, topCategory }
}

export function computeChartData(receipts: Receipt[], period: Period): ChartDataPoint[] {
  const groups: Record<string, number> = {}

  for (const r of receipts) {
    if (!r.expense_date) continue
    const key = (period === 'week' || period === 'month')
      ? r.expense_date.slice(0, 10)
      : r.expense_date.slice(0, 7)
    groups[key] = (groups[key] ?? 0) + Number(r.total_amount ?? 0)
  }

  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({ date, amount }))
}

export function computeCategoryData(items: Item[]): CategoryDataPoint[] {
  const groups: Record<string, number> = {}
  for (const item of items) {
    const cat = item.category ?? 'Uncategorized'
    groups[cat] = (groups[cat] ?? 0) + Number(item.amount ?? 0)
  }
  return Object.entries(groups)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name, value }))
}

export function getPeriodLabel(period: Period, ref: Date): string {
  const { start, end } = getDateRange(period, ref)
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
    d.toLocaleDateString('en-PH', opts)

  switch (period) {
    case 'week':
      return `${fmt(start, { month: 'short', day: 'numeric' })} – ${fmt(end, { month: 'short', day: 'numeric', year: 'numeric' })}`
    case 'month':
      return fmt(ref, { month: 'long', year: 'numeric' })
    case 'quarter': {
      const q = Math.floor(ref.getMonth() / 3) + 1
      return `Q${q} ${ref.getFullYear()}`
    }
    case 'year':
      return String(ref.getFullYear())
  }
}

export function shiftPeriod(period: Period, ref: Date, dir: 1 | -1): Date {
  const next = new Date(ref)
  switch (period) {
    case 'week':    next.setDate(next.getDate() + dir * 7); break
    case 'month':   next.setMonth(next.getMonth() + dir); break
    case 'quarter': next.setMonth(next.getMonth() + dir * 3); break
    case 'year':    next.setFullYear(next.getFullYear() + dir); break
  }
  return next
}

export const formatPeso = (n: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n)

export const formatDate = (s: string | null) =>
  s ? new Date(s).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'
