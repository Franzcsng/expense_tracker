"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { getPeriodLabel, shiftPeriod } from "@/app/lib/dashboard-utils"
import type { Period } from "@/app/lib/types"

const PERIODS: { value: Period; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
]

interface Props {
  period: Period
  refDate: string
}

export function PeriodFilter({ period, refDate }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const ref = new Date(refDate)

  const navigate = (newPeriod: Period, newRef: Date) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("period", newPeriod)
    params.set("ref", newRef.toISOString().slice(0, 10))
    router.push(`/dashboard?${params.toString()}`)
  }

  const shift = (dir: 1 | -1) => navigate(period, shiftPeriod(period, ref, dir))

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => shift(-1)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
        >
          ‹
        </button>
        <span className="text-zinc-100 font-medium min-w-48 text-center">
          {getPeriodLabel(period, ref)}
        </span>
        <button
          onClick={() => shift(1)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
        >
          ›
        </button>
      </div>

      <div className="flex rounded-lg bg-zinc-800 p-1 gap-1">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => navigate(p.value, new Date())}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              period === p.value
                ? "bg-indigo-600 text-white"
                : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
