"use client"

import { useState } from "react"
import Link from "next/link"
import { formatPeso, formatDate } from "@/app/lib/dashboard-utils"
import type { ReceiptWithItems } from "@/app/lib/types"

interface Props {
  transactions: ReceiptWithItems[]
}

export function RecentTransactions({ transactions }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 text-center">
        <p className="text-zinc-500">No transactions yet</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-400">Recent Transactions</h3>
        <Link href="/receipts" className="text-xs text-indigo-400 hover:text-indigo-300 transition">
          View all →
        </Link>
      </div>

      <ul className="divide-y divide-zinc-800">
        {transactions.map((t) => {
          const isOpen = expanded.has(t.receipt_id)
          return (
            <li key={t.receipt_id}>
              <button
                onClick={() => toggle(t.receipt_id)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800/50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm shrink-0">
                    🧾
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-100">
                      {t.merchant ?? "Unknown Merchant"}
                    </p>
                    <p className="text-xs text-zinc-500">{formatDate(t.expense_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-zinc-100">
                    {formatPeso(Number(t.total_amount ?? 0))}
                  </span>
                  <span className="text-zinc-600 text-xs">{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-4 bg-zinc-950/40">
                  {t.items.length === 0 ? (
                    <p className="text-xs text-zinc-600 py-2">No items recorded</p>
                  ) : (
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-zinc-500 border-b border-zinc-800">
                          <th className="text-left py-2 font-medium">Item</th>
                          <th className="text-left py-2 font-medium">Category</th>
                          <th className="text-right py-2 font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.items.map((item) => (
                          <tr key={item.item_id} className="border-b border-zinc-800/50 last:border-0">
                            <td className="py-2 text-zinc-300">{item.item ?? "—"}</td>
                            <td className="py-2 text-zinc-500">{item.category ?? "—"}</td>
                            <td className="py-2 text-right text-zinc-300">
                              {formatPeso(Number(item.amount ?? 0))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <Link
                    href={`/receipts/${t.receipt_id}`}
                    className="inline-block mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition"
                  >
                    View full receipt →
                  </Link>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
