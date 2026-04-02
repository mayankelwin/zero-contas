"use client"

import React, { memo, useMemo } from "react"
import { Star, Trophy, Target, ArrowUpRight, Calendar, PiggyBank } from "lucide-react"
import { formatCurrency } from "@/src/utils/formatCurrency"
import dayjs from "dayjs"
import { cn } from "@/src/lib/utils"

interface GoalCardModernProps {
  goal: any
  onTogglePriority: (goal: any) => void
  onView: (goal: any) => void
}

const GoalCardModern = memo(function GoalCardModern({ goal, onTogglePriority, onView }: GoalCardModernProps) {
  const { progress, isDelayed, remainingTime } = useMemo(() => {
    const p = Math.min((goal.savedAmount / goal.goalValue) * 100, 100)
    const deadline = dayjs(goal.goalDeadline)
    const isD = dayjs().isAfter(deadline) && p < 100
    const remaining = deadline.diff(dayjs(), 'day')
    
    return {
      progress: p,
      isDelayed: isD,
      remainingTime: remaining > 0 ? `${remaining} dias` : 'Expirado'
    }
  }, [goal])

  return (
    <div 
      onClick={() => onView(goal)}
      className={cn(
        "group relative bg-[#161618] border border-white/[0.03] rounded-[2.5rem] p-8 hover:bg-[#111111] hover:border-white/10 transition-all duration-500 cursor-pointer overflow-hidden",
        goal.isPriority && "border-yellow-500/20"
      )}
    >
      {/* Background Decorativo */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl group-hover:bg-white/[0.05] transition-all duration-700" />
      
      <div className="relative z-10 space-y-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
             <div className={cn(
               "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
               goal.isFinished ? "bg-emerald-500/10 text-emerald-500" : "bg-white/[0.03] text-white/40 group-hover:bg-white group-hover:text-black"
             )}>
                {goal.isFinished ? <Trophy size={20} /> : <Target size={20} />}
             </div>
             <div>
                <div className="flex items-center gap-2">
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 italic">
                      {goal.isFinished ? 'Concluída' : 'Objetivo'}
                   </span>
                   {isDelayed && (
                     <span className="text-[8px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 uppercase">
                        Atrasado
                     </span>
                   )}
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter italic text-white group-hover:translate-x-1 transition-transform">
                  {goal.goalName}
                </h3>
             </div>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); onTogglePriority(goal); }}
            className={cn(
              "p-2.5 rounded-xl transition-all active:scale-90",
              goal.isPriority ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]" : "bg-white/[0.03] text-white/10 hover:text-white hover:bg-white/10"
            )}
          >
            <Star size={16} fill={goal.isPriority ? "currentColor" : "none"} strokeWidth={2.5} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
               <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white italic tracking-tighter">
                    {formatCurrency(goal.savedAmount)}
                  </span>
                  <span className="text-[10px] font-bold text-white/20 uppercase">/ {formatCurrency(goal.goalValue)}</span>
               </div>
               <span className={cn(
                 "text-xs font-black italic tracking-tighter",
                 goal.isFinished ? "text-emerald-500" : "text-white/40"
               )}>
                 {progress.toFixed(0)}%
               </span>
            </div>

            <div className="relative h-2 w-full bg-white/[0.02] rounded-full overflow-hidden border border-white/[0.05]">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-[1500ms] ease-out",
                  goal.isFinished ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-white/80"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/[0.02]">
             <div className="flex items-center gap-2">
                <Calendar size={12} className="text-white/20" />
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">
                  Prazo: {dayjs(goal.goalDeadline).format('DD MMM YYYY')}
                </span>
             </div>
             <div className="flex items-center justify-end gap-2">
                <PiggyBank size={12} className="text-white/20" />
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">
                  Falta {formatCurrency(Math.max(goal.goalValue - goal.savedAmount, 0))}
                </span>
             </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
         <ArrowUpRight size={20} className="text-white/40" />
      </div>
    </div>
  )
})

export default GoalCardModern
