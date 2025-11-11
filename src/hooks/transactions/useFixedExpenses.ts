import { useTransactionsByType } from "./useTransactionsByType"

export function useFixedExpenses() {
  return useTransactionsByType("fixedExpense")
}
