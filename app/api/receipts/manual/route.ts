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
    .from('receipts')
    .insert({ merchant, expense_date, total_amount, user_id: user.id })
    .select('receipt_id')
    .single()

  if (receiptError || !receipt) {
    return NextResponse.json({ error: receiptError?.message ?? 'Insert failed' }, { status: 400 })
  }

  if (items.length > 0) {
    const { error: itemsError } = await supabase.from('items').insert(
      items.map((i: { item: string; category: string; amount: number }) => ({
        receipt_id: receipt.receipt_id,
        item: i.item,
        amount: Number(i.amount) || 0,
        category: i.category,
      })),
    )
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 400 })
    }
  }

  return NextResponse.json({ receiptId: receipt.receipt_id })
}
