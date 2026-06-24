import Link from "next/link"
import { createClient } from "@/app/lib/supabase/server-client"
import { formatPeso, formatDate } from "@/app/lib/dashboard-utils"

export default async function ReceiptsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: receipts } = await supabase
    .from("Receipts")
    .select("*")
    .eq("user_id", user!.id)
    .order("expense_date", { ascending: false })

  const receiptList = receipts ?? []

  const receiptIds = receiptList.map((r) => r.receipt_id)
  const itemCounts: Record<string, number> = {}

  if (receiptIds.length > 0) {
    const { data: items } = await supabase
      .from("Items")
      .select("item_id, receipt_id")
      .in("receipt_id", receiptIds)

    for (const item of items ?? []) {
      if (item.receipt_id) {
        itemCounts[item.receipt_id] = (itemCounts[item.receipt_id] ?? 0) + 1
      }
    }
  }

  return (
    <div className="bg-zinc-950 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-300 transition block mb-1">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-zinc-100">Receipts</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/upload"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
            >
              Upload
            </Link>
            <Link
              href="/add"
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium transition"
            >
              Add Manually
            </Link>
          </div>
        </div>

        {receiptList.length === 0 ? (
          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-12 text-center">
            <p className="text-zinc-500 mb-4">No receipts yet</p>
            <Link href="/upload" className="text-indigo-400 hover:text-indigo-300 text-sm transition">
              Upload your first receipt →
            </Link>
          </div>
        ) : (
          <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Merchant</th>
                  <th className="text-right px-5 py-3 font-medium">Total</th>
                  <th className="text-right px-5 py-3 font-medium">Items</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {receiptList.map((r) => (
                  <tr key={r.receipt_id} className="hover:bg-zinc-800/40 transition">
                    <td className="px-5 py-3.5 text-zinc-400">{formatDate(r.expense_date)}</td>
                    <td className="px-5 py-3.5 text-zinc-100 font-medium">
                      {r.merchant ?? <span className="text-zinc-600">Unknown</span>}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-100 text-right font-medium">
                      {formatPeso(Number(r.total_amount ?? 0))}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500 text-right">
                      {itemCounts[r.receipt_id] ?? 0}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/receipts/${r.receipt_id}`}
                        className="text-indigo-400 hover:text-indigo-300 transition text-xs"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
