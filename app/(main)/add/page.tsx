import Link from "next/link"
import { ManualReceiptForm } from "./components/ManualReceiptForm"

export default function AddPage() {
  return (
    <div className="bg-zinc-950 min-h-screen p-6">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-300 transition">
            ← Back to Dashboard
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Add Receipt</h1>
        <p className="text-sm text-zinc-500 mb-8">
          Manually enter receipt details and individual items.
        </p>
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8">
          <ManualReceiptForm />
        </div>
      </div>
    </div>
  )
}
