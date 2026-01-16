"use client"

import { Input } from "../../ui/Input"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Calendar, CreditCard, ChevronDown, Sparkles } from "lucide-react"
import { clsx } from "clsx"

// Importe o tipo diretamente do seu hook para evitar conflito
import { TransactionType } from "../../../hooks/transactions/useAddTransaction"

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
  
  // Estilo padrão para os selects customizados
  const selectStyles = "w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all appearance-none cursor-pointer text-sm"

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* Seção Principal: Nome e Categoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cfg && (
          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
              {cfg.label1}
            </label>
            <Input
              type="text"
              value={formData[cfg.titleKey] || ""}
              placeholder={`Ex: Assinatura Netflix`}
              onChange={(v) => handleChange(cfg.titleKey, v)}
              required
            />
          </div>
        )}

        {cfg.selectLabel && (
          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
              {cfg.selectLabel}
            </label>
            <div className="relative">
              <select
                value={formData[cfg.categoryKey || cfg.key1]}
                onChange={(e) => handleChange(cfg.categoryKey || cfg.key1, e.target.value)}
                required
                className={selectStyles}
              >
                <option value="" className="bg-[#09090b] text-gray-500">{cfg.placeholder}</option>
                {cfg.selectOptions?.map((option: any) => (
                  <option key={option.id} value={option.name} className="bg-[#09090b]">
                    {option.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
          {cfg.label2}
        </label>
        <div className="relative group">
          <Input
            type="money"
            value={type === "goal" ? rawGoalValue : rawAmount}
            onChange={(v) => (type === "goal" ? handleGoalValueChange(v) : handleAmountChange(v))}
            placeholder="R$ 0,00"
            required
          />
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-white/40 transition-colors">
          </div>
        </div>
      </div>

      {/* Cartão e Parcelas (UX melhorada) */}
      {(type === "expense" || type === "fixedExpense") && (
        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] space-y-6">
          {type === "fixedExpense" && (
            <div className="flex items-center gap-3 pb-2">
              <input
                id="linkCard"
                type="checkbox"
                checked={!!selectedCard}
                onChange={(e) => {
                  if (e.target.checked) setSelectedCard(cardsWithUniqueIds[0] || null)
                  else setSelectedCard(null)
                }}
                className="w-5 h-5 accent-white bg-transparent border-white/20 rounded-lg cursor-pointer"
              />
              <label htmlFor="linkCard" className="text-xs font-bold text-white/60 cursor-pointer select-none">
                Vincular cartão de crédito
              </label>
            </div>
          )}

          {(type === "expense" || selectedCard) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <select
                  value={selectedCard?.uniqueId || ""}
                  onChange={(e) => {
                    const selected = cardsWithUniqueIds.find((c) => c.uniqueId === e.target.value)
                    setSelectedCard(selected || null)
                  }}
                  className={selectStyles}
                >
                  <option value="" className="bg-[#09090b]">Selecione o cartão</option>
                  {cardsWithUniqueIds.map((card) => (
                    <option key={card.uniqueId} value={card.uniqueId} className="bg-[#09090b]">
                      {card.cardName} (**** {card.cardNumber.slice(-4)})
                    </option>
                  ))}
                </select>
                <CreditCard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
              </div>

              {selectedCard && (
                <div className="relative">
                   <select 
                    value={installments} 
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className={selectStyles}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <option key={`inst-${num}`} value={num} className="bg-[#09090b]">
                        {num === 1 ? 'À vista' : `${num} parcelas`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Datas e Recorrência */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
            {type === "goal" ? "Data Limite" : "Data do Lançamento"}
          </label>
          <div className="relative">
            <DatePicker
              selected={formData[cfg.dateKey]}
              onChange={(date) => handleChange(cfg.dateKey, date)}
              dateFormat="dd/MM/yyyy"
              className={clsx(selectStyles, "w-full")}
              required
            />
            <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
          </div>
        </div>

        {type === "fixedExpense" && (
          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Frequência</label>
            <div className="relative">
              <select
                value={subscriptionType}
                onChange={(e) => setSubscriptionType(e.target.value)}
                className={selectStyles}
              >
                <option value="mensal" className="bg-[#09090b]">Mensal</option>
                <option value="bimestral" className="bg-[#09090b]">Bimestral</option>
                <option value="trimestral" className="bg-[#09090b]">Trimestral</option>
                <option value="anual" className="bg-[#09090b]">Anual</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}