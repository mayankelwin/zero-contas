"use client"

import { useState, useMemo } from "react"
import { Plus, Trophy, Target } from "lucide-react"

import Header from "@/src/components/layout/Header"
import Sidebar from "@/src/components/layout/Sidebar"
import { useGoalsLogic } from "@/src/hooks/useGoalsLogic"
import AddTransactionModal from "@/src/components/modal/addTransaction/AddTransactionModal"
import { LoadingPage } from "@/src/components/ui/Loading"

import GoalHero from "@/src/components/goals/GoalHero"
import GoalCardModern from "@/src/components/goals/GoalCardModern"
import GoalModalModern from "@/src/components/goals/GoalModalModern"
import GoalFilters from "@/src/components/goals/GoalFilters"

export default function MetasScreen() {
  const { 
    user, 
    loading, 
    goals, 
    togglePriority, 
    deleteGoal, 
    finishGoal, 
    updateGoal,
    goalsStats
  } = useGoalsLogic()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "finished">("active")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<any>(null)

  const processedGoals = useMemo(() => {
    return goals
      .filter(g => g.goalName.toLowerCase().includes(search.toLowerCase()))
      .filter(g => {
        if (statusFilter === "all") return true
        if (statusFilter === "active") return !g.isFinished
        return g.isFinished
      })
      .sort((a, b) => (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0))
  }, [goals, search, statusFilter])

  if (loading || !user) return <LoadingPage />

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <Sidebar />
      <main className="flex-1 ml-20 flex flex-col overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 hide-scrollbar">
          {/* Header & Ação Principal */}
          <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-500">
                <Trophy size={16} strokeWidth={3} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Intelligence Hub</span>
              </div>
              <div className="space-y-1">
                <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                  Gestão de <span className="text-white/10 not-italic">Metas</span>
                </h1>
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Ambito de Objetivos Estratégicos</p>
              </div>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="group relative flex items-center gap-4 px-10 py-5 bg-white text-black rounded-[2rem] hover:bg-emerald-500 transition-all duration-500 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-emerald-500/20"
            >
              <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Plus size={20} strokeWidth={3} className="relative z-10" />
              <span className="text-[11px] font-black uppercase tracking-widest relative z-10">Nova Meta</span>
            </button>
          </section>

          {/* Sumário Global */}
          <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
             <GoalHero stats={goalsStats} />
          </section>

          {/* Filtros e Busca */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
             <GoalFilters 
               search={search} 
               setSearch={setSearch} 
               statusFilter={statusFilter} 
               setStatusFilter={setStatusFilter} 
             />
          </section>

          {/* Grid de Metas */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-32 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            {processedGoals.length === 0 ? (
              <div className="col-span-full py-32 flex flex-col items-center justify-center gap-6 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
                 <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center text-white/10">
                   <Target size={32} />
                 </div>
                 <div className="text-center space-y-1">
                   <p className="text-lg font-black uppercase tracking-tighter italic text-white/20">Sem Objetivos Definidos</p>
                   <p className="text-[10px] font-bold text-white/10 uppercase tracking-widest">Inicie um novo alvo para rastreamento estratégico</p>
                 </div>
              </div>
            ) : (
              processedGoals.map(goal => (
                <GoalCardModern 
                  key={goal.id} 
                  goal={goal}
                  onTogglePriority={togglePriority}
                  onView={() => setSelectedGoal(goal)}
                />
              ))
            )}
          </section>
        </div>

        {selectedGoal && (
           <GoalModalModern 
             goal={selectedGoal} 
             isOpen={!!selectedGoal} 
             onClose={() => setSelectedGoal(null)}
             onUpdate={updateGoal}
             onDelete={deleteGoal}
             onFinish={finishGoal}
             userIncomes={goalsStats.userIncomes}
           />
        )}

        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          defaultType="goal"
          allowedTypes={["goal"]}
          onSuccess={() => setIsAddModalOpen(false)}
        />
      </main>
    </div>
  )
}