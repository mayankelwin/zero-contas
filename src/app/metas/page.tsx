'use client'

import Header from "@/src/components/Header"
import Sidebar from "@/src/components/Sidebar"
import { useAuth } from "@/src/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { toast } from "react-toastify"
import { X, Star, Edit2, Plus } from "lucide-react"

interface Goal {
  id: string
  goalName: string
  goalValue: number
  savedAmount: number
  isPriority?: boolean
}

export default function MetasScreen() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])

  useEffect(() => {
    if (!loading && !user) router.push('/auth')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, "goals"), where("userId", "==", user.uid))
    const unsubscribe = onSnapshot(q, snapshot => {
      const goalsArr: Goal[] = []
      snapshot.forEach(docSnap => {
        const data = docSnap.data()
        goalsArr.push({
          id: docSnap.id,
          goalName: data.goalName,
          goalValue: Number(data.goalValue ?? 0),
          savedAmount: Number(data.savedAmount ?? 0),
          isPriority: data.isPriority ?? false
        })
      })
      setGoals(goalsArr)
    })
    return () => unsubscribe()
  }, [user])

  const togglePriority = async (goal: Goal) => {
    try {
      // Desmarca qualquer outra prioridade
      const batch = goals.map(g =>
        g.id !== goal.id && g.isPriority ? updateDoc(doc(db, "goals", g.id), { isPriority: false }) : null
      )
      await Promise.all(batch)

      // Marca/desmarca a meta atual
      const goalRef = doc(db, "goals", goal.id)
      await updateDoc(goalRef, { isPriority: !goal.isPriority })
      toast.success(goal.isPriority ? "Meta removida dos favoritos" : "Meta marcada como favorita")
    } catch (err) {
      console.error(err)
      toast.error("Erro ao atualizar prioridade.")
    }
  }

  const deleteGoal = async (goal: Goal) => {
    if (!confirm(`Deseja realmente apagar a meta "${goal.goalName}"?`)) return
    try {
      await deleteDoc(doc(db, "goals", goal.id))
      toast.success("Meta removida com sucesso!")
    } catch (err) {
      console.error(err)
      toast.error("Erro ao apagar a meta.")
    }
  }

  if (loading || !user) return <div className="p-8">Carregando...</div>

  return (
    <div className="flex h-screen relative">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="p-6 space-y-6">
          {/* Botão adicionar */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.push('/metas/adicionar')} // ou abrir modal
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
            >
              <Plus size={16}/> Adicionar Meta
            </button>
          </div>

          {/* Lista de metas */}
          <div className="flex flex-col gap-4">
            {goals.map(goal => (
              <div key={goal.id} className="bg-[#1E1F24] p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:justify-between md:items-center gap-3 transition hover:scale-105">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <h3 className="text-lg font-bold">{goal.goalName}</h3>
                  <p className="text-gray-300 font-medium">Valor: R$ {goal.goalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="w-full md:w-48 h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 transition-all duration-500"
                      style={{ width: `${Math.min((goal.savedAmount / goal.goalValue) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm">{goal.savedAmount.toLocaleString('pt-BR', {minimumFractionDigits: 2})} / {goal.goalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                </div>

                <div className="flex gap-2 mt-2 md:mt-0">
                  <button onClick={() => togglePriority(goal)}>
                    <Star className={`cursor-pointer ${goal.isPriority ? "text-yellow-400" : "text-gray-400"} transition-colors`} />
                  </button>
                  <button onClick={() => router.push(`/metas/editar/${goal.id}`)}>
                    <Edit2 className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
                  </button>
                  <button onClick={() => deleteGoal(goal)}>
                    <X className="text-red-500 cursor-pointer hover:text-red-600 transition-colors"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
