import Link from "next/link"
import { createClient } from "@/app/lib/supabase/server-client"
import {
  getDateRange,
  computeStats,
  computeChartData,
  computeCategoryData,
} from "@/app/lib/dashboard-utils"
import type { Period, Item, ReceiptWithItems } from "@/app/lib/types"
import { PeriodFilter } from "./components/PeriodFilter"
import { StatsGrid } from "./components/StatsGrid"
import { ExpensesChart } from "./components/ExpensesChart"
import { CategoryChart } from "./components/CategoryChart"
import { RecentTransactions } from "./components/RecentTransactions"

const VALID_PERIODS: Period[] = ["week", "month", "quarter", "year"]

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; ref?: string }>
}) {
  const { period: periodParam, ref: refParam } = await searchParams

  const period: Period = VALID_PERIODS.includes(periodParam as Period)
    ? (periodParam as Period)
    : "month"

  const refDate = refParam ? new Date(refParam) : new Date()
  const { start, end } = getDateRange(period, refDate)
  const startStr = start.toISOString().slice(0, 10)
  const endStr = end.toISOString().slice(0, 10)

  console.log(startStr, endStr)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: receipts } = await supabase
    .from("Receipts")
    .select("*")
    .eq("user_id", user!.id)
    .gte("expense_date", startStr)
    .lte("expense_date", endStr)
    .order("expense_date", { ascending: true })

  const receiptIds = (receipts ?? []).map((r) => r.receipt_id)

  let periodItems: Item[] = []
  if (receiptIds.length > 0) {
    const { data } = await supabase
      .from("Items")
      .select("*")
      .in("receipt_id", receiptIds)
    periodItems = (data ?? []) as Item[]
  }

  const stats = computeStats((receipts ?? []) as any, periodItems)
  const chartData = computeChartData((receipts ?? []) as any, period)
  const categoryData = computeCategoryData(periodItems)


  const { data: recentReceipts } = await supabase
    .from("Receipts")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const recentIds = (recentReceipts ?? []).map((r) => r.receipt_id)
  let recentItems: Item[] = []
  if (recentIds.length > 0) {
    const { data } = await supabase.from("Items").select("*").in("receipt_id", recentIds)
    recentItems = (data ?? []) as Item[]
  }

  const recentTransactions: ReceiptWithItems[] = (recentReceipts ?? []).map((r) => ({
    ...r,
    items: recentItems.filter((i) => i.receipt_id === r.receipt_id),
  }))

  return (
    <div className="bg-zinc-950 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-0.5">Track your expenses</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/upload"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
            >
              Upload Receipt
            </Link>
            <Link
              href="/add"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium transition"
            >
              Add Manually
            </Link>
          </div>
        </div>

        <PeriodFilter period={period} refDate={refDate.toISOString().slice(0, 10)} />

        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <ExpensesChart data={chartData} period={period} />
          </div>
          <div>
            <CategoryChart data={categoryData} />
          </div>
        </div>

        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  )
}
