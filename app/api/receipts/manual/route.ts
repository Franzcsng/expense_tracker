import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/app/lib/supabase/server-client'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { merchant, expense_date, items } = await request.json()

  const total_amount = (items as { amount: number }[]).reduce(
    (sum, i) => sum + (Number(i.amount) || 0),
    0,
  )

  const { data: receipt, error: receiptError } = await supabase
    .from('Receipts')
    .insert({ merchant, expense_date, total_amount, user_id: user.id })
    .select('receipt_id, expense_date, merchant, total_amount')
    .single()

  if (receiptError || !receipt) {
    return NextResponse.json({ error: receiptError?.message ?? 'Insert failed' }, { status: 400 })
  }

  let payloadItems: Array<Record<string, unknown>> = []
  if (items.length > 0) {
    const { data: resItems, error: itemsError } = await supabase
      .from('Items')
      .insert(
        items.map((i: { item: string; category: string; amount: number }) => ({
          receipt_id: receipt.receipt_id,
          item: i.item,
          amount: Number(i.amount) || 0,
          category: i.category,
        })),
      )
      .select('*')

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 400 })
    }

    payloadItems = resItems ?? []
  }

  try {
    const n8nRes = await fetch(process.env.N8N_RECEIPT_CREATION_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ receipt, items: payloadItems }),
    })

    if (!n8nRes.ok) {
      const error = await n8nRes.text()
      return NextResponse.json({ error }, { status: n8nRes.status })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  return NextResponse.json({ receiptId: receipt.receipt_id })
}
