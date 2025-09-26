"use client"

import { useEffect, useState } from "react"
import { db } from "@/src/lib/firebase"
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore"
import { useAuth } from "@/src/context/AuthContext"
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import AddRemoveModal from "./ModalAddandRemove"

const formatCurrencyBR = (value: number | string) => {
  const numberValue = typeof value === "string" ? parseFloat(value) || 0 : value
  return numberValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

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
  const [saldoMetas, setSaldoMetas] = useState(0)
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    income: 0,
    expenses: 0,
    fixedExpenses: 0,
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [favoriteGoal, setFavoriteGoal] = useState<Goal | null>(null)
  const { user } = useAuth()

  // Busca da meta favorita
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
        setFavoriteGoal({
          id: docSnap.id,
          goalName: data.goalName,
          goalValue: Number(data.goalValue ?? 0),
          savedAmount: Number(data.savedAmount ?? 0),
        })
      } else {
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
          } else setFavoriteGoal(null)
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
      let income = 0, expenses = 0
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
      snapshot.forEach(doc => fixedExpenses += Number(doc.data().value ?? 0))
      setSummary(prev => ({ ...prev, fixedExpenses, total: Math.max(prev.income - prev.expenses - fixedExpenses, 0) }))
    })

    return () => {
      unsubscribeTransactions()
      unsubscribeSubscriptions()
    }
  }, [user])

  const openModal = (goal: Goal) => {
    setSelectedGoal(goal)
    setModalOpen(true)
  }

const handleSubmitModal = async (formData: any & { type: "Add" | "Remove"; useSaldo: boolean }) => {
  if (!selectedGoal || !user) return
  const amount = parseFloat(formData.amount)
  const addToGoal = formData.type === "Add" ? amount : 0
  const removeFromGoal = formData.type === "Remove" ? amount : 0

  if (formData.type === "Add" && formData.useSaldo && amount > summary.total) {
    toast.error("Saldo insuficiente!")
    return
  }

  try {
    const goalRef = doc(db, "goals", selectedGoal.id)
    let newSavedAmount = selectedGoal.savedAmount
    let saldoUsado = 0

    if (formData.type === "Add") {
      if (formData.useSaldo) {
        saldoUsado = addToGoal
        setSummary(prev => ({ ...prev, total: prev.total - saldoUsado }))
      }
      newSavedAmount += addToGoal
      setSaldoMetas(prev => prev + addToGoal)
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type: formData.useSaldo ? "expense" : "goalIncome",
        amount: addToGoal,
        title: `Adição à meta "${selectedGoal.goalName}"`,
        description: `Valor guardado na meta "${selectedGoal.goalName}"`,
        category: `Meta: ${selectedGoal.goalName}`,
        date: new Date().toISOString(),
      })
    }

    if (formData.type === "Remove") {
      newSavedAmount -= removeFromGoal
      if (newSavedAmount < 0) newSavedAmount = 0
      setSaldoMetas(prev => prev - removeFromGoal)
      setSummary(prev => ({ ...prev, total: prev.total + removeFromGoal }))
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type: "income",
        amount: removeFromGoal,
        title: `Retirada da meta "${selectedGoal.goalName}"`,
        description: `Valor retirado da meta "${selectedGoal.goalName}"`,
        category: `Meta: ${selectedGoal.goalName}`,
        date: new Date().toISOString(),
      })
    }

    await updateDoc(goalRef, { savedAmount: newSavedAmount })
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
              {formatCurrencyBR(card.value ?? 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Meta favorita */}
      {favoriteGoal && (
        <div className="mt-6 bg-[#2A2B30] p-6 rounded-3xl shadow-md w-full flex flex-col gap-4 border border-[#3B3C44]">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">{favoriteGoal.goalName}</h3>
            <p className="text-gray-300 font-medium">
              {`${formatCurrencyBR(favoriteGoal.savedAmount)} / ${formatCurrencyBR(favoriteGoal.goalValue)}`}
            </p>
          </div>

          <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-purple-700 rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${Math.min((favoriteGoal.savedAmount / favoriteGoal.goalValue) * 100, 100)}%` }}
            />
            <span className="absolute right-2 top-0 text-xs font-medium text-gray-200">
              {`${Math.floor((favoriteGoal.savedAmount / favoriteGoal.goalValue) * 100)}%`}
            </span>
          </div>

          <button
            onClick={() => openModal(favoriteGoal)}
            className="mt-4 px-5 py-2 bg-gray-600 text-gray-100 font-semibold rounded-xl shadow-sm hover:bg-gray-500 transition-all"
          >
            Adicionar / Remover
          </button>
        </div>
      )}

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
