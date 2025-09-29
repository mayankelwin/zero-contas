"use client"

import { useEffect, useState } from "react"
import { JSX } from "react"
import { Query, FirestoreError, onSnapshot } from "firebase/firestore"

interface CardItem {
  id: string
  title?: string
  name?: string
  amount?: number
  type?: "income" | "expense"
  value?: number
  category?: string
  subscriptionType?: string
  date?: string 
  nextBilling?: string 
}

interface GenericCardProps {
  title: string
  firebaseQuery: Query
  getIcon: (item: CardItem) => JSX.Element
  formatValue?: (item: CardItem) => string
  skeletonItemsCount?: number
  cardType?: "transaction" | "subscription"
  reloadFlag?: number
}

export default function CardGlobal({
  title,
  firebaseQuery,
  getIcon,
  formatValue,
  skeletonItemsCount = 5,
  cardType = "transaction",
  reloadFlag = 0,
}: GenericCardProps) {
  const [items, setItems] = useState<CardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<FirestoreError | null>(null)

  /* --- FETCH DATA --- */
  useEffect(() => {
    setLoading(true)
    const unsubscribe = onSnapshot(
      firebaseQuery,
      (snapshot) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const data: CardItem[] = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as CardItem)
        )

        let filtered: CardItem[] = []

        if (cardType === "transaction") {
          filtered = data
            .filter((item) => item.date && new Date(item.date) <= today)
            .sort(
              (a, b) =>
                (b.date ? new Date(b.date).getTime() : 0) -
                (a.date ? new Date(a.date).getTime() : 0)
            )
        }

        if (cardType === "subscription") {
          filtered = data.sort(
            (a, b) =>
              new Date(a.nextBilling ?? 0).getTime() - new Date(b.nextBilling ?? 0).getTime()
          )
        }
        setItems(filtered)
        setLoading(false)
      },
      (err) => {
        setError(err as FirestoreError)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [firebaseQuery, reloadFlag, cardType])

  /* --- FORMAT FUNCTIONS --- */
  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString("pt-BR") : "-"
  const formatCurrency = (value?: number) =>
    (value ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })

  /* --- RENDER --- */
  return (
    <div className="bg-[#1E1F24] text-white rounded-2xl shadow-sm border border-gray-800 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      </div>

      {error && <p className="text-red-400">Erro ao carregar dados</p>}

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <ul className="divide-y divide-gray-800 overflow-y-auto max-h-72">
          {items.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              Nenhum item encontrado
            </p>
          ) : (
            items.map((item) => {
              const displayValue = item.amount ?? item.value ?? 0;

              return (
                <li key={item.id} className="w-full grid grid-cols-3 gap-4 py-3 items-center justify-between align-center">
                  {/* Nome + Ícone */}
                  <div className="flex items-center gap-3 ">
                    <div className="p-2 bg-[#2A2B31] rounded-full">{getIcon(item)}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-200">
                        {item.title ?? item.name ?? "Sem nome"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.category ?? item.subscriptionType ?? "Sem categoria"}
                      </p>
                    </div>
                  </div>

                  {/* Data */}
                  <p className="text-xs text-gray-400 text-center">
                    {formatDate(item.date ?? item.nextBilling)}
                  </p>

                  {/* Valor */}
                  <p
                    className={`text-sm font-semibold text-center ${
                      item.type === "expense" || cardType === "subscription"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {formatValue
                      ? formatValue(item)
                      : cardType === "subscription"
                      ? `- ${formatCurrency(displayValue)}`
                      : `${item.type === "expense" ? "-" : "+"} ${formatCurrency(displayValue)}`}
                  </p>
                </li>
              )
            })
          )}
        </ul>
      )}
    
    </div>
  )
}
