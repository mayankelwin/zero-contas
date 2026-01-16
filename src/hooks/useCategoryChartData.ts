import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { collection, onSnapshot } from "firebase/firestore"
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

    // Queries para cada coleção dentro do usuário
    const transactionsQuery = collection(db, "users", user.uid, "transactions")
    const subscriptionsQuery = collection(db, "users", user.uid, "subscriptions")

    // Mapas para armazenar os valores agregados
    const incomeMap: Record<string, number> = {}
    const expenseMap: Record<string, number> = {}
    const subscriptionMap: Record<string, number> = {}

    // Subscrever transações
    const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      // Limpar mapas antes de agregar
      Object.keys(incomeMap).forEach(key => delete incomeMap[key])
      Object.keys(expenseMap).forEach(key => delete expenseMap[key])

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
        }
      })

      // Atualizar gráfico depois de agregar e juntar dados das assinaturas (se já carregadas)
      updateChart()
    })

    // Subscrever assinaturas
    const unsubscribeSubscriptions = onSnapshot(subscriptionsQuery, (snapshot) => {
      // Limpar mapa antes de agregar
      Object.keys(subscriptionMap).forEach(key => delete subscriptionMap[key])

      snapshot.forEach((doc) => {
        const data = doc.data()
        const amount = Number(data.value ?? 0)
        subscriptionMap[data.subscriptionName ?? "Outros"] = (subscriptionMap[data.subscriptionName ?? "Outros"] || 0) + amount
      })

      updateChart()
    })

    // Função para atualizar os dados do gráfico juntando tudo
    function updateChart() {
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
    }

    return () => {
      unsubscribeTransactions()
      unsubscribeSubscriptions()
    }
  }, [user])

  return chartData
}
