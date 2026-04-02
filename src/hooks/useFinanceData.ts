"use client"

import { useCallback, useState } from "react"
import { db } from "@/src/lib/firebase"
import { doc, updateDoc, addDoc, deleteDoc, collection } from "firebase/firestore"
import { useAuth } from "@/src/context/AuthContext"
import { useFinance } from "@/src/context/FinanceContext"
import { toast } from "react-toastify"

export function useFinanceData() {
  const { user } = useAuth()
  const { summary, goals, cards: cardsList, transactions: allTransactions } = useFinance()

  const [selectedGoal, setSelectedGoal] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [editCardData, setEditCardData] = useState<any>(null)

  const favoriteGoal = goals.find(g => g.isPriority) || goals[0] || null
  const saldoMetas = favoriteGoal?.savedAmount ?? 0

  const handleAddCard = useCallback(async (data: any) => {
    if (!user) return
    try {
      await addDoc(collection(db, "users", user.uid, "cards"), { 
        ...data, 
        createdAt: new Date().toISOString() 
      })
      toast.success("Cartão adicionado com sucesso!")
    } catch (err) {
      console.error(err)
      toast.error("Erro ao adicionar o cartão")
    }
  }, [user])

  const handleEditCard = useCallback((card: any) => {
    setEditCardData(card)
    setAddCardOpen(true)
  }, [])

  const handleUpdateCard = useCallback(async (data: any) => {
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
  }, [user, editCardData])

  const handleDeleteCard = useCallback(async () => {
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
  }, [user, editCardData])

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
