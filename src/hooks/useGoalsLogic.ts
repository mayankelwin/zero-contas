import { useAuth } from "@/src/context/AuthContext"
import { useFinance } from "@/src/context/FinanceContext"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { toast } from "react-toastify"

export interface Goal {
  id: string
  goalName: string
  goalValue: number
  savedAmount: number
  goalDeadline: string;
  isPriority?: boolean
  isActive?: boolean
  isFinished?: boolean
  updatedAt?: string
}

export function useGoalsLogic() {
  const { user, loading: authLoading } = useAuth()
  const { goals, loading: financeLoading, summary } = useFinance()
  const router = useRouter()

  const loading = authLoading || financeLoading.goals

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth")
  }, [user, authLoading, router])

  const togglePriority = async (goal: Goal) => {
    if (!user) return
    try {
      const updates = goals.map(g =>
        g.id !== goal.id && g.isPriority
          ? updateDoc(doc(db, "users", user.uid, "goals", g.id), { isPriority: false })
          : null
      ).filter(Boolean)
      await Promise.all(updates)

      await updateDoc(doc(db, "users", user.uid, "goals", goal.id), {
        isPriority: !goal.isPriority,
      })

      toast.success(
        goal.isPriority
          ? "Meta removida dos favoritos"
          : "Meta marcada como favorita"
      )
    } catch (err) {
      console.error(err)
      toast.error("Erro ao atualizar prioridade.")
    }
  }

  const toggleActive = async (goal: Goal) => {
    if (!user) return
    try {
      await updateDoc(doc(db, "users", user.uid, "goals", goal.id), {
        isActive: !goal.isActive,
      })
      toast.success(
        goal.isActive ? "Meta desativada" : "Meta ativada"
      )
    } catch (err) {
      console.error(err)
      toast.error("Erro ao atualizar status da meta.")
    }
  }

  const finishGoal = async (goal: Goal) => {
    if (!user) return
    try {
      await updateDoc(doc(db, "users", user.uid, "goals", goal.id), {
        isFinished: true,
        isActive: false
      })
      toast.success(`Meta "${goal.goalName}" finalizada!`)
    } catch (err) {
      console.error(err)
      toast.error("Erro ao finalizar a meta.")
    }
  }

  const deleteGoal = async (goal: Goal) => {
    if (!user) return
    if (!confirm(`Deseja realmente apagar a meta "${goal.goalName}"?`)) return
    try {
      await deleteDoc(doc(db, "users", user.uid, "goals", goal.id))
      toast.success("Meta removida com sucesso!")
    } catch (err) {
      console.error(err)
      toast.error("Erro ao apagar a meta.")
    }
  }

  const updateGoal = async (goalId: string, data: Partial<Goal>) => {
    if (!user) return;
    try {
      const goalRef = doc(db, "users", user.uid, "goals", goalId);
      const updateData: any = { ...data, updatedAt: new Date().toISOString() };
      if (data.goalValue) updateData.goalValue = Number(data.goalValue);
      await updateDoc(goalRef, updateData);
      toast.success("Objetivo atualizado!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar os dados.");
    }
  };

  const goalsStats = useMemo(() => {
    const totalTarget = goals.reduce((acc, g) => acc + (g.goalValue || 0), 0)
    const totalSaved = goals.reduce((acc, g) => acc + (g.savedAmount || 0), 0)
    const globalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0
    const activeGoals = goals.filter(g => !g.isFinished).length
    const completedGoals = goals.filter(g => g.isFinished).length

    return {
      totalTarget,
      totalSaved,
      globalProgress,
      activeGoals,
      completedGoals,
      userIncomes: summary.income
    }
  }, [goals, summary.income])

  return {
    user,
    loading,
    goals,
    togglePriority,
    toggleActive,
    finishGoal,
    deleteGoal,
    router,
    updateGoal,
    goalsStats
  }
}
