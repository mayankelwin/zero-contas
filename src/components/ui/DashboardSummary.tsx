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
import { Activity } from "lucide-react"

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

  const { InfosResume } = useInfosGeral()
  const { user } = useAuth()
  
  return (
    <div className=" animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <ToastContainer 
        toastClassName={() => "bg-[#161618] text-white font-black uppercase text-[10px] tracking-widest p-4 rounded-2xl shadow-2xl"}
        position="top-right" 
        autoClose={3000} 
      />

      <section className="space-y-12">
        <header className="flex items-end justify-between border-b border-white/[0.03] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-500">
              <Activity size={14} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">sua vida finaceira</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">
              Dashboard <span className="text-white/10 not-italic">Financeiro</span>
            </h2>
          </div>
          
        </header>

        <SummaryCards cards={InfosResume} />

        <CardsSection
          cardsList={cardsList}
          selectedCardId={selectedCardId}
          setSelectedCardId={setSelectedCardId}
          onAddCard={() => setAddCardOpen(true)}
          onEditCard={handleEditCard}
        />
      </section>

      {favoriteGoal && (
        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">
              AS suas <span className="text-white/20"> Metas</span>
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/[0.05] to-transparent"></div>
          </div>

              <FavoriteGoal
                goal={favoriteGoal}
                onOpenModal={(goal) => { setSelectedGoal(goal); setModalOpen(true) }}
              />
        </section>
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
                toast.success(`SISTEMA: ENTRADA DE R$${amount.toFixed(2)}`)
              } else {
                newSaved = Math.max((selectedGoal.savedAmount ?? 0) - amount, 0)
                diff = -amount
                toast.error(`SISTEMA: SAÍDA DE R$${amount.toFixed(2)}`)
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
              toast.error("ERRO CRÍTICO DE SINCRONIZAÇÃO")
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
    </div>
  )
}