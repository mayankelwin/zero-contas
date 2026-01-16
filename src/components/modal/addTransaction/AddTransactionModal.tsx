"use client"

import { useState, useEffect, useMemo } from "react"
import { X, Plus, Sparkles, Receipt, Wallet, Target, Repeat, Loader2 } from "lucide-react"
import { useAddTransaction } from "../../../hooks/transactions/useAddTransaction"
import { useCreateCard } from "../../../services/createCard"
import TransactionForm from "./TransactionForm"
import TransactionDetailsPanel from "./TransactionDetailsPanel"
import { clsx } from "clsx"

import { TransactionType } from "../../../hooks/transactions/useAddTransaction"

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType: TransactionType;
  allowedTypes?: TransactionType[]; 
}

export default function AddTransactionModal({ 
  isOpen, 
  onClose, 
  defaultType,
  allowedTypes 
}: AddTransactionModalProps) {
  
  const { cardsList, selectedCard, installments, setInstallments, setSelectedCard } = useCreateCard()
  const {
    type, setType, loading, rawAmount, rawGoalValue, formData,
    handleChange, handleAmountChange, handleGoalValueChange,
    formatCurrencyForDisplay, handleSubmit,
    typeLabels, typeDisplayConfig, fieldConfig,
  } = useAddTransaction(defaultType)
  const [showDetails, setShowDetails] = useState(false)

  
  const filteredDisplayConfig = useMemo(() => {
    if (!allowedTypes || allowedTypes.length === 0) return typeDisplayConfig;
    return typeDisplayConfig.filter(t => allowedTypes.includes(t.key as TransactionType));
  }, [typeDisplayConfig, allowedTypes]);
  
  useEffect(() => {
    setShowDetails(!!rawAmount || !!rawGoalValue)
  }, [rawAmount, rawGoalValue])
  
  if (!isOpen) return null;
  if (type === "balance") return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />

      <div className={clsx(
        "relative flex w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] items-center justify-center",
        showDetails ? "max-w-6xl gap-6" : "max-w-3xl"
      )}>
        
        <div className="hidden sm:flex flex-col gap-3 p-2 bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-md self-center z-10 shadow-2xl">
          {filteredDisplayConfig.map((t) => (
            <button
              key={t.key}
              onClick={() => setType(t.key as TransactionType)}
              className={clsx(
                "p-4 rounded-2xl transition-all duration-500 group relative",
                type === t.key 
                  ? "bg-white text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              {t.key === 'income' && <Wallet size={20} />}
              {t.key === 'expense' && <Receipt size={20} />}
              {t.key === 'fixedExpense' && <Repeat size={20} />}
              {t.key === 'goal' && <Target size={20} />}
              
              <span className="absolute right-full mr-4 px-3 py-1.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 shadow-2xl translate-x-2 group-hover:translate-x-0 whitespace-nowrap">
                {t.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-[#09090b] border border-white/[0.08] rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-8 pb-0 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Entry Terminal</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter">
                {typeLabels[type]} <span className="text-white/20">/01</span>
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 rounded-full bg-white/[0.03] border border-white/[0.05] text-gray-500 hover:text-white hover:rotate-90 transition-all duration-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 flex-1">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onClose) }} className="h-full flex flex-col justify-between">
              <div className="py-6">
                <TransactionForm
                  type={type} 
                  formData={formData} 
                  handleChange={handleChange}
                  rawAmount={rawAmount} 
                  rawGoalValue={rawGoalValue}
                  handleAmountChange={handleAmountChange} 
                  handleGoalValueChange={handleGoalValueChange}
                  cfg={fieldConfig[type] || {}} 
                  selectedCard={selectedCard} 
                  setSelectedCard={setSelectedCard}
                  cardsWithUniqueIds={cardsList}
                  installments={installments} 
                  setInstallments={setInstallments}
                  subscriptionType={formData.subscriptionType || "mensal"} 
                  setSubscriptionType={(val) => handleChange('subscriptionType', val)}
                />
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-white/[0.05]">
                <button
                  disabled={loading}
                  onClick={onClose} 
                  className="group relative flex items-center gap-3 bg-gray-500 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:pr-14 active:scale-95 disabled:opacity-20"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Cancelar"}
                  <Plus className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={18} strokeWidth={3} />
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:pr-14 active:scale-95 disabled:opacity-20"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Registrar"}
                  <Plus className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={18} strokeWidth={3} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {showDetails && (
          <div className="hidden lg:block w-[400px] h-full animate-in slide-in-from-right-10 fade-in duration-1000">
            <TransactionDetailsPanel
              type={type} 
              formData={formData} 
              selectedCard={selectedCard} 
              installments={installments}
              rawAmount={rawAmount} 
              rawGoalValue={rawGoalValue} 
              formatCurrencyForDisplay={formatCurrencyForDisplay}
              usedCredit={selectedCard?.usedCredit || 0} 
              creditLimit={selectedCard?.creditLimit || 0} 
              isMobile={false} 
              setShowDetailsPanel={() => {}}
              cfg={fieldConfig[type]}
            />
          </div>
        )}
      </div>
    </div>
  )
}