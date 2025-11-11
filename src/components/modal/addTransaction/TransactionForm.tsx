"use client"

import { Input } from "../../ui/Input"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Calendar, CreditCard, Target } from "lucide-react"

type TransactionType = "income" | "expense" | "fixedExpense" | "goal"

interface TransactionFormProps {
  type: TransactionType
  formData: any
  handleChange: (key: string, value: any) => void
  rawAmount: string
  rawGoalValue: string
  handleAmountChange: (v: string) => void
  handleGoalValueChange: (v: string) => void
  cfg: any
  selectedCard: any
  setSelectedCard: (card: any) => void
  cardsWithUniqueIds: any[]
  installments: number
  setInstallments: (n: number) => void
  subscriptionType: string
  setSubscriptionType: (s: string) => void
}

export default function TransactionForm({
  type,
  formData,
  handleChange,
  rawAmount,
  rawGoalValue,
  handleAmountChange,
  handleGoalValueChange,
  cfg,
  selectedCard,
  setSelectedCard,
  cardsWithUniqueIds,
  installments,
  setInstallments,
  subscriptionType,
  setSubscriptionType,
}: TransactionFormProps) {
  return (
    <div className="space-y-6">
      {/* Dados básicos */}
      <div className="space-y-4">
        {cfg && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              {cfg.label1}
            </label>
            <Input
              type="text"
              value={formData[cfg.titleKey] || ""}
              placeholder={`Digite o ${cfg.label1.toLowerCase()}`}
              onChange={(v) => handleChange(cfg.titleKey, v)}
              required
            />
          </div>
        )}

        {/* Categoria */}
        {cfg.selectLabel && cfg.selectOptions?.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{cfg.selectLabel}</label>
            <select
              value={formData[cfg.categoryKey || cfg.key1]}
              onChange={(e) => handleChange(cfg.categoryKey || cfg.key1, e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none"
            >
              <option value="">{cfg.placeholder}</option>
              {cfg.selectOptions.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Valores */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">{cfg.label2}</label>
        <Input
          type="money"
          value={type === "goal" ? rawGoalValue : rawAmount}
          onChange={(v) => (type === "goal" ? handleGoalValueChange(v) : handleAmountChange(v))}
          placeholder={`Digite o ${cfg.label1.toLowerCase()}`}
          required
        />
      </div>

      {/* Cartão e Parcelas */}
      {(type === "expense" || type === "fixedExpense") && (
        <div className="space-y-4">
          {type === "fixedExpense" && (
            <div className="flex items-center gap-3">
              <input
                id="linkCard"
                type="checkbox"
                checked={!!selectedCard}
                onChange={(e) => {
                  if (e.target.checked) setSelectedCard(cardsWithUniqueIds[0] || null)
                  else setSelectedCard(null)
                }}
                className="w-5 h-5 accent-blue-500 rounded-md cursor-pointer"
              />
              <label htmlFor="linkCard" className="text-sm font-medium text-gray-300 cursor-pointer select-none">
                Vincular cartão a esta despesa fixa
              </label>
            </div>
          )}

          {(type === "expense" || selectedCard) && (
            <>
              <label className="text-sm font-medium text-gray-300">Cartão de Crédito</label>
              <div className="flex gap-3">
                <select
                  value={selectedCard?.uniqueId || ""}
                  onChange={(e) => {
                    const selected = cardsWithUniqueIds.find((c) => c.uniqueId === e.target.value)
                    setSelectedCard(selected || null)
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none"
                >
                  <option value="">Selecione um cartão</option>
                  {cardsWithUniqueIds.map((card) => (
                    <option key={card.uniqueId} value={card.uniqueId}>
                      {card.cardName} **** {card.cardNumber.slice(-4)} - {card.bank}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCard && (
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-300 flex-1">Parcelas</label>
                  <Input type="number" value={installments} onChange={(v) => setInstallments(Number(v))} placeholder="Número de parcelas" allowNegative={false} required />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Datas + Assinatura */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
           {type === "goal" ? "Data Limite" : "Data"}
          </label>
          <DatePicker
            selected={formData[cfg.dateKey]}
            onChange={(date) => handleChange(cfg.dateKey, date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione a data"
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
        </div>

        {type === "fixedExpense" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Tipo de assinatura</label>
            <select
              value={subscriptionType}
              onChange={(e) => setSubscriptionType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none"
            >
              <option value="mensal">Mensal</option>
              <option value="bimestral">Bimestral</option>
              <option value="trimestral">Trimestral</option>
              <option value="anual">Anual</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}
