"use client"

import React, { memo } from "react"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { cn } from "@/src/lib/utils"

export interface SummaryCardData {
  label: string
  value: number
  icon: any
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral' | string 
}

interface SummaryCardsProps {
  cards: SummaryCardData[]
}

const SummaryCards = memo(function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group flex flex-col gap-4 relative transition-all duration-500"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/20 group-hover:text-white group-hover:border-white/10 transition-all duration-500">
                <card.icon size={14} strokeWidth={2.5} />
              </div>
              <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-white/40 transition-colors">
                {card.label}
              </h3>
            </div>
            
            {card.change && (
              <div className={cn(
                "text-[8px] font-black tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border",
                card.changeType === 'positive' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 
                card.changeType === 'negative' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
                'text-white/20 border-white/5 bg-white/5'
              )}>
                {card.changeType === 'positive' && "+"}
                {card.change}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tighter italic overflow-hidden text-ellipsis whitespace-nowrap">
              {formatCurrency(card.value ?? 0)}
            </h2>
            <div className="h-px w-full bg-gradient-to-r from-white/[0.05] to-transparent" />
          </div>
        </div>
      ))}
    </div>
  )
})

export default SummaryCards