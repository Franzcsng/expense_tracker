"use client"

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"
import type { CategoryDataPoint } from "@/app/lib/types"

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#f43f5e", "#14b8a6"]

interface Props {
  data: CategoryDataPoint[]
}

export function CategoryChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 h-64 flex items-center justify-center">
        <p className="text-zinc-600">No category data</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
      <h3 className="text-sm font-medium text-zinc-400 mb-4">By Category</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
            labelStyle={{ color: "#a1a1aa", fontSize: 12 }}
            formatter={(v: number) => `₱${v.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
          />
          <Legend
            formatter={(value) => <span className="text-zinc-400 text-xs">{value}</span>}
            wrapperStyle={{ fontSize: 11 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
