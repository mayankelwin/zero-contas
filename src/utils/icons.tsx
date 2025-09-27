import { ArrowDownLeft, ArrowUpRight, CreditCard, Film, Music, ShoppingBag, ShoppingCart, Tv } from "lucide-react"
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

  if (amount > 0) return <ArrowUpRight className="text-green-400" size={18} />
  if (title.includes("mercado")) return <ShoppingCart className="text-red-400" size={18} />
  if (title.includes("netflix")) return <Film className="text-red-400" size={18} />

  return <ArrowDownLeft className="text-red-400" size={18} />
}

export const getSubscriptionIcon = (item: CardItem): JSX.Element => {
  const key = (item.name ?? "").toLowerCase()
  const Icon = ICONS_MAP[key]
  return Icon ? <Icon className="size-4 text-gray-400" /> : <CreditCard className="size-4 text-gray-400" />
}
