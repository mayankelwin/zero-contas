"use client"
import { PieChart, DollarSign, CreditCard } from "lucide-react"
import { FinanceCard } from "./FinanceCard"
import { SummaryItem } from "./SummaryItem"
import { formatCurrency } from "@/src/utils/formatCurrency"

interface FinanceDashboardProps {
  balance: number
  summary: { expenses: number; fixedExpenses: number }
  goals: number
  subscriptions: number
}

export function FinanceDashboard({ balance, summary, goals, subscriptions }: FinanceDashboardProps) {
  const totalExpenses = summary.expenses + summary.fixedExpenses
  const netBalance = balance - totalExpenses
  const savingsRate = balance > 0 ? ((balance - totalExpenses) / balance) * 100 : 0

  return (
    <>
      <div className="bg-[#1E1F24] rounded-3xl p-8 border border-gray-700/50 space-y-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <PieChart className="text-violet-400" size={24} />
          Dashboard Financeiro
        </h3>

        <FinanceCard
          label="Saldo Total"
          value={formatCurrency(balance.toFixed(2))}
          icon={<DollarSign className="text-green-400" size={24} />}
          gradient="from-green-500/10 to-emerald-500/10"
        />

        <div className="grid grid-cols-2 gap-4">
          <FinanceCard label="Despesas Variáveis" value={formatCurrency(summary.expenses.toFixed(2))} color="red" />
          <FinanceCard label="Despesas Fixas" value={formatCurrency(summary.fixedExpenses.toFixed(2))} color="orange" />
        </div>

        <FinanceCard
          label="Resultado Líquido"
          value={formatCurrency(netBalance.toFixed(2))}
          subText={
            savingsRate >= 0
              ? `Taxa de economia: ${savingsRate.toFixed(1)}%`
              : `Déficit: ${Math.abs(savingsRate).toFixed(1)}%`
          }
          gradient={netBalance >= 0 ? "from-green-500/10 to-emerald-500/10" : "from-red-500/10 to-rose-500/10"}
          textColor={netBalance >= 0 ? "text-green-400" : "text-red-400"}
        />
      </div>

      <div className="bg-[#1E1F24] rounded-3xl p-6 border border-gray-700/50 space-y-4">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
          <CreditCard className="text-blue-400" size={20} />
          Resumo
        </h3>
        <div className="space-y-2">
          <SummaryItem label="Metas Definidas" value={goals} color="green" />
          <SummaryItem label="Assinaturas Ativas" value={subscriptions} color="blue" />
        </div>
      </div>
    </>
  )
}
