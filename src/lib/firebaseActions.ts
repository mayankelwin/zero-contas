import { addDoc, updateDoc, doc, collection, query, where, getDocs, QuerySnapshot, DocumentData, Query } from "firebase/firestore"
import { db } from "./firebase"

/* Utilitário para extrair data */
function extractDate(dateField: any): string | undefined {
  if (!dateField) return undefined
  if (typeof dateField.toDate === "function") {
    return dateField.toDate().toISOString()
  }
  return typeof dateField === "string" ? dateField : undefined
}

/* Tipos principais */
export type TransactionType = "income" | "expense" | "subscription" | "goal"
export type SubscriptionType = "streaming" | "servico" | "outros"

/* Dados genéricos para salvar no Firebase */
export interface TransactionData {
  type: TransactionType
  userId: string
  amount?: number
  category?: string
  date?: string
  subscriptionName?: string
  subscriptionType?: SubscriptionType
  goalName?: string
  goalValue?: number
  goalDeadline?: string
}

/* Dados para edição/adição de transações simples */
export interface TransactionItem {
  id?: string
  title: string
  value: number
  type: TransactionType
  date: string
}

/* Dados para edição/adição de assinaturas */
export interface SubscriptionItem {
  id?: string
  name: string
  value: number
  subscriptionType: SubscriptionType
  nextBilling: string
}

export interface AllTransactions {
  transactions: TransactionData[]
  subscriptions: SubscriptionItem[]
  goals: TransactionData[]
}

/* Consulta filtrada no Firestore pelo userId */
export async function getAllTransactionsByType(userId: string): Promise<AllTransactions> {
  try {
    const q = query(collection(db, "transactions"), where("userId", "==", userId))
    const snapshot = await getDocs(q)

    const transactions: TransactionData[] = []
    const subscriptions: SubscriptionItem[] = []
    const goals: TransactionData[] = []

    snapshot.docs.forEach(docSnap => {
      const item = docSnap.data()
      switch (item.type) {
        case "income":
        case "expense":
          transactions.push({
            type: item.type,
            userId: item.userId,
            amount: item.amount,
            category: item.category,
            date: extractDate(item.createdAt),
          })
          break
        case "subscription":
          subscriptions.push({
            id: docSnap.id,
            name: item.subscriptionName,
            value: item.amount,
            subscriptionType: item.subscriptionType,
            nextBilling: extractDate(item.createdAt) || "",
          })
          break
        case "goal":
          goals.push({
            type: "goal",
            userId: item.userId,
            goalName: item.goalName,
            goalValue: item.goalValue,
            goalDeadline: extractDate(item.goalDeadline),
          })
          break
      }
    })

    return { transactions, subscriptions, goals }
  } catch (err) {
    console.error("Erro ao buscar todas as transações:", err)
    return { transactions: [], subscriptions: [], goals: [] }
  }
}

/* Salvar transação genérica */
export async function saveTransactionItem(collectionRef: ReturnType<typeof collection>, item: TransactionItem) {
  const payload = { title: item.title, amount: item.value, type: item.type, date: item.date }
  if (item.id) {
    const docRef = doc(collectionRef.path, item.id)
    await updateDoc(docRef, payload)
  } else {
    await addDoc(collectionRef, payload)
  }
}

export async function saveSubscriptionItem(collectionRef: ReturnType<typeof collection>, item: SubscriptionItem) {
  const payload = { name: item.name, value: item.value, subscriptionType: item.subscriptionType, nextBilling: item.nextBilling }
  if (item.id) {
    const docRef = doc(collectionRef.path, item.id)
    await updateDoc(docRef, payload)
  } else {
    await addDoc(collectionRef, payload)
  }
}

export async function saveTransactionFirebase(data: TransactionData) {
  const payload: any = { type: data.type, userId: data.userId, createdAt: new Date() }
  switch (data.type) {
    case "income":
    case "expense":
      payload.amount = Number(data.amount)
      payload.category = data.category
      if (data.date) payload.createdAt = new Date(data.date)
      break
    case "subscription":
      payload.type = "expense" // cuidado aqui, talvez queira manter "subscription"?
      payload.amount = Number(data.amount)
      payload.subscriptionName = data.subscriptionName
      payload.subscriptionType = data.subscriptionType
      if (data.date) payload.createdAt = new Date(data.date)
      break
    case "goal":
      payload.goalName = data.goalName
      payload.goalValue = Number(data.goalValue)
      if (data.goalDeadline) payload.goalDeadline = new Date(data.goalDeadline)
      break
  }
  return await addDoc(collection(db, "transactions"), payload)
}

/* Nova função para buscar todas as transações */
export async function getAllTransactions(userId: string) {
  try {
    const q = query(collection(db, "transactions"), where("userId", "==", userId))
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(q)

    const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return allData
  } catch (err) {
    console.error("Erro ao buscar todas as transações:", err)
    return []
  }
}
