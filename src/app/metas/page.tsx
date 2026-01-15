"use client"

import { useState, useMemo, useEffect } from "react"
import { 
  Plus, Star, Edit2, X, Check, Search, 
  Trophy, Target, Calendar, Sparkles, 
  TrendingUp, Clock, ArrowRight, Save,
  Activity,
  ArrowUpRight
} from "lucide-react"
import dayjs from "dayjs"

import Header from "@/src/components/layout/Header"
import Sidebar from "@/src/components/layout/Sidebar"
import { useGoalsLogic } from "@/src/hooks/useGoalsLogic"
import AddTransactionModal from "@/src/components/modal/addTransaction/AddTransactionModal"
import { LoadingPage } from "@/src/components/ui/Loading"
import { formatCurrency } from "@/src/utils/formatCurrency"

export default function MetasScreen() {
  const { 
    user, loading, goals, togglePriority, deleteGoal, 
    finishGoal, updateGoal 
  } = useGoalsLogic()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "finished">("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  const [selectedGoal, setSelectedGoal] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Sincroniza o modal se os dados da meta mudarem em tempo real
  useEffect(() => {
    if (selectedGoal) {
      const updated = goals.find((g: any) => g.id === selectedGoal.id);
      if (updated) setSelectedGoal(updated);
    }
  }, [goals]);

  const processedGoals = useMemo(() => {
    return (goals as any[])
      .filter(g => g.goalName.toLowerCase().includes(search.toLowerCase()))
      .filter(g => {
        if (statusFilter === "all") return true
        if (statusFilter === "active") return g.isActive && !g.isFinished
        if (statusFilter === "inactive") return !g.isActive && !g.isFinished
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
        
        <div className="flex-1 overflow-y-auto p-8 space-y-10 hide-scrollbar">
          <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <Trophy size={14} className="animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Ambition Tracker</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                Metas <span className="text-white/20 not-italic">Financeiras</span>
              </h1>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl transition-all active:scale-95"
            >
              <Plus size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Novo Alvo</span>
            </button>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
            {processedGoals.map(goal => (
              <GoalCard 
                key={goal.id} 
                goal={goal}
                onTogglePriority={togglePriority}
                onView={() => setSelectedGoal(goal)}
              />
            ))}
          </section>
        </div>

        {selectedGoal && (
          <GoalDetailModal 
            goal={selectedGoal} 
            isOpen={!!selectedGoal} 
            onClose={() => { setSelectedGoal(null); setIsEditMode(false); }}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            onUpdate={updateGoal}
          />
        )}

        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          defaultType="goal"
          allowedTypes={["goal"]}
        />
      </main>
    </div>
  )
}

function GoalCard({ goal, onTogglePriority, onView }: any) {
  const progress = Math.min((goal.savedAmount / goal.goalValue) * 100, 100)
  
  return (
    <div 
      onClick={onView}
      className="group relative bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] p-8 hover:bg-white/[0.03] hover:border-white/10 transition-all cursor-pointer overflow-hidden"
    >
      <div className="relative z-10 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 italic">
               {goal.isFinished ? 'Concluída' : 'Em Progresso'}
            </span>
            <h3 className="text-xl font-black uppercase tracking-tighter italic">{goal.goalName}</h3>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onTogglePriority(goal); }}
            className={`p-3 rounded-xl transition-all ${goal.isPriority ? 'bg-yellow-500 text-black' : 'bg-white/5 text-white/20'}`}
          >
            <Star size={16} fill={goal.isPriority ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${goal.isFinished ? 'bg-emerald-500' : 'bg-white'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span>{progress.toFixed(0)}% Alcançado</span>
            <span className="text-white/40">{formatCurrency(goal.goalValue)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function GoalDetailModal({ goal, isOpen, onClose, isEditMode, setIsEditMode, onUpdate, userIncomes }: any) {
  const [editData, setEditData] = useState({ ...goal });

  useEffect(() => {
    setEditData({ ...goal });
  }, [goal]);

  const stats = useMemo(() => {
    const remaining = goal.goalValue - (goal.savedAmount || 0);
    const today = dayjs();
    const deadline = dayjs(goal.goalDeadline);
    
    let months = deadline.diff(today, 'month');
    if (months <= 0 && deadline.isAfter(today)) months = 1;
    const monthlyAport = months > 0 ? remaining / months : remaining;

    return {
      remaining,
      months: months > 0 ? months : 1,
      monthlyAport,
      // Supondo que você passe a receita mensal do usuário via props
      viability: userIncomes > 0 ? (monthlyAport / userIncomes) * 100 : 0
    };
  }, [goal, userIncomes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Minimalista */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/[0.02]">
           <div className="flex items-center gap-4">
              <h2 className="text-xl font-black uppercase italic tracking-tighter">
                {isEditMode ? "Editar Meta" : goal.goalName}
              </h2>
              {!isEditMode && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full border border-emerald-500/20">
                  {((goal.savedAmount / goal.goalValue) * 100).toFixed(0)}% CONCLUÍDO
                </span>
              )}
           </div>
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
              >
                {isEditMode ? <X size={20}/> : <Edit2 size={20}/>}
              </button>
              <button onClick={onClose} className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-white/20 hover:text-red-500">
                <X size={20} />
              </button>
           </div>
        </div>

        <div className="p-8">
          {isEditMode ? (
            /* Layout de Edição */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Nome do Objetivo</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold"
                      value={editData.goalName}
                      onChange={e => setEditData({...editData, goalName: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Valor Alvo</label>
                      <input 
                        type="number"
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold"
                        value={editData.goalValue}
                        onChange={e => setEditData({...editData, goalValue: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Prazo</label>
                      <input 
                        type="date"
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold text-white [color-scheme:dark]"
                        value={dayjs(editData.goalDeadline).format('YYYY-MM-DD')}
                        onChange={e => setEditData({...editData, goalDeadline: e.target.value})}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => { onUpdate(goal.id, editData); setIsEditMode(false); }}
                    className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={18} /> Salvar Alterações
                  </button>
               </div>
               <div className="bg-white/5 rounded-2xl p-6 flex flex-col justify-center items-center text-center border border-dashed border-white/10">
                  <Sparkles className="text-emerald-500 mb-4" size={32} />
                  <p className="text-xs text-white/60 font-medium">Os novos cálculos de projeção serão atualizados assim que você salvar os dados.</p>
               </div>
            </div>
          ) : (
            /* Layout de Visualização - Inteligência Financeira */
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* Coluna da Esquerda: O Plano (Cálculos) */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-emerald-500 rounded-2xl p-8 text-black relative overflow-hidden group">
                  <div className="relative z-10 space-y-4">
                    <span className="px-3 py-1 bg-black/10 rounded-full text-[10px] font-black uppercase tracking-widest">Plano de Ação</span>
                    <h3 className="text-4xl font-black tracking-tighter leading-none">
                      {formatCurrency(stats.monthlyAport)} <span className="text-lg opacity-60">/mês</span>
                    </h3>
                    <p className="text-sm font-bold leading-tight opacity-80">
                      Se você poupar <span className="underline">{formatCurrency(stats.monthlyAport)}</span> por mês durante os próximos <span className="underline">{stats.months} meses</span>, você atingirá o objetivo de {formatCurrency(goal.goalValue)}.
                    </p>
                  </div>
                  <TrendingUp size={120} className="absolute -right-4 -bottom-4 text-black/10" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-black text-white/30 uppercase mb-2">Falta Juntar</p>
                    <p className="text-xl font-black text-red-400">{formatCurrency(stats.remaining)}</p>
                  </div>
                  <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-black text-white/30 uppercase mb-2">Data Limite</p>
                    <p className="text-xl font-black">{dayjs(goal.goalDeadline).format('MMM YYYY')}</p>
                  </div>
                </div>
              </div>

              {/* Coluna da Direita: Viabilidade (Receita) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Saúde da Meta</p>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-white/60">Impacto na Receita</span>
                      <span className={`text-lg font-black ${stats.viability > 30 ? 'text-orange-500' : 'text-emerald-500'}`}>
                        {stats.viability.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${stats.viability > 30 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(stats.viability, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-white/40">
                        <ArrowUpRight size={14} />
                        <span className="text-[10px] font-black uppercase">Sua Receita</span>
                      </div>
                      <span className="text-sm font-black text-emerald-400">{formatCurrency(userIncomes || 0)}</span>
                    </div>
                    <p className="text-[10px] text-white/30 font-medium leading-relaxed italic">
                      {stats.viability > 50 
                        ? "Atenção: Esta meta compromete mais da metade da sua renda. Considere estender o prazo." 
                        : "Esta meta parece saudável para o seu orçamento atual."}
                    </p>
                  </div>
                </div>

                <div className="p-6 border border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-white/5 transition-colors cursor-help">
                   <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                      <Activity size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-white/40">Dica de Sucesso</p>
                      <p className="text-[11px] font-bold text-white/80">Automatize esse aporte para o dia que seu salário cair.</p>
                   </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}