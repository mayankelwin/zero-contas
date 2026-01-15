"use client"

import { useEffect, useState, JSX } from "react"
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
import { Calendar, Loader2 } from "lucide-react"

interface GenericCardProps {
  title: string
  firebaseQuery?: Query
  getIcon: (item: CardItem) => JSX.Element
  formatValue?: (item: CardItem) => string
  cardType?: "transaction" | "subscription" | "goal"
  reloadFlag?: number
}

export default function CardGlobal({
  title,
  firebaseQuery,
  getIcon,
  formatValue,
  cardType = "transaction",
  reloadFlag = 0,
}: GenericCardProps) {
  const [items, setItems] = useState<CardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<FirestoreError | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.uid) return
    setLoading(true)

    const activeQuery = cardType === "goal"
      ? query(collection(db, "users", user.uid, "goals"))
      : firebaseQuery

    if (!activeQuery) return

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

      setItems(filtered)
      setLoading(false)
    }, (err) => {
      setError(err as FirestoreError)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user?.uid, firebaseQuery, reloadFlag, cardType])

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' }) : "-"

  return (
    <div className="bg-[#161618] rounded-[2.5rem] p-6 lg:p-8 border border-white/[0.03] shadow-2xl flex flex-col h-full overflow-hidden">
      {/* Header Padronizado */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
          {title}
        </h3>
        <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
      </div>

      {error && (
        <div className="py-10 text-center">
          <p className="text-red-400 text-xs font-bold">Erro ao carregar dados</p>
        </div>
      )}

      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Sincronizando</p>
        </div>
      ) : (
        <div className="overflow-y-auto pr-2 custom-scrollbar max-h-[380px]">
          {items.length === 0 ? (
            <p className="text-gray-600 text-xs text-center py-10 font-medium italic">
              Nenhuma atividade registrada
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const isNegative = item.type === "expense" || item.type === "fixedExpense" || cardType === "subscription";
                const isGoal = item.type === "goal";
                
                const displayName = isGoal ? item.goalName : (item.title ?? item.name ?? "Sem nome");
                const displayValue = isGoal ? item.goalValue : (item.amount ?? item.value ?? 0);
                const displayCategory = isGoal ? "Meta" : (item.category ?? item.subscriptionType ?? "Geral");
                const displayDate = isGoal ? formatDate(item.goalDeadline) : formatDate(item.date ?? item.nextBilling);

                return (
                  <li
                    key={item.id}
                    className="group flex items-center justify-between p-3 rounded-2xl bg-white/[0.01] border border-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-300">
                        {getIcon(item)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white tracking-tight leading-tight">
                          {displayName}
                        </span>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                          {displayCategory}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-sm font-black tracking-tighter ${
                        isNegative ? "text-red-400" : isGoal ? "text-blue-400" : "text-emerald-400"
                      }`}>
                        {formatValue ? formatValue(item) : (
                          `${isNegative ? "- " : !isGoal ? "+ " : ""}${formatCurrency(displayValue ?? 0)}`
                        )}
                      </span>
                      <div className="flex items-center gap-1 opacity-40">
                        <Calendar size={10} className="text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
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
}