'use client'

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './AuthContext'
import { CardItem } from '../types/transactions'

interface Summary {
  income: number
  expenses: number
  fixedExpenses: number
  savedAmount: number
  total: number
}

interface FinanceContextType {
  transactions: CardItem[]
  subscriptions: CardItem[]
  goals: any[]
  cards: any[]
  summary: Summary
  loading: {
    transactions: boolean
    subscriptions: boolean
    goals: boolean
    cards: boolean
  }
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<CardItem[]>([])
  const [subscriptions, setSubscriptions] = useState<CardItem[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [cards, setCards] = useState<any[]>([])
  
  const [loading, setLoading] = useState({
    transactions: true,
    subscriptions: true,
    goals: true,
    cards: true,
  })

  useEffect(() => {
    if (!user) {
      setTransactions([])
      setSubscriptions([])
      setGoals([])
      setCards([])
      setLoading({
        transactions: false,
        subscriptions: false,
        goals: false,
        cards: false,
      })
      return
    }

    setLoading({
      transactions: true,
      subscriptions: true,
      goals: true,
      cards: true,
    })

    const transactionsRef = collection(db, "users", user.uid, "transactions")
    const subscriptionsRef = collection(db, "users", user.uid, "subscriptions")
    const goalsRef = collection(db, "users", user.uid, "goals")
    const cardsRef = collection(db, "users", user.uid, "cards")

    const unsubscribeTransactions = onSnapshot(transactionsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CardItem))
      setTransactions(data)
      setLoading(prev => ({ ...prev, transactions: false }))
    })

    const unsubscribeSubscriptions = onSnapshot(subscriptionsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        type: 'fixedExpense' as const 
      } as CardItem))
      setSubscriptions(data)
      setLoading(prev => ({ ...prev, subscriptions: false }))
    })

    const unsubscribeGoals = onSnapshot(goalsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setGoals(data)
      setLoading(prev => ({ ...prev, goals: false }))
    })

    const unsubscribeCards = onSnapshot(cardsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCards(data)
      setLoading(prev => ({ ...prev, cards: false }))
    })

    return () => {
      unsubscribeTransactions()
      unsubscribeSubscriptions()
      unsubscribeGoals()
      unsubscribeCards()
    }
  }, [user])

  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + Number(t.amount ?? 0), 0)
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + Number(t.amount ?? 0), 0)
    
    const fixedExpenses = subscriptions
      .reduce((acc, s) => acc + Number(s.value ?? 0), 0)
    
    const savedAmount = goals
      .reduce((acc, g) => acc + Number(g.savedAmount ?? 0), 0)
    
    const total = Math.max(income - expenses - fixedExpenses, 0)

    return { income, expenses, fixedExpenses, savedAmount, total }
  }, [transactions, subscriptions, goals])

  const contextValue = useMemo(() => ({
    transactions,
    subscriptions,
    goals,
    cards,
    summary,
    loading
  }), [transactions, subscriptions, goals, cards, summary, loading])

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
