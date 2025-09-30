import { useTransactionsByType } from "./useTransactionsByType"

export function useIncomes() {
  return useTransactionsByType("income")
}
