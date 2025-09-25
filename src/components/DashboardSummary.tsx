"use client"

import { useEffect, useState } from "react"
import { db } from "@/src/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { useAuth } from "@/src/context/AuthContext"
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react"

interface Summary {
  total: number
  income: number
  expenses: number
}

export default function DashboardSummary() {
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    income: 0,
    expenses: 0,
  })

  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const fetchTransactions = async () => {
      const q = query(collection(db, "transactions"), where("userId", "==", user.uid))
      const querySnapshot = await getDocs(q)

      let income = 0
      let expenses = 0

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        const amount = Number(data.amount)

        if (data.type === "income") income += amount
        else if (data.type === "expense") expenses += amount
      })

      const total = income - expenses
      setSummary({ income, expenses, total })
    }

    fetchTransactions()
  }, [user])

  const cards = [
    {
      label: "Total",
      value: summary.total,
      icon: <Wallet className="text-white opacity-80" />,
      bg: "bg-[#3A3F33]",
      ring: "ring-1 ring-gray-600",
    },
    {
      label: "Receitas",
      value: summary.income,
      icon: <ArrowUpRight className="text-green-400" />,
      bg: "bg-[#324033]",
      ring: "ring-1 ring-green-700",
    },
    {
      label: "Despesas",
      value: summary.expenses,
      icon: <ArrowDownRight className="text-red-400" />,
      bg: "bg-[#403232]",
      ring: "ring-1 ring-red-700",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`
            ${card.bg} ${card.ring}
            rounded-xl p-6 transition-all duration-300
            transform hover:scale-[1.03] hover:shadow-lg hover:animate-shake
            text-white font-orbitron
          `}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm tracking-wide uppercase text-gray-200 font-semibold">
              {card.label}
            </h3>
            {card.icon}
          </div>
          <p className="text-3xl font-bold text-white">
            R$ {card.value.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  )
}
