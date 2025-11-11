'use client'

import { useState, useMemo } from 'react'
import { TrendingUp, Wallet, PiggyBank, Calendar, Filter } from 'lucide-react'
import Header from '@/src/components/layout/Header'
import Sidebar from '@/src/components/layout/Sidebar'
import { useFinanceData } from '@/src/hooks/useFinanceData' 

export default function RelatoriosPage() {
  const { allTransactions } = useFinanceData() 

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedType, setSelectedType] = useState('all')
  const loadingTransactions = allTransactions.length === 0


  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  // 🔹 Filtra transações usando o hook
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(t => {
      const date = new Date(t.date || t.createdAt) // <- pega a data correta
      const matchMonth = date.getMonth() + 1 === selectedMonth
      const matchYear = date.getFullYear() === selectedYear
      const matchType = selectedType === 'all' || t.type === selectedType
      return matchMonth && matchYear && matchType
    })
  }, [allTransactions, selectedMonth, selectedYear, selectedType])

  // 🔹 Resumo para os cards
  const income = filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + (t.amount ?? 0), 0)
  const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + (t.amount ?? 0), 0)
  const fixedExpense = filteredTransactions.filter(t => t.type === 'fixedExpense').reduce((acc, t) => acc + (t.amount ?? 0), 0)
  const goals = filteredTransactions.filter(t => t.type === 'goal').reduce((acc, t) => acc + (t.goalValue ?? 0), 0)
  const balance = income - expense - fixedExpense

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 ml-16 sm:ml-20">
        <Header />

        <div className="p-6 space-y-6">
        {/* Título */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Relatórios Financeiros</h1>

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0 bg-gray-800/50 border border-gray-700 px-4 py-2 rounded-xl">
            <Calendar size={18} className="text-violet-400" />
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-white text-sm outline-none"
            >
              {months.map((m, i) => (
                <option key={i} value={i + 1} className="bg-gray-900">
                  {m}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="bg-transparent w-20 text-center outline-none text-white text-sm"
            />

            <Filter size={18} className="text-violet-400 ml-2" />
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="bg-transparent text-white text-sm outline-none"
            >
              <option value="all" className="bg-gray-900">Todos</option>
              <option value="income" className="bg-gray-900">Receitas</option>
              <option value="expense" className="bg-gray-900">Despesas</option>
              <option value="fixedExpense" className="bg-gray-900">Fixas</option>
              <option value="goal" className="bg-gray-900">Metas</option>
            </select>
          </div>
        </div>

        {/* Cards Resumo */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ResumoCard icon={<TrendingUp />} title="Entradas" value={formatCurrency(income)} color="text-emerald-400" />
          <ResumoCard icon={<Wallet />} title="Despesas" value={formatCurrency(expense)} color="text-rose-400" />
          <ResumoCard icon={<PiggyBank />} title="Metas" value={formatCurrency(goals)} color="text-blue-400" />
          <ResumoCard icon={<Wallet />} title="Saldo Geral" value={formatCurrency(balance)} color="text-violet-400" />
        </div>

        {/* Tabela Detalhada */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Transações do Mês</h2>

          {loadingTransactions ? (
            <p className="text-gray-500">Carregando...</p>
          ) : filteredTransactions.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700/50">
                    <th className="py-3 px-2">Nome</th>
                    <th className="py-3 px-2">Tipo</th>
                    <th className="py-3 px-2">Valor</th>
                    <th className="py-3 px-2">Categoria</th>
                    <th className="py-3 px-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t, i) => (
                    <tr key={i} className="border-b border-gray-700/40 hover:bg-gray-700/30 transition">
                      <td className="py-3 px-2">
                        {t.type === 'income'
                          ? t.source || t.title
                          : t.type === 'goal'
                          ? t.title
                          : t.title || t.category || 'Sem nome'}
                      </td>
                      <td className={`py-3 px-2 font-semibold ${
                        t.type === 'income'
                          ? 'text-emerald-400'
                          : t.type === 'goal'
                          ? 'text-blue-400'
                          : t.type === 'fixedExpense'
                          ? 'text-orange-400'
                          : 'text-rose-400'
                      }`}>
                        {t.type === 'income'
                          ? 'Receita'
                          : t.type === 'goal'
                          ? 'Meta'
                          : t.type === 'fixedExpense'
                          ? 'Despesa Fixa'
                          : 'Despesa'}
                      </td>
                      <td className="py-3 px-2">{formatCurrency(t.amount)}</td>
                      <td className="py-3 px-2 text-gray-400">{t.category || '-'}</td>
                      <td className="py-3 px-2 text-gray-400">
                        {new Date(t.date).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">Nenhuma transação neste mês.</p>
          )}
        </div>
      </div>
       </main>
    </div>
  )
}

const ResumoCard = ({ icon, title, value, color }: any) => (
  <div className="flex flex-col items-start gap-2 bg-gray-800/50 border border-gray-700 rounded-2xl p-5 hover:bg-gray-800/80 transition-all">
    <div className={`flex items-center gap-2 text-sm ${color}`}>
      {icon}
      <span>{title}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
)
