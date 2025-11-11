import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/src/context/AuthContext"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { ArrowUpRight, Target, TrendingDown, Wallet } from "lucide-react"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { useIncomes } from "./useIncomes"
import { useExpenses } from "./useExpenses"
import { useFixedExpenses } from "./useFixedExpenses"

export function useInfosGeral() {
  const { user, loading } = useAuth()

  const [goals, setGoals] = useState(0)
  const [subcriptions, setSubcriptions] = useState(0)
  const [saldoMetas, setSaldoMetas] = useState(0)
  const [favoriteGoal, setFavoriteGoal] = useState<any>(null)
  const [cardsList, setCardsList] = useState<any[]>([])

  const { transactions: incomes } = useIncomes()
  const { transactions: expenses } = useExpenses()
  const { transactions: fixedExpenses } = useFixedExpenses()

  // Calcula total por tipo
  const summary = useMemo(() => {
    const income = incomes.reduce((acc, item) => acc + (item.amount || 0), 0)
    const expense = expenses.reduce((acc, item) => acc + (item.amount || 0), 0)
    const fixed = fixedExpenses.reduce((acc, item) => acc + (item.amount || 0), 0)
    const total = income - expense - fixed

    return {
      income,
      expenses: expense,
      fixedExpenses: fixed,
      total,
      previousMonth: { income: 0, expenses: 0, fixedExpenses: 0 }, 
    }
  }, [incomes, expenses, fixedExpenses])

  const calculatePercentageChange = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? "+100%" : "0%"
    const change = ((current - previous) / previous) * 100
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`
  }

  // 📊 Porcentagens
  const incomePercentage = calculatePercentageChange(summary.income, summary.previousMonth.income)
  const incomeChangeType = summary.income >= summary.previousMonth.income ? "positive" : "negative"
  const saldoPercentage = summary.income > 0
    ? `${((summary.total / summary.income) * 100).toFixed(1)}% da renda`
    : "0% da renda"
  const goalPercentage = favoriteGoal && favoriteGoal.goalValue > 0
    ? `${((saldoMetas / favoriteGoal.goalValue) * 100).toFixed(1)}% da meta`
    : "Sem meta"

  const InfosResume = [
    {
      label: "Saldo Total",
      value: summary.total,
      icon: Wallet,
      color: "text-blue-400",
      valueColor: "text-white",
      subtitle: "Disponível",
      change: saldoPercentage,
      changeType: "positive"
    },
    {
      label: "Receitas",
      value: summary.income,
      icon: ArrowUpRight,
      color: "text-green-400",
      valueColor: "text-green-400",
      subtitle: "Este mês",
      change: incomePercentage,
      changeType: incomeChangeType
    },
    {
      label: "Despesas Totais",
      value: summary.expenses + summary.fixedExpenses,
      icon: TrendingDown,
      color: "text-red-400",
      valueColor: "text-red-400",
      subtitle: "Este mês",
      change: `-${formatCurrency(summary.expenses + summary.fixedExpenses)}`,
      changeType: "negative"
    },
    {
      label: "Saldo Metas",
      value: saldoMetas,
      icon: Target,
      color: "text-purple-400",
      valueColor: "text-purple-400",
      subtitle: "Guardado",
      change: goalPercentage,
      changeType: "positive"
    }
  ]

  // Buscar metas e assinaturas
  useEffect(() => {
    if (!user) return

    const goalsQ = query(collection(db, "users", user.uid, "goals"))
    const unsubGoals = onSnapshot(goalsQ, snapshot => {
      setGoals(snapshot.docs.length)
    })

    const subQ = query(collection(db, "users", user.uid, "subscriptions"))
    const unsubSubs = onSnapshot(subQ, snapshot => {
      setSubcriptions(snapshot.docs.length)
    })

    return () => {
      unsubGoals()
      unsubSubs()
    }
  }, [user])

  // Buscar meta favorita
  useEffect(() => {
    if (!user) return

    const favoriteQuery = query(
      collection(db, "users", user.uid, "goals"),
      where("isPriority", "==", true)
    )
    const unsubscribeFavorite = onSnapshot(favoriteQuery, snapshot => {
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0]
        const data = docSnap.data()
        const savedAmount = Number(data.savedAmount ?? 0)
        setFavoriteGoal({
          id: docSnap.id,
          goalName: data.goalName,
          goalValue: Number(data.goalValue ?? 0),
          savedAmount,
        })
        setSaldoMetas(savedAmount)
      } else {
        // Se não há favorita, pega a primeira disponível
        const allGoalsQuery = query(collection(db, "users", user.uid, "goals"))
        const unsubscribeAllGoals = onSnapshot(allGoalsQuery, allSnapshot => {
          if (!allSnapshot.empty) {
            const docSnap = allSnapshot.docs[0]
            const data = docSnap.data()
            const savedAmount = Number(data.savedAmount ?? 0)
            setFavoriteGoal({
              id: docSnap.id,
              goalName: data.goalName,
              goalValue: Number(data.goalValue ?? 0),
              savedAmount,
            })
            setSaldoMetas(savedAmount)
          } else {
            setFavoriteGoal(null)
            setSaldoMetas(0)
          }
        })
        return () => unsubscribeAllGoals()
      }
    })

    return () => unsubscribeFavorite()
  }, [user])

  // Buscar cartões
  useEffect(() => {
    if (!user) return
    const q = collection(db, "users", user.uid, "cards")
    const unsub = onSnapshot(q, snap => {
      setCardsList(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [user])

  return {
    user,
    loading,
    balance: summary.total,
    expanse: summary.expenses,
    expensefixes: summary.fixedExpenses,
    goals,
    subcriptions,
    InfosResume,
    summary,
    saldoMetas,
    favoriteGoal,
    cardsList
  }
}
