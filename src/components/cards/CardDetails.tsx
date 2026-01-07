"use client"

import { 
  ArrowLeft, ArrowRight, ChevronLeft, 
  Settings2, BarChart3, Info, Wallet, Sparkles, Lightbulb, ShieldCheck
} from "lucide-react"
import CardItem from "./CardItem"
import { formatCurrency } from "@/src/utils/formatCurrency"

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

export default function CardDetails({
  card, onEdit, onViewReport, onBack, handlePrev, handleNext, 
  canNavigate, isAnimating, currentIndex, totalCards
}: CardDetailsProps) {
  if (!card) return null

  const usedPercentage = (card.usedCredit / card.creditLimit) * 100
  const availableCredit = card.creditLimit - card.usedCredit

  // Frases de efeito baseadas na saúde do cartão
  const getInsight = () => {
    if (usedPercentage > 80) return {
      icon: <Info className="text-red-400" />, 
      title: "Zona de Risco", 
      desc: "O uso acima de 80% do limite pode impactar seu score de crédito. Considere amortizar parte do valor."
    }
    if (usedPercentage > 50) return {
      icon: <Lightbulb className="text-yellow-400" />, 
      title: "Alocação Moderada", 
      desc: "Você está utilizando metade do seu poder de compra. Mantenha o controle para evitar juros rotativos."
    }
    return {
      icon: <ShieldCheck className="text-emerald-400" />, 
      title: "Saúde Excelente", 
      desc: "Seu nível de utilização está ideal. Isso demonstra ao mercado uma gestão financeira de elite."
    }
  }

  const insight = getInsight();

  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex items-center justify-between mb-10">
        <button onClick={onBack} className="flex items-center gap-3 group transition-all">
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
            <ChevronLeft size={18} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Voltar ao terminal</p>
            <p className="text-xs font-bold text-white uppercase">Visão Geral</p>
          </div>
        </button>

        <div className="hidden md:flex flex-col items-center">
          <div className="flex gap-1.5 mb-2">
            {Array.from({ length: totalCards }).map((_, i) => (
              <div key={i} className={`h-[2px] transition-all duration-500 ${i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/10"}`} />
            ))}
          </div>
        </div>

        <button onClick={() => onEdit(card)} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all">
          <Settings2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        <div className="xl:col-span-6 space-y-12">
          <div className={`relative flex justify-center transition-all duration-700 ${isAnimating ? 'opacity-0 scale-90 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
            <CardItem {...card} />
            
            {canNavigate && (
              <div className="absolute inset-x-[-20px] top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <button onClick={handlePrev} className="p-2 text-white/10 hover:text-white pointer-events-auto transition-colors"><ArrowLeft size={24}/></button>
                <button onClick={handleNext} className="p-2 text-white/10 hover:text-white pointer-events-auto transition-colors"><ArrowRight size={24}/></button>
              </div>
            )}
          </div>

          <div className="bg-[#111111] p-8 rounded-[2.5rem] space-y-4">
            <div className="flex items-center gap-3">
              {insight.icon}
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">{insight.title}</h4>
            </div>
            <p className="text-sm font-bold text-white/40 leading-relaxed italic">
              "{insight.desc}"
            </p>
            <div className="pt-4 flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-emerald-500">
               <Sparkles size={14} />
               <span>Dica: Pague sempre o valor total para evitar juros de {card.interestRate}%</span>
            </div>
          </div>
        </div>

        <div className="xl:col-span-6 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/[0.02]">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Poder de Compra</p>
              <p className="text-2xl font-black text-emerald-400 tracking-tighter">{formatCurrency(availableCredit)}</p>
            </div>
            <div className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/[0.02]">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Comprometido</p>
              <p className="text-2xl font-black text-white tracking-tighter">{formatCurrency(card.usedCredit)}</p>
            </div>
          </div>

          <div className="bg-[#111111] p-8 rounded-[2.5rem] space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Exposição do Limite</span>
                <span className="text-2xl font-black tracking-tighter italic">{usedPercentage.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-in-out ${usedPercentage > 80 ? 'bg-red-500' : 'bg-white'}`}
                  style={{ width: `${Math.min(usedPercentage, 100)}%` }} 
                />
              </div>
            </div>

            <div className="pt-4 grid grid-cols-1 gap-4">
              <button
                onClick={() => onViewReport?.(card)}
                className="w-full flex items-center justify-between px-8 py-6 bg-white/[0.03] hover:bg-white text-white hover:text-black rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <BarChart3 size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">Análise de Gastos</span>
                </div>
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
              </button>

              <button
                onClick={() => onEdit(card)}
                className="w-full flex items-center justify-between px-8 py-6 bg-white/[0.03] hover:bg-emerald-500 text-white hover:text-black rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <Wallet size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">Ajustar Parâmetros</span>
                </div>
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}