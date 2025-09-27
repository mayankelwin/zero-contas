"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { collection, query, where, onSnapshot, getDocs, deleteDoc, doc } from "firebase/firestore"

import { db } from "@/src/lib/firebase"
import { useAuth } from "@/src/context/AuthContext"
import { useCategoryChartData } from "@/src/hooks/useCategoryChartData"
import { CardItem } from "@/src/types/transactions"

export function useHomeLogic() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<"income" | "expense" | null>(null)
  const [reloadFlag, setReloadFlag] = useState(0)
  const [summaryData, setSummaryData] = useState({ income: 0, expenses: 0, fixedExpenses: 0, savedAmount: 0 })
  const [transactions, setTransactions] = useState<CardItem[]>([])
  const [goals, setGoals] = useState<any[]>([])

  const categoryChartData = useCategoryChartData()

  // Redirect se não autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [loading, user, router])

  // Modal
  const handleSelectType = useCallback((type: "income" | "expense") => {
    setTransactionType(type)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setTransactionType(null)
    setIsModalOpen(false)
  }, [])

  // 🔹 Resumo do Firebase e transações recentes
    useEffect(() => {
    if (!user) return

    const transactionsQuery = query(collection(db, "transactions"), where("userId", "==", user.uid))
    const subscriptionsQuery = query(collection(db, "subscriptions"), where("userId", "==", user.uid))
    const goalsQuery = query(collection(db, "goals"), where("userId", "==", user.uid))

    const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const txns: CardItem[] = []
      let income = 0
      let expenses = 0

      snapshot.forEach(docSnap => {
        const data = docSnap.data() as CardItem
        txns.push({ id: docSnap.id, ...data })
        const amount = Number(data.amount ?? 0)

        if (data.type === "income") income += amount
        else if (data.type === "expense") expenses += amount
      })

      setTransactions(prev => ({ ...prev, transactions: txns }))
      setSummaryData(prev => ({ ...prev, income, expenses }))
    })

    const unsubscribeSubscriptions = onSnapshot(subscriptionsQuery, (snapshot) => {
      const subs: CardItem[] = []
      let fixedExpenses = 0

      snapshot.forEach(docSnap => {
        const data = docSnap.data() as CardItem
        subs.push({ id: docSnap.id, ...data, type: "fixedExpense" })
        fixedExpenses += Number(data.value ?? 0)
      })

      setTransactions(prev => ({ ...prev, subscriptions: subs }))
      setSummaryData(prev => ({ ...prev, fixedExpenses }))
    })

    const unsubscribeGoals = onSnapshot(goalsQuery, (snapshot) => {
      const goalsArr: any[] = []
      let savedAmountTotal = 0

      snapshot.forEach(docSnap => {
        const data = docSnap.data()
        goalsArr.push({ id: docSnap.id, ...data })
        savedAmountTotal += Number(data.savedAmount ?? 0)
      })

      setGoals(goalsArr)
      setSummaryData(prev => ({ ...prev, savedAmount: savedAmountTotal }))
    })

    return () => {
      unsubscribeTransactions()
      unsubscribeSubscriptions()
      unsubscribeGoals()
    }
  }, [user])


  // 🔹 Deletar todos os dados
  const handleDeleteAllData = useCallback(async () => {
    if (!user) return

    const confirmation = confirm("Deseja realmente apagar todos os dados? Isso não pode ser desfeito.")
    if (!confirmation) return

    try {
      const collections = ["transactions", "subscriptions", "goals"]

      for (const colName of collections) {
        const snapshot = await getDocs(query(collection(db, colName), where("userId", "==", user.uid)))
        await Promise.all(snapshot.docs.map((docSnap) => deleteDoc(doc(db, colName, docSnap.id))))
      }

      toast.success("Todos os dados foram apagados com sucesso!")
      setReloadFlag(prev => prev + 1)
    } catch (err) {
      console.error("Erro ao apagar dados:", err)
      toast.error("Ocorreu um erro ao apagar os dados.")
    }
  }, [user])

  // 🔹 Dados para gráfico (incluindo saldo de metas)
  const spendingData = useMemo(() => ({
    labels: ["Receitas", "Despesas", "Despesas Fixas", "Saldo Metas"],
    datasets: [
      {
        label: "Valores (R$)",
        data: [
          summaryData.income,
          summaryData.expenses,
          summaryData.fixedExpenses,
          summaryData.savedAmount ?? 0
        ],
        backgroundColor: ["#10b981", "#ef4444", "#f59e0b", "#8b5cf6"],
        borderWidth: 1,
      },
    ],
  }), [summaryData])

  // 🔹 Transações recentes incluindo metas
  const recentTransactions = useMemo(() => {
    const allTxns: CardItem[] = [
      ...(transactions.transactions ?? []),
      ...(transactions.subscriptions ?? []),
      ...goals.map(goal => ({
        id: goal.id,
        amount: goal.savedAmount ?? 0,
        type: "income",
        category: "meta",
        description: `Saldo guardado da meta: ${goal.goalName}`,
        createdAt: goal.updatedAt ?? new Date().toISOString(),
      }))
    ]

    return allTxns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [transactions, goals])


  return {
    user,
    loading,
    isMenuOpen,
    setIsMenuOpen,
    isModalOpen,
    transactionType,
    reloadFlag,
    categoryChartData,
    spendingData,
    recentTransactions,
    handleSelectType,
    handleCloseModal,
    handleDeleteAllData,
  }
}
