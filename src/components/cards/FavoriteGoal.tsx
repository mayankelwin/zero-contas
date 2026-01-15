"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { Target, Trophy, PlusCircle, ArrowUpRight } from "lucide-react"

interface Goal {
  id: string
  goalName: string
  savedAmount: number
  goalValue: number
  saldoMetas?: number
}

interface FavoriteGoalProps {
  goal: Goal
  onOpenModal: (goal: Goal) => void
}

export default function FavoriteGoal({ goal, onOpenModal }: FavoriteGoalProps) {
  const [displayPercent, setDisplayPercent] = useState(0)
  const [animatedValue, setAnimatedValue] = useState(0)

  const actualPercent = Math.min((goal.savedAmount / goal.goalValue) * 100, 100)
  const isGoalCompleted = actualPercent >= 100

  useEffect(() => {
    const timer = setTimeout(() => setDisplayPercent(actualPercent), 200)
    
    let start = 0
    const end = goal.savedAmount
    const duration = 800 
    const incrementTime = 20
    const step = (end / (duration / incrementTime))

    const counter = setInterval(() => {
      start += step
      if (start >= end) {
        setAnimatedValue(end)
        clearInterval(counter)
      } else {
        setAnimatedValue(start)
      }
    }, incrementTime)

    return () => {
      clearTimeout(timer)
      clearInterval(counter)
    }
  }, [actualPercent, goal.savedAmount])

  return (
    <div className="mt-6 relative group">
      <div className="relative bg-[#161618] px-6 py-5 rounded-[2rem] border border-white/[0.05] flex flex-col gap-4 shadow-xl group-hover:border-white/10 transition-all duration-500">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
              isGoalCompleted 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-violet-500/10 border-violet-500/20 text-violet-400"
            }`}>
              {isGoalCompleted ? <Trophy size={18} /> : <Target size={18} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.15em]">Meta Favorita</span>
                {isGoalCompleted && (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-400/5 px-1.5 py-0.5 rounded">
                    CONCLUÍDA
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight leading-none mt-1">
                {goal.goalName}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Progresso</div>
            <div className={`text-xl font-black tracking-tighter ${isGoalCompleted ? 'text-emerald-400' : 'text-white'}`}>
              {Math.floor(displayPercent)}%
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[11px] font-medium text-gray-400">
                <strong className="text-white font-bold">{formatCurrency(animatedValue)}</strong> acumulados
              </span>
              <span className="text-[11px] font-medium text-gray-500">
                alvo: {formatCurrency(goal.goalValue)}
              </span>
            </div>
            
            <div className="relative h-2 bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.05]">
              <div
                className={`h-full rounded-full transition-all duration-[1200ms] ease-out ${
                  isGoalCompleted ? 'bg-emerald-500' : 'bg-violet-600'
                } shadow-[0_0_10px_rgba(124,58,237,0.3)]`}
                style={{ width: `${displayPercent}%` }}
              />
            </div>
          </div>

          {!isGoalCompleted && (
            <button
              onClick={() => onOpenModal(goal)}
              className="h-10 px-5 flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-xs transition-all active:scale-95 whitespace-nowrap"
            >
              <PlusCircle size={14} strokeWidth={3} />
              GESTÃO
            </button>
          )}
        </div>

        {!isGoalCompleted && (
          <div className="flex items-center gap-2 pt-1 border-t border-white/[0.03]">
            <ArrowUpRight size={12} className="text-emerald-400" />
            <p className="text-[10px] font-medium text-gray-500 italic">
              Continue focado, você está cada vez mais perto do seu objetivo.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}