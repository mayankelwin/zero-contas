import { db } from "@/src/lib/firebase"
import { addDoc, updateDoc, deleteDoc, doc, collection } from "firebase/firestore"

export async function addCard(userId: string, data: any) {
  await addDoc(collection(db, "cards"), { ...data, userId, createdAt: new Date().toISOString() })
}

export async function updateCard(cardId: string, data: any) {
  await updateDoc(doc(db, "cards", cardId), { ...data, updatedAt: new Date().toISOString() })
}

export async function deleteCard(cardId: string) {
  await deleteDoc(doc(db, "cards", cardId))
}
