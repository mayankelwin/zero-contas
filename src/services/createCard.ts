import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"
import { toast } from "react-toastify"
import { db } from "../lib/firebase"

export function useCreateCard() {
  const { user } = useAuth()

  const [cardsList, setCardsList] = useState<any[]>([])
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [editCardData, setEditCardData] = useState<any>(null)
  const [selectedCard, setSelectedCard] = useState<any>(null)
  const [installments, setInstallments] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    date: null as Date | null,
    source: "",
    subscriptionType: "",
    goalDeadline: null as Date | null,
    card: "",
    installments: 1,
  })

    useEffect(() => {
        if (selectedCard) {
        setFormData(prev => ({ ...prev, card: selectedCard.cardNumber, installments }))
        }
    }, [selectedCard, installments])

  // Buscar cartões
  useEffect(() => {
    if (!user) return
    const q = collection(db, "users", user.uid, "cards")
    const unsub = onSnapshot(q, (snap) => {
      setCardsList(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [user])

  // CRUD cartões
   const handleAddCard = async (data: any) => {
    if (!user) return null
    try {
      const docRef = await addDoc(collection(db, "users", user.uid, "cards"), {
        ...data,
        createdAt: new Date().toISOString(),
      })
      const newCard = { id: docRef.id, ...data }
      toast.success("Cartão adicionado com sucesso!")
      return newCard 
    } catch (error) {
      console.error("Erro ao adicionar cartão:", error)
      toast.error("Erro ao adicionar cartão")
      return null
    }
  }

  const handleEditCard = (card: any) => {
    setEditCardData(card)
    setAddCardOpen(true)
  }

  const handleUpdateCard = async (data: any) => {
    if (!user || !editCardData) return
    try {
      const cardRef = doc(db, "users", user.uid, "cards", editCardData.id)
      await updateDoc(cardRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      })
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
  const resetCardSelection = () => {
    setSelectedCard(null)
    setInstallments(1)
  }
  return {
    addCardOpen,
    selectedCardId,
    editCardData,
    setAddCardOpen,
    setSelectedCardId,
    setEditCardData,
    setSelectedCard,
    selectedCard,
    formData,
    setFormData,
    installments,
    setInstallments,
    cardsList,
    handleAddCard,
    handleEditCard,
    handleUpdateCard,
    handleDeleteCard,
    resetCardSelection,
  }
}
