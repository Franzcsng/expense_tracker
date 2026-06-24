export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-900">
      <div className="max-w-6xl w-full mx-auto px-6 h-12 flex items-center">
        <p className="text-xs text-zinc-600">© {new Date().getFullYear()} ExpenseTracker</p>
      </div>
    </footer>
  )
}
