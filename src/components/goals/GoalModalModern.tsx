"use client"

import React, { useState, useEffect, useMemo, memo, useCallback } from "react"
import { 
  X, Edit2, Check, Sparkles, TrendingUp, 
  Target, Calendar, Activity, ArrowUpRight, 
  AlertCircle, Trash2, CheckCircle2, MoreHorizontal 
} from "lucide-react"
import dayjs from "dayjs"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { cn } from "@/src/lib/utils"

interface GoalModalModernProps {
  goal: any
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: string, data: any) => void
  onDelete: (goal: any) => void
  onFinish: (goal: any) => void
  userIncomes: number
}

const GoalModalModern = memo(function GoalModalModern({ 
  goal, 
  isOpen, 
  onClose, 
  onUpdate,
  onDelete,
  onFinish,
  userIncomes 
}: GoalModalModernProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [editData, setEditData] = useState({ ...goal })

  useEffect(() => {
    if (goal) setEditData({ ...goal })
  }, [goal])

  const stats = useMemo(() => {
    if (!goal) return null
    const remaining = Math.max(goal.goalValue - (goal.savedAmount || 0), 0)
    const today = dayjs()
    const deadline = dayjs(goal.goalDeadline)
    
    let months = deadline.diff(today, 'month')
    if (months <= 0 && deadline.isAfter(today)) months = 1
    const monthlyAport = months > 0 ? remaining / months : remaining

    return {
      remaining,
      months: months > 0 ? months : 1,
      monthlyAport,
      viability: userIncomes > 0 ? (monthlyAport / userIncomes) * 100 : 0,
      progress: Math.min((goal.savedAmount / goal.goalValue) * 100, 100)
    }
  }, [goal, userIncomes])

  const handleSave = useCallback(() => {
    onUpdate(goal.id, editData)
    setIsEditMode(false)
  }, [goal, editData, onUpdate])

  const handleDelete = useCallback(() => {
    onDelete(goal)
    onClose()
  }, [goal, onDelete, onClose])

  const handleFinish = useCallback(() => {
    onFinish(goal)
    onClose()
  }, [goal, onFinish, onClose])

  if (!isOpen || !goal || !stats) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-[#0f0f0f] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Superior */}
        <div className="flex justify-between items-center px-10 py-8 border-b border-white/[0.03] bg-white/[0.01]">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white">
                 <Target size={24} />
              </div>
              <div className="space-y-0.5">
                 <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                   {isEditMode ? "Ajustar Objetivo" : goal.goalName}
                 </h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">
                   Informações da Estratégia
                 </p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              {!goal.isFinished && (
                 <button 
                   onClick={() => setIsEditMode(!isEditMode)}
                   className={cn(
                     "p-3 rounded-2xl transition-all duration-300 border",
                     isEditMode ? "bg-white text-black border-white" : "bg-white/[0.03] text-white/40 border-white/5 hover:border-white/20 hover:text-white"
                   )}
                 >
                   {isEditMode ? <X size={20}/> : <Edit2 size={20}/>}
                 </button>
              )}
              <button 
                onClick={onClose} 
                className="p-3 bg-red-500/10 border border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/20 rounded-2xl transition-all active:scale-90"
              >
                <X size={20} />
              </button>
           </div>
        </div>

        <div className="p-10 hide-scrollbar overflow-y-auto max-h-[70vh]">
          {isEditMode ? (
            /* Layout de Edição */
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
               <div className="md:col-span-3 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic ml-1">Nome do Destino</label>
                    <input 
                      className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-2xl outline-none focus:border-white transition-all font-black text-xl italic tracking-tighter uppercase"
                      value={editData.goalName}
                      onChange={e => setEditData({...editData, goalName: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic ml-1">Montante Alvo</label>
                      <input 
                        type="number"
                        className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-2xl outline-none focus:border-white transition-all font-black text-xl italic tracking-tighter"
                        value={editData.goalValue}
                        onChange={e => setEditData({...editData, goalValue: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic ml-1">Prazo Estimado</label>
                      <input 
                        type="date"
                        className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-2xl outline-none focus:border-white transition-all font-black text-xl italic tracking-tighter text-white [color-scheme:dark]"
                        value={dayjs(editData.goalDeadline).format('YYYY-MM-DD')}
                        onChange={e => setEditData({...editData, goalDeadline: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={handleSave}
                      className="flex-1 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]"
                    >
                      <Check size={18} strokeWidth={3} /> Salvar Plano
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="px-6 border border-red-500/20 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
               </div>

               <div className="md:col-span-2 flex flex-col gap-6">
                  <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center gap-4">
                    <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center text-white/20">
                      <Sparkles size={32} />
                    </div>
                    <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                      Ajuste seus parâmetros para recalcular a projeção de aportes.
                    </p>
                  </div>
                  
                  {!goal.isFinished && stats.progress >= 100 && (
                    <button 
                      onClick={handleFinish}
                      className="w-full py-5 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      <CheckCircle2 size={20} strokeWidth={3} /> Finalizar Meta
                    </button>
                  )}
               </div>
            </div>
          ) : (
            /* Layout de Visualização - Inteligência FinTech */
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              
              <div className="lg:col-span-3 space-y-8">
                {/* Card de Projeção Principal */}
                <div className="bg-white text-black rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                       <span className="px-4 py-1.5 bg-black/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic">Estratégia Recomendada</span>
                       <TrendingUp size={16} />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-6xl font-black tracking-tighter leading-none italic">
                        {formatCurrency(stats.monthlyAport)}
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 ml-1">por faturamento mensal</p>
                    </div>

                    <p className="text-sm font-bold leading-relaxed opacity-70 max-w-md">
                      Poupando <span className="underline font-black">{formatCurrency(stats.monthlyAport)}</span> nos próximos <span className="underline font-black">{stats.months} meses</span>, você garante a conquista de {formatCurrency(goal.goalValue)}.
                    </p>
                  </div>
                  <div className="absolute -right-10 -bottom-10 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                    <TrendingUp size={300} strokeWidth={1} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] space-y-2 group hover:border-white/10 transition-all">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic flex items-center gap-2">
                       <AlertCircle size={10} /> Déficit
                    </p>
                    <p className="text-2xl font-black text-red-500 tracking-tighter italic">{formatCurrency(stats.remaining)}</p>
                  </div>
                  <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] space-y-2 group hover:border-white/10 transition-all">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic flex items-center gap-2">
                       <Calendar size={10} /> Horizonte
                    </p>
                    <p className="text-2xl font-black text-white tracking-tighter italic">{dayjs(goal.goalDeadline).format('MMM YYYY')}</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                {/* Análise de Viabilidade (Health Check) */}
                <div className="p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest italic">Saúde Financeira</p>
                        <p className="text-sm font-bold text-white/80">Impacto na Receita</p>
                      </div>
                      <span className={cn(
                        "text-3xl font-black italic tracking-tighter",
                        stats.viability > 40 ? "text-orange-500" : "text-emerald-500"
                      )}>
                        {stats.viability.toFixed(1)}%
                      </span>
                    </div>

                    <div className="relative h-4 w-full bg-white/[0.02] rounded-full overflow-hidden border border-white/[0.05] p-1">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000 ease-out",
                          stats.viability > 40 ? "bg-orange-500" : "bg-emerald-500"
                        )}
                        style={{ width: `${Math.min(stats.viability, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/[0.05] space-y-6">
                    <div className="flex justify-between items-center group">
                      <div className="flex items-center gap-3 text-white/30 group-hover:text-white transition-colors">
                        <ArrowUpRight size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Seu Salário</span>
                      </div>
                      <span className="text-base font-black text-emerald-400 tracking-tighter italic">{formatCurrency(userIncomes || 0)}</span>
                    </div>
                    
                    <div className="bg-white/5 p-5 rounded-2xl">
                       <p className="text-[10px] text-white/40 font-bold leading-relaxed italic">
                         {stats.viability > 40 
                           ? "Atenção: Aporte muito agressivo para sua renda atual. Recomenda-se estender o prazo." 
                           : "Meta sustentável. Aporte recomendado não compromete seu fluxo de caixa."}
                       </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[#161618] border border-white/5 rounded-3xl flex items-center gap-5 hover:bg-emerald-500/5 transition-all cursor-default">
                   <div className="w-12 h-12 bg-white/[0.03] rounded-2xl flex items-center justify-center text-white/20">
                      <Activity size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black uppercase text-white/20 tracking-widest">Dica de Gestão</p>
                      <p className="text-[11px] font-bold text-white/70 italic">Considere fracionar aportes em ativos de alta liquidez.</p>
                   </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default GoalModalModern
