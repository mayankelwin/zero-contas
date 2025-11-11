"use client"

import { ToastContainer } from "react-toastify"
import SummaryCards from "../cards/SummaryCards"
import CardsSection from "../cards/CardsSection"
import FavoriteGoal from "../cards/FavoriteGoal"
import AddAndRemoveModal from "../modal/ModalAddandRemove"
import AddCardModal from "../modal/AddCardModal"
import { useFinanceData } from "@/src/hooks/useFinanceData"
import { db } from "@/src/lib/firebase"
import { doc, updateDoc, addDoc, collection } from "firebase/firestore"
import { toast } from "react-toastify"
import { useAuth } from "@/src/context/AuthContext"
import { useInfosGeral } from "../../hooks/transactions/useInfosGeral"

export default function DashboardSummary({ reloadFlag }: { reloadFlag?: number }) {
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
  } = useFinanceData(reloadFlag)

  const {
    InfosResume
  } = useInfosGeral()
  
  const { user } = useAuth()
  
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        <SummaryCards cards={InfosResume} />
        <CardsSection
          cardsList={cardsList}
          selectedCardId={selectedCardId}
          setSelectedCardId={setSelectedCardId}
          onAddCard={() => setAddCardOpen(true)}
          onEditCard={handleEditCard}
        />
      </div>

      {favoriteGoal && (
        <FavoriteGoal
          goal={favoriteGoal}
          onOpenModal={(goal) => { setSelectedGoal(goal); setModalOpen(true) }}
        />
      )}

      {modalOpen && selectedGoal && (
        <AddAndRemoveModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultType="income"
          onSave={async (data) => {
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
                toast.success(`Adicionado R$${amount.toFixed(2)} à meta ${selectedGoal.goalName}`)
              } else {
                newSaved = Math.max((selectedGoal.savedAmount ?? 0) - amount, 0)
                diff = -amount
                toast.success(`Retirado R$${amount.toFixed(2)} da meta ${selectedGoal.goalName}`)
              }

              // Atualiza o valor salvo da meta
              await updateDoc(goalRef, { savedAmount: newSaved })

              // Atualiza o saldo geral de metas no documento do usuário
              await updateDoc(userRef, {
                saldoMetas: diff > 0 
                  ? (selectedGoal.saldoMetas ?? 0) + diff 
                  : Math.max((selectedGoal.saldoMetas ?? 0) + diff, 0)
              })

              // Registra a transação
              await addDoc(collection(db, "users", user.uid, "transactions"), {
                amount,
                type: data.transactionType === "income" ? "income" : "expense",
                category: "meta",
                description: `${data.transactionType === "income" ? "Adicionado" : "Retirado"} da meta ${selectedGoal.goalName}`,
                createdAt: new Date().toISOString(),
                goalId: selectedGoal.id,
                goalName: selectedGoal.goalName
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
          onClose={() => { setAddCardOpen(false) }}
          onSubmit={editCardData ? handleUpdateCard : handleAddCard}
          editData={editCardData}
          onDelete={editCardData ? handleDeleteCard : undefined}
        />
      )}
    </>
  )
}
