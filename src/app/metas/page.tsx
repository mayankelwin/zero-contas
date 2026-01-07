"use client"

import { useState, useMemo } from "react"
import { 
  Plus, Star, Edit2, X, Check, Search, 
  Trophy, Target, Calendar, MoreVertical,
  ArrowUpRight, ArrowRight
} from "lucide-react"
import dayjs from "dayjs"

import Header from "@/src/components/layout/Header"
import Sidebar from "@/src/components/layout/Sidebar"
import { useGoalsLogic } from "@/src/hooks/useGoalsLogic"
import AddTransactionModal from "@/src/components/modal/addTransaction/AddTransactionModal"
import { LoadingPage } from "@/src/components/ui/Loading"
import { formatCurrency } from "@/src/utils/formatCurrency"

interface Goal {
  id: string
  goalName: string
  goalValue: number
  savedAmount: number
  targetDate: string
  createdAt: string
  isPriority: boolean
  isActive: boolean
  isFinished: boolean
}

export default function MetasScreen() {
  const { 
    user, loading, goals, togglePriority, deleteGoal, 
    toggleActive, finishGoal, router 
  } = useGoalsLogic()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "finished">("all")
  const [sortType, setSortType] = useState<"recent" | "az" | "priority">("recent")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const processedGoals = useMemo(() => {
    return (goals as Goal[])
      .filter(g => g.goalName.toLowerCase().includes(search.toLowerCase()))
      .filter(g => {
        if (statusFilter === "all") return true
        if (statusFilter === "active") return g.isActive && !g.isFinished
        if (statusFilter === "inactive") return !g.isActive && !g.isFinished
        return g.isFinished
      })
      .sort((a, b) => {
        if (sortType === "priority") return (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0)
        if (sortType === "az") return a.goalName.localeCompare(b.goalName)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }, [goals, search, statusFilter, sortType])

  if (loading || !user) return <LoadingPage />

  return (
    <div className="flex h-screen bg-[#0C0C0E]">
      <Sidebar />
      <main className="flex-1 ml-16 sm:ml-20 overflow-auto custom-scrollbar">
        <Header />
        
        <div className="p-6 sm:p-10 max-w-[1400px] mx-auto space-y-8">
          
          {/* Header */}
          <section className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Metas Financeiras</h1>
              <p className="text-gray-500 text-sm">Acompanhe seu progresso detalhado.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 text-black text-sm font-bold rounded-xl transition-all"
            >
              <Plus size={18} />
              Nova Meta
            </button>
          </section>

          {/* Filtros Estilo Toolbar */}
          <section className="flex flex-col md:flex-row gap-4 items-center bg-[#161618] p-3 rounded-2xl border border-white/5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Filtrar por nome..."
                className="w-full pl-11 pr-4 py-2 bg-transparent text-sm text-white outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="h-6 w-[1px] bg-white/10 hidden md:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-xs text-gray-400 px-2 outline-none cursor-pointer hover:text-white"
            >
              <option value="all">Todos Status</option>
              <option value="active">Ativas</option>
              <option value="inactive">Pausadas</option>
              <option value="finished">Concluídas</option>
            </select>
          </section>

          {/* Lista Horizontal (Estilo Tabela) */}
          <section className="space-y-2">
            {/* Table Header - Oculto em mobile */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <div className="col-span-4">Objetivo</div>
              <div className="col-span-2 text-center">Progresso</div>
              <div className="col-span-2 text-right">Acumulado / Alvo</div>
              <div className="col-span-2 text-center">Prazo</div>
              <div className="col-span-2 text-right">Ações</div>
            </div>

            {processedGoals.length > 0 ? (
              <div className="flex flex-col gap-2">
                {processedGoals.map(goal => (
                  <GoalRow 
                    key={goal.id} 
                    goal={goal}
                    onTogglePriority={togglePriority}
                    onFinish={() => finishGoal(goal)}
                    onDelete={deleteGoal}
                    onEdit={(id) => router.push(`/metas/editar/${id}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState isFiltering={!!search} onReset={() => setSearch("")} />
            )}
          </section>
        </div>

        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          defaultType="goal"
          allowedTypes={["goal"]}
        />
      </main>
    </div>
  )
}

function GoalRow({ 
  goal, onTogglePriority, onFinish, onDelete, onEdit 
}: { 
  goal: Goal, 
  onTogglePriority: (g: Goal) => void,
  onFinish: () => void,
  onDelete: (g: Goal) => void,
  onEdit: (id: string) => void 
}) {
  const progress = Math.min((goal.savedAmount / goal.goalValue) * 100, 100)
  
  return (
    <div className="group bg-[#161618] border border-white/5 rounded-2xl p-4 md:px-8 md:py-4 hover:bg-[#1C1C1E] hover:border-white/10 transition-all flex flex-col md:grid md:grid-cols-12 md:items-center gap-4">
      
      {/* Nome e Ícone */}
      <div className="col-span-4 flex items-center gap-4">
        <button onClick={() => onTogglePriority(goal)} className="transition-colors">
          <Star size={18} className={goal.isPriority ? "fill-yellow-400 text-yellow-400" : "text-gray-700 hover:text-gray-500"} />
        </button>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{goal.goalName}</p>
          <p className="text-[10px] text-gray-500 flex items-center gap-1">
            {goal.isFinished ? <span className="text-emerald-500 font-bold uppercase">Concluído</span> : 'Em andamento'}
          </p>
        </div>
      </div>

      {/* Progresso (Barra Horizontal) */}
      <div className="col-span-2 flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-[10px] font-medium text-gray-400 px-0.5">
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${goal.isFinished ? 'bg-emerald-500' : 'bg-violet-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Valores */}
      <div className="col-span-2 text-right hidden md:block">
        <p className="text-sm font-bold text-white">{formatCurrency(goal.savedAmount)}</p>
        <p className="text-[10px] text-gray-600 font-medium">de {formatCurrency(goal.goalValue)}</p>
      </div>

      {/* Data */}
      <div className="col-span-2 text-center hidden md:block text-xs text-gray-400 font-medium">
        {dayjs(goal.targetDate).format("DD MMM, YYYY")}
      </div>

      {/* Ações */}
      <div className="col-span-2 flex items-center justify-end gap-2">
        {!goal.isFinished && (
          <button 
            onClick={onFinish}
            className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
            title="Concluir Meta"
          >
            <Check size={16} />
          </button>
        )}
        <button 
          onClick={() => onEdit(goal.id)}
          className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all"
        >
          <Edit2 size={16} />
        </button>
        <button 
          onClick={() => onDelete(goal)}
          className="p-2 bg-red-500/5 text-red-500/50 rounded-lg hover:bg-red-500 hover:text-white transition-all"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

function EmptyState({ isFiltering, onReset }: any) {
  return (
    <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl">
      <p className="text-gray-500 text-sm">Nenhum registro encontrado.</p>
      {isFiltering && (
        <button onClick={onReset} className="mt-2 text-xs text-violet-400">Remover filtros</button>
      )}
    </div>
  )
}