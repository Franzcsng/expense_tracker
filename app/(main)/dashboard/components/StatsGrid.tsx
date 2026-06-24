import { formatPeso } from "@/app/lib/dashboard-utils"
import type { DashboardStats } from "@/app/lib/types"

interface Props {
  stats: DashboardStats
}

export function StatsGrid({ stats }: Props) {
  const cards = [
    {
      label: "Total Expenses",
      value: formatPeso(stats.total),
      sub: `${stats.count} receipt${stats.count !== 1 ? "s" : ""}`,
      color: "text-indigo-400",
    },
    {
      label: "Average per Receipt",
      value: formatPeso(stats.average),
      sub: "per transaction",
      color: "text-emerald-400",
    },
    {
      label: "Transactions",
      value: String(stats.count),
      sub: "in this period",
      color: "text-sky-400",
    },
    {
      label: "Top Category",
      value: stats.topCategory ?? "—",
      sub: "most spent",
      color: "text-amber-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl bg-zinc-900 border border-zinc-800 p-4"
        >
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide mb-2">
            {c.label}
          </p>
          <p className={`text-xl font-bold ${c.color} truncate`}>{c.value}</p>
          <p className="text-xs text-zinc-600 mt-1">{c.sub}</p>
        </div>
      ))}
    </div>
  )
}
