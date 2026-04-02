"use client"

import React, { memo } from "react"
import { 
  ArrowLeft, ArrowRight, ChevronLeft, 
  Settings2, BarChart3, Info, Wallet, Sparkles, Lightbulb, ShieldCheck
} from "lucide-react"
import CardItem from "./CardItem"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { cn } from "@/src/lib/utils"

interface CardDetailsProps {
  card: any
  onEdit: (card: any) => void
  onViewReport?: (card: any) => void
  onBack: () => void
  handlePrev: () => void
  handleNext: () => void
  canNavigate: boolean
  isAnimating: boolean
  currentIndex: number
  totalCards: number
  onSelectCard: (cardId: string) => void
}

const CardDetails = memo(function CardDetails({
  card, onEdit, onViewReport, onBack, handlePrev, handleNext, 
  canNavigate, isAnimating, currentIndex, totalCards
}: CardDetailsProps) {
  if (!card) return null

  const usedPercentage = (card.usedCredit / card.creditLimit) * 100
  const availableCredit = card.creditLimit - card.usedCredit

  const getInsight = () => {
    if (usedPercentage > 80) return {
      icon: <Info size={16} className="text-red-500" />, 
      title: "Alerta de Exposição", 
      desc: "Uso crítico do limite. Recomendamos amortização imediata para proteger seu score."
    }
    if (usedPercentage > 50) return {
      icon: <Lightbulb size={16} className="text-orange-500" />, 
      title: "Consumo Moderado", 
      desc: "Você está na metade da capacidade. Mantenha o fluxo controlado para evitar encargos."
    }
    return {
      icon: <ShieldCheck size={16} className="text-emerald-500" />, 
      title: "Gestão de Elite", 
      desc: "Utilização exemplar. Seu perfil demonstra alto controle e baixo risco financeiro."
    }
  }

  const insight = getInsight()

  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-bottom-2 duration-1000">
      
      <header className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="flex items-center gap-4 group transition-all">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
            <ChevronLeft size={18} />
          </div>
          <div className="text-left space-y-0.5">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic leading-none">Voltar ao Grid</p>
            <p className="text-xs font-bold text-white uppercase tracking-widest leading-none">Visão Detalhada</p>
          </div>
        </button>

        <div className="hidden md:flex flex-col items-center">
          <div className="flex gap-2 p-1 bg-white/[0.02] rounded-full border border-white/[0.05]">
            {Array.from({ length: totalCards }).map((_, i) => (
              <div key={i} className={cn(
                "h-1.5 transition-all duration-700 rounded-full",
                i === currentIndex ? "w-8 bg-white" : "w-1.5 bg-white/10"
              )} />
            ))}
          </div>
        </div>

        <button 
          onClick={() => onEdit(card)} 
          className="w-10 h-10 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 transition-all active:scale-90"
        >
          <Settings2 size={18} />
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
        
        <div className="xl:col-span-12 2xl:col-span-5 space-y-12">
          <div className={cn(
            "relative flex justify-center transition-all duration-700",
            isAnimating ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
          )}>
            <div className="shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] rounded-[2.5rem]">
               <CardItem {...card} />
            </div>
            
            {canNavigate && (
              <div className="absolute inset-x-[-30px] top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-2 sm:px-0">
                <button onClick={handlePrev} className="p-3 text-white/10 hover:text-white pointer-events-auto transition-all active:scale-90"><ArrowLeft size={28} strokeWidth={1} /></button>
                <button onClick={handleNext} className="p-3 text-white/10 hover:text-white pointer-events-auto transition-all active:scale-90"><ArrowRight size={28} strokeWidth={1} /></button>
              </div>
            )}
          </div>

          <div className="bg-white/[0.01] border border-white/[0.04] p-10 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center">
                 {insight.icon}
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 italic leading-none">{insight.title}</h4>
            </div>
            <p className="text-sm font-bold text-white/30 leading-relaxed italic">
              "{insight.desc}"
            </p>
            <div className="pt-6 border-t border-white/[0.03] flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 italic">
               <Sparkles size={12} />
               <span>Estratégia Recomendada: Liquidar faturas em vencimento imediato.</span>
            </div>
          </div>
        </div>

        <div className="xl:col-span-12 2xl:col-span-7 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#161618] p-10 rounded-[2.5rem] border border-white/[0.03] space-y-1 transition-all hover:bg-[#111111]">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Disponibilidade</p>
              <p className="text-4xl font-black text-emerald-400 tracking-tighter italic leading-none">{formatCurrency(availableCredit)}</p>
              <div className="pt-4 h-1 w-12 bg-emerald-500/20 rounded-full" />
            </div>
            <div className="bg-[#161618] p-10 rounded-[2.5rem] border border-white/[0.03] space-y-1 transition-all hover:bg-[#111111]">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Saldo Devedor</p>
              <p className="text-4xl font-black text-white/60 tracking-tighter italic leading-none">{formatCurrency(card.usedCredit)}</p>
              <div className="pt-4 h-1 w-12 bg-white/10 rounded-full" />
            </div>
          </div>

          <div className="bg-[#161618] p-10 rounded-[3rem] border border-white/[0.03] space-y-10">
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                   <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">Taxa de Utilização</span>
                   <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Nível de Exposição</p>
                </div>
                <span className="text-5xl font-black tracking-tighter italic text-white">{usedPercentage.toFixed(0)}%</span>
              </div>
              <div className="h-4 w-full bg-white/[0.02] rounded-full overflow-hidden border border-white/5 p-1">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-[1500ms] ease-in-out",
                    usedPercentage > 80 ? 'bg-red-500 shadow-[0_0_20px_rgba(239,44,44,0.3)]' : 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                  )}
                  style={{ width: `${Math.min(usedPercentage, 100)}%` }} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => onViewReport?.(card)}
                className="group w-full flex items-center justify-between px-8 py-6 bg-white/[0.03] border border-white/5 hover:bg-white text-white hover:text-black rounded-3xl transition-all duration-500"
              >
                <div className="flex items-center gap-5">
                  <BarChart3 size={20} strokeWidth={1.5} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Auditoria de Fluxo</span>
                </div>
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
              </button>

              <button
                onClick={() => onEdit(card)}
                className="group w-full flex items-center justify-between px-8 py-6 bg-white/[0.03] border border-white/5 hover:bg-emerald-500 text-white hover:text-black rounded-3xl transition-all duration-500"
              >
                <div className="flex items-center gap-5">
                  <Wallet size={20} strokeWidth={1.5} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Gestão Patrimonial</span>
                </div>
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default CardDetails