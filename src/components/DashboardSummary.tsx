"use client"

import { useEffect, useState } from "react"
import { db } from "@/src/lib/firebase"
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore"
import { useAuth } from "@/src/context/AuthContext"
import { ArrowUpRight, ArrowDownRight, Wallet, Target, TrendingDown } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import AddRemoveModal from "./ModalAddandRemove"
import AddCardModal from "./AddCardModal"
import SummaryCards from "./SummaryCards"
import CardsSection from "./CardsSection"
import FavoriteGoal from "./FavoriteGoal"
import AddAndRemoveModal from "./ModalAddandRemove"

const formatCurrencyBR = (value: number | string) => {
  const numberValue = typeof value === "string" ? parseFloat(value) || 0 : value
  return numberValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

// Função para calcular porcentagem de mudança
const calculatePercentageChange = (current: number, previous: number): string => {
  if (previous === 0) return current > 0 ? "+100%" : "0%"
  const change = ((current - previous) / previous) * 100
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
}

// Função para filtrar transações por mês
const getTransactionsByMonth = (transactions: any[], monthOffset: number = 0) => {
  const now = new Date()
  const targetDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1)
  const nextMonth = new Date(now.getFullYear(), now.getMonth() - monthOffset + 1, 1)
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.createdAt)
    return transactionDate >= targetDate && transactionDate < nextMonth
  })
}

export default function DashboardSummary({ reloadFlag }: { reloadFlag?: number }) {
  const { user } = useAuth()

  // 🟢 Estados
  const [summary, setSummary] = useState({ 
    total: 0, 
    income: 0, 
    expenses: 0, 
    fixedExpenses: 0,
    previousMonth: { income: 0, expenses: 0, fixedExpenses: 0 }
  })
  const [saldoMetas, setSaldoMetas] = useState(0)
  const [cardsList, setCardsList] = useState<any[]>([])
  const [favoriteGoal, setFavoriteGoal] = useState<any>(null)
  const [selectedGoal, setSelectedGoal] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [editCardData, setEditCardData] = useState<any>(null)
  const [allTransactions, setAllTransactions] = useState<any[]>([])

  // 🔹 Buscar meta favorita
  useEffect(() => {
    if (!user) return
    const favoriteQuery = query(
      collection(db, "goals"),
      where("userId", "==", user.uid),
      where("isPriority", "==", true)
    )
    const unsubscribeFavorite = onSnapshot(favoriteQuery, snapshot => {
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0]
        const data = docSnap.data()
        const savedAmount = Number(data.savedAmount ?? 0)
        setFavoriteGoal({
          id: docSnap.id,
          goalName: data.goalName,
          goalValue: Number(data.goalValue ?? 0),
          savedAmount: Number(data.savedAmount ?? 0),
        })
        setSaldoMetas(savedAmount)
      } else {
        const allGoalsQuery = query(collection(db, "goals"), where("userId", "==", user.uid))
        const unsubscribeAllGoals = onSnapshot(allGoalsQuery, allSnapshot => {
          if (!allSnapshot.empty) {
            const docSnap = allSnapshot.docs[0]
            const data = docSnap.data()
            const savedAmount = Number(data.savedAmount ?? 0)
            setFavoriteGoal({
              id: docSnap.id,
              goalName: data.goalName,
              goalValue: Number(data.goalValue ?? 0),
              savedAmount: Number(data.savedAmount ?? 0),
            })
            setSaldoMetas(savedAmount) 
          } else {
            setFavoriteGoal(null)
            setSaldoMetas(0) 
          }
        })
        return () => unsubscribeAllGoals()
      }
    })
    return () => unsubscribeFavorite()
  }, [user])

  // 🔹 Buscar todas as transações para cálculo de porcentagens
  useEffect(() => {
    if (!user) return

    const q = query(collection(db, "transactions"), where("userId", "==", user.uid))
    const unsubscribe = onSnapshot(q, snapshot => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setAllTransactions(transactions)

      // Calcular mês atual
      const currentMonthTransactions = getTransactionsByMonth(transactions, 0)
      const previousMonthTransactions = getTransactionsByMonth(transactions, 1)

      let currentIncome = 0
      let currentExpenses = 0
      let currentFixedExpenses = 0
      let previousIncome = 0
      let previousExpenses = 0
      let previousFixedExpenses = 0

      // Mês atual
      currentMonthTransactions.forEach(transaction => {
        if (transaction.type === "balance" || transaction.type === "income") {
          currentIncome += Number(transaction.amount ?? 0)
        }
        if (transaction.type === "expense") {
          currentExpenses += Number(transaction.amount ?? 0)
        }
        if (transaction.type === "fixedExpense") {
          currentFixedExpenses += Number(transaction.amount ?? 0)
        }
      })

      // Mês anterior
      previousMonthTransactions.forEach(transaction => {
        if (transaction.type === "balance" || transaction.type === "income") {
          previousIncome += Number(transaction.amount ?? 0)
        }
        if (transaction.type === "expense") {
          previousExpenses += Number(transaction.amount ?? 0)
        }
        if (transaction.type === "fixedExpense") {
          previousFixedExpenses += Number(transaction.amount ?? 0)
        }
      })

      setSummary({
        income: currentIncome,
        expenses: currentExpenses,
        fixedExpenses: currentFixedExpenses,
        total: Math.max(currentIncome - currentExpenses - currentFixedExpenses, 0),
        previousMonth: {
          income: previousIncome,
          expenses: previousExpenses,
          fixedExpenses: previousFixedExpenses
        }
      })
    })

    return () => unsubscribe()
  }, [user])

  // 🔹 Buscar cartões do usuário
  useEffect(() => {
    if (!user) return
    const q = query(collection(db, "cards"), where("userId", "==", user.uid))
    const unsub = onSnapshot(q, (snap) => {
      setCardsList(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [user, reloadFlag])

  // 🔹 Adicionar cartão
  const handleAddCard = async (data: any) => {
    if (!user) return
    await addDoc(collection(db, "cards"), { ...data, userId: user.uid, createdAt: new Date().toISOString() })
    toast.success("Cartão adicionado com sucesso!")
  }

  // 🔹 Editar cartão
  const handleEditCard = (card: any) => {
    setEditCardData(card)
    setAddCardOpen(true)
  }

  const handleUpdateCard = async (data: any) => {
    if (!user || !editCardData) return
    try {
      const cardRef = doc(db, "cards", editCardData.id)
      await updateDoc(cardRef, { ...data, updatedAt: new Date().toISOString() })
      toast.success("Cartão atualizado com sucesso!")
      setEditCardData(null)
      setAddCardOpen(false)
    } catch (err) {
      console.error(err)
      toast.error("Erro ao atualizar o cartão")
    }
  }

  const handleDeleteCard = async () => {
    if (!editCardData) return
    try {
      await deleteDoc(doc(db, "cards", editCardData.id))
      toast.success("Cartão excluído com sucesso!")
      setEditCardData(null)
      setAddCardOpen(false)
      setSelectedCardId(null) 
    } catch (err) {
      console.error(err)
      toast.error("Erro ao excluir o cartão")
    }
  }

  // 🔹 Calcular porcentagens dinâmicas
  const incomePercentage = calculatePercentageChange(summary.income, summary.previousMonth.income)
  const incomeChangeType = summary.income >= summary.previousMonth.income ? 'positive' : 'negative'
  
  const saldoPercentage = summary.income > 0 ? `${((summary.total / summary.income) * 100).toFixed(1)}% da renda` : "0% da renda"
  
  const goalPercentage = favoriteGoal && favoriteGoal.goalValue > 0 
    ? `${((saldoMetas / favoriteGoal.goalValue) * 100).toFixed(1)}% da meta` 
    : "Sem meta"

  // 🔹 Cards principais consolidados (apenas 4 cards)
  const cards = [
    { 
      label: "Saldo Total", 
      value: summary.total, 
      icon: Wallet, 
      color: "text-blue-400", 
      valueColor: "text-white",
      subtitle: "Disponível",
      change: saldoPercentage,
      changeType: "positive"
    },
    { 
      label: "Receitas", 
      value: summary.income, 
      icon: ArrowUpRight, 
      color: "text-green-400", 
      valueColor: "text-green-400",
      subtitle: "Este mês",
      change: incomePercentage,
      changeType: incomeChangeType
    },
    { 
      label: "Despesas Totais", 
      value: summary.expenses + summary.fixedExpenses, 
      icon: TrendingDown, 
      color: "text-red-400", 
      valueColor: "text-red-400",
      subtitle: "Este mês",
      change: `-${formatCurrencyBR(summary.expenses + summary.fixedExpenses)}`,
      changeType: "negative"
    },
    { 
      label: "Saldo Metas", 
      value: saldoMetas, 
      icon: Target, 
      color: "text-purple-400", 
      valueColor: "text-purple-400",
      subtitle: "Guardado",
      change: goalPercentage,
      changeType: "positive"
    }
  ]

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SummaryCards cards={cards} />

        <CardsSection
          cardsList={cardsList}
          selectedCardId={selectedCardId}
          setSelectedCardId={setSelectedCardId}
          onAddCard={() => setAddCardOpen(true)}
          onEditCard={handleEditCard}
        />
      </div>

      {favoriteGoal && <FavoriteGoal goal={favoriteGoal} onOpenModal={(goal) => { setSelectedGoal(goal); setModalOpen(true) }} />}

      {modalOpen && selectedGoal && (
        <AddAndRemoveModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultType="income"
          onSave={async (data) => {
            if (!user || !selectedGoal) return
            const amount = Number(data.amount) / 100 
            const goalRef = doc(db, "goals", selectedGoal.id)

            try {
              let newSaved: number

              if (data.transactionType === "income") {
                newSaved = (selectedGoal.savedAmount ?? 0) + amount
                await updateDoc(goalRef, { savedAmount: newSaved })
                toast.success(`Adicionado ${formatCurrencyBR(amount)} à meta ${selectedGoal.goalName}`)
              } else {
                newSaved = Math.max((selectedGoal.savedAmount ?? 0) - amount, 0)
                await updateDoc(goalRef, { savedAmount: newSaved })
                toast.success(`Retirado ${formatCurrencyBR(amount)} da meta ${selectedGoal.goalName}`)
              }

              setSaldoMetas(newSaved)
              setFavoriteGoal(prev => ({ ...prev, savedAmount: newSaved }))

              await addDoc(collection(db, "transactions"), {
                userId: user.uid,
                amount: amount,
                type: data.transactionType === "income" ? "income" : "expense",
                category: "meta", 
                description: `${data.transactionType === "income" ? "Adicionado" : "Retirado"} da meta ${selectedGoal.goalName}`,
                createdAt: new Date().toISOString(),
              })

              setModalOpen(false)
            } catch (err) {
              console.error(err)
              toast.error("Erro ao atualizar a meta")
            }
          }}
        />
      )}

      {addCardOpen && (
        <AddCardModal
          isOpen={addCardOpen}
          onClose={() => { setAddCardOpen(false); setEditCardData(null) }}
          onSubmit={editCardData ? handleUpdateCard : handleAddCard}
          editData={editCardData}
          onDelete={editCardData ? handleDeleteCard : undefined} 
        />
      )}
    </>
  )
}