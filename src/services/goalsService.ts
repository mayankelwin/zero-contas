import { db } from "@/src/lib/firebase"
import { doc, updateDoc, addDoc, collection } from "firebase/firestore"
import { Goal } from "@/src/types/finance"

export async function updateGoalAmount(
  userId: string,
  goal: Goal,
  type: "Add" | "Remove",
  amount: number,
  useSaldo: boolean
) {
  const goalRef = doc(db, "goals", goal.id)
  let newSavedAmount = goal.savedAmount

  if (type === "Add") {
    newSavedAmount += amount
    await addDoc(collection(db, "transactions"), {
      userId,
      type: useSaldo ? "expense" : "goalIncome",
      amount,
      title: `Adição à meta "${goal.goalName}"`,
      date: new Date().toISOString(),
    })
  }

  if (type === "Remove") {
    newSavedAmount = Math.max(0, newSavedAmount - amount)
    await addDoc(collection(db, "transactions"), {
      userId,
      type: "income",
      amount,
      title: `Retirada da meta "${goal.goalName}"`,
      date: new Date().toISOString(),
    })
  }

  await updateDoc(goalRef, { savedAmount: newSavedAmount })
}
