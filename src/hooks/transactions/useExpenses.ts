import { useTransactionsByType } from "./useTransactionsByType"

export function useExpenses() {
  return useTransactionsByType("expense")
}
