"use client"

import { useTransition, useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/app/lib/supabase/browser-client"

type JobStatus = "idle" | "uploading" | "processing" | "completed" | "failed"

export function UploadReceiptForm() {
  const [preview, setPreview] = useState<string | null>(null)
  const [jobStatus, setJobStatus] = useState<JobStatus>("idle")
  const [processingJobId, setProcessingJobId] = useState<string | null>(null)
  const [receiptId, setReceiptId] = useState<string | null>(null)
  const [error, setError] = useState<string>("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!processingJobId) return

    const supabase = createClient()
    const channel = supabase
      .channel(`job:${processingJobId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Processing_jobs",
          filter: `id=eq.${processingJobId}`,
        },
        (payload) => {
          const { status, receipt_id } = payload.new as { status: string; receipt_id: string }
          if (status === "completed") {
            setJobStatus("completed")
            setReceiptId(receipt_id ?? null)
          } else if (status === "failed") {
            setJobStatus("failed")
            setError("Processing failed. Please try again.")
          }
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [processingJobId])

  const handleAction = (formData: FormData) => {
    setError("")
    setJobStatus("uploading")

    startTransition(async () => {
      const response = await fetch("/api/receipts", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setJobStatus("failed")
        setError(data.error ?? "Upload failed")
        return
      }

      setProcessingJobId(data.processingJobId)
      setJobStatus("processing")
    })
  }

  const reset = () => {
    setJobStatus("idle")
    setPreview(null)
    setProcessingJobId(null)
    setReceiptId(null)
    setError("")
  }

  if (jobStatus === "processing") {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-zinc-100 font-medium">Processing your receipt…</p>
        <p className="text-zinc-500 text-sm text-center max-w-xs">
          Our AI is extracting the receipt data. This usually takes 10–30 seconds.
        </p>
      </div>
    )
  }

  if (jobStatus === "completed") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl">
          ✓
        </div>
        <p className="text-zinc-100 font-medium">Receipt processed!</p>
        <div className="flex gap-3">
          {receiptId && (
            <Link
              href={`/receipts/${receiptId}`}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
            >
              View Receipt
            </Link>
          )}
          <Link
            href="/add"
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium transition"
          >
            Add New Receipt
          </Link>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 text-sm transition"
          >
            Upload Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <form action={handleAction} className="flex flex-col gap-6">
      <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-zinc-700 hover:border-indigo-500 rounded-xl p-10 cursor-pointer transition">
        <span className="text-3xl">📎</span>
        <span className="text-zinc-300 font-medium">
          {preview ? "Change image" : "Select receipt image"}
        </span>
        <span className="text-zinc-600 text-sm">PNG, JPG, WEBP supported</span>
        <input
          name="receipt"
          type="file"
          accept="image/*"
          required
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            setPreview(file ? URL.createObjectURL(file) : null)
          }}
        />
      </label>

      {preview && (
        <img
          src={preview}
          alt="Receipt preview"
          className="rounded-xl max-h-64 object-contain bg-zinc-800"
        />
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-semibold text-white transition"
      >
        {isPending ? "Uploading…" : "Upload Receipt"}
      </button>
    </form>
  )
}
