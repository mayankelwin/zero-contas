import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { useAuth } from "@/src/context/AuthContext"

export function useCards() {
  const { user } = useAuth()
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const q = collection(db, "users", user.uid, "cards")
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setCards(data)
      setLoading(false)
    })

    return () => unsub()
  }, [user])

  return {
    cards,
    loading
  }
}
