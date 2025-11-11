"use client"

import { useEffect, useState } from "react"
import { db } from "@/src/lib/firebase"
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore"
import { useAuth } from "@/src/context/AuthContext"
import { toast } from "react-toastify"

// 🔹 Função utilitária para filtrar transações por mês
const getTransactionsByMonth = (transactions: any[], monthOffset: number = 0) => {
  const now = new Date()
  const targetDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1)
  const nextMonth = new Date(now.getFullYear(), now.getMonth() - monthOffset + 1, 1)

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.createdAt)
    return transactionDate >= targetDate && transactionDate < nextMonth
  })
}

export function useFinanceData(reloadFlag?: number) {
  const { user } = useAuth()

  // 🔹 Estados principais
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
      collection(db, "users", user.uid, "goals"),
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
          goalValue: data.goalValue ?? 0,
          savedAmount,
        })
        setSaldoMetas(savedAmount)
      } else {
        const allGoalsQuery = query(collection(db, "users", user.uid, "goals"))
        const unsubscribeAllGoals = onSnapshot(allGoalsQuery, allSnapshot => {
          if (!allSnapshot.empty) {
            const docSnap = allSnapshot.docs[0]
            const data = docSnap.data()
            const savedAmount = Number(data.savedAmount ?? 0)
            setFavoriteGoal({
              id: docSnap.id,
              goalName: data.goalName,
              goalValue: Number(data.goalValue ?? 0),
              savedAmount,
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

  // 🔹 Buscar todas as transações
  useEffect(() => {
    if (!user) return
    const transactionsRef = collection(db, "users", user.uid, "transactions")

    const unsubscribe = onSnapshot(transactionsRef, snapshot => {
      const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setAllTransactions(transactions)

      const currentMonthTransactions = getTransactionsByMonth(transactions, 0)
      const previousMonthTransactions = getTransactionsByMonth(transactions, 1)

      let currentIncome = 0, currentExpenses = 0, currentFixedExpenses = 0
      let previousIncome = 0, previousExpenses = 0, previousFixedExpenses = 0

      currentMonthTransactions.forEach(transaction => {
        if (transaction.type === "balance" || transaction.type === "income") currentIncome += Number(transaction.amount ?? 0)
        if (transaction.type === "expense") currentExpenses += Number(transaction.amount ?? 0)
        if (transaction.type === "fixedExpense") currentFixedExpenses += Number(transaction.amount ?? 0)
      })

      previousMonthTransactions.forEach(transaction => {
        if (transaction.type === "balance" || transaction.type === "income") previousIncome += Number(transaction.amount ?? 0)
        if (transaction.type === "expense") previousExpenses += Number(transaction.amount ?? 0)
        if (transaction.type === "fixedExpense") previousFixedExpenses += Number(transaction.amount ?? 0)
      })

      setSummary({
        income: currentIncome,
        expenses: currentExpenses,
        fixedExpenses: currentFixedExpenses,
        total: Math.max(currentIncome - currentExpenses - currentFixedExpenses, 0),
        previousMonth: { income: previousIncome, expenses: previousExpenses, fixedExpenses: previousFixedExpenses }
      })
    })

    return () => unsubscribe()
  }, [user])

  // 🔹 Buscar cartões
  useEffect(() => {
    if (!user) return
    const cardsRef = collection(db, "users", user.uid, "cards")

    const unsub = onSnapshot(cardsRef, snap => {
      setCardsList(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })

    return () => unsub()
  }, [user, reloadFlag])

  // 🔹 CRUD cartões
  const handleAddCard = async (data: any) => {
    if (!user) return
    await addDoc(collection(db, "users", user.uid, "cards"), { ...data, createdAt: new Date().toISOString() })
    toast.success("Cartão adicionado com sucesso!")
  }

  const handleEditCard = (card: any) => {
    setEditCardData(card)
    setAddCardOpen(true)
  }

  const handleUpdateCard = async (data: any) => {
    if (!user || !editCardData) return
    try {
      const cardRef = doc(db, "users", user.uid, "cards", editCardData.id)
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
    if (!user || !editCardData) return
    try {
      await deleteDoc(doc(db, "users", user.uid, "cards", editCardData.id))
      toast.success("Cartão excluído com sucesso!")
      setEditCardData(null)
      setAddCardOpen(false)
      setSelectedCardId(null)
    } catch (err) {
      console.error(err)
      toast.error("Erro ao excluir o cartão")
    }
  }

  return {
    summary,
    saldoMetas,
    cardsList,
    favoriteGoal,
    selectedGoal,
    modalOpen,
    addCardOpen,
    selectedCardId,
    editCardData,
    setModalOpen,
    setAddCardOpen,
    setSelectedCardId,
    setSelectedGoal,
    handleAddCard,
    handleEditCard,
    handleUpdateCard,
    handleDeleteCard,
    allTransactions,
  }
}
