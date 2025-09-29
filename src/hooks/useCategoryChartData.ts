import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "../lib/firebase"

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
  }[]
}

export function useCategoryChartData() {
  const { user } = useAuth()
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [{ label: "Valores (R$)", data: [], backgroundColor: [] }],
  })

  useEffect(() => {
    if (!user) return

    const q = query(collection(db, "transactions"), where("userId", "==", user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const incomeMap: Record<string, number> = {}
      const expenseMap: Record<string, number> = {}
      const subscriptionMap: Record<string, number> = {}

      snapshot.forEach((doc) => {
        const data = doc.data()
        const amount = Number(data.amount ?? 0)

        switch (data.type) {
          case "income":
            incomeMap[data.category ?? "Outros"] = (incomeMap[data.category ?? "Outros"] || 0) + amount
            break
          case "expense":
            expenseMap[data.category ?? "Outros"] = (expenseMap[data.category ?? "Outros"] || 0) + amount
            break
          case "subscription":
            subscriptionMap[data.subscriptionName ?? "Outros"] = (subscriptionMap[data.subscriptionName ?? "Outros"] || 0) + amount
            break
        }
      })

      // Transformar em arrays para o chart
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

      setChartData({
        labels,
        datasets: [
          {
            label: "Valores (R$)",
            data,
            backgroundColor: colors,
          },
        ],
      })
    })

    return () => unsubscribe()
  }, [user])

  return chartData
}
