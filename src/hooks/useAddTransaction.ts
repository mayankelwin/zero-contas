"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useAuth } from "../hooks/useAuth"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"
import { createTransaction } from "../services/transactionService"

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
  const [cards, setCards] = useState<CardData[]>([])
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
    if (!user?.uid) return 
    
    const fetchCards = async () => {
      try {
        const snapshot = await getDocs(collection(db, "cards"))
        setCards(snapshot.docs.map(doc => doc.data() as CardData))
      } catch (error) {
        console.error("Erro ao buscar cartões:", error)
      }
    }
    
    fetchCards()
  }, [user?.uid])

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
      await createTransaction(type, {
        userId: user.uid,
        title: type === "income" ? formData.source || "Receita" : formData.name || "Despesa",
        amount: Number(rawAmount) / 100,
        source: formData.source,
        category: formData.category,
        card: formData.card,
        installments: formData.installments,
        subscriptionType: formData.subscriptionType,
        goalName: formData.name,
        goalValue: Number(rawGoalValue) / 100,
        goalDeadline: formData.goalDeadline?.toISOString() || null,
        date: formData.date?.toISOString() || new Date().toISOString(),
      })
      onClose()
    } catch (err) {
      console.error("Erro ao salvar:", err)
    } finally {
      setLoading(false)
    }
  }, [user?.uid, type, formData, rawAmount, rawGoalValue])

  const transactionValue = useMemo(() => ({
    type,
    setType,
    loading,
    rawAmount,
    rawGoalValue,
    cards,
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
  }), [
    type, loading, rawAmount, rawGoalValue, cards, selectedCard, 
    installments, formData, handleChange, handleAmountChange, 
    handleGoalValueChange, formatCurrencyForDisplay, handleSubmit
  ])

  return transactionValue
}