import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/app/lib/supabase/server-client"
import { formatPeso, formatDate } from "@/app/lib/dashboard-utils"

export default async function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: receipt } = await supabase
    .from("Receipts")
    .select("*")
    .eq("receipt_id", id)
    .eq("user_id", user!.id)
    .single()

  if (!receipt) notFound()

  const { data: items } = await supabase
    .from("Items")
    .select("*")
    .eq("receipt_id", id)
    .order("created_at", { ascending: true })

  const itemList = items ?? []
  const total = itemList.reduce((sum, i) => sum + Number(i.amount ?? 0), 0)

  return (
    <div className="bg-zinc-950 min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/receipts" className="text-sm text-zinc-500 hover:text-zinc-300 transition">
            ← Receipts
          </Link>
        </div>

        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-zinc-100">
                  {receipt.merchant ?? "Unknown Merchant"}
                </h1>
                <p className="text-sm text-zinc-500 mt-1">{formatDate(receipt.expense_date)}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-400">
                  {formatPeso(Number(receipt.total_amount ?? 0))}
                </p>
                <p className="text-xs text-zinc-600 mt-1">total</p>
              </div>
            </div>

            {receipt.image_link && (
              <a
                href={receipt.image_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition"
              >
                View Image →
              </a>
            )}
          </div>

          <div className="p-6">
            <h2 className="text-sm font-medium text-zinc-400 mb-4">
              Items ({itemList.length})
            </h2>

            {itemList.length === 0 ? (
              <p className="text-zinc-600 text-sm">No items recorded for this receipt.</p>
            ) : (
              <>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-zinc-500 uppercase tracking-wide border-b border-zinc-800">
                      <th className="text-left pb-3 font-medium">Item</th>
                      <th className="text-left pb-3 font-medium">Category</th>
                      <th className="text-right pb-3 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {itemList.map((item) => (
                      <tr key={item.item_id}>
                        <td className="py-3 text-zinc-200">{item.item ?? "—"}</td>
                        <td className="py-3">
                          {item.category ? (
                            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-xs">
                              {item.category}
                            </span>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </td>
                        <td className="py-3 text-right text-zinc-200">
                          {formatPeso(Number(item.amount ?? 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-zinc-700">
                      <td className="pt-3 text-sm font-medium text-zinc-400" colSpan={2}>
                        Total from items
                      </td>
                      <td className="pt-3 text-right font-bold text-zinc-100">
                        {formatPeso(total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
