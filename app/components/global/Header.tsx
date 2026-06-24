import Link from "next/link"

export default function Header() {
  return (
    <header className="w-full border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl w-full mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="text-zinc-100 font-semibold text-sm tracking-tight">
          ExpenseTracker
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-100 transition">
            Dashboard
          </Link>
          <Link href="/receipts" className="text-zinc-400 hover:text-zinc-100 transition">
            Receipts
          </Link>
          <Link
            href="/upload"
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
          >
            Upload
          </Link>
        </nav>
      </div>
    </header>
  )
}
