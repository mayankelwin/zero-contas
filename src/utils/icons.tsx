import { ArrowDownLeft, ArrowDownRight, ArrowUpRight, CreditCard, Film, Music, ShoppingBag, ShoppingCart, Tv } from "lucide-react"
import { CardItem } from "@/src/types/transactions"
import { JSX } from "react"

export const ICONS_MAP: Record<string, React.ElementType> = {
  spotify: Music,
  netflix: Tv,
  amazon: ShoppingBag,
  disney: Film,
  apple: CreditCard,
}

export const getTransactionIcon = (item: CardItem): JSX.Element => {
  const amount = item.amount ?? 0
  const title = item.title?.toLowerCase() ?? ""

  // Ícone para transações de entrada (income)
  if (item.type === "income") {
    return (
      <div className="p-1  rounded-full text-green-400">
        <ArrowUpRight size={18} />
      </div>
    )
  }

  // Ícones específicos para despesas (expense) com base no título
  if (item.type === "expense") {
    if (title.includes("mercado")) {
      return (
        <div className="p-1  rounded-full text-red-400">
          <ShoppingCart size={18} />
        </div>
      )
    }
    if (title.includes("netflix")) {
      return (
        <div className="p-1 rounded-full text-red-400">
          <Film size={18} />
        </div>
      )
    }
    // Ícone padrão para despesa: seta para baixo com fundo vermelho
    return (
      <div className="p-1 rounded-full text-red-400">
        <ArrowDownRight size={18} />
      </div>
    )
  }

  // Caso não seja income nem expense, fallback com seta para baixo vermelho
  return (
    <div className="p-1 bg-red-600/20 rounded-full text-red-400">
      <ArrowDownLeft size={18} />
    </div>
  )
}

export const getSubscriptionIcon = (item: CardItem): JSX.Element => {
  const key = (item.name ?? "").toLowerCase()
  const Icon = ICONS_MAP[key]
  return Icon ? <Icon className="size-4 text-gray-400" /> : <CreditCard className="size-4 text-gray-400" />
}
