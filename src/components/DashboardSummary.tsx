"use client"

import { useEffect, useState } from "react"
import { db } from "@/src/lib/firebase"
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore"
import { useAuth } from "@/src/context/AuthContext"
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react"
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

export default function DashboardSummary({ reloadFlag }: { reloadFlag?: number }) {
  const { user } = useAuth()

  // 🟢 Estados
  const [summary, setSummary] = useState({ total: 0, income: 0, expenses: 0, fixedExpenses: 0 })
  const [saldoMetas, setSaldoMetas] = useState(0)
  const [cardsList, setCardsList] = useState<any[]>([])
  const [favoriteGoal, setFavoriteGoal] = useState<any>(null)
  const [selectedGoal, setSelectedGoal] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [editCardData, setEditCardData] = useState<any>(null)

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

  // 🔹 Resumo financeiro
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

  // 🔹 Cards principais
  const cards = [
    { label: "Saldo", value: summary.total, icon: Wallet, color: "text-gray-300", valueColor: "text-white" },
    { label: "Receitas", value: summary.income, icon: ArrowUpRight, color: "text-green-400", valueColor: "text-green-400" },
    { label: "Despesas", value: summary.expenses, icon: ArrowDownRight, color: "text-red-400", valueColor: "text-red-400" },
    { label: "Despesas Fixas", value: summary.fixedExpenses, icon: ArrowDownRight, color: "text-yellow-400", valueColor: "text-yellow-400" },
    { label: "Saldo Metas", value: saldoMetas, icon: Wallet, color: "text-purple-400", valueColor: "text-purple-400" }
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
                type: "income", 
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
