export interface Receipt {
  receipt_id: string
  merchant: string | null
  total_amount: number | null
  expense_date: string | null
  image_link: string | null
  created_at: string
  user_id: string
}

export interface Item {
  item_id: string
  receipt_id: string | null
  item: string | null
  amount: number | null
  category: string | null
  created_at: string
}

export interface ReceiptWithItems extends Receipt {
  items: Item[]
}

export type Period = 'week' | 'month' | 'quarter' | 'year'

export interface ChartDataPoint {
  date: string
  amount: number
}

export interface CategoryDataPoint {
  name: string
  value: number
}

export interface DashboardStats {
  total: number
  count: number
  average: number
  topCategory: string | null
}
