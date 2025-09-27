export type TransactionType = "income" | "expense" | "fixedExpense" | "goalIncome"

export interface CardItem {
  id: string
  title?: string
  name?: string
  amount?: number
  type?: TransactionType
  value?: number
  subscriptionType?: string
  date?: string
  nextBilling?: string
}
