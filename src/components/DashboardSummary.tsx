"use client"

import { useEffect, useState } from "react"
import { db } from "@/src/lib/firebase"
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore"
import { useAuth } from "@/src/context/AuthContext"
import { ArrowUpRight, ArrowDownRight, Wallet, X, ArrowLeft, ArrowRight, Edit } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import AddRemoveModal from "./ModalAddandRemove"
import AddCardModal from "./AddCardModal"
import CardItem from "./CardItem"

const formatCurrencyBR = (value: number | string) => {
  const numberValue = typeof value === "string" ? parseFloat(value) || 0 : value
  return numberValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

interface DashboardSummaryProps {
  reloadFlag?: number
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

interface CardItemProps {
  bank: string
  cardName: string
  brand: string
  cardNumber: string
  billingDay: number
  index?: number
  interestRate?: number
  creditLimit?: number
  usedCredit?: number
}


export default function DashboardSummary({ reloadFlag }: DashboardSummaryProps) {
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
  const [cardsList, setCardsList] = useState<any[]>([])
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [editCardData, setEditCardData] = useState<CardItemType | null>(null)

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

  // Buscar cartões do usuário
  useEffect(() => {
    if (!user) return
    const q = query(collection(db, "cards"), where("userId", "==", user.uid))
    const unsub = onSnapshot(q, (snap) => {
      setCardsList(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [user, reloadFlag])

  const handleAddCard = async (data: any) => {
    if (!user) return
    await addDoc(collection(db, "cards"), {
      ...data,
      userId: user.uid,
      createdAt: new Date().toISOString()
    })
    toast.success("Cartão adicionado com sucesso!")
  }

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
      } else {
        setSaldoMetas(prev => prev + addToGoal)
      }

        newSavedAmount += addToGoal

        await addDoc(collection(db, "transactions"), {
          userId: user.uid,
          type: formData.useSaldo ? "expense" : "goalIncome",
          amount: addToGoal,
          title: `Adição à meta "${selectedGoal.goalName}"`,
          description: `Valor guardado na meta "${selectedGoal.goalName}"`,
          category: formData.useSaldo
            ? `Meta (Saldo): ${selectedGoal.goalName}`
            : `Meta (Fora do saldo): ${selectedGoal.goalName}`,
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
        category: `Retirada de Meta: ${selectedGoal.goalName}`,
        subcategory: selectedGoal.goalName,
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
    { label: "Saldo Metas", value: saldoMetas, icon: Wallet, color: "text-purple-400", valueColor: "text-purple-400" }
  ]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1))
  }
  const handleEditCard = (card: CardItemType) => {
    setEditCardData(card)
    setAddCardOpen(true)
  }

  const handleUpdateCard = async (data: any) => {
    if (!user || !editCardData) return
    try {
      const cardRef = doc(db, "cards", editCardData.id)
      await updateDoc(cardRef, {
        ...data,
        updatedAt: new Date().toISOString()
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


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(card => (
          <div key={card.label} className="bg-[#1E1F24] rounded-2xl p-6 shadow-sm border border-gray-800 hover:border-gray-700 transition-all justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-400">{card.label}</h3>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className={`mt-3 text-2xl font-semibold ${card.valueColor}`}>
              {formatCurrencyBR(card.value ?? 0)}
            </p>
          </div>
        ))}
      </div>

     {/* Wallets */}
        <div className="bg-[#1E1F24] rounded-2xl p-6 shadow-sm border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Carteiras</h3>
            <button
              onClick={() => {
                if (cardsList.length >= 5) {
                  toast.error("Você pode adicionar no máximo 5 cartões.")
                  return
                }
                setAddCardOpen(true)
              }}
              className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition"
            >
              + Adicionar
            </button>
          </div>

          {cardsList.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum cartão adicionado ainda</p>
          ) : (
            <div className="relative w-full flex justify-center items-start">
              {!selectedCardId ? (
                <div className="relative w-64 h-64">
                  {cardsList
                    .slice() 
                    .reverse() 
                    .map((card, index) => {
                      const offsetY = index * 30
                      const zIndex = index 

                      return (
                        <div
                          key={card.id}
                          onClick={() => setSelectedCardId(card.id)}
                          className="absolute left-0 w-full cursor-pointer transition-transform duration-300 hover:-translate-y-7"
                          style={{ top: `${offsetY}px`, zIndex }}
                        >
                          <CardItem
                            bank={card.bank ?? "Banco"}
                            cardName={card.cardName ?? "Meu Cartão"}
                            brand={card.brand ?? "Visa"}
                            cardNumber={card.cardNumber ?? "0000"}
                            billingDay={card.billingDay ?? 1}
                            interestRate={card.interestRate ?? 0}
                            creditLimit={card.creditLimit ?? 0}
                            usedCredit={card.usedCredit ?? 0}
                            index={index}
                          />
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="transition-all duration-500 flex justify-center">
                  <CardItem
                    bank={cardsList.find(c => c.id === selectedCardId)?.bank ?? "Banco"}
                    cardName={cardsList.find(c => c.id === selectedCardId)?.cardName ?? "Meu Cartão"}
                    brand={cardsList.find(c => c.id === selectedCardId)?.brand ?? "Visa"}
                    cardNumber={cardsList.find(c => c.id === selectedCardId)?.cardNumber ?? "0000"}
                    index={0}
                  />
                </div>
              )}

              {/* Botão voltar e setas */}
              {selectedCardId && (
                <>

                  {/* Botão fechar / voltar */}
                  <button
                    onClick={() => setSelectedCardId(null)}
                    className="absolute top-2 left-1 w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
                  >
                    <X size={18} />
                  </button>
                  <button
                    onClick={() => handleEditCard(cardsList.find(c => c.id === selectedCardId))}
                    className="absolute top-2 right-1 w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
                  >
                    <Edit size={18} />
                  </button>

                  {cardsList.length > 1 && (
                    <>
                      {/* Botão anterior */}
                      <button
                        onClick={() => {
                          const idx = cardsList.findIndex(c => c.id === selectedCardId)
                          const prevIndex = (idx - 1 + cardsList.length) % cardsList.length
                          setSelectedCardId(cardsList[prevIndex].id)
                        }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition"
                      >
                        <ArrowLeft size={20} />
                      </button>

                      {/* Botão próximo */}
                      <button
                        onClick={() => {
                          const idx = cardsList.findIndex(c => c.id === selectedCardId)
                          const nextIndex = (idx + 1) % cardsList.length
                          setSelectedCardId(cardsList[nextIndex].id)
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition"
                      >
                        <ArrowRight size={20} />
                      </button>
                    </>
                  )}
                </>
              )}
              </div>
          )}
              {selectedCardId && (
                <div className="p-4 mt-3 rounded-xl text-white w-full mx-auto shadow-lg">
                  {(() => {
                    const card = cardsList.find(c => c.id === selectedCardId)
                    if (!card) return <p className="text-gray-400 text-center">Cartão não encontrado</p>

                    const creditLimit = card.creditLimit ?? 0
                    const usedCredit = card.usedCredit ?? 0
                    const interestRate = card.interestRate ?? 0
                    const usedPercent = creditLimit > 0 ? (usedCredit / creditLimit) * 100 : 0

                    return (
                      <>
                        <p className="text-sm text-gray-400  ">Adicionado em: {card.createdAt ? new Date(card.createdAt).toLocaleDateString() : '-'}</p>
                        <p className="text-sm text-gray-400 ">Juros ao mês: {interestRate}%</p>
                        <p className="text-sm text-gray-400 ">Limite de crédito: R$ {creditLimit.toLocaleString()}</p>

                        {/* Barra de uso do cartão */}
                        <div className="mt-2 bg-gray-700 rounded-full h-3 w-full relative">
                          <div
                            className="bg-green-400 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${usedPercent}%` }}
                          />
                        </div>
                        <p className="text-right text-sm mt-1">{usedPercent.toFixed(0)}% utilizado</p>
                      </>
                    )
                  })()}
                </div>
              )}
        </div> 

      {addCardOpen && (
        <AddCardModal
          isOpen={addCardOpen}
          onClose={() => { setAddCardOpen(false); setEditCardData(null) }}
          onSubmit={editCardData ? handleUpdateCard : handleAddCard}
          editData={editCardData}
          onDelete={editCardData ? handleDeleteCard : undefined} 
        />
      )}
      </div>

      {/* Meta favorita */}
      {favoriteGoal && (
        <div className="mt-6 bg-[#1E1F24] p-6 rounded-3xl shadow-md w-full flex flex-col gap-4 border border-[#3B3C44]">
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
          saldoAtual={summary.total}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitModal}
        />
      )}
    </>
  )
}
