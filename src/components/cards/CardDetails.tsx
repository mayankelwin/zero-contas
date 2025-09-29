"use client"

import { ArrowLeft, ArrowRight, ArrowLeftFromLine, Edit, BarChart3 } from "lucide-react"
import CardItem from "./CardItem"

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

  return (
    <div className="min-h-[500px] transition-all">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:bg-gray-800 rounded-lg"
          >
            <ArrowLeftFromLine size={16} />
          </button>

          <h3 className="text-sm text-center font-semibold text-white">Detalhes do Cartão</h3>

          <button
            onClick={() => onEdit(card)}
            className="p-2 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:bg-gray-800 rounded-lg"
          >
            <Edit size={16} />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Cartão no topo */}
        <div className="flex justify-center mb-8">
          <CardItem {...card} />
        </div>

        {/* Navegação entre cartões */}
        {canNavigate && (
          <div className="flex justify-center items-center gap-6 mb-8">
            <button
              onClick={handlePrev}
              className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAnimating}
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalCards }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => onSelectCard(index.toString())}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-violet-500 w-8"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAnimating}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* Detalhes */}
        <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Limite Total</p>
                  <p className="text-xl font-bold text-white">
                    R$ {card.creditLimit?.toLocaleString("pt-BR")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Crédito Usado</p>
                  <p className="text-xl font-bold text-red-400">
                    R$ {card.usedCredit?.toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Disponível</p>
                  <p className="text-xl font-bold text-green-400">
                    R${" "}
                    {(card.creditLimit - card.usedCredit)?.toLocaleString("pt-BR")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Taxa de Juros</p>
                  <p className="text-xl font-bold text-yellow-400">
                    {card.interestRate}% ao mês
                  </p>
                </div>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Utilização do Limite</span>
                <span className="font-semibold text-white">
                  {usedPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    usedPercentage > 80
                      ? "bg-red-500"
                      : usedPercentage > 50
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(usedPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>R$ 0</span>
                <span>R$ {card.creditLimit?.toLocaleString("pt-BR")}</span>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => onEdit(card)}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all duration-300 hover:scale-105 font-semibold"
              >
                <Edit size={18} />
                Editar Cartão
              </button>

              {onViewReport && (
                <button
                  onClick={() => onViewReport(card)}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all duration-300 hover:scale-105 font-semibold"
                >
                  <BarChart3 size={18} />
                  Ver Relatório
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
