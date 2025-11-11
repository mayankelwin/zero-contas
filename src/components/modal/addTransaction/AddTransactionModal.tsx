"use client"

import { useState, useEffect, useCallback } from "react"
import { X, DollarSign } from "lucide-react"
import AddCardModal from "../AddCardModal"
import { useAddTransaction } from "../../../hooks/transactions/useAddTransaction"
import { useCreateCard } from "../../../services/createCard"
import TransactionForm from "./TransactionForm"
import TransactionDetailsPanel from "./TransactionDetailsPanel"

type TransactionType = "income" | "expense" | "fixedExpense" | "goal"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  defaultType: TransactionType
  allowedTypes?: TransactionType[] | "ALL_TYPES"
}

export default function AddTransactionModal({ isOpen, onClose, defaultType, allowedTypes = "ALL_TYPES" }: AddTransactionModalProps) {
  const {
    type, setType, loading, rawAmount, rawGoalValue, formData,
    handleChange, handleAmountChange, handleGoalValueChange,
    formatCurrencyForDisplay, handleSubmit, resetForm,
    typeIcons, typeLabels, typeColors, typeDisplayConfig, fieldConfig,
  } = useAddTransaction(defaultType)

  const {
    cardsList, handleAddCard, selectedCard, installments,
    setInstallments, setSelectedCard,
  } = useCreateCard()

  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [showDetailsPanel, setShowDetailsPanel] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [subscriptionType, setSubscriptionType] = useState("mensal")

  const usedCredit = selectedCard?.usedCredit || 0
  const creditLimit = selectedCard?.creditLimit || 1
  const cfg = fieldConfig[type] ?? fieldConfig.income

  // Detectar dispositivo mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Reset form ao abrir modal
  useEffect(() => { if (isOpen) { resetForm(); setShowDetailsPanel(false) } }, [isOpen, defaultType])

  // Atualiza o cartão selecionado
  useEffect(() => { if (selectedCard?.id) handleChange("card", selectedCard.id) }, [selectedCard])

  useEffect(() => {
  const hasRelevantInfo = (() => {
    if (type === "expense") {
      return selectedCard && installments > 1 && rawAmount
    }
    if (type === "goal") {
      return !!rawGoalValue
    }
    if (type === "income") {
      return !!rawAmount
    }
    if (type === "fixedExpense") {
      return !!subscriptionType
    }
    return Object.values(formData).some(value => value)
  })()

  setShowDetailsPanel(!!hasRelevantInfo)
}, [type, selectedCard, installments, rawAmount, rawGoalValue, formData])


  const handleTypeChange = useCallback((newType: TransactionType) => {
    resetForm()
    setType(newType)
    setShowDetailsPanel(false)
    setSelectedCard(null)
    setInstallments(1)
    if (newType !== "fixedExpense") setSubscriptionType("mensal")
  }, [resetForm, setType, setSelectedCard, setInstallments])

  if (!isOpen) return null

  const availableTypes = allowedTypes === "ALL_TYPES"
    ? typeDisplayConfig
    : typeDisplayConfig.filter(t => allowedTypes.includes(t.key as TransactionType))

  const cardsWithUniqueIds = cardsList.map((card, i) => ({ ...card, uniqueId: `${card.cardNumber}-${card.bank}-${i}` }))

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn">
      <div className="flex gap-6 w-full max-w-7xl justify-center transition-all duration-500">
        
        {/* Modal principal */}
        <div className={`bg-gradient-to-br from-[#1E1F24] to-[#2A2B32] text-white rounded-3xl shadow-2xl max-h-[90vh] overflow-auto relative border border-gray-700/50
          ${showDetailsPanel && !isMobile ? 'w-full max-w-md lg:max-w-lg xl:max-w-xl' : 'w-full max-w-2xl'} transition-all duration-500`}>
          
          {/* Header */}
          <div className={`bg-gradient-to-r ${typeColors[type]} p-6 rounded-t-3xl sticky top-0 z-10`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">{typeIcons[type]}</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{typeLabels[type]}</h2>
                  <p className="text-white/80 text-sm">
                    {type === 'income' ? 'Adicione uma nova entrada de dinheiro' :
                     type === 'expense' ? 'Registre uma despesa do dia a dia' :
                     type === 'fixedExpense' ? 'Cadastre uma despesa recorrente' :
                     'Defina um novo objetivo financeiro'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm">
                <X size={22} className="text-white" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Tabs de tipo */}
            {availableTypes.length > 1 && (
              <div className="flex bg-gray-800/50 rounded-2xl p-1 mb-8 backdrop-blur-sm">
                {availableTypes.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => handleTypeChange(key as TransactionType)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 flex-1 justify-center text-center ${
                      type === key
                        ? `bg-gradient-to-r ${typeColors[key]} text-white shadow-lg scale-105`
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >{icon}{label}</button>
                ))}
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={e => { e.preventDefault(); handleSubmit(onClose) }} className="space-y-6">
              <TransactionForm
                type={type} formData={formData} handleChange={handleChange}
                rawAmount={rawAmount} rawGoalValue={rawGoalValue}
                handleAmountChange={handleAmountChange} handleGoalValueChange={handleGoalValueChange}
                cfg={cfg} selectedCard={selectedCard} setSelectedCard={setSelectedCard}
                cardsWithUniqueIds={cardsWithUniqueIds} installments={installments} setInstallments={setInstallments}
                subscriptionType={subscriptionType} setSubscriptionType={setSubscriptionType}
              />

              {/* Botões */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-700/50">
                <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 backdrop-blur-sm">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className={`px-6 py-3 rounded-xl bg-gradient-to-r ${typeColors[type]} hover:shadow-lg text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}>
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Salvando...</>
                  ) : (
                    <><DollarSign size={16} />Salvar {type === 'income' ? 'Receita' : type === 'goal' ? 'Meta' : 'Despesa'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Painel de detalhes */}
        {showDetailsPanel && (
          <TransactionDetailsPanel
            type={type} formData={formData} selectedCard={selectedCard} installments={installments}
            rawAmount={rawAmount} rawGoalValue={rawGoalValue} formatCurrencyForDisplay={formatCurrencyForDisplay}
            usedCredit={usedCredit} creditLimit={creditLimit} isMobile={isMobile} setShowDetailsPanel={setShowDetailsPanel}
            cfg={cfg}
          />
        )}
      </div>

      {/* Modal de cartão */}
      <AddCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onSubmit={async cardData => {
          const createdCard = await handleAddCard(cardData)
          if (createdCard) { setSelectedCard(createdCard); setIsCardModalOpen(false) }
        }}
      />
    </div>
  )
}
