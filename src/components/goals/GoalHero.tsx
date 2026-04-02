"use client"

import React, { memo } from "react"
import { Target, TrendingUp, CheckCircle2, Wallet } from "lucide-react"
import { formatCurrency } from "@/src/utils/formatCurrency"

interface GoalHeroProps {
  stats: {
    totalTarget: number
    totalSaved: number
    globalProgress: number
    activeGoals: number
    completedGoals: number
  }
}

const GoalHero = memo(function GoalHero({ stats }: GoalHeroProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card Principal: Progresso Global */}
      <div className="md:col-span-2 relative overflow-hidden bg-[#161618] border border-white/[0.03] rounded-[2.5rem] p-8 group transition-all duration-500 hover:border-emerald-500/20">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500">
          <Target size={180} strokeWidth={1} />
        </div>
        
        <div className="relative z-10 flex flex-col h-full justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Visão Geral</p>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Progresso Global</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-4xl font-black text-white tracking-tighter italic">
                  {stats.globalProgress.toFixed(1)}%
                </span>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">dos objetivos alcançados</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-400">{formatCurrency(stats.totalSaved)}</p>
                <p className="text-[10px] font-bold text-white/20 uppercase">Acumulado Total</p>
              </div>
            </div>

            <div className="relative h-3 bg-white/[0.02] rounded-full overflow-hidden border border-white/[0.05]">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                style={{ width: `${stats.globalProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cards Laterais: Stats Rápidas */}
      <div className="flex flex-col gap-6">
        <div className="flex-1 bg-[#161618] border border-white/[0.03] rounded-3xl p-6 flex flex-col justify-center gap-4 group hover:border-white/10 transition-all">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-white/20 group-hover:text-white transition-colors">
                <Wallet size={18} />
             </div>
             <div>
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Falta Juntar</p>
                <p className="text-lg font-black text-white italic tracking-tighter">
                  {formatCurrency(Math.max(stats.totalTarget - stats.totalSaved, 0))}
                </p>
             </div>
          </div>
        </div>

        <div className="flex-1 bg-emerald-500 rounded-3xl p-6 flex flex-col justify-center gap-4 group transition-all hover:scale-[1.02] active:scale-[0.98]">
           <div className="flex items-center gap-3 text-black">
              <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center">
                 <CheckCircle2 size={18} />
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Concluídas</p>
                 <p className="text-xl font-black italic tracking-tighter">
                   {stats.completedGoals} <span className="text-sm opacity-40">Alvos</span>
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
})

export default GoalHero
