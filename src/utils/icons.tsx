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
  const title = item.title?.toLowerCase() ?? ""

  if (item.type === "income") {
    return (
      <div className="p-1  rounded-full text-green-400">
        <ArrowUpRight size={18} />
      </div>
    )
  }

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
    return (
      <div className="p-1 rounded-full text-red-400">
        <ArrowDownRight size={18} />
      </div>
    )
  }

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
