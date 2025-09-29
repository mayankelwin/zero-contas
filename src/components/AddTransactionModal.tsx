"use client"

import { useState } from "react"
import { X, DollarSign, CreditCard, Gift, Book, Film, Smartphone, Wifi, Target } from "lucide-react"
import { Input } from "./Input"
import { Select } from "./Select"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import AddCardModal from "./AddCardModal"
import { useAddTransaction } from "../hooks/useAddTransaction"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  defaultType: "income" | "expense" | "fixedExpense" | "goal"
}

const incomeSources = [
  { name: "Freelance", icon: <CreditCard size={20} /> },
  { name: "Vendas", icon: <Gift size={20} /> },
  { name: "Negócios", icon: <Gift size={20} /> },
  { name: "Investimentos", icon: <Gift size={20} /> },
  { name: "Outros", icon: <DollarSign size={20} /> },
]

const expenseCategories = [
  { name: "Alimentação", icon: <Gift size={20} /> },
  { name: "Transporte", icon: <CreditCard size={20} /> },
  { name: "Moradia", icon: <Book size={20} /> },
  { name: "Lazer", icon: <Film size={20} /> },
  { name: "Saúde", icon: <Gift size={20} /> },
  { name: "Educação", icon: <Book size={20} /> },
  { name: "Outros", icon: <DollarSign size={20} /> },
]

const subscriptionTypes = [
  { name: "Filmes Streaming", icon: <Film size={20} /> },
  { name: "Cursos", icon: <Book size={20} /> },
  { name: "Telefone", icon: <Smartphone size={20} /> },
  { name: "Internet", icon: <Wifi size={20} /> },
  { name: "Outros", icon: <DollarSign size={20} /> },
]

export default function AddTransactionModal({ isOpen, onClose, defaultType }: AddTransactionModalProps) {
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
  } = useAddTransaction(defaultType)

  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  if (!isOpen) return null

  // Configuração dinâmica dos campos
  const fieldConfig = {
    income: {
      label1: "Origem do dinheiro",
      key1: "source",
      icon1: <DollarSign />,
      label2: "Valor",
      key2: "amount",
      dateKey: "date",
      selectLabel: "Categoria",
      selectOptions: incomeSources,
      placeholder: "Selecione a categoria",
    },
    expense: {
      label1: "Nome da Despesa",
      key1: "name",
      icon1: <CreditCard />,
      label2: "Valor",
      key2: "amount",
      dateKey: "date",
      selectLabel: "Categoria",
      selectOptions: expenseCategories,
      placeholder: "Selecione a categoria",
    },
    fixedExpense: {
      label1: "Nome da Assinatura",
      key1: "name",
      icon1: <CreditCard />,
      label2: "Valor Mensal",
      key2: "amount",
      dateKey: "date",
      selectLabel: "Tipo de Assinatura",
      selectOptions: subscriptionTypes,
      placeholder: "Selecione o tipo",
    },
    goal: {
      label1: "Nome da Meta",
      key1: "name",
      icon1: <Target />,
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-[#1E1F24] text-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto p-6 relative animate-slideUp border border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700 transition">
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {type === "income" ? "Receita" : type === "expense" ? "Despesa" : type === "fixedExpense" ? "Despesa Fixa" : "Meta"}
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {["income", "expense", "fixedExpense", "goal"].map(t => (
            <button
              key={t}
              onClick={() => setType(t as any)}
              className={`px-5 py-2 rounded-full font-medium transition shadow-md ${type === t ? "bg-blue-600 text-white scale-105 shadow-lg" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {t === "income" ? "Receita" : t === "expense" ? "Despesa" : t === "fixedExpense" ? "Despesa Fixa" : "Meta"}
            </button>
          ))}
        </div>

        <form onSubmit={e => handleSubmit(onClose)} className="space-y-6">
          {/* INPUT DINÂMICO */}
          <Input
            label={cfg.label1}
            value={formData[cfg.key1]}
            onChange={v => handleChange(cfg.key1, v)}
            required
            icon={cfg.icon1}
          />
          <Input
            label={cfg.label2}
            type="text"
            value={type === "goal" ? formatCurrencyForDisplay(rawGoalValue) : formatCurrencyForDisplay(rawAmount)}
            onChange={type === "goal" ? handleGoalValueChange : handleAmountChange}
            required
            icon={<DollarSign />}
          />
          {cfg.selectLabel && (
            <Select
              label={cfg.selectLabel}
              value={formData[cfg.key1]} 
              onChange={v => handleChange(cfg.key1, v)}
              options={cfg.selectOptions}
              placeholder={cfg.placeholder}
              required
            />
          )}
          <DatePicker
            selected={formData[cfg.dateKey]}
            onChange={date => handleChange(cfg.dateKey, date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione a data"
            className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Cartão opcional e parcelas */}
          {type === "expense" && (
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Cartão de Crédito (opcional)</label>
              <div className="flex gap-2">
                <select
                  value={selectedCard?.cardNumber || ""}
                  onChange={e => setSelectedCard(cards.find(c => c.cardNumber === e.target.value) || null)}
                  className="flex-1 rounded-xl bg-gray-800 p-2 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um cartão</option>
                  {cards.map(c => (
                    <option key={c.cardNumber} value={c.cardNumber}>
                      {c.cardName} ****{c.cardNumber}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(true)}
                  className="bg-blue-600 px-4 rounded-xl hover:bg-blue-500 transition"
                >
                  + Cartão
                </button>
              </div>
              {selectedCard && (
                <div className="mt-2">
                  <label className="text-sm text-gray-300">Parcelas</label>
                  <input
                    type="number"
                    min={1}
                    value={installments}
                    onChange={e => setInstallments(Math.max(1, Number(e.target.value)))}
                    className="w-24 rounded-xl bg-gray-800 p-2 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <AddCardModal
                isOpen={isCardModalOpen}
                onClose={() => setIsCardModalOpen(false)}
                onSubmit={(newCard) => {
                  setSelectedCard(newCard)
                  setIsCardModalOpen(false)
                }}
              />
            </div>
          )}

          {/* Ações */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-gray-500 text-gray-300 hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
