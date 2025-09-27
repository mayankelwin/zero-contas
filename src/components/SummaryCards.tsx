import { formatCurrency } from "@/src/utils/formatCurrency"

interface Card {
  label: string
  value: number
  icon: any
  color: string
  valueColor: string
}

interface SummaryCardsProps {
  cards: Card[]
}

export default function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map(card => (
        <div
          key={card.label}
          className="bg-[#1E1F24] rounded-2xl p-6 shadow-sm border border-gray-800 hover:border-gray-700 transition-all justify-between"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">{card.label}</h3>
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
          <p className={`mt-3 text-2xl font-semibold ${card.valueColor}`}>
            {formatCurrency(card.value ?? 0)}
          </p>
        </div>
      ))}
    </div>
  )
}
