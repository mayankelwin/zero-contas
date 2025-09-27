import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { Goal } from "@/src/types/finance"

export function useFavoriteGoal(userId?: string) {
  const [favoriteGoal, setFavoriteGoal] = useState<Goal | null>(null)

  useEffect(() => {
    if (!userId) return
    const q = query(
      collection(db, "goals"),
      where("userId", "==", userId),
      where("isPriority", "==", true)
    )

    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        const doc = snap.docs[0]
        const data = doc.data()
        setFavoriteGoal({
          id: doc.id,
          goalName: data.goalName,
          goalValue: Number(data.goalValue ?? 0),
          savedAmount: Number(data.savedAmount ?? 0),
        })
      } else {
        setFavoriteGoal(null)
      }
    })

    return () => unsub()
  }, [userId])

  return favoriteGoal
}
