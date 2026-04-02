import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"

import { db } from "@/src/lib/firebase"
import { useAuth } from "@/src/context/AuthContext"
import { useFinance } from "@/src/context/FinanceContext"
import { useCategoryChartData } from "@/src/hooks/useCategoryChartData"
import { CardItem } from "@/src/types/transactions"

export function useHomeLogic() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { 
    transactions, 
    subscriptions, 
    goals, 
    summary: summaryData, 
    loading: financeLoading 
  } = useFinance()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<"income" | "expense" | "fixedExpense" | "goal" | null>(null)
  const [reloadFlag, setReloadFlag] = useState(0)

  const categoryChartData = useCategoryChartData()
  const loading = authLoading || financeLoading.transactions

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [authLoading, user, router])

  const handleSelectType = useCallback((type: "income" | "expense" | "goal" | "fixedExpense") => { 
    setTransactionType(type)
    setTimeout(() => {
      setIsMenuOpen(false)
      setIsModalOpen(true)
    }, 100) 
  }, [])

  const handleCloseModal = useCallback(() => {
    setTransactionType(null)
    setIsModalOpen(false)
  }, [])

  const handleDeleteAllData = useCallback(async () => {
    if (!user) return

    const confirmation = confirm(
      "Deseja realmente apagar todos os dados? Isso não pode ser desfeito."
    )
    if (!confirmation) return

    try {
      const collections = ["transactions", "subscriptions", "goals", "cards"]

      for (const colName of collections) {
        const colRef = collection(db, "users", user.uid, colName)
        const snapshot = await getDocs(colRef)

        await Promise.all(
          snapshot.docs.map((docSnap) => deleteDoc(doc(colRef, docSnap.id)))
        )
      }

      toast.success("Todos os dados foram apagados com sucesso!")
      setReloadFlag((prev) => prev + 1)
    } catch (err) {
      console.error("Erro ao apagar dados:", err)
      toast.error("Ocorreu um erro ao apagar os dados.")
    }
  }, [user])

  const spendingData = useMemo(() => [
    { label: "Receitas", amount: summaryData.income },
    { label: "Despesas", amount: summaryData.expenses },
    { label: "Assinaturas", amount: summaryData.fixedExpenses },
    { label: "Metas", amount: summaryData.savedAmount ?? 0 }
  ], [summaryData]);

  const recentTransactions = useMemo(() => {
    const all = [
      ...transactions,
      ...subscriptions,
      ...goals.map(goal => ({
        id: goal.id,
        amount: goal.savedAmount ?? 0,
        type: "income" as const,
        category: "meta",
        description: `Saldo guardado da meta: ${goal.goalName}`,
        createdAt: goal.updatedAt ?? new Date().toISOString(),
      } as CardItem))
    ]
    
    return all.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0).getTime()
      const dateB = new Date(b.date || b.createdAt || 0).getTime()
      return dateB - dateA
    })
  }, [transactions, subscriptions, goals])

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
    subscriptions,
    handleSelectType,
    handleCloseModal,
    handleDeleteAllData,
  }
}

