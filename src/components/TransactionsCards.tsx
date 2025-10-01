"use client"

import { useEffect, useState } from "react"
import { JSX } from "react"
import {
  Query,
  FirestoreError,
  onSnapshot,
  collection,
  query,
} from "firebase/firestore"
import { useAuth } from "../hooks/useAuth"
import { db } from "../lib/firebase"

interface CardItem {
  id: string
  title?: string
  name?: string
  amount?: number
  type?: "income" | "expense" | "fixedExpense" | "goal"
  value?: number
  category?: string
  subscriptionType?: string
  date?: string
  nextBilling?: string
  goalName?: string
  goalValue?: number
  goalDeadline?: string
}

interface GenericCardProps {
  title: string
  firebaseQuery?: Query
  getIcon: (item: CardItem) => JSX.Element
  formatValue?: (item: CardItem) => string
  skeletonItemsCount?: number
  cardType?: "transaction" | "subscription" | "goal"
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
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.uid) return

    setLoading(true)

    // Decide a query com base no tipo
    const activeQuery =
      cardType === "goal"
        ? query(collection(db, "users", user.uid, "goals"))
        : firebaseQuery

    if (!activeQuery) return

    const unsubscribe = onSnapshot(
      activeQuery,
      (snapshot) => {
        const data: CardItem[] = snapshot.docs.map((doc) => {
          const raw = doc.data()
          // Define type "goal" se for metas
          return {
            id: doc.id,
            ...raw,
            type: cardType === "goal" ? "goal" : raw.type,
          } as CardItem
        })

        let filtered: CardItem[] = []

        if (cardType === "transaction") {
          filtered = data
            .filter((item) =>
              ["income", "expense", "fixedExpense"].includes(item.type ?? "")
            )
            .sort(
              (a, b) =>
                (b.date ? new Date(b.date).getTime() : 0) -
                (a.date ? new Date(a.date).getTime() : 0)
            )
        } else if (cardType === "subscription") {
          filtered = data.sort(
            (a, b) =>
              new Date(a.nextBilling ?? 0).getTime() -
              new Date(b.nextBilling ?? 0).getTime()
          )
        } else if (cardType === "goal") {
          filtered = data.sort(
            (a, b) =>
              new Date(a.goalDeadline ?? 0).getTime() -
              new Date(b.goalDeadline ?? 0).getTime()
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
  }, [user?.uid, firebaseQuery, reloadFlag, cardType])

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString("pt-BR") : "-"
  const formatCurrency = (value?: number) =>
    (value ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })

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
              const displayName =
                item.type === "goal"
                  ? item.goalName ?? "Meta sem nome"
                  : item.title ?? item.name ?? "Sem nome"

              const displayValue =
                item.type === "goal"
                  ? item.goalValue ?? 0
                  : item.amount ?? item.value ?? 0

              const displayCategory =
                item.type === "goal"
                  ? "Meta"
                  : item.category ?? item.subscriptionType ?? "Sem categoria"

              const displayDate =
                item.type === "goal"
                  ? formatDate(item.goalDeadline)
                  : formatDate(item.date ?? item.nextBilling)

              return (
                <li
                  key={item.id}
                  className="w-full grid grid-cols-3 gap-4 py-3 items-center justify-between align-center"
                >
                  <div className="flex items-center gap-3 ">
                    <div className="p-2 bg-[#2A2B31] rounded-full">
                      {getIcon(item)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-200">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500">{displayCategory}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 text-center">{displayDate}</p>

                  <p
                    className={`text-sm font-semibold text-center ${
                      item.type === "expense" ||
                      item.type === "fixedExpense" ||
                      cardType === "subscription"
                        ? "text-red-400"
                        : item.type === "goal"
                        ? "text-blue-400"
                        : "text-green-400"
                    }`}
                  >
                    {formatValue
                      ? formatValue(item)
                      : cardType === "subscription"
                      ? `- ${formatCurrency(displayValue)}`
                      : item.type === "goal"
                      ? formatCurrency(displayValue)
                      : `${
                          item.type === "expense" || item.type === "fixedExpense"
                            ? "-"
                            : "+"
                        } ${formatCurrency(displayValue)}`}
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
