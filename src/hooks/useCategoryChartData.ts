import { useMemo } from "react"
import { useFinance } from "../context/FinanceContext"

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
  }[]
}

export function useCategoryChartData() {
  const { transactions, subscriptions } = useFinance()

  const chartData = useMemo(() => {
    const incomeMap: Record<string, number> = {}
    const expenseMap: Record<string, number> = {}
    const subscriptionMap: Record<string, number> = {}

    // Process transactions
    transactions.forEach((t) => {
      const amount = Number(t.amount ?? 0)
      const category = t.category ?? "Outros"
      if (t.type === "income") {
        incomeMap[category] = (incomeMap[category] || 0) + amount
      } else if (t.type === "expense") {
        expenseMap[category] = (expenseMap[category] || 0) + amount
      }
    })

    // Process subscriptions
    subscriptions.forEach((s) => {
      const amount = Number(s.value ?? 0)
      const name = s.subscriptionName || "Outros"
      subscriptionMap[name] = (subscriptionMap[name] || 0) + amount
    })

    const labels = [
      ...Object.keys(incomeMap),
      ...Object.keys(expenseMap),
      ...Object.keys(subscriptionMap),
    ]

    const data = [
      ...Object.values(incomeMap),
      ...Object.values(expenseMap),
      ...Object.values(subscriptionMap),
    ]

    const colors = [
      ...Object.keys(incomeMap).map(() => "#10b981"), // verde
      ...Object.keys(expenseMap).map(() => "#ef4444"), // vermelho
      ...Object.keys(subscriptionMap).map(() => "#f59e0b"), // laranja
    ]

    return {
      labels,
      datasets: [
        {
          label: "Valores (R$)",
          data,
          backgroundColor: colors,
        },
      ],
    }
  }, [transactions, subscriptions])

  return chartData
}
