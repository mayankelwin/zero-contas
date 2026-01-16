"use client"

import { useEffect } from "react"
import { Input } from "../../ui/Input"
import { CreditCard, ChevronDown, Sparkles, Target, Wallet, Calendar } from "lucide-react"
import { clsx } from "clsx"

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
  
  const baseInputStyles = "w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all appearance-none cursor-pointer text-sm"

  const goalCategories = [
    { id: "g1", name: "Adquirir uma casa" },
    { id: "g2", name: "Comprar um carro" },
    { id: "g3", name: "Quitar uma dívida" },
    { id: "g4", name: "Reserva de Emergência" },
    { id: "g5", name: "Viagem / Férias" },
    { id: "g6", name: "Aposentadoria" },
    { id: "g7", name: "Educação / Curso" },
    { id: "g8", name: "Outros" },
  ]

  useEffect(() => {
    if (!formData[cfg.dateKey]) {
      const today = new Date().toISOString().split('T')[0]
      handleChange(cfg.dateKey, today)
    }
  }, [cfg.dateKey, formData, handleChange])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {type === "goal" ? (
          <>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Objetivo Principal</label>
              <div className="relative">
                <select
                  onChange={(e) => handleChange(cfg.titleKey, e.target.value)}
                  className={baseInputStyles}
                  defaultValue=""
                >
                  <option value="" disabled className="bg-[#09090b]">Selecione uma meta...</option>
                  {goalCategories.map((cat) => (
                    <option key={cat.id} value={cat.name} className="bg-[#09090b]">{cat.name}</option>
                  ))}
                </select>
                <Target size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Nome Personalizado</label>
              <Input
                type="text"
                value={formData[cfg.titleKey] || ""}
                placeholder={`Ex: Minha Casa Própria`}
                onChange={(v) => handleChange(cfg.titleKey, v)}
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">{cfg?.label1}</label>
              <Input
                type="text"
                value={formData[cfg?.titleKey] || ""}
                placeholder={`Ex: Assinatura Netflix`}
                onChange={(v) => handleChange(cfg.titleKey, v)}
                required
              />
            </div>
            {cfg?.selectLabel && (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">{cfg.selectLabel}</label>
                <div className="relative">
                  <select
                    value={formData[cfg.categoryKey || cfg.key1]}
                    onChange={(e) => handleChange(cfg.categoryKey || cfg.key1, e.target.value)}
                    required
                    className={baseInputStyles}
                  >
                    <option value="" className="bg-[#09090b] text-gray-500">{cfg.placeholder}</option>
                    {cfg.selectOptions?.map((option: any, idx: number) => (
                      <option key={`${option.id}-${idx}`} value={option.name} className="bg-[#09090b]">{option.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
          {type === "goal" ? "Valor Alvo da Meta" : cfg?.label2}
        </label>
        <div className="relative group">
          <Input
            type="money"
            value={type === "goal" ? rawGoalValue : rawAmount}
            onChange={(v) => (type === "goal" ? handleGoalValueChange(v) : handleAmountChange(v))}
            placeholder="R$ 0,00"
            required
          />
          <Wallet size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none" />
        </div>
      </div>

      {(type === "expense" || type === "fixedExpense") && (
        <div className="space-y-3">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
            Forma de Pagamento
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <select
                value={selectedCard?.uniqueId || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const found = cardsWithUniqueIds.find((c) => c.uniqueId === val);
                  if (found) {
                    setSelectedCard(found);
                  } else {
                    setSelectedCard(null);
                    setInstallments(1); 
                  }
                }}
                className={baseInputStyles}
              >
                <option value="" className="bg-[#09090b]">Saldo em conta (Débito)</option>
                {cardsWithUniqueIds.map((card, idx) => (
                  <option key={`${card.uniqueId}-${idx}`} value={card.uniqueId} className="bg-[#09090b]">
                    {card.cardName} (**** {card.cardNumber?.slice(-4)})
                  </option>
                ))}
              </select>
              <CreditCard size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
            </div>

            <div className="relative">
               <select 
                value={installments} 
                onChange={(e) => setInstallments(Number(e.target.value))}
                className={clsx(
                  baseInputStyles, 
                  !selectedCard && "opacity-40 cursor-not-allowed grayscale"
                )}
                disabled={!selectedCard}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={`inst-${num}`} value={num} className="bg-[#09090b]">
                    {num === 1 ? 'Pagamento À Vista' : `${num}x Parcelado`}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
            {type === "goal" ? "Prazo Final" : "Data do Lançamento"}
          </label>
          <div className="relative group">
            <input
              type="date"
              value={formData[cfg?.dateKey] ? (formData[cfg.dateKey] instanceof Date ? formData[cfg.dateKey].toISOString().split('T')[0] : formData[cfg.dateKey]) : ""}
              onChange={(e) => handleChange(cfg.dateKey, e.target.value)}
              className={clsx(baseInputStyles, "block [color-scheme:dark]")}
              required
            />
            <Calendar size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
          </div>
        </div>

        {type === "fixedExpense" && (
          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Frequência</label>
            <div className="relative">
              <select
                value={subscriptionType}
                onChange={(e) => setSubscriptionType(e.target.value)}
                className={baseInputStyles}
              >
                <option value="mensal" className="bg-[#09090b]">Mensal</option>
                <option value="bimestral" className="bg-[#09090b]">Bimestral</option>
                <option value="trimestral" className="bg-[#09090b]">Trimestral</option>
                <option value="anual" className="bg-[#09090b]">Anual</option>
              </select>
              <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 px-2 py-1 text-[9px] font-bold text-white/20 uppercase tracking-widest">
        <Sparkles size={10} />
        Preencha todos os campos obrigatórios
      </div>
    </div>
  )
}