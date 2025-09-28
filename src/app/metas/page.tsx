"use client"

import Header from "@/src/components/layout/Header"
import Sidebar from "@/src/components/layout/Sidebar"
import { Plus, Star, Edit2, X, Check } from "lucide-react"
import { useGoalsLogic } from "@/src/hooks/useGoalsLogic"
import { useState, useMemo } from "react"
import dayjs from "dayjs"
import AddTransactionModal from "@/src/components/AddTransactionModal"

export default function MetasScreen() {
  const { user, loading, goals, togglePriority, deleteGoal, toggleActive, finishGoal, router } =
    useGoalsLogic()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "finished">("all")
  const [sortType, setSortType] = useState<"recent" | "az">("recent")

  // 🔹 Estado do modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

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
    }
    return sorted
  }, [filteredGoals, sortType])

  if (loading || !user) return <div className="p-8">Carregando...</div>

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 ml-16 sm:ml-20">
        <Header />
        <div className="p-6 space-y-6">

          {/* Top controls: add, search, filter */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
            >
              <Plus size={16} /> Adicionar Meta
            </button>

            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center w-full md:w-auto">
              <input
                type="text"
                placeholder="Pesquisar meta..."
                className="px-3 py-2 rounded bg-[#2A2B32] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 flex-1"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded bg-[#2A2B32] text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">Todas</option>
                <option value="active">Ativas</option>
                <option value="inactive">Desativadas</option>
                <option value="finished">Concluídas</option>
              </select>
              <select
                value={sortType}
                onChange={e => setSortType(e.target.value as any)}
                className="px-3 py-2 rounded bg-[#2A2B32] text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="recent">Mais Recentes</option>
                <option value="az">A-Z</option>
              </select>
            </div>
          </div>

          {/* Lista em formato tabela */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700 text-left text-gray-200">
              <thead className="bg-[#1E1F24] border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Progresso</th>
                  <th className="px-4 py-3">Data Criada</th>
                  <th className="px-4 py-3">Data Desejada</th>
                  <th className="px-4 py-3">Ativa</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-[#2A2B32] divide-y divide-gray-700">
                {sortedGoals.map(goal => {
                  const isFinished = goal.isFinished
                  const progressPercent = Math.min((goal.savedAmount / goal.goalValue) * 100, 100)

                  return (
                    <tr
                      key={goal.id}
                      className={`relative border ${isFinished ? "border-green-500" : "border-transparent"} ${
                        isFinished ? "bg-green-900/10" : ""
                      }`}
                    >
                      {/* Nome */}
                      <td className="px-4 py-3 font-medium">{goal.goalName}</td>

                      {/* Progresso */}
                      <td className="px-4 py-3">
                        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                          <div
                            className={`h-full ${isFinished ? "bg-green-500" : "bg-violet-500"}`}
                            style={{ width: `${isFinished ? 100 : progressPercent}%` }}
                          />
                        </div>
                        {isFinished ? (
                          <div className="flex items-center gap-2 mt-1 text-green-500 font-semibold">
                            <span>Concluído</span>
                            <Check size={24} />
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 mt-1">
                            {goal.savedAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} /{" "}
                            {goal.goalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        )}
                      </td>

                      {/* Datas */}
                      <td className="px-4 py-3">{dayjs(goal.createdAt).format("DD/MM/YYYY")}</td>
                      <td className="px-4 py-3">{dayjs(goal.targetDate).format("DD/MM/YYYY")}</td>

                      {/* Ativa */}
                      <td className="px-4 py-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={goal.isActive}
                            onChange={() => toggleActive(goal)}
                            className="hidden"
                          />
                          <span
                            className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                              goal.isActive ? "bg-green-500" : "bg-gray-400"
                            }`}
                          >
                            <span
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                                goal.isActive ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </span>
                        </label>
                      </td>

                      {/* Ações */}
                      <td className="px-4 py-3 flex gap-2">
                        <button onClick={() => togglePriority(goal)}>
                          <Star
                            className={`cursor-pointer ${goal.isPriority ? "text-yellow-400" : "text-gray-400"}`}
                          />
                        </button>
                        {!isFinished && (
                          <button onClick={() => finishGoal(goal)}>
                            <Check className="text-green-400 cursor-pointer" />
                          </button>
                        )}
                        <button onClick={() => router.push(`/metas/editar/${goal.id}`)}>
                          <Edit2 className="text-gray-400 cursor-pointer" />
                        </button>
                        <button onClick={() => deleteGoal(goal)}>
                          <X className="text-red-500 cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <AddTransactionModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            defaultType="goal"
          />
        )}
      </main>
    </div>
  )
}
