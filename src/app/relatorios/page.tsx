'use client'

import { useState, useMemo } from 'react'
import { TrendingUp, Wallet, PiggyBank, Calendar, Filter, ArrowUpRight, ArrowDownRight, Activity, Search } from 'lucide-react'
import Header from '@/src/components/layout/Header'
import Sidebar from '@/src/components/layout/Sidebar'
import { useFinanceData } from '@/src/hooks/useFinanceData' 

export default function RelatoriosPage() {
  const { allTransactions } = useFinanceData() 
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedType, setSelectedType] = useState('all')

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(t => {
      const date = new Date(t.date || t.createdAt) 
      const matchMonth = date.getMonth() + 1 === selectedMonth
      const matchYear = date.getFullYear() === selectedYear
      const matchType = selectedType === 'all' || t.type === selectedType
      return matchMonth && matchYear && matchType
    })
  }, [allTransactions, selectedMonth, selectedYear, selectedType])

  const income = filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + (t.amount ?? 0), 0)
  const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + (t.amount ?? 0), 0)
  const fixedExpense = filteredTransactions.filter(t => t.type === 'fixedExpense').reduce((acc, t) => acc + (t.amount ?? 0), 0)
  const goals = filteredTransactions.filter(t => t.type === 'goal').reduce((acc, t) => acc + (t.goalValue ?? 0), 0)
  const balance = income - expense - fixedExpense

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <Sidebar />

      <main className="flex-1 ml-20 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto p-8 space-y-10 hide-scrollbar">
          
          {/* Header da Página */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-500 mb-2">
                <Activity size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sistema de Auditoria</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                Relatórios <span className="text-white/20 not-italic">Mensais</span>
              </h1>
            </div>

            {/* Filtros Estilo Terminal */}
            <div className="flex flex-wrap items-center gap-2 bg-white/[0.02] border border-white/[0.05] p-2 rounded-2xl">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                <Calendar size={14} className="text-white/20" />
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(Number(e.target.value))}
                  className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer"
                >
                  {months.map((m, i) => (
                    <option key={i} value={i + 1} className="bg-[#111]">{m}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={e => setSelectedYear(Number(e.target.value))}
                  className="bg-transparent w-14 text-[10px] font-black outline-none border-l border-white/10 ml-2 pl-2"
                />
              </div>

              <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                <Filter size={14} className="text-white/20" />
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#111]">Todos Fluxos</option>
                  <option value="income" className="bg-[#111]">Receitas</option>
                  <option value="expense" className="bg-[#111]">Despesas</option>
                  <option value="fixedExpense" className="bg-[#111]">Fixas</option>
                  <option value="goal" className="bg-[#111]">Metas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards de Resumo Brutalistas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResumoCard title="Entradas" value={income} type="plus" />
            <ResumoCard title="Saídas" value={expense + fixedExpense} type="minus" />
            <ResumoCard title="Aportes/Metas" value={goals} type="neutral" />
            <ResumoCard title="Net Balance" value={balance} type="main" />
          </div>

          {/* Listagem de Transações */}
          <div className="space-y-4 pb-20">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Log de Transações Registradas</h2>
              <span className="text-[10px] font-medium text-white/20">{filteredTransactions.length} registros localizados</span>
            </div>

            {filteredTransactions.length > 0 ? (
              <div className="grid gap-2">
                {filteredTransactions.map((t, i) => (
                  <TransactionRow key={i} t={t} formatCurrency={formatCurrency} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-white/5 rounded-[2rem]">
                <Search size={32} className="mx-auto text-white/5 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Nenhum dado processado para este período</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

/* Componente de Card Refinado */
const ResumoCard = ({ title, value, type }: any) => {
  const styles: any = {
    plus: "text-emerald-500 border-emerald-500/10 bg-emerald-500/[0.02]",
    minus: "text-rose-500 border-rose-500/10 bg-rose-500/[0.02]",
    neutral: "text-blue-500 border-blue-500/10 bg-blue-500/[0.02]",
    main: "text-white border-white/10 bg-white/[0.02]"
  }

  return (
    <div className={`p-6 rounded-[2rem] border transition-all hover:scale-[1.02] duration-500 ${styles[type]}`}>
      <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-50 mb-4">{title}</p>
      <div className="text-2xl font-black tracking-tighter">
        {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </div>
    </div>
  )
}

/* Linha de Transação Estilo Terminal */
const TransactionRow = ({ t, formatCurrency }: any) => {
  const isIncome = t.type === 'income'
  const isGoal = t.type === 'goal'
  
  return (
    <div className="group flex items-center justify-between p-4 bg-white/[0.01] border border-white/[0.03] hover:border-white/10 hover:bg-white/[0.03] rounded-2xl transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
          isIncome ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 
          isGoal ? 'border-blue-500/20 text-blue-500 bg-blue-500/5' : 
          'border-white/10 text-white/40 bg-white/5'
        }`}>
          {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            {t.source || t.title || 'Inominado'}
          </h4>
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
            {new Date(t.date).toLocaleDateString('pt-BR')} • {t.category || 'Geral'}
          </p>
        </div>
      </div>

      <div className="text-right">
        <div className={`text-sm font-black tracking-tighter ${isIncome ? 'text-emerald-500' : 'text-white'}`}>
          {isIncome ? '+' : '-'} {formatCurrency(t.amount || t.goalValue)}
        </div>
        <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/10">
          Status: Confirmado
        </div>
      </div>
    </div>
  )
}