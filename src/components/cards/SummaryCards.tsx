"use client"

import { formatCurrency } from "@/src/utils/formatCurrency"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { ElementType } from "react"

export interface SummaryCardData {
  label: string
  value: number
  icon: ElementType
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group relative bg-[#161618] hover:bg-[#111111] p-5 transition-all duration-500 overflow-hidden rounded-2xl"
        >
          {/* Indicador lateral sutil no hover */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-hover:h-1/2 bg-white transition-all duration-500" />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-white/20 group-hover:text-white transition-colors duration-500">
                  <card.icon size={16} strokeWidth={2} />
                </div>
                <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em] group-hover:text-white/60 transition-colors">
                  {card.label}
                </h3>
              </div>
              
              {card.change && (
                <div className={`text-[9px] font-black italic tracking-tighter ${
                  card.changeType === 'positive' ? 'text-emerald-500' : 
                  card.changeType === 'negative' ? 'text-red-500' : 'text-white/20'
                }`}>
                  {card.changeType === 'positive' && "+"}
                  {card.change}
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                {formatCurrency(card.value ?? 0)}
              </h2>
              <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest hidden xl:block">
                Total Net
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}