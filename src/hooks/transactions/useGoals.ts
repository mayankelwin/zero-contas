import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { useAuth } from "@/src/context/AuthContext"

export function useGoals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<any[]>([])
  const [favoriteGoal, setFavoriteGoal] = useState<any>(null)
  const [saldoMetas, setSaldoMetas] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const goalsQuery = query(collection(db, "users", user.uid, "goals"))
    const unsubscribeGoals = onSnapshot(goalsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setGoals(data)
      setLoading(false)
    })

    return () => unsubscribeGoals()
  }, [user])

  useEffect(() => {
    if (!user) return

    const favoriteQuery = query(
      collection(db, "users", user.uid, "goals"),
      where("isPriority", "==", true)
    )

    const unsubscribeFavorite = onSnapshot(favoriteQuery, (snapshot) => {
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
        setFavoriteGoal(null)
        setSaldoMetas(0)
      }
    })

    return () => unsubscribeFavorite()
  }, [user])

  return {
    goals,
    favoriteGoal,
    saldoMetas,
    loading
  }
}
