import React, { useEffect, useState, JSX, memo } from "react"
import {
  Query,
  FirestoreError,
  onSnapshot,
  collection,
  query,
} from "firebase/firestore"
import { useAuth } from "../../hooks/useAuth"
import { db } from "../../lib/firebase"
import { formatCurrency } from "../../utils/formatCurrency"
import { CardItem } from "../../types/transactions"
import { Calendar, Loader2, Search, ArrowUpRight } from "lucide-react"
import { cn } from "@/src/lib/utils"

interface GenericCardProps {
  title: string
  firebaseQuery?: Query
  items?: CardItem[]
  getIcon: (item: CardItem) => JSX.Element
  formatValue?: (item: CardItem) => string
  cardType?: "transaction" | "subscription" | "goal"
  reloadFlag?: number
  loading?: boolean
}

const CardGlobal = memo(function CardGlobal({
  title,
  firebaseQuery,
  items: itemsProp,
  getIcon,
  formatValue,
  cardType = "transaction",
  reloadFlag = 0,
  loading: loadingProp,
}: GenericCardProps) {
  const [internalItems, setInternalItems] = useState<CardItem[]>([])
  const [internalLoading, setInternalLoading] = useState(true)
  const [error, setError] = useState<FirestoreError | null>(null)
  const { user } = useAuth()

  const items = itemsProp ?? internalItems
  const loading = itemsProp ? (loadingProp ?? false) : internalLoading

  useEffect(() => {
    if (itemsProp || !user?.uid) {
      if (!itemsProp) setInternalLoading(false)
      return
    }

    setInternalLoading(true)

    const activeQuery = cardType === "goal"
      ? query(collection(db, "users", user.uid, "goals"))
      : firebaseQuery

    if (!activeQuery) {
      setInternalLoading(false)
      return
    }

    const unsubscribe = onSnapshot(activeQuery, (snapshot) => {
      const data: CardItem[] = snapshot.docs.map((doc) => {
        const raw = doc.data()
        return {
          id: doc.id,
          ...raw,
          type: cardType === "goal" ? "goal" : raw.type,
        } as CardItem
      })

      let filtered: CardItem[] = []
      if (cardType === "transaction") {
        filtered = data
          .filter((item) => ["income", "expense", "fixedExpense"].includes(item.type ?? ""))
          .sort((a, b) => (b.date ? new Date(b.date).getTime() : 0) - (a.date ? new Date(a.date).getTime() : 0))
      } else if (cardType === "subscription") {
        filtered = data.sort((a, b) => new Date(a.nextBilling ?? 0).getTime() - new Date(b.nextBilling ?? 0).getTime())
      } else if (cardType === "goal") {
        filtered = data.sort((a, b) => new Date(a.goalDeadline ?? 0).getTime() - new Date(b.goalDeadline ?? 0).getTime())
      }

      setInternalItems(filtered)
      setInternalLoading(false)
    }, (err) => {
      setError(err as FirestoreError)
      setInternalLoading(false)
    })

    return () => unsubscribe()
  }, [user?.uid, reloadFlag, cardType, !!itemsProp, firebaseQuery])

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' }) : "-"

  return (
    <div className="bg-[#0f0f11]/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/[0.04] shadow-2xl flex flex-col h-full overflow-hidden group transition-all duration-500 hover:border-white/10">
      {/* Header Padronizado */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic group-hover:text-white/40 transition-colors">
            {title}
          </h3>
          <div className="h-0.5 w-6 bg-emerald-500/30 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10">
              <Search size={12} />
           </div>
        </div>
      </div>

      {error && (
        <div className="py-12 text-center bg-red-500/5 rounded-3xl border border-red-500/10">
          <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">Erro de Sincronização</p>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <div className="relative">
             <div className="w-10 h-10 border-2 border-white/5 rounded-full" />
             <Loader2 className="w-10 h-10 text-white/20 animate-spin absolute inset-0" />
          </div>
          <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.4em] italic">Auditoria em Tempo Real</p>
        </div>
      ) : (
        <div className="overflow-y-auto pr-3 hide-scrollbar max-h-[420px]">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-2 opacity-20">
               <p className="text-[10px] font-black uppercase tracking-[0.3em]">Nenhum registro</p>
               <p className="text-[8px] font-bold uppercase tracking-widest italic leading-none">Aguardando movimentações</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const isNegative = item.type === "expense" || item.type === "fixedExpense" || cardType === "subscription";
                const isGoal = item.type === "goal";
                
                const displayName = isGoal ? item.goalName : (item.title ?? item.name ?? "Operação");
                const displayValue = isGoal ? item.goalValue : (item.amount ?? item.value ?? 0);
                const displayCategory = isGoal ? "Meta" : (item.category ?? item.subscriptionType ?? "Geral");
                const displayDate = isGoal ? formatDate(item.goalDeadline) : formatDate(item.date ?? item.nextBilling);

                return (
                  <li
                    key={item.id}
                    className="group/item flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
                  >
                    <div className="flex items-center gap-5 flex-1">
                      <div className="w-11 h-11 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/20 group-hover/item:border-emerald-500/20 group-hover/item:text-white transition-all duration-500">
                        {getIcon(item)}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-sm font-black text-white italic tracking-tighter uppercase leading-none block">
                          {displayName}
                        </span>
                        <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">
                          {displayCategory}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-base font-black tracking-tighter italic leading-none",
                          isNegative ? "text-red-500" : isGoal ? "text-emerald-500" : "text-emerald-500"
                        )}>
                          {formatValue ? formatValue(item) : (
                            `${isNegative ? "-" : "+"}${formatCurrency(displayValue ?? 0)}`
                          )}
                        </span>
                        {!isGoal && <ArrowUpRight size={10} className="text-white/5 group-hover/item:text-white/20 transition-colors" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={10} className="text-white/10" />
                        <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest leading-none">
                          {displayDate}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
})

export default CardGlobal