"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "../useAuth"
import { createTransaction } from "../../services/createTransaction"
import { Book, CreditCard, DollarSign, Film, Gift, HeartHandshake, Home, Smartphone, Target, TrendingUp, Wallet, Wifi, Zap } from 'lucide-react';
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export interface CardData {
  bank: string
  color: string
  cardName: string
  brand: string
  cardNumber: string
  interestRate: number
  creditLimit: number
  createdAt: string
  usedCredit: number
  billingDay: number
}

export type TransactionType = "balance" | "expense" | "fixedExpense" | "goal" | "income" 

export function useAddTransaction(defaultType: TransactionType) {
  const { user } = useAuth()
  const [type, setType] = useState<TransactionType>(defaultType)
  const [loading, setLoading] = useState(false)
  const [rawAmount, setRawAmount] = useState("")
  const [rawGoalValue, setRawGoalValue] = useState("")
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null)
  const [installments, setInstallments] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    date: null as Date | null,
    source: "",
    goalDeadline: null as Date | null,
    card: "",
    installments: 1,
    subscriptionType: "",
    recurrence: "monthly",
    nextPaymentDate: null as Date | null, 
  })

  const handleChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleAmountChange = useCallback((value: string | number) => {
    const strValue = String(value ?? "") 
    setRawAmount(strValue.replace(/\D/g, ""))
  }, [])

  const handleGoalValueChange = useCallback((value: string | number) => {
    const strValue = String(value ?? "")
    setRawGoalValue(strValue.replace(/\D/g, ""))
  }, [])

  useEffect(() => {
    if (selectedCard) {
      console.log("Cartão selecionado:", selectedCard)
      setFormData(prev => ({ ...prev, card: selectedCard.cardNumber, installments }))
    }
  }, [selectedCard, installments])

  useEffect(() => {
    setType(defaultType)
    setFormData({
      name: "",
      category: "",
      date: null,
      source: "",
      goalDeadline: null,
      card: "",
      subscriptionType: "",
      installments: 1,
      recurrence: "",
      nextPaymentDate: null, 
    })
    setRawAmount("")
    setRawGoalValue("")
  }, [defaultType])

  const formatCurrencyForDisplay = (value: number | string) => {
    const num = typeof value === "string"
      ? Number(value.toString().replace(/[^0-9.-]+/g,"")) / 100
      : value
    return num.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
  }

  const handleSubmit = useCallback(async (onClose: () => void) => {
    if (!user?.uid) return

    setLoading(true)

    try {
      const baseData: any = {
        userId: user.uid,
        date: formData.date?.toISOString() || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        type,
      }

      if (type === "income") {
        baseData.title = formData.source || "Receita"
        baseData.amount = Number(rawAmount) / 100
        baseData.category = formData.category || ""
        baseData.source = formData.source || "Outro" 
      }

      if (type === "expense") {
        baseData.title = formData.name || "Despesa"
        baseData.amount = Number(rawAmount) / 100
        baseData.category = formData.category || ""
        baseData.card = formData.card || ""
        baseData.installments = formData.installments || 1
      }

      if (type === "fixedExpense") {
        baseData.title = formData.name || "Assinatura"
        baseData.amount = Number(rawAmount) / 100

        baseData.category = formData.category || "Outro"

        baseData.subscriptionType = formData.subscriptionType || "mensal"

        baseData.recurrence = formData.recurrence || "monthly"

        const today = formData.date ? new Date(formData.date) : new Date()
        const nextDate = new Date(today)

        if (formData.recurrence === "daily") {
          nextDate.setDate(today.getDate() + 1)
        } else if (formData.recurrence === "weekly") {
          nextDate.setDate(today.getDate() + 7)
        } else {
          nextDate.setMonth(today.getMonth() + 1)
        }

        baseData.startDate = today.toISOString()
        baseData.nextPaymentDate = nextDate.toISOString()
      }

     if (type === "goal") {
        baseData.goalName = formData.name || "Meta"
        baseData.goalValue = Number(rawGoalValue) / 100
        baseData.goalDeadline = formData.goalDeadline?.toISOString() || null
      }

      await createTransaction(type, baseData)
      if (type === "expense" && formData.card) {
        const amount = Number(rawAmount) / 100
        const cardRef = doc(db, "users", user.uid, "cards", formData.card)
        const cardSnap = await getDoc(cardRef)

        if (!cardSnap.exists()) {
          toast.error("Cartão não encontrado.")
          return
        }

        const cardData = cardSnap.data()
        const creditLimit = cardData.creditLimit || 0
        const usedCredit = cardData.usedCredit || 0
        const availableLimit = creditLimit - usedCredit

        if (amount > availableLimit) {
          toast.error(
            `Limite insuficiente! Você só tem R$ ${availableLimit.toFixed(2)} disponíveis.`,
            { position: "top-right" }
          )
          setLoading(false)
          return
        }

        await updateUsedCredit(user.uid, formData.card, amount)
      }

      resetForm()
      onClose()
    } catch (err) {
      console.error("Erro ao salvar:", err)
    } finally {
      setLoading(false)
    }
  }, [user?.uid, type, formData, rawAmount, rawGoalValue])

  const updateUsedCredit = async (userId: string, cardId: string, amount: number) => {
    try {
      const cardRef = doc(db, "users", userId, "cards", cardId)
      const cardSnap = await getDoc(cardRef)

      if (!cardSnap.exists()) {
        console.warn("Cartão não encontrado com ID:", cardId)
        return
      }

      const cardData = cardSnap.data()
      const newUsedCredit = (cardData.usedCredit || 0) + amount

      await updateDoc(cardRef, { usedCredit: newUsedCredit })
      console.log(" Crédito usado atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar o crédito usado:", error)
    }
  }

  useEffect(() => {
    setType(defaultType)
    resetForm() 
  }, [defaultType])

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      date: null,
      source: "",
      goalDeadline: null,
      card: "",
      subscriptionType: "", 
      installments: 1,
      recurrence: "",
      nextPaymentDate: null, 
    })
    setRawAmount("")
    setRawGoalValue("")
    setSelectedCard(null) 
    setInstallments(1) 
  }
   
 const incomeSources = [
    { id: "income-0", name: "Salario", icon: <TrendingUp size={20} /> },
    { id: "income-1", name: "Freelance", icon: <TrendingUp size={20} /> },
    { id: "income-2", name: "Vendas", icon: <Gift size={20} /> },
    { id: "income-3", name: "Negócios", icon: <Zap size={20} /> },
    { id: "income-4", name: "Investimentos", icon: <TrendingUp size={20} /> },
    { id: "income-5", name: "Outros", icon: <DollarSign size={20} /> },
  ]

  const expenseCategories = [
    { id: "expense-1", name: "Alimentação", icon: <Gift size={20} /> },
    { id: "expense-2", name: "Supermercado", icon: <Gift size={20} /> },
    { id: "expense-3", name: "Compras", icon: <Gift size={20} /> },
    { id: "expense-4", name: "Transporte", icon: <CreditCard size={20} /> },
    { id: "expense-5", name: "Moradia", icon: <Book size={20} /> },
    { id: "expense-6", name: "Lazer", icon: <Film size={20} /> },
    { id: "expense-7", name: "Games", icon: <Film size={20} /> },
    { id: "expense-8", name: "Saúde", icon: <Gift size={20} /> },
    { id: "expense-9", name: "Educação", icon: <Book size={20} /> },
    { id: "expense-10", name: "Outros", icon: <DollarSign size={20} /> },
  ]

  const recurringTypes = [
    { id: "sub-1", name: "Assinaturas", icon: <Film size={20} /> },
    { id: "sub-2", name: "Cursos", icon: <Book size={20} /> },
    { id: "sub-3", name: "Telefone", icon: <Smartphone size={20} /> },
    { id: "sub-4", name: "Internet", icon: <Wifi size={20} /> },
    { id: "sub-5", name: "Pensão", icon: <HeartHandshake size={20} /> },
    { id: "sub-6", name: "Financiamento", icon: <Home size={20} /> },
    { id: "sub-7", name: "Outros", icon: <DollarSign size={20} /> },
  ]

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

  const typeDisplayConfig = [
    { key: "income", label: "Receita", icon: <TrendingUp size={16} /> },
    { key: "expense", label: "Despesa", icon: <Wallet size={16} /> },
    { key: "fixedExpense", label: "Fixa", icon: <CreditCard size={16} /> },
    { key: "goal", label: "Meta", icon: <Target size={16} /> },
  ]

  const fieldConfig = {
    income: {
      label1: "Origem do dinheiro",
      key1: "source",
      titleKey: "source",
      categoryKey: "category",
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
      key1: "title",
      titleKey: "name",
      categoryKey: "category",
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
      key1: "name",
      titleKey: "title",
      categoryKey: "category",
      icon1: <CreditCard size={20} />,
      label2: "Valor Mensal",
      key2: "amount",
      dateKey: "date",
      selectLabel: "Tipo de Assinatura",
      selectOptions: recurringTypes,
      placeholder: "Selecione o tipo",
    },
    goal: {
      label1: "Nome da Meta",
      key1: "name",
      titleKey: "name",
      icon1: <Target size={20} />,
      label2: "Valor da Meta",
      key2: "goalValue",
      dateKey: "goalDeadline",
      selectLabel: null,
      selectOptions: [],
      placeholder: "",
    },
  }

  return {
    // lógica
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

    // exporta dados estáticos
    incomeSources,
    expenseCategories,
    recurringTypes,
    typeIcons,
    typeLabels,
    typeColors,
    typeDisplayConfig,
    fieldConfig,
  }
}