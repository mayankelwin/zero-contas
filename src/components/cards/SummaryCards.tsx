"use client"

import { formatCurrency } from "@/src/utils/formatCurrency"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { ElementType } from "react"

// Exportamos o tipo para que outros hooks possam usá-lo
export interface SummaryCardData {
  label: string
  value: number
  icon: ElementType // Melhor que 'any' para ícones Lucide
  color?: string 
  valueColor?: string
  subtitle?: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral' | string 
}

interface SummaryCardsProps {
  cards: SummaryCardData[]
}

export default function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative bg-[#161618] rounded-[2.5rem] p-8 border border-white/[0.03] hover:border-white/10 transition-all duration-500 group overflow-hidden shadow-2xl"
        >
          {/* Sutil gradiente de profundidade no hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  {card.label}
                </h3>
                <p className="text-[11px] text-gray-600 font-semibold italic">
                  {card.subtitle || "Período atual"}
                </p>
              </div>
              
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500 shadow-inner">
                <card.icon size={22} strokeWidth={1.5} />
              </div>
            </div>

            <div className="flex items-end justify-between gap-3">
              <h2 className="text-4xl font-black text-white tracking-tighter">
                {formatCurrency(card.value ?? 0)}
              </h2>
              
              {card.change && (
                <div className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-xl border transition-all duration-500 ${
                  card.changeType === 'positive' 
                    ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]' 
                    : card.changeType === 'negative'
                    ? 'text-red-400 bg-red-400/10 border-red-400/20 shadow-[0_0_15px_rgba(248,113,113,0.1)]'
                    : 'text-gray-400 bg-gray-400/10 border-gray-400/20'
                }`}>
                  {card.changeType === 'positive' && <TrendingUp size={14} strokeWidth={2.5} />}
                  {card.changeType === 'negative' && <TrendingDown size={14} strokeWidth={2.5} />}
                  {card.changeType === 'neutral' && <Minus size={14} strokeWidth={2.5} />}
                  <span className="tracking-tight">{card.change}</span>
                </div>
              )}
            </div>

            {/* Linha Decorativa com gradiente no hover */}
            <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent group-hover:via-white/[0.2] transition-all duration-700" />
          </div>
        </div>
      ))}
    </div>
  )
}