// TransactionDetailsPanel.tsx
'use client'

import { ChevronLeft, Calculator, CreditCard, Target, Info, AlertTriangle } from "lucide-react"
import React from "react"

interface TransactionDetailsPanelProps {
  type: "income" | "expense" | "fixedExpense" | "goal"
  formData: any
  selectedCard: any
  installments: number
  rawAmount: number
  rawGoalValue: number
  formatCurrencyForDisplay: (amount: number) => string
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

  const amountNumber = Number(rawAmount.toString().replace(/[^0-9.-]+/g,"")) / 100 || 0
  const numInstallments = installments > 0 ? installments : 1
  const monthlyInterestRate = selectedCard?.interestRate ? selectedCard.interestRate / 100 : 0

  const calculateTotalWithInterest = (principal: number, months: number, monthlyRate: number) => {
    if(monthlyRate === 0) return principal
    return principal * (Math.pow(1 + monthlyRate, months))
  }

  const installmentValueWithoutInterest = amountNumber / numInstallments
  const totalWithInterest = calculateTotalWithInterest(amountNumber, numInstallments, monthlyInterestRate)
  const installmentValueWithInterest = totalWithInterest / numInstallments
  const interestPaid = totalWithInterest - amountNumber
  const installmentValue = selectedCard && selectedCard.interestRate > 0 
    ? installmentValueWithInterest 
    : installmentValueWithoutInterest

  const totalUsedAfterTransaction = usedCredit + totalWithInterest
  const usedPercentage = (totalUsedAfterTransaction / creditLimit) * 100
  const displayedPercentage = Math.min(usedPercentage, 100).toFixed(1)
  const exceededPercentage = usedPercentage > 100 ? (usedPercentage - 100).toFixed(1) : null

  return (
    <div className={`
       text-white rounded-3xl shadow-2xl 
       max-h-[90vh] overflow-auto relative border border-gray-700/50
       ${isMobile ? 'w-full max-w-2xl mt-4 animate-slideUp' : 'w-120 animate-slideInRight'}
       transition-all duration-500
    `}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Calculator className="text-blue-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Detalhes</h3>
              <p className="text-gray-400 text-sm">Resumo da transação</p>
            </div>
          </div>
          {isMobile && setShowDetailsPanel && (
            <button 
              onClick={() => setShowDetailsPanel(false)}
              className="p-2 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-300"
            >
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Informações básicas */}
          {(type === "expense" || type === "fixedExpense") && (formData.title || formData.name || formData.source) && (
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-600/50">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Info size={16} className="text-blue-400" />
                Informações
              </h4>
              <p className="text-gray-300 text-sm">{formData.title || formData.name || formData.source}</p>
              {formData[cfg?.categoryKey || cfg?.key1] && (
                <p className="text-gray-300 text-xs mt-1">{formData[cfg.categoryKey || cfg.key1]}</p>
              )}
              <p className="text-gray-300 text-xs mt-1">
                Valor: <span className="text-white font-medium">{formatCurrencyForDisplay(rawAmount)}</span>
              </p>
            </div>
          )}

          {/* Parcelamento */}
          {type === "expense" && selectedCard && installments > 1 && rawAmount && (
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/20">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <CreditCard size={16} className="text-purple-400" />
                Parcelamento
              </h4>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Valor original:</span>
                  <span className="text-white font-medium">{formatCurrencyForDisplay(rawAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Parcelas:</span>
                  <span className="text-white font-medium">{installments}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Valor da parcela:</span>
                  <span className="text-white font-medium">{formatCurrencyForDisplay(installmentValueWithoutInterest)}</span>
                </div>

                {selectedCard.interestRate > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Taxa de juros:</span>
                      <span className="text-yellow-400 font-medium">{selectedCard.interestRate}% a.m.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Juros totais:</span>
                      <span className="text-red-400 font-medium">{formatCurrencyForDisplay(interestPaid)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-600 pt-2">
                      <span className="text-gray-300 font-semibold">Total com juros:</span>
                      <span className="text-white font-bold">{formatCurrencyForDisplay(totalWithInterest)}</span>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 mt-2">
                      <div className="flex items-center gap-2 text-yellow-400 text-xs">
                        <AlertTriangle size={12} />
                        <span>Parcelamento com juros do cartão</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Utilização do Limite</span>
                        <span className="font-semibold text-white text-right">
                          {displayedPercentage}%
                          {usedPercentage > 100 && (
                            <p className="text-xs text-red-400">Ultrapassaria o limite em {exceededPercentage}%</p>
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-1000 ${
                            usedPercentage > 80 ? "bg-red-500" : usedPercentage > 50 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(usedPercentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>R$ {usedCredit.toLocaleString("pt-BR")}</span>
                        <span>R$ {creditLimit.toLocaleString("pt-BR")}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Meta */}
          {type === "goal" && (formData.title || formData.name || formData.source) && (
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Target size={16} className="text-green-400" />
                Meta Financeira
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300 text-sm">{formData.title || formData.name || formData.source}</p>
                <div className="flex justify-between">
                  <span className="text-gray-300">Valor da meta:</span>
                  <span className="text-white font-medium">{formatCurrencyForDisplay(rawGoalValue)}</span>
                </div>
                {formData.goalDeadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Data limite:</span>
                    <span className="text-white font-medium">
                      {new Date(formData.goalDeadline).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aviso */}
          <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-600/30">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-400 text-xs">Revise os detalhes antes de confirmar a transação.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
