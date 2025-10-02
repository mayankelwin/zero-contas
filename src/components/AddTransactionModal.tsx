"use client"

import { useState, useEffect } from "react"
import { X, DollarSign, CreditCard, Gift, Book, Film, Smartphone, Wifi, Target, TrendingUp, Zap, Calendar, Wallet, PiggyBank, Calculator, AlertTriangle, Info, ChevronLeft, LucideCreditCard } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import AddCardModal from "./AddCardModal"
import { useAddTransaction } from "../hooks/useAddTransaction"
import { useCreateCard } from "../services/createCard"
import { Input } from "./Input"

type TransactionType = "income" | "expense" | "fixedExpense" | "goal"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  defaultType: TransactionType
  allowedTypes?: TransactionType[] | "ALL_TYPES"
}

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
    formData,
    handleChange,
    handleAmountChange,
    handleGoalValueChange,
    formatCurrencyForDisplay,
    handleSubmit,
    resetForm,
    incomeSources,
    expenseCategories,
    subscriptionTypes,
    typeIcons,
    typeLabels,
    typeColors,
    typeDisplayConfig,
    fieldConfig,
  } = useAddTransaction(defaultType)
  
  const {
    cardsList,
    handleAddCard,
    selectedCard,
    installments,
    setInstallments,
    setSelectedCard,
    resetCardSelection,
  } = useCreateCard()

  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [showDetailsPanel, setShowDetailsPanel] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [subscriptionType, setSubscriptionType] = useState("mensal")

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleTypeChange = (newType: TransactionType) => {
    resetForm(); 
    setType(newType);
    setShowDetailsPanel(false);
    setSelectedCard(null);  
    setInstallments(1);      
    if(newType !== 'fixedExpense') setSubscriptionType("mensal");
  }

  useEffect(() => {
    if (isOpen) {
      resetForm()
      setShowDetailsPanel(false)
    }
  }, [isOpen, defaultType])

 useEffect(() => {
    if (selectedCard?.id) {
      handleChange("card", selectedCard.id)
    }
  }, [selectedCard])

  useEffect(() => {
    const hasRelevantInfo = 
      (type === "expense" && selectedCard && installments > 1 && rawAmount) ||
      (type === "goal" && rawGoalValue) ||
      (formData.title || formData.name || formData.source)
    
    setShowDetailsPanel(!!hasRelevantInfo)
  }, [type, selectedCard, installments, rawAmount, rawGoalValue, formData])

  if (!isOpen) return null

  const availableTypes = allowedTypes === "ALL_TYPES" 
    ? typeDisplayConfig 
    : typeDisplayConfig.filter(t => allowedTypes.includes(t.key as TransactionType))

  const cardsWithUniqueIds = cardsList.map((card, index) => ({
    ...card,
    uniqueId: `${card.cardNumber}-${card.bank}-${index}`
  }))

  const amountNumber = Number(rawAmount.toString().replace(/[^0-9.-]+/g,"")) || 0
  const numInstallments = installments > 0 ? installments : 1
  const monthlyInterestRate = selectedCard?.interestRate ? selectedCard.interestRate / 100 : 0

  function calculateTotalWithInterest(principal: number, months: number, monthlyRate: number) {
    if(monthlyRate === 0) return principal;
    return principal * (Math.pow(1 + monthlyRate, months));
  }

  // Valor da parcela sem juros
  const installmentValueWithoutInterest = amountNumber / numInstallments

  // Valor total com juros
  const totalWithInterest = calculateTotalWithInterest(amountNumber, numInstallments, monthlyInterestRate)
  const installmentValueWithInterest = totalWithInterest / numInstallments
  const interestPaid = totalWithInterest - amountNumber
  const installmentValue = selectedCard && selectedCard.interestRate > 0 
    ? installmentValueWithInterest 
    : installmentValueWithoutInterest


  const cfg = fieldConfig[type] ?? fieldConfig.income;


  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
      <div className={`
        flex gap-6 w-full max-w-7xl
        ${showDetailsPanel && !isMobile ? 'justify-center' : 'justify-center'}
        transition-all duration-500
      `}>
        
        {/* Modal Principal */}
        <div className={`
          bg-gradient-to-br from-[#1E1F24] to-[#2A2B32] text-white rounded-3xl shadow-2xl 
          max-h-[90vh] overflow-auto relative animate-slideUp border border-gray-700/50
          ${showDetailsPanel && !isMobile 
            ? 'w-full max-w-md lg:max-w-lg xl:max-w-xl translate-x-0' 
            : 'w-full max-w-2xl'
          }
          transition-all duration-500
        `}>
          {/* Header com gradiente */}
          <div className={`bg-gradient-to-r ${typeColors[type]} p-6 rounded-t-3xl sticky top-0 z-10`}>
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
            {/* Tabs condicionais - Só mostra se tiver mais de um tipo disponível */}
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
              <div className="space-y-8">

                {/* 🔹 Seção: Dados básicos */}
                <div className="grid gap-4">
                  {/* Input principal */}
                  <div className="space-y-2">
                    {cfg && (
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        {cfg.icon1}
                        {cfg.label1}
                      </label>
                    )}
                    <Input
                      type="text"
                      value={formData[cfg.titleKey] || ""}
                      placeholder={`Digite o ${cfg.label1.toLowerCase()}`}
                      onChange={(v) => handleChange(cfg.titleKey, v)} 
                      required
                      icon={cfg.icon1}
                    />

                    
                  </div>

                  {/* Categoria (select se existir) */}
                  {cfg.selectLabel && cfg.selectOptions?.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        {cfg.selectLabel}
                      </label>
                      <select
                        value={formData[cfg.categoryKey || cfg.key1]}
                        onChange={(e) => handleChange(cfg.categoryKey || cfg.key1, e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white 
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                  transition-all duration-300 backdrop-blur-sm appearance-none"
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
                </div>

                {/* 🔹 Seção: Valores */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <DollarSign size={20} />
                    {cfg.label2}
                  </label>
                  <Input
                    type="money"
                    value={type === "goal" ? rawGoalValue : rawAmount}
                    onChange={(v) => type === "goal" ? handleGoalValueChange(v) : handleAmountChange(v)}
                    placeholder={`Digite o ${cfg.label1.toLowerCase()}`}
                    required
                    icon={<DollarSign size={20} />}
                  />
                </div>

                {/* 🔹 Seção: Cartão e Parcelas */}
                {(type === "expense" || type === "fixedExpense") && (
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-300">💳 Cartão de Crédito</label>

                    <div className="flex gap-3">
                      <select
                        value={selectedCard?.uniqueId || ""}
                        onChange={(e) => {
                          const selected = cardsWithUniqueIds.find(c => c.uniqueId === e.target.value)
                          setSelectedCard(selected || null)
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white 
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                  transition-all duration-300 backdrop-blur-sm appearance-none"
                      >
                        <option value="">Selecione um cartão</option>
                        {cardsWithUniqueIds.map(card => (
                          <option key={card.uniqueId} value={card.uniqueId}>
                            {card.cardName} **** {card.cardNumber.slice(-4)} - {card.bank}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => setIsCardModalOpen(true)}
                        className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 
                                  hover:to-cyan-700 text-white rounded-xl transition-all duration-300 
                                  hover:scale-105 flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                      >
                        <CreditCard size={16} />
                        <span className="hidden sm:inline">Novo</span>
                      </button>
                    </div>

                    {selectedCard && (
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-300 flex-1">Parcelas</label>
                        <Input
                          type="number"
                          value={installments}
                          onChange={(v) => setInstallments(Number(v))}
                          placeholder="Número de parcelas"
                          allowNegative={false} 
                          required
                          icon={<LucideCreditCard size={20} />}
                        />
                      </div>
                    )}
                  </div>
                )}
                {/* 🔹 Seção: Datas + Assinatura */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Data */}
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
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white 
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                  transition-all duration-300 backdrop-blur-sm"
                        required
                      />
                    </div>

                    {/* Assinatura (somente fixedExpense) */}
                    {type === "fixedExpense" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Tipo de assinatura</label>
                          
                        <select
                          value={subscriptionType}
                          onChange={(e) => setSubscriptionType(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                    transition-all duration-300 backdrop-blur-sm appearance-none"
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
        </div>
        {/* Painel de Detalhes */}
        {showDetailsPanel && (
          <div className={`
             text-white rounded-3xl shadow-2xl 
            max-h-[90vh] overflow-auto relative border border-gray-700/50
            ${isMobile 
              ? 'w-full max-w-2xl mt-4 animate-slideUp' 
              : 'w-120 animate-slideInRight'
            }
            transition-all duration-500
          `}>
            <div className="p-6">
              {/* Header do painel de detalhes */}
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
                {isMobile && (
                  <button 
                    onClick={() => setShowDetailsPanel(false)}
                    className="p-2 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-300"
                  >
                    <ChevronLeft size={20} className="text-gray-400" />
                  </button>
                )}
              </div>
              {/* Conteúdo do painel de detalhes */}
              <div className="space-y-4">
                {/* Informações básicas */}
                {(type === "expense" || type === "fixedExpense") && (formData.title || formData.name || formData.source) && (
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-600/50">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Info size={16} className="text-blue-400" />
                      Informações
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {formData.title || formData.name || formData.source}
                    </p>
                    {formData[cfg.categoryKey || cfg.key1] && (
                      <p className="text-gray-300 text-xs mt-1">
                       {formData[cfg.categoryKey || cfg.key1]}
                      </p>
                    )}
                      <p className="text-gray-300 text-xs mt-1">
                       Valor:  <span className="text-white font-medium">{formatCurrencyForDisplay(rawAmount)}</span>
                      </p>
                        {type === "fixedExpense" &&(
                       <p className="text-gray-300 text-xs mt-1">
                       Tipo de assinatura:  <span className="text-white font-medium"></span>
                      </p>
                        )}
                  </div>
                )}
                {/* Detalhes de parcelamento */}
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
                        <span className="text-white font-medium">
                          {formatCurrencyForDisplay(installmentValueWithoutInterest)}
                        </span>
                      </div>

                      {selectedCard.interestRate > 0 && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Taxa de juros:</span>
                            <span className="text-yellow-400 font-medium">{selectedCard.interestRate}% a.m.</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-300">Juros totais:</span>
                            <span className="text-red-400 font-medium">
                              {formatCurrencyForDisplay(interestPaid)}
                            </span>
                          </div>

                          <div className="flex justify-between border-t border-gray-600 pt-2">
                            <span className="text-gray-300 font-semibold">Total com juros:</span>
                            <span className="text-white font-bold">
                              {formatCurrencyForDisplay(totalWithInterest)}
                            </span>
                          </div>

                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 mt-2">
                            <div className="flex items-center gap-2 text-yellow-400 text-xs">
                              <AlertTriangle size={12} />
                              <span>Parcelamento com juros do cartão</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {/* Detalhes de meta */}
                {type === "goal" && (formData.title || formData.name || formData.source) && (
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Target size={16} className="text-green-400" />
                      Meta Financeira
                    </h4>
                    
                    <div className="space-y-2 text-sm">
                        <p className="text-gray-300 text-sm">
                        {formData.title || formData.name || formData.source}
                      </p>
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
                {/* Aviso geral */}
                <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-600/30">
                  <div className="flex items-start gap-2">
                    <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-400 text-xs">
                      Revise os detalhes antes de confirmar a transação.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Modal de cartão */}
      <AddCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onSubmit={async (cardData) => {
          const createdCard = await handleAddCard(cardData)
          if (createdCard) {
            setSelectedCard(createdCard)
            setIsCardModalOpen(false)
          }
        }}
      />
    </div>
  )
}