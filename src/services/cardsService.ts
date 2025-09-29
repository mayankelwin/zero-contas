import { db } from "@/src/lib/firebase"
import { addDoc, updateDoc, deleteDoc, doc, collection, Timestamp } from "firebase/firestore"
export interface CardData {
  bank: string
  billingDay: number
  brand: string
  cardName: string
  cardNumber: string
  color: string
  creditLimit: number
  interestRate: number
  usedCredit: number
}

export async function addCard(userId: string, data: CardData) {
  try {
    await addDoc(collection(db, "cards"), {
      ...data,
      userId,
      createdAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("Erro ao adicionar cartão:", error)
    throw error
  }
}

export async function updateCard(cardId: string, data: Partial<CardData>) {
  try {
    await updateDoc(doc(db, "cards", cardId), {
      ...data,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("Erro ao atualizar cartão:", error)
    throw error
  }
}

export async function deleteCard(cardId: string) {
  try {
    await deleteDoc(doc(db, "cards", cardId))
  } catch (error) {
    console.error("Erro ao deletar cartão:", error)
    throw error
  }
}
