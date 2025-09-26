"use client"

import { useEffect, useState } from "react"
import { JSX } from "react"
import { Query, FirestoreError, onSnapshot } from "firebase/firestore"
import { incomeCategories, expenseCategories, subscriptionTypes } from "../data/categories"

interface CardItem {
  id: string
  title?: string
  name?: string
  amount?: number
  type?: "income" | "expense"
  value?: number
  category?: string
  subscriptionType?: string
  date?: string // para transações
  nextBilling?: string // para assinaturas
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
        // pega todas as transações até hoje
        filtered = data.filter((item) => {
          if (!item.date) return false
          const d = new Date(item.date)
          d.setHours(0, 0, 0, 0)
          return d <= today
        })

        // ordena por data decrescente (mais recente primeiro)
        filtered.sort((a, b) => {
          const da = a.date ? new Date(a.date).getTime() : 0
          const db = b.date ? new Date(b.date).getTime() : 0
          return db - da
        })
      }

        if (cardType === "subscription") {
          // sempre mostra todas as assinaturas
          filtered = data
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
            <p className="text-gray-500 text-sm text-center py-4">Nenhum item encontrado</p>
          ) : (
            items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#2A2B31] rounded-full">{getIcon(item)}</div>
                  <div>
                   {item && (
                      <p className="text-sm font-semibold text-gray-200">
                        {item.title ?? item.name ?? "Sem nome"}
                      </p>
                    )}

                    {/* 🔹 mostra categoria padronizada */}
                    {cardType === "subscription" ? (
                      <p className="text-xs text-gray-500">
                        {item.category ?? item.subscriptionType}
                        </p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        {item.category ?? "Sem categoria"}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {item.date ?? item.nextBilling}
                    </p>
                  </div>
                </div>

                {formatValue ? (
                  <p className="text-sm font-semibold">{formatValue(item)}</p>
                ) : cardType === "subscription" ? (
                  <p className="text-sm font-semibold text-blue-400">
                    - R$ {(item.amount ?? 0).toFixed(2)}
                  </p>
                ) : (
                  <p
                    className={`text-sm font-semibold ${
                      item.type === "expense" ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {item.type === "expense" ? "-" : "+"} R$ {(item.amount ?? 0).toFixed(2)}
                  </p>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
