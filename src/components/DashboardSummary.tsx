"use client"

import { useEffect, useState } from "react"
import { db } from "@/src/lib/firebase"
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore"
import { useAuth } from "@/src/context/AuthContext"
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import AddRemoveModal from "./ModalAddandRemove"
import formatCurrency from "../data/formatCurrency"

interface Summary {
  total: number
  income: number
  expenses: number
  fixedExpenses: number
}

interface Goal {
  id: string
  goalName: string
  goalValue: number
  savedAmount: number
}

export default function DashboardSummary() {
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    income: 0,
    expenses: 0,
    fixedExpenses: 0,
  })
  const [goals, setGoals] = useState<Goal[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const { user } = useAuth()
  const [favoriteGoal, setFavoriteGoal] = useState<Goal | null>(null)
  const categories = ["Salário", "Lazer", "Alimentação", "Transporte", "Outro"] // Exemplo de categorias

  // Busca da meta favorita
  useEffect(() => {
    if (!user) return

    // 1️⃣ Consulta metas favoritas
    const favoriteQuery = query(
      collection(db, "goals"),
      where("userId", "==", user.uid),
      where("isPriority", "==", true)
    )

    const unsubscribeFavorite = onSnapshot(favoriteQuery, snapshot => {
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0]
        const data = docSnap.data()
        setFavoriteGoal({
          id: docSnap.id,
          goalName: data.goalName,
          goalValue: Number(data.goalValue ?? 0),
          savedAmount: Number(data.savedAmount ?? 0),
        })
      } else {
        // 2️⃣ Se não houver favorito, pegar qualquer meta existente
        const allGoalsQuery = query(collection(db, "goals"), where("userId", "==", user.uid))
        const unsubscribeAllGoals = onSnapshot(allGoalsQuery, allSnapshot => {
          if (!allSnapshot.empty) {
            const docSnap = allSnapshot.docs[0]
            const data = docSnap.data()
            setFavoriteGoal({
              id: docSnap.id,
              goalName: data.goalName,
              goalValue: Number(data.goalValue ?? 0),
              savedAmount: Number(data.savedAmount ?? 0),
            })
          } else {
            setFavoriteGoal(null)
          }
        })

        return () => unsubscribeAllGoals()
      }
    })

    return () => unsubscribeFavorite()
  }, [user])


  // Resumo financeiro
  useEffect(() => {
    if (!user) return

    const transactionsQuery = query(collection(db, "transactions"), where("userId", "==", user.uid))
    const unsubscribeTransactions = onSnapshot(transactionsQuery, snapshot => {
      let income = 0
      let expenses = 0
      snapshot.forEach(doc => {
        const data = doc.data()
        if (data.type === "income") income += Number(data.amount ?? 0)
        if (data.type === "expense") expenses += Number(data.amount ?? 0)
      })
      setSummary(prev => ({ ...prev, income, expenses, total: Math.max(income - expenses - prev.fixedExpenses, 0) }))
    })

    const subscriptionsQuery = query(collection(db, "subscriptions"), where("userId", "==", user.uid))
    const unsubscribeSubscriptions = onSnapshot(subscriptionsQuery, snapshot => {
      let fixedExpenses = 0
      snapshot.forEach(doc => {
        const data = doc.data()
        fixedExpenses += Number(data.value ?? 0)
      })
      setSummary(prev => ({ ...prev, fixedExpenses, total: Math.max(prev.income - prev.expenses - fixedExpenses, 0) }))
    })

    return () => {
      unsubscribeTransactions()
      unsubscribeSubscriptions()
    }
  }, [user])

  const openModal = (goal: Goal) => setSelectedGoal(goal) || setModalOpen(true)

  const handleSubmitModal = async (formData: any & { type: "Add" | "Remove" }) => {
    if (!selectedGoal || !user) return

    const amount = parseFloat(formData.amount)
    const addWalletAmount = formData.type === "Add" ? amount : 0
    const removeAmount = formData.type === "Remove" ? amount : 0

    let totalAvailable = summary.total + addWalletAmount
    if (removeAmount > totalAvailable) {
      toast.error("O valor excede o saldo disponível!")
      return
    }

    try {
      // Adiciona saldo à carteira
      if (addWalletAmount > 0) {
        await addDoc(collection(db, "transactions"), {
          userId: user.uid,
          type: "income",
          amount: addWalletAmount,
          title: `Depósito para meta "${selectedGoal.goalName}"`,
          description: `Você movimentou ${formatCurrency(amount)} para a meta "${selectedGoal.goalName}"`,
          date: new Date().toISOString(),
        })
        setSummary(prev => ({ ...prev, total: prev.total + addWalletAmount }))
      }

      // Movimenta valor para a meta
      const goalRef = doc(db, "goals", selectedGoal.id)
      let newSavedAmount = selectedGoal.savedAmount + addWalletAmount - removeAmount
      if (newSavedAmount < 0) newSavedAmount = 0
      await updateDoc(goalRef, { savedAmount: newSavedAmount })

      // Cria transação de movimentação
      if (addWalletAmount > 0 || removeAmount > 0) {
        await addDoc(collection(db, "transactions"), {
          userId: user.uid,
          type: "expense",
          amount: removeAmount,
          title: `Movimentação para meta "${selectedGoal.goalName}"`,
          description: `Você movimentou R$ ${amount.toFixed(2)} para a meta "${selectedGoal.goalName}"`,
          date: new Date().toISOString(),
        })
      }

      toast.success(`Meta "${selectedGoal.goalName}" atualizada com sucesso!`)
      setModalOpen(false)
    } catch (err) {
      console.error(err)
      toast.error("Erro ao atualizar a meta.")
    }
  }

  const cards = [
    { label: "Saldo", value: summary.total, icon: Wallet, color: "text-gray-300", valueColor: "text-white" },
    { label: "Receitas", value: summary.income, icon: ArrowUpRight, color: "text-green-400", valueColor: "text-green-400" },
    { label: "Despesas", value: summary.expenses, icon: ArrowDownRight, color: "text-red-400", valueColor: "text-red-400" },
    { label: "Despesas Fixas", value: summary.fixedExpenses, icon: ArrowDownRight, color: "text-yellow-400", valueColor: "text-yellow-400" },
  ]

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map(card => (
          <div key={card.label} className="bg-[#1E1F24] rounded-2xl p-6 shadow-sm border border-gray-800 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-400">{card.label}</h3>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className={`mt-3 text-3xl font-semibold ${card.valueColor}`}>
              {formatCurrency(card.value ?? 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Meta favorita */}
      {favoriteGoal && (
        <div className="mt-6 bg-[#1E1F24] p-6 rounded-2xl shadow-md w-full flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">{favoriteGoal.goalName}</h3>
            <p className="text-gray-400">
              {`${formatCurrency(favoriteGoal.savedAmount)} / ${formatCurrency(favoriteGoal.goalValue)}`}
            </p>
          </div>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 transition-all duration-500"
              style={{ width: `${Math.min((favoriteGoal.savedAmount / favoriteGoal.goalValue) * 100, 100)}%` }}
            />
          </div>
          <button
            onClick={() => openModal(favoriteGoal)}
            className="mt-3 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl text-white"
          >
            Adicionar / Remover
          </button>
        </div>
      )}

      {/* Modal funcional */}
      {modalOpen && selectedGoal && (
        <AddRemoveModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitModal}
        />
      )}
    </>
  )
}
