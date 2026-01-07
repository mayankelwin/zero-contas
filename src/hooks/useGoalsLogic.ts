"use client"

import { useAuth } from "@/src/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore"
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
}

export function useGoalsLogic() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!loading && !user) router.push("/auth")
  }, [user, loading, router])

  // Listener das metas
  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, "users", user.uid, "goals")
      // não precisa do where("userId", "==", user.uid) porque já está no caminho do usuário
    )
    const unsubscribe = onSnapshot(q, snapshot => {
      const goalsArr: Goal[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          goalName: data.goalName,
          goalValue: Number(data.goalValue ?? 0),
          savedAmount: Number(data.savedAmount ?? 0),
          goalDeadline: data.goalDeadline ?? "",
          isPriority: data.isPriority ?? false,
          isActive: data.isActive ?? true,
          isFinished: data.isFinished ?? false,
        }
      })
      setGoals(goalsArr)
    })
    return () => unsubscribe()
  }, [user])

  // Prioridade
  const togglePriority = async (goal: Goal) => {
    try {
      // Desmarca outras prioridades
      const updates = goals.map(g =>
        g.id !== goal.id && g.isPriority
          ? updateDoc(doc(db, "users", user!.uid, "goals", g.id), { isPriority: false })
          : null
      ).filter(Boolean)
      await Promise.all(updates)

      await updateDoc(doc(db, "users", user!.uid, "goals", goal.id), {
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

  // Ativar / Desativar
  const toggleActive = async (goal: Goal) => {
    try {
      await updateDoc(doc(db, "users", user!.uid, "goals", goal.id), {
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

  // Finalizar meta
  const finishGoal = async (goal: Goal) => {
    try {
      await updateDoc(doc(db, "users", user!.uid, "goals", goal.id), {
        isFinished: true,
        isActive: false
      })
      toast.success(`Meta "${goal.goalName}" finalizada!`)
    } catch (err) {
      console.error(err)
      toast.error("Erro ao finalizar a meta.")
    }
  }

  // Deletar meta
  const deleteGoal = async (goal: Goal) => {
    if (!confirm(`Deseja realmente apagar a meta "${goal.goalName}"?`)) return
    try {
      await deleteDoc(doc(db, "users", user!.uid, "goals", goal.id))
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
      
      const updateData: any = { ...data };

      if (data.goalValue) updateData.goalValue = Number(data.goalValue);
      
      await updateDoc(goalRef, updateData);
      
      toast.success("Objetivo atualizado!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar os dados.");
    }
  };

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
  }
}
