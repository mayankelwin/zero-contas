'use client'

import { ChevronLeft, Calculator, CreditCard, Target, Info, AlertTriangle, ArrowRight } from "lucide-react"
import React from "react"
import { TransactionType } from "../../../hooks/transactions/useAddTransaction"
import { clsx } from "clsx"

interface TransactionDetailsPanelProps {
  type: TransactionType
  formData: any
  selectedCard: any
  installments: number
  rawAmount: string | number // Tipagem flexível para evitar erros
  rawGoalValue: string | number
  formatCurrencyForDisplay: (amount: any) => string
  usedCredit?: number
  creditLimit?: number
  isMobile?: boolean
  setShowDetailsPanel?: (value: boolean) => void
  cfg?: any
}

export default function TransactionDetailsPanel({
  type,
  formData,
  selectedCard,
  installments,
  rawAmount,
  rawGoalValue,
  formatCurrencyForDisplay,
  usedCredit = 0,
  creditLimit = 1,
  isMobile = false,
  setShowDetailsPanel,
  cfg,
}: TransactionDetailsPanelProps) {

  if (!type) return null

  // Normalização segura para número
  const parseValue = (val: string | number) => {
    if (typeof val === 'number') return val / 100
    const cleanStr = val.toString().replace(/[^0-9.-]+/g, "")
    return (Number(cleanStr) / 100) || 0
  }

  const amountNumber = type === "goal" ? parseValue(rawGoalValue) : parseValue(rawAmount)
  const numInstallments = installments > 0 ? installments : 1
  const monthlyInterestRate = selectedCard?.interestRate ? selectedCard.interestRate / 100 : 0

  const calculateTotalWithInterest = (principal: number, months: number, monthlyRate: number) => {
    if (monthlyRate === 0 || months <= 1) return principal
    return principal * (Math.pow(1 + monthlyRate, months))
  }

  const totalWithInterest = calculateTotalWithInterest(amountNumber, numInstallments, monthlyInterestRate)
  const installmentValue = totalWithInterest / numInstallments
  const interestPaid = totalWithInterest - amountNumber

  const usedPercentage = ((usedCredit + totalWithInterest) / creditLimit) * 100

  return (
    <div className={clsx(
      "bg-white/[0.02] border border-white/[0.08] rounded-[2.5rem] backdrop-blur-3xl overflow-hidden transition-all duration-700",
      isMobile ? 'w-full mt-4' : 'w-full h-full shadow-[0_0_50px_rgba(0,0,0,0.3)]'
    )}>
      <div className="p-8">
        {/* Header Minimalista */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center">
              <Calculator size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Resumo</h3>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-tight">Análise em tempo real</p>
            </div>
          </div>
          {isMobile && setShowDetailsPanel && (
            <button onClick={() => setShowDetailsPanel(false)} className="p-2 text-white/40"><ChevronLeft /></button>
          )}
        </div>

        <div className="space-y-8">
          {/* Valor Principal em Destaque */}
          <div className="border-b border-white/[0.05] pb-8">
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Total Estimado</span>
             <h4 className="text-4xl font-black text-white tracking-tighter mt-1">
               {formatCurrencyForDisplay(type === "goal" ? rawGoalValue : rawAmount)}
             </h4>
          </div>

          {/* Seção Dinâmica Baseada no Tipo */}
          <div className="space-y-6">
            {/* Informações de Título */}
            {(formData.title || formData.name) && (
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Identificação</span>
                  <p className="text-sm text-white font-bold">{formData.title || formData.name}</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.05]">
                  <span className="text-[9px] font-black text-white/60 uppercase">{type}</span>
                </div>
              </div>
            )}

            {/* Parcelamento com Visual Moderno */}
            {type === "expense" && installments > 1 && (
              <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/[0.05] space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40 font-bold uppercase tracking-widest">Parcelas</span>
                  <span className="text-white font-black">{installments}x de {formatCurrencyForDisplay(installmentValue * 100)}</span>
                </div>
                
                {selectedCard?.interestRate > 0 && (
                   <div className="pt-4 border-t border-white/[0.05] space-y-2">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-orange-400/80 font-black uppercase">Juros Totais</span>
                        <span className="text-orange-400 font-black">+{formatCurrencyForDisplay(interestPaid * 100)}</span>
                      </div>
                   </div>
                )}
              </div>
            )}

            {/* Barra de Progresso de Limite (Apenas Cartão) */}
            {selectedCard && (
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Uso do Limite</span>
                  <span className={clsx(
                    "text-xs font-black",
                    usedPercentage > 90 ? "text-red-500" : "text-white"
                  )}>{usedPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={clsx(
                      "h-full transition-all duration-1000 ease-out",
                      usedPercentage > 90 ? "bg-red-500" : "bg-white"
                    )}
                    style={{ width: `${Math.min(usedPercentage, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Meta Financeira */}
            {type === "goal" && formData.goalDeadline && (
               <div className="flex items-center gap-4 p-4 rounded-2xl bg-white text-black">
                 <Target size={20} strokeWidth={3} />
                 <div>
                   <p className="text-[9px] font-black uppercase tracking-tight opacity-60">Prazo Estimado</p>
                   <p className="text-xs font-black uppercase tracking-widest">
                     {new Date(formData.goalDeadline).toLocaleDateString('pt-BR')}
                   </p>
                 </div>
               </div>
            )}
          </div>
        </div>

        {/* Rodapé do Painel */}
        <div className="mt-12 pt-8 border-t border-white/[0.05]">
          <div className="flex items-center gap-3 text-white/20">
            <Info size={14} />
            <p className="text-[9px] font-bold uppercase tracking-[0.1em]">Valores baseados nas configurações atuais</p>
          </div>
        </div>
      </div>
    </div>
  )
}