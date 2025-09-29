import { formatCurrency } from "@/src/utils/formatCurrency"

interface Card {
  label: string
  value: number
  icon: any
  color: string
  valueColor: string
  subtitle?: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
}

interface SummaryCardsProps {
  cards: Card[]
}

export default function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className="bg-[#1E1F24] rounded-2xl p-6 shadow-lg border justify-between h-full border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              {card.label}
            </h3>
            <div className={`p-2 rounded-lg ${card.color} bg-opacity-20`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>

          {/* Main Value */}
          <div className="mb-3">
            <p className={`text-3xl font-bold ${card.valueColor}`}>
              {formatCurrency(card.value ?? 0)}
            </p>
          </div>

          {/* Subtitle and Change */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {card.subtitle || "Esse mês"}
            </span>
            
            {card.change && (
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                card.changeType === 'positive' 
                  ? 'bg-green-500/20 text-green-400' 
                  : card.changeType === 'negative'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {card.change}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}