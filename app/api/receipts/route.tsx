import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/app/lib/supabase/server-client'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') ?? '50')
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  let query = supabase
    .from('Receipts')
    .select('*')
    .eq('user_id', user.id)
    .order('expense_date', { ascending: false })
    .limit(limit)

  if (start) query = query.gte('expense_date', start)
  if (end) query = query.lte('expense_date', end)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const files = (formData.getAll('receipts') as File[]).filter(f => f.size > 0)

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const { data: job, error: jobError } = await supabase
      .from('Processing_jobs')
      .insert({ user_id: user.id, status: 'started' })
      .select('id')
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: jobError?.message ?? 'Failed to create job' }, { status: 500 })
    }

    const jobId = job.id

    // Upload images to supabase storage
    const uploadedReceipts = await Promise.all(
      files.map((file) => {
        const ext = file.name.split('.').pop() ?? 'jpg'
        const path = `receipts/${user.id}/${jobId}/${crypto.randomUUID()}.${ext}`
        return supabase.storage
          .from("Expense Tracker Bucket")
          .upload(path, file)
      })
    )

    const uploadedReceiptsUrls: string[] = uploadedReceipts.map((result) => {
      return result.data!.path})

    const rows = uploadedReceiptsUrls.map((result) => ({
        user_id: user.id,
        job_id: jobId,
        storage_path: result,
        receipt_id: null,
        status: "started",
    }));
    
    const { data: uploadsId, error } = await supabase
      .from('Receipt_uploads')
      .insert(rows)
      .select('id')

      console.log("Error: ", error)

      if(!uploadsId || error) {
        return NextResponse.json({ error: 'Failed to insert receipt upload' }, { status: 500 })
      }

    const response = await fetch(process.env.N8N_IMAGE_UPLOAD_URL!, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId,
        user_id: user.id,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      await supabase
        .from('Processing_jobs')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', job.id)
      return NextResponse.json({ error }, { status: response.status })
    }

    return NextResponse.json({ processingJobId: job.id })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
