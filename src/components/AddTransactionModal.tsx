"use client"

import { useState, useEffect } from "react"
import { X, DollarSign, CreditCard, Gift, Book, Film, Smartphone, Wifi, Target, TrendingUp, Zap, Calendar, Wallet, PiggyBank } from "lucide-react"
import { Input } from "./Input"
import { Select } from "./Select"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import AddCardModal from "./AddCardModal"
import { useAddTransaction } from "../hooks/useAddTransaction"

type TransactionType = "income" | "expense" | "fixedExpense" | "goal"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  defaultType: TransactionType
  allowedTypes?: TransactionType[] | "ALL_TYPES"
}

// 🔧 CORREÇÃO: Adicionar IDs únicos para cada opção
const incomeSources = [
  { id: "income-1", name: "Freelance", icon: <TrendingUp size={20} /> },
  { id: "income-2", name: "Vendas", icon: <Gift size={20} /> },
  { id: "income-3", name: "Negócios", icon: <Zap size={20} /> },
  { id: "income-4", name: "Investimentos", icon: <TrendingUp size={20} /> },
  { id: "income-5", name: "Outros", icon: <DollarSign size={20} /> },
]

const expenseCategories = [
  { id: "expense-1", name: "Alimentação", icon: <Gift size={20} /> },
  { id: "expense-2", name: "Transporte", icon: <CreditCard size={20} /> },
  { id: "expense-3", name: "Moradia", icon: <Book size={20} /> },
  { id: "expense-4", name: "Lazer", icon: <Film size={20} /> },
  { id: "expense-5", name: "Saúde", icon: <Gift size={20} /> },
  { id: "expense-6", name: "Educação", icon: <Book size={20} /> },
  { id: "expense-7", name: "Outros", icon: <DollarSign size={20} /> },
]

const subscriptionTypes = [
  { id: "sub-1", name: "Filmes Streaming", icon: <Film size={20} /> },
  { id: "sub-2", name: "Cursos", icon: <Book size={20} /> },
  { id: "sub-3", name: "Telefone", icon: <Smartphone size={20} /> },
  { id: "sub-4", name: "Internet", icon: <Wifi size={20} /> },
  { id: "sub-5", name: "Outros", icon: <DollarSign size={20} /> },
]

// Ícones para os tipos de transação
const typeIcons = {
  income: <TrendingUp className="text-green-200" size={24} />,
  expense: <Wallet className="text-red-200" size={24} />,
  fixedExpense: <CreditCard className="text-blue-200" size={24} />,
  goal: <Target className="text-purple-200" size={24} />,
}

const typeLabels = {
  income: "Nova Receita",
  expense: "Nova Despesa", 
  fixedExpense: "Despesa Fixa",
  goal: "Nova Meta",
}

const typeColors = {
  income: "from-green-500 to-emerald-600",
  expense: "from-red-500 to-rose-600",
  fixedExpense: "from-blue-500 to-cyan-600", 
  goal: "from-purple-500 to-violet-600",
}

// 🔥 NOVO: Mapeamento de tipos para exibição
const typeDisplayConfig = [
  { key: "income", label: "Receita", icon: <TrendingUp size={16} /> },
  { key: "expense", label: "Despesa", icon: <Wallet size={16} /> },
  { key: "fixedExpense", label: "Fixa", icon: <CreditCard size={16} /> },
  { key: "goal", label: "Meta", icon: <Target size={16} /> },
]

export default function AddTransactionModal({ 
  isOpen, 
  onClose, 
  defaultType, 
  allowedTypes = "ALL_TYPES"
}: AddTransactionModalProps) {
  const {
    type,
    setType,
    loading,
    rawAmount,
    rawGoalValue,
    cards,
    selectedCard,
    setSelectedCard,
    installments,
    setInstallments,
    formData,
    handleChange,
    handleAmountChange,
    handleGoalValueChange,
    formatCurrencyForDisplay,
    handleSubmit,
    resetForm
  } = useAddTransaction(defaultType)

  const [isCardModalOpen, setIsCardModalOpen] = useState(false)

  // 🔥 CORREÇÃO: Limpar TUDO quando trocar de tipo
  const handleTypeChange = (newType: TransactionType) => {
    resetForm()
    setType(newType)
  }

  useEffect(() => {
    if (isOpen) {
      resetForm()
    }
  }, [isOpen, defaultType])

  if (!isOpen) return null

  // 🔥 NOVO: Filtrar tipos permitidos
  const availableTypes = allowedTypes === "ALL_TYPES" 
    ? typeDisplayConfig 
    : typeDisplayConfig.filter(t => allowedTypes.includes(t.key as TransactionType))

  // 🔧 CORREÇÃO: Criar IDs únicos para os cartões
  const cardsWithUniqueIds = cards.map((card, index) => ({
    ...card,
    uniqueId: `${card.cardNumber}-${card.bank}-${index}`
  }))

  // 🔥 CORREÇÃO: Configuração dinâmica dos campos com chaves separadas
  const fieldConfig = {
    income: {
      label1: "Origem do dinheiro",
      key1: "source", // 🔥 Campo do select
      titleKey: "name", // 🔥 Campo separado para o título
      icon1: <TrendingUp size={20} />,
      label2: "Valor da Receita",
      key2: "amount",
      dateKey: "date",
      selectLabel: "Categoria",
      selectOptions: incomeSources,
      placeholder: "Selecione a categoria",
    },
    expense: {
      label1: "Nome da Despesa", 
      key1: "name", // 🔥 Campo do input de texto
      titleKey: "name", // 🔥 Mesmo campo (não tem select)
      icon1: <Wallet size={20} />,
      label2: "Valor da Despesa",
      key2: "amount",
      dateKey: "date",
      selectLabel: "Categoria",
      selectOptions: expenseCategories,
      placeholder: "Selecione a categoria",
    },
    fixedExpense: {
      label1: "Nome da Assinatura",
      key1: "name", // 🔥 Campo do input de texto  
      titleKey: "name", // 🔥 Mesmo campo (não tem select)
      icon1: <CreditCard size={20} />,
      label2: "Valor Mensal",
      key2: "amount", 
      dateKey: "date",
      selectLabel: "Tipo de Assinatura",
      selectOptions: subscriptionTypes,
      placeholder: "Selecione o tipo",
    },
    goal: {
      label1: "Nome da Meta",
      key1: "name", // 🔥 Campo do input de texto
      titleKey: "name", // 🔥 Mesmo campo
      icon1: <Target size={20} />,
      label2: "Valor da Meta",
      key2: "goalValue",
      dateKey: "goalDeadline",
      selectLabel: null,
      selectOptions: [],
      placeholder: "",
    },
  }

  const cfg = fieldConfig[type]

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-[#1E1F24] to-[#2A2B32] text-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto relative animate-slideUp border border-gray-700/50">
        
        {/* Header com gradiente */}
        <div className={`bg-gradient-to-r ${typeColors[type]} p-6 rounded-t-3xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                {typeIcons[type]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {typeLabels[type]}
                </h2>
                <p className="text-white/80 text-sm">
                  {type === 'income' ? 'Adicione uma nova entrada de dinheiro' :
                   type === 'expense' ? 'Registre uma despesa do dia a dia' :
                   type === 'fixedExpense' ? 'Cadastre uma despesa recorrente' :
                   'Defina um novo objetivo financeiro'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
            >
              <X size={22} className="text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* 🔥 Tabs condicionais - Só mostra se tiver mais de um tipo disponível */}
          {availableTypes.length > 1 && (
            <div className="flex bg-gray-800/50 rounded-2xl p-1 mb-8 backdrop-blur-sm">
              {availableTypes.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => handleTypeChange(key as TransactionType)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 flex-1 text-center justify-center ${
                    type === key 
                      ? `bg-gradient-to-r ${typeColors[key]} text-white shadow-lg scale-105` 
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onClose); }} className="space-y-6">
            {/* Campos do formulário */}
            <div className="grid gap-6">
              {/* 🔥 CORREÇÃO: Input de título SEPARADO do select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  {cfg.icon1}
                  {cfg.label1}
                </label>
                <input
                  type="text"
                  value={formData[cfg.titleKey]} // 🔥 Usa titleKey em vez de key1
                  onChange={(e) => handleChange(cfg.titleKey, e.target.value)} // 🔥 titleKey
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder={`Digite o ${cfg.label1.toLowerCase()}`}
                />
              </div>

              {/* Valor */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <DollarSign size={20} />
                  {cfg.label2}
                </label>
                <input
                  type="text"
                  value={type === "goal" ? formatCurrencyForDisplay(rawGoalValue) : formatCurrencyForDisplay(rawAmount)}
                  onChange={(e) => type === "goal" ? handleGoalValueChange(e.target.value) : handleAmountChange(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder="R$ 0,00"
                />
              </div>

              {/* Select (se aplicável) - AGORA SEPARADO do título */}
              {cfg.selectLabel && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    {cfg.selectLabel}
                  </label>
                  <select
                    value={formData[cfg.key1]} // 🔥 Usa key1 (campo separado)
                    onChange={(e) => handleChange(cfg.key1, e.target.value)} // 🔥 key1
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm appearance-none"
                  >
                    <option value="">{cfg.placeholder}</option>
                    {cfg.selectOptions.map(option => (
                      <option key={option.id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Calendar size={20} />
                  {type === 'goal' ? 'Data Limite' : 'Data'}
                </label>
                <DatePicker
                  selected={formData[cfg.dateKey]}
                  onChange={(date) => handleChange(cfg.dateKey, date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecione a data"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  required
                />
              </div>

              {/* Cartão e Parcelas (apenas para despesas) */}
              {type === "expense" && (
                <div className="space-y-4 p-4 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                  <label className="text-sm font-medium text-gray-300">💳 Cartão de Crédito</label>
                  
                  <div className="flex gap-3">
                    <select
                      value={selectedCard?.cardNumber || ""}
                      onChange={(e) => {
                        const selected = cardsWithUniqueIds.find(c => c.uniqueId === e.target.value)
                        setSelectedCard(selected || null)
                      }}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    >
                      <option value="">Selecione um cartão</option>
                      {cardsWithUniqueIds.map(card => (
                        <option key={card.uniqueId} value={card.uniqueId}>
                          {card.cardName} ****{card.cardNumber.slice(-4)} - {card.bank}
                        </option>
                      ))}
                    </select>
                    
                    <button
                      type="button"
                      onClick={() => setIsCardModalOpen(true)}
                      className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                    >
                      <CreditCard size={16} />
                      Novo
                    </button>
                  </div>

                  {selectedCard && (
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-300 flex-1">
                        📦 Parcelas
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={24}
                        value={installments}
                        onChange={(e) => setInstallments(Math.max(1, Math.min(24, Number(e.target.value))))}
                        className="w-24 px-3 py-2 rounded-xl bg-gray-800/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-center"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-700/50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-xl bg-gradient-to-r ${typeColors[type]} hover:shadow-lg text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <DollarSign size={16} />
                    Salvar {type === 'income' ? 'Receita' : type === 'goal' ? 'Meta' : 'Despesa'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Modal de cartão */}
        <AddCardModal
          isOpen={isCardModalOpen}
          onClose={() => setIsCardModalOpen(false)}
          onSubmit={(newCard) => {
            setSelectedCard(newCard)
            setIsCardModalOpen(false)
          }}
        />
      </div>
    </div>
  )
}