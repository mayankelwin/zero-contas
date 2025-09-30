import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { useAuth } from "@/src/context/AuthContext"

export function useTransactionsByType(type: string) {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, "users", user.uid, "transactions"),
      where("type", "==", type)
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setTransactions(data)
      setLoading(false)
    })

    return () => unsub()
  }, [user, type])

  return { transactions, loading }
}
