"use client"

import Header from "@/src/components/layout/Header"
import Sidebar from "@/src/components/layout/Sidebar"
import { Plus, Star, Edit2, X, Check, Search, Filter, SortAsc, Trophy, Target, Calendar, Zap, Sparkles } from "lucide-react"
import { useGoalsLogic } from "@/src/hooks/useGoalsLogic"
import { useState, useMemo } from "react"
import dayjs from "dayjs"
import AddTransactionModal from "@/src/components/AddTransactionModal"
import { LoadingPage } from "@/src/components/Loading"

export default function MetasScreen() {
  const { user, loading, goals, togglePriority, deleteGoal, toggleActive, finishGoal, router } =
    useGoalsLogic()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "finished">("all")
  const [sortType, setSortType] = useState<"recent" | "az" | "priority">("recent")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [celebratingGoal, setCelebratingGoal] = useState<string | null>(null)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  // Efeito de celebração quando uma meta é completada
  const handleFinishGoalWithCelebration = (goal: any) => {
    setCelebratingGoal(goal.id)
    finishGoal(goal)
    setTimeout(() => setCelebratingGoal(null), 3000)
  }

  const filteredGoals = useMemo(() => {
    return goals
      .filter(goal => goal.goalName.toLowerCase().includes(search.toLowerCase()))
      .filter(goal => {
        if (statusFilter === "all") return true
        if (statusFilter === "active") return goal.isActive && !goal.isFinished
        if (statusFilter === "inactive") return !goal.isActive && !goal.isFinished
        if (statusFilter === "finished") return goal.isFinished
        return true
      })
  }, [goals, search, statusFilter])
 
  const sortedGoals = useMemo(() => {
    let sorted = [...filteredGoals]
    if (sortType === "recent") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortType === "az") {
      sorted.sort((a, b) => a.goalName.localeCompare(b.goalName))
    } else if (sortType === "priority") {
      sorted.sort((a, b) => (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0))
    }
    return sorted
  }, [filteredGoals, sortType])

 if (loading || !user) return <LoadingPage />

  return (
    <div className="flex h-screen bg-[#1A1A1A]">
      <Sidebar />
      <main className="flex-1 ml-16 sm:ml-20 overflow-auto">
        <Header />
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">

          {/* Header com título e botão */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <Target className="text-violet-400" size={28} />
                Minhas Metas
              </h1>
              <p className="text-gray-400 text-sm">
                Gerencie suas metas financeiras e acompanhe seu progresso
              </p>
            </div>
            
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/25 active:scale-95 group w-full lg:w-auto justify-center"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              Nova Meta
            </button>
          </div>

          {/* Filtros e busca */}
          <div className="bg-[#1E1F24] rounded-2xl p-4 sm:p-6 border border-gray-800">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
              {/* Barra de pesquisa */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Pesquisar metas..."
                  className="w-full pl-12 pr-4 py-3 bg-[#2A2B32] border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full pl-10 pr-4 py-3 bg-[#2A2B32] border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 appearance-none"
                  >
                    <option value="all">Todas as Metas</option>
                    <option value="active">Ativas</option>
                    <option value="inactive">Desativadas</option>
                    <option value="finished">Concluídas</option>
                  </select>
                </div>

                <div className="relative flex-1">
                  <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={sortType}
                    onChange={e => setSortType(e.target.value as any)}
                    className="w-full pl-10 pr-4 py-3 bg-[#2A2B32] border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 appearance-none"
                  >
                    <option value="recent">Mais Recentes</option>
                    <option value="az">Ordem A-Z</option>
                    <option value="priority">Prioridade</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Cards de metas - Layout responsivo */}
          <div className="grid grid-cols-1 gap-6">
            {sortedGoals.map(goal => {
              const isFinished = goal.isFinished
              const progressPercent = Math.min((goal.savedAmount / goal.goalValue) * 100, 100)
              const daysToTarget = dayjs(goal.targetDate).diff(dayjs(), 'days')
              const isCelebrating = celebratingGoal === goal.id

              return (
                <div
                  key={goal.id}
                  className={`relative rounded-2xl p-6 border-2 transition-all duration-500 hover:shadow-2xl overflow-hidden ${
                    isFinished 
                      ? "border-green-400 bg-gradient-to-br from-green-900/30 via-emerald-900/20 to-green-800/10 shadow-2xl shadow-green-500/20" 
                      : goal.isPriority
                      ? "border-yellow-500/50 bg-gradient-to-br from-yellow-900/20 to-amber-900/10"
                      : "border-gray-700 hover:border-violet-500/50 bg-[#1E1F24]"
                  } ${isCelebrating ? 'animate-pulse ring-4 ring-yellow-400' : ''}`}
                >

                  {/* Efeito de brilho para metas completadas */}
                  {isFinished && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/5 animate-pulse"></div>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-emerald-400/20 rounded-full -ml-8 -mb-8 blur-xl"></div>
                    </>
                  )}

                  {/* Efeito de celebração */}
                  {isCelebrating && (
                    <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-20">
                      <div className="animate-bounce">
                        <Trophy className="w-12 h-12 text-yellow-400" />
                      </div>
                    </div>
                  )}

                  {/* Header do card */}
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl backdrop-blur-sm ${
                        isFinished 
                          ? "bg-green-500/20 border border-green-400/30" 
                          : goal.isPriority
                          ? "bg-yellow-500/20 border border-yellow-400/30"
                          : "bg-violet-500/20 border border-violet-400/30"
                      }`}>
                        {isFinished ? (
                          <Trophy className="w-6 h-6 text-green-400" />
                        ) : goal.isPriority ? (
                          <Zap className="w-6 h-6 text-yellow-400" />
                        ) : (
                          <Target className="w-6 h-6 text-violet-400" />
                        )}
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${
                          isFinished ? "text-green-300" : "text-white"
                        }`}>
                          {goal.goalName}
                        </h3>
                        <p className={`text-sm ${
                          isFinished ? "text-green-400/80" : "text-gray-400"
                        }`}>
                          {isFinished ? "🎉 Meta Concluída!" : goal.isPriority ? "⚡ Prioridade" : "📈 Em andamento"}
                        </p>
                      </div>
                    </div>
                    
                    {/* Estrela de prioridade - Só aparece se não estiver concluída */}
                    {!isFinished && (
                      <button 
                        onClick={() => togglePriority(goal)}
                        className="p-2 hover:bg-gray-700/50 rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        <Star
                          className={`w-5 h-5 transition-all duration-300 ${
                            goal.isPriority 
                              ? "text-yellow-400 fill-yellow-400 animate-pulse" 
                              : "text-gray-400 hover:text-yellow-300"
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Barra de progresso */}
                  <div className="space-y-3 mb-4 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-semibold ${
                        isFinished ? "text-green-300" : "text-white"
                      }`}>
                        {isFinished ? "Valor Concluído" : "Progresso"}
                      </span>
                      <span className={`text-lg font-bold ${
                        isFinished ? "text-green-400" : "text-violet-400"
                      }`}>
                        {Math.floor(progressPercent)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          isFinished 
                            ? "bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 shadow-lg shadow-green-400/50"
                            : "bg-gradient-to-r from-violet-500 to-purple-600"
                        } ${isFinished ? 'animate-pulse' : ''}`}
                        style={{ width: `${isFinished ? 100 : progressPercent}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className={isFinished ? "text-green-300/80" : "text-gray-400"}>
                        R$ {goal.savedAmount.toLocaleString('pt-BR')}
                      </span>
                      <span className={isFinished ? "text-green-300/80" : "text-gray-400"}>
                        R$ {goal.goalValue.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Informações de data */}
                  <div className={`flex items-center justify-between text-sm mb-4 relative z-10 ${
                    isFinished ? "text-green-300/80" : "text-gray-400"
                  }`}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Criada: {dayjs(goal.createdAt).format("DD/MM/YY")}</span>
                    </div>
                    <div className="text-right">
                      <div>Previsão: {dayjs(goal.targetDate).format("DD/MM/YY")}</div>
                      {!isFinished && daysToTarget > 0 && (
                        <div className="text-xs text-yellow-400">
                          {daysToTarget} dias restantes
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações - COMPORTAMENTO DIFERENTE PARA METAS CONCLUÍDAS */}
                  {isFinished ? (
                    // AÇÕES PARA META CONCLUÍDA - VISUAL ESPECIAL
                    <div className="relative z-10">
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 text-center backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
                          <span className="text-green-300 font-bold text-lg bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            Missão Cumprida!
                          </span>
                          <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
                        </div>
                        <p className="text-green-300/90 text-sm mb-3">
                          Parabéns! Você alcançou sua meta em {dayjs(goal.targetDate).format("DD/MM/YYYY")}
                        </p>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => router.push(`/metas/editar/${goal.id}`)}
                            className="px-3 py-2 bg-blue-600/80 hover:bg-blue-500 text-white rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                            title="Ver detalhes"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deleteGoal(goal)}
                            className="px-3 py-2 bg-red-600/80 hover:bg-red-500 text-white rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                            title="Excluir meta"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // AÇÕES PARA META EM ANDAMENTO
                    <div className="flex gap-2 relative z-10">
                      <button
                        onClick={() => toggleActive(goal)}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm ${
                          goal.isActive
                            ? "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/25"
                            : "bg-gray-600 hover:bg-gray-500 text-gray-200"
                        }`}
                      >
                        {goal.isActive ? "Ativa" : "Inativa"}
                      </button>
                      
                      <button
                        onClick={() => handleFinishGoalWithCelebration(goal)}
                        className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25"
                        title="Concluir meta"
                      >
                        <Check size={16} />
                      </button>
                      
                      <button
                        onClick={() => router.push(`/metas/editar/${goal.id}`)}
                        className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
                        title="Editar meta"
                      >
                        <Edit2 size={16} />
                      </button>
                      
                      <button
                        onClick={() => deleteGoal(goal)}
                        className="p-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/25"
                        title="Excluir meta"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Mensagem quando não há metas */}
          {sortedGoals.length === 0 && (
            <div className="text-center py-16 bg-[#1E1F24] rounded-2xl border border-gray-800">
              <Target className="w-24 h-24 text-gray-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">
                {search || statusFilter !== "all" ? "Nenhuma meta encontrada" : "Nenhuma meta cadastrada"}
              </h3>
              <p className="text-gray-500 mb-6">
                {search || statusFilter !== "all" 
                  ? "Tente ajustar os filtros ou termos da busca" 
                  : "Comece criando sua primeira meta para organizar seus objetivos financeiros"
                }
              </p>
              <button
                onClick={handleOpenModal}
                className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all duration-300 hover:scale-105"
              >
                <Plus size={20} />
                Criar Primeira Meta
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <AddTransactionModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            defaultType="goal"
            allowedTypes={["goal"]}
          />
        )}
      </main>
    </div>
  )
}