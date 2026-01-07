"use client"

import { 
  ArrowLeft, ArrowRight, ChevronLeft, 
  Settings2, BarChart3, Info, Wallet
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
  card,
  onEdit,
  onViewReport,
  onBack,
  handlePrev,
  handleNext,
  canNavigate,
  isAnimating,
  currentIndex,
  totalCards,
  onSelectCard
}: CardDetailsProps) {
  if (!card) return null

  const usedPercentage = (card.usedCredit / card.creditLimit) * 100
  const availableCredit = card.creditLimit - card.usedCredit

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Minimalista */}
      <div className="flex items-center justify-between mb-8 px-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10">
            <ChevronLeft size={20} />
          </div>
          <span className="text-sm font-medium hidden sm:inline">Voltar</span>
        </button>

        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">
          Gerenciar Cartão
        </h3>

        <button
          onClick={() => onEdit(card)}
          className="p-2 text-gray-500 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full"
        >
          <Settings2 size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Lado Esquerdo: Visualização do Cartão */}
        <div className="space-y-8">
          <div className={`relative flex justify-center transition-transform duration-500 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100'}`}>
            <CardItem {...card} />
          </div>

          {/* Paginação Estilo Mobile App */}
          {canNavigate && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-8">
                <button
                  onClick={handlePrev}
                  disabled={isAnimating}
                  className="p-3 text-gray-400 hover:text-white disabled:opacity-20 transition-all"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="flex gap-1.5">
                  {Array.from({ length: totalCards }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={isAnimating}
                  className="p-3 text-gray-400 hover:text-white disabled:opacity-20 transition-all"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lado Direito: Informações e Ações */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 space-y-8">
            
            {/* Grid de Valores */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Limite Total</p>
                <p className="text-xl font-bold text-white">{formatCurrency(card.creditLimit)}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Disponível</p>
                <p className="text-xl font-bold text-emerald-400">{formatCurrency(availableCredit)}</p>
              </div>
            </div>

            {/* Barra de Progresso Progressiva */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Uso do limite</span>
                  {usedPercentage > 85 && <Info size={12} className="text-red-500 animate-pulse" />}
                </div>
                <span className={`text-sm font-bold ${usedPercentage > 85 ? 'text-red-500' : 'text-white'}`}>
                  {usedPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${
                    usedPercentage > 85 ? "bg-red-500" : usedPercentage > 60 ? "bg-yellow-500" : "bg-white"
                  }`}
                  style={{ width: `${Math.min(usedPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-medium text-gray-600">
                <span>{formatCurrency(card.usedCredit)} USADOS</span>
                <span>{card.interestRate}% JUROS</span>
              </div>
            </div>

            {/* Botões de Ação Dinâmicos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <button
                onClick={() => onEdit(card)}
                className="flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl text-xs font-bold hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-white/5"
              >
                <Wallet size={16} />
                Editar Dados
              </button>

              {onViewReport && (
                <button
                  onClick={() => onViewReport(card)}
                  className="flex items-center justify-center gap-2 py-4 bg-white/[0.05] border border-white/[0.05] text-white rounded-2xl text-xs font-bold hover:bg-white/10 transition-all active:scale-95"
                >
                  <BarChart3 size={16} />
                  Ver Histórico
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}