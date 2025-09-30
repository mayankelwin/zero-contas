"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useAuth } from "../hooks/useAuth"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"
import { createTransaction } from "../services/createTransaction"

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
    subscriptionType: "",
    goalDeadline: null as Date | null,
    card: "",
    installments: 1,
  })

  const handleChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleAmountChange = useCallback((value: string) => {
    setRawAmount(value.replace(/\D/g, ""))
  }, [])

  const handleGoalValueChange = useCallback((value: string) => {
    setRawGoalValue(value.replace(/\D/g, ""))
  }, [])

  useEffect(() => {
    if (selectedCard) {
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
      subscriptionType: "",
      goalDeadline: null,
      card: "",
      installments: 1,
    })
    setRawAmount("")
    setRawGoalValue("")
  }, [defaultType])

  const formatCurrencyForDisplay = useCallback((value: string) => {
    if (!value) return ""
    return (parseFloat(value) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }, [])

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
        baseData.subscriptionType = formData.subscriptionType || "Outro"
        baseData.category = formData.category || ""
      }

     if (type === "goal") {
        baseData.goalName = formData.name || "Meta"
        baseData.goalValue = Number(rawGoalValue) / 100
        baseData.goalDeadline = formData.goalDeadline?.toISOString() || null
      }

      await createTransaction(type, baseData)
      resetForm()
      onClose()
    } catch (err) {
      console.error("Erro ao salvar:", err)
    } finally {
      setLoading(false)
    }
  }, [user?.uid, type, formData, rawAmount, rawGoalValue])

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
      subscriptionType: "", 
      goalDeadline: null,
      card: "",
      installments: 1,
    })
    setRawAmount("")
    setRawGoalValue("")
    setSelectedCard(null) 
    setInstallments(1) 
  }
   
 const transactionValue = useMemo(() => ({
    type,
    setType,
    loading,
    rawAmount,
    rawGoalValue,
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
    resetForm,
  }), [
    type, loading, rawAmount, rawGoalValue, selectedCard, 
    installments, formData, handleChange, handleAmountChange, 
    handleGoalValueChange, formatCurrencyForDisplay, handleSubmit
  ])

  return transactionValue
}