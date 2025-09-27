export interface Summary {
  total: number
  income: number
  expenses: number
  fixedExpenses: number
}

export interface Goal {
  id: string
  goalName: string
  goalValue: number
  savedAmount: number
}

export interface CardItem {
  id: string
  bank: string
  cardName: string
  brand: string
  cardNumber: string
  billingDay: number
  interestRate?: number
  creditLimit?: number
  usedCredit?: number
}
