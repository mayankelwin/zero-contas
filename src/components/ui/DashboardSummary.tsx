"use client"

import React, { memo, useCallback } from "react"
import SummaryCards from "../cards/SummaryCards"
import CardsSection from "../cards/CardsSection"
import GoalCardModern from "../goals/GoalCardModern"
import AddAndRemoveModal from "../modal/ModalAddandRemove"
import AddCardModal from "../modal/AddCardModal"
import { useFinanceData } from "@/src/hooks/useFinanceData"
import { db } from "@/src/lib/firebase"
import { doc, updateDoc, addDoc, collection } from "firebase/firestore"
import { toast } from "react-toastify"
import { useAuth } from "@/src/context/AuthContext"
import { useInfosGeral } from "../../hooks/transactions/useInfosGeral"
import { Activity, Sparkles } from "lucide-react"

const DashboardSummary = memo(function DashboardSummary() {
  const {
    cardsList,
    favoriteGoal,
    selectedGoal,
    modalOpen,
    addCardOpen,
    selectedCardId,
    editCardData,
    setModalOpen,
    setAddCardOpen,
    setSelectedGoal,
    setSelectedCardId,
    handleAddCard,
    handleEditCard,
    handleUpdateCard,
    handleDeleteCard
  } = useFinanceData()

  const { InfosResume } = useInfosGeral()
  const { user } = useAuth()

  const handleOpenGoalModal = useCallback((goal: any) => {
    setSelectedGoal(goal)
    setModalOpen(true)
  }, [setSelectedGoal, setModalOpen])

  const handleCloseGoalModal = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const handleCloseCardModal = useCallback(() => {
    setAddCardOpen(false)
  }, [setAddCardOpen])

  const handleOpenAddCard = useCallback(() => {
    setAddCardOpen(true)
  }, [setAddCardOpen])

  const handleSaveGoalTransaction = useCallback(async (data: any) => {
    if (!user || !selectedGoal) return
    const amount = Number(data.amount) / 100 
    const goalRef = doc(db, "users", user.uid, "goals", selectedGoal.id)
    const userRef = doc(db, "users", user.uid)

    try {
      let newSaved: number
      let diff: number

      if (data.transactionType === "income") {
        newSaved = (selectedGoal.savedAmount ?? 0) + amount
        diff = amount
        toast.success(`ENTRADA: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}`)
      } else {
        newSaved = Math.max((selectedGoal.savedAmount ?? 0) - amount, 0)
        diff = -amount
        toast.info(`SAÍDA: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}`)
      }

      await updateDoc(goalRef, { savedAmount: newSaved })
      await updateDoc(userRef, {
        saldoMetas: diff > 0 
          ? (selectedGoal.saldoMetas ?? 0) + diff 
          : Math.max((selectedGoal.saldoMetas ?? 0) + diff, 0)
      })

      await addDoc(collection(db, "users", user.uid, "transactions"), {
        amount,
        type: data.transactionType === "income" ? "income" : "expense",
        category: "meta",
        description: `Operação em Meta: ${selectedGoal.goalName}`,
        createdAt: new Date().toISOString(),
        goalId: selectedGoal.id,
        goalName: selectedGoal.goalName
      })

      setModalOpen(false)
    } catch (err) {
      console.error(err)
      toast.error("Erro na sincronização de dados")
    }
  }, [user, selectedGoal, setModalOpen])
  
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <section className="space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/20">
              <Sparkles size={12} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Resumo Executivo</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter uppercase italic text-white flex items-baseline gap-4">
              Overview <span className="text-white/5 not-italic text-4xl">Geral</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] p-2 rounded-2xl">
             <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-emerald-500">
                <Activity size={18} />
             </div>
             <div className="pr-4">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Status da Conta</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Otimizada & Segura</p>
             </div>
          </div>
        </header>

        <SummaryCards cards={InfosResume} />

        <div className="pt-4">
          <CardsSection
            cardsList={cardsList}
            selectedCardId={selectedCardId}
            setSelectedCardId={setSelectedCardId}
            onAddCard={handleOpenAddCard}
            onEditCard={handleEditCard}
          />
        </div>
      </section>

      {favoriteGoal && (
        <section className="space-y-10">
          <div className="flex items-center justify-between group">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tighter uppercase italic text-white">
                Suas <span className="text-white/20">Metas</span>
              </h2>
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">Favoritos em destaque</p>
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/[0.05] via-white/[0.05] to-transparent ml-8"></div>
          </div>

          <div className="max-w-2xl transform transition-all duration-500 hover:scale-[1.01]">
            <GoalCardModern
              goal={favoriteGoal}
              onTogglePriority={() => {}} 
              onView={handleOpenGoalModal}
            />
          </div>
        </section>
      )}

      {modalOpen && selectedGoal && (
        <AddAndRemoveModal
          isOpen={modalOpen}
          onClose={handleCloseGoalModal}
          defaultType="income"
          onSave={handleSaveGoalTransaction}
        />
      )}

      {addCardOpen && (
        <AddCardModal
          isOpen={addCardOpen}
          onClose={handleCloseCardModal}
          onSubmit={editCardData ? handleUpdateCard : handleAddCard}
          editData={editCardData}
          onDelete={editCardData ? handleDeleteCard : undefined}
        />
      )}
    </div>
  )
})

export default DashboardSummary