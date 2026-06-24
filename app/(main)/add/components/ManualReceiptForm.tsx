"use client"

import { useState, useTransition } from "react"
import Link from "next/link"

interface ItemRow {
  item: string
  category: string
  amount: string
}

const CATEGORIES = ["Food", "Transport", "Shopping", "Utilities", "Health", "Entertainment", "Other"]

const emptyItem = (): ItemRow => ({ item: "", category: "", amount: "" })

export function ManualReceiptForm() {
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState<ItemRow[]>([emptyItem()])
  const [error, setError] = useState("")
  const [savedReceiptId, setSavedReceiptId] = useState<string | null>(null)

  const updateItem = (i: number, field: keyof ItemRow, value: string) =>
    setItems((prev) => prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)))

  const addItem = () => setItems((prev) => [...prev, emptyItem()])

  const removeItem = (i: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i))

  const total = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0)

  const handleAction = (formData: FormData) => {
    setError("")
    startTransition(async () => {
      const merchant = formData.get("merchant") as string
      const expense_date = formData.get("expense_date") as string

      const response = await fetch("/api/receipts/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant: merchant || null,
          expense_date: expense_date || null,
          items: items
            .filter((i) => i.item.trim())
            .map((i) => ({
              item: i.item.trim(),
              category: i.category || null,
              amount: parseFloat(i.amount) || 0,
            })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? "Failed to save receipt")
        return
      }

      setSavedReceiptId(data.receiptId)
    })
  }

  const reset = () => {
    setSavedReceiptId(null)
    setItems([emptyItem()])
    setError("")
  }

  if (savedReceiptId) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl">
          ✓
        </div>
        <p className="text-zinc-100 font-medium">Receipt saved!</p>
        <div className="flex gap-3">
          <Link
            href={`/receipts/${savedReceiptId}`}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
          >
            View Receipt
          </Link>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium transition"
          >
            Add New Receipt
          </button>
        </div>
      </div>
    )
  }

  return (
    <form action={handleAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Merchant</label>
          <input
            name="merchant"
            type="text"
            placeholder="Store or restaurant name"
            className="rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Date</label>
          <input
            name="expense_date"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition [color-scheme:dark]"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-zinc-300">Items</label>
          <button
            type="button"
            onClick={addItem}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition"
          >
            + Add item
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-12 gap-2 text-xs text-zinc-500 px-1">
            <span className="col-span-5">Item</span>
            <span className="col-span-4">Category</span>
            <span className="col-span-2">Amount</span>
          </div>

          {items.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input
                value={row.item}
                onChange={(e) => updateItem(i, "item", e.target.value)}
                placeholder="Item name"
                className="col-span-5 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500 transition"
              />
              <input
                list="categories"
                value={row.category}
                onChange={(e) => updateItem(i, "category", e.target.value)}
                placeholder="Category"
                className="col-span-4 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500 transition"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={row.amount}
                onChange={(e) => updateItem(i, "amount", e.target.value)}
                placeholder="0.00"
                className="col-span-2 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                disabled={items.length === 1}
                className="col-span-1 text-zinc-600 hover:text-red-400 disabled:opacity-30 transition text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <datalist id="categories">
          {CATEGORIES.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>

      <div className="flex justify-between items-center rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3">
        <span className="text-sm text-zinc-400">Total</span>
        <span className="text-sm font-bold text-zinc-100">
          ₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-semibold text-white transition"
      >
        {isPending ? "Saving…" : "Save Receipt"}
      </button>
    </form>
  )
}
