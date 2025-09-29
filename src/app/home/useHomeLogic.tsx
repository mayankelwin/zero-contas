"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { collection, query, where, onSnapshot, getDocs, deleteDoc, doc } from "firebase/firestore"

import { db } from "@/src/lib/firebase"
import { useAuth } from "@/src/context/AuthContext"
import { useCategoryChartData } from "@/src/hooks/useCategoryChartData"
import { CardItem } from "@/src/types/transactions"
import AddTransactionModal from "@/src/components/AddTransactionModal"

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
     setTimeout(() => {
    setIsMenuOpen(false)
    setIsModalOpen(true)
  }, 100) 
  }, [])

  const handleCloseModal = useCallback(() => {
    setTransactionType(null)
    setIsModalOpen(false)
  }, [])

  // 🔹 Resumo do Firebase e transações recentes
    useEffect(() => {
    if (!user) return

    const transactionsQuery = collection(db, "users", user.uid, "transactions")
    const subscriptionsQuery = collection(db, "users", user.uid, "subscriptions")
    const goalsQuery = collection(db, "users", user.uid, "goals")

    
    // Transações normais
    const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const txns: CardItem[] = []

      snapshot.forEach(docSnap => {
        const data = docSnap.data() as CardItem
        txns.push({ id: docSnap.id, ...data })
      })

      setTransactions(prev => {
        // remove antigas "income/expense" para evitar duplicatas
        const filteredPrev = prev.filter(t => t.type !== "income" && t.type !== "expense")
        return [...filteredPrev, ...txns]
      })

      const income = txns.filter(t => t.type === "income").reduce((acc, t) => acc + Number(t.amount ?? 0), 0)
      const expenses = txns.filter(t => t.type === "expense").reduce((acc, t) => acc + Number(t.amount ?? 0), 0)
      setSummaryData(prev => ({ ...prev, income, expenses }))
    })

    // Subscriptions
    const unsubscribeSubscriptions = onSnapshot(subscriptionsQuery, (snapshot) => {
      const subs: CardItem[] = []

      snapshot.forEach(docSnap => {
        const data = docSnap.data() as CardItem
        subs.push({ id: docSnap.id, ...data, type: "fixedExpense" })
      })

      setTransactions(prev => {
        const filteredPrev = prev.filter(t => t.type !== "fixedExpense")
        return [...filteredPrev, ...subs]
      })

      const fixedExpenses = subs.reduce((acc, s) => acc + Number(s.value ?? 0), 0)
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
    const recentTransactions = useMemo(() => [
      ...transactions,
      ...goals.map(goal => ({
        id: goal.id,
        amount: goal.savedAmount ?? 0,
        type: "income",
        category: "meta",
        description: `Saldo guardado da meta: ${goal.goalName}`,
        createdAt: goal.updatedAt ?? new Date().toISOString(),
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [transactions, goals])

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
