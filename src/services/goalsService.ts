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
  const validAmount = Math.abs(amount)
  let newSavedAmount = goal.savedAmount

  if (type === "Add") {
    newSavedAmount += validAmount
    await addDoc(collection(db, "transactions"), {
      userId,
      type: useSaldo ? "expense" : "goalIncome",
      amount: validAmount,
      title: `Adição à meta "${goal.goalName}"`,
      date: new Date().toISOString(),
    })
  } else if (type === "Remove") {
    newSavedAmount = Math.max(0, newSavedAmount - validAmount)
    await addDoc(collection(db, "transactions"), {
      userId,
      type: "income",
      amount: validAmount,
      title: `Retirada da meta "${goal.goalName}"`,
      date: new Date().toISOString(),
    })
  }

  await updateDoc(goalRef, { savedAmount: newSavedAmount })
}
