"use client"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import type { ChartDataPoint, Period } from "@/app/lib/types"

interface Props {
  data: ChartDataPoint[]
  period: Period
}

const tickLabel = (key: string, period: Period) => {
  if (period === "week" || period === "month") {
    const d = new Date(key + "T00:00:00")
    return d.toLocaleDateString("en-PH", { month: "short", day: "numeric" })
  }
  const [year, month] = key.split("-")
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-PH", {
    month: "short",
    year: "2-digit",
  })
}

export function ExpensesChart({ data, period }: Props) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 h-64 flex items-center justify-center">
        <p className="text-zinc-600">No expense data for this period</p>
      </div>
    )
  }

  const formatted = data.map((d) => ({
    ...d,
    label: tickLabel(d.date, period),
  }))

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
      <h3 className="text-sm font-medium text-zinc-400 mb-4">Expenses Over Time</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={formatted} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₱${Number(v).toLocaleString()}`}
            width={70}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
            labelStyle={{ color: "#a1a1aa", fontSize: 12 }}
            formatter={(v: number) => [`₱${v.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`, "Expenses"]}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#expenseGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
