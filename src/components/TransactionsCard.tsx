"use client"

import {
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingCart,
  Wallet,
  Film,
} from "lucide-react"

const transactions = [
  { id: 1, title: "Mercado", date: "2025-09-23", amount: -123.45 },
  { id: 2, title: "Salário", date: "2025-09-20", amount: 5000.0 },
  { id: 3, title: "Netflix", date: "2025-09-15", amount: -39.9 },
]

// Ícones dinâmicos baseado no título ou tipo
const getIcon = (title: string, amount: number) => {
  if (amount > 0) return <ArrowUpRight className="text-green-500" size={20} />
  if (/mercado/i.test(title)) return <ShoppingCart className="text-red-400" size={20} />
  if (/netflix/i.test(title)) return <Film className="text-red-400" size={20} />
  return <ArrowDownLeft className="text-red-500" size={20} />
}

export default function TransactionsCard() {
  return (
    <div className="bg-[#3A3F33] text-white rounded-xl shadow-md p-6 col-span-1 font-montserrat">
      <h3 className="text-base font-bold uppercase tracking-wider mb-4">
        Transações recentes
      </h3>

      <ul className="divide-y divide-gray-700">
        {transactions.map((tx) => (
          <li key={tx.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2E332B] rounded-full">
                {getIcon(tx.title, tx.amount)}
              </div>
              <div>
                <p className="text-sm font-semibold">{tx.title}</p>
                <p className="text-xs text-gray-400">{tx.date}</p>
              </div>
            </div>
            <div>
              <p
                className={`text-sm font-bold ${
                  tx.amount < 0 ? "text-red-400" : "text-green-400"
                }`}
              >
                {tx.amount < 0 ? "-" : "+"} R$ {Math.abs(tx.amount).toFixed(2)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
