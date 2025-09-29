import { addDoc, updateDoc, doc, collection, Query, getDocs, QuerySnapshot, DocumentData } from "firebase/firestore"
import { db } from "./firebase"

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

export async function getAllTransactionsByType(userId: string): Promise<AllTransactions> {
  try {
    const q = collection(db, "transactions")
    const snapshot = await getDocs(q)

    const allData = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) => item.userId === userId)

    const transactions: TransactionData[] = []
    const subscriptions: SubscriptionItem[] = []
    const goals: TransactionData[] = []

    allData.forEach((item: any) => {
      switch (item.type) {
        case "income":
        case "expense":
          transactions.push({
            type: item.type,
            userId: item.userId,
            amount: item.amount,
            category: item.category,
            date: item.createdAt?.toDate ? item.createdAt.toDate().toISOString() : item.createdAt,
          })
          break
        case "subscription":
          subscriptions.push({
            id: item.id,
            name: item.subscriptionName,
            value: item.amount,
            subscriptionType: item.subscriptionType,
            nextBilling: item.createdAt?.toDate ? item.createdAt.toDate().toISOString() : item.createdAt,
          })
          break
        case "goal":
          goals.push({
            type: "goal",
            userId: item.userId,
            goalName: item.goalName,
            goalValue: item.goalValue,
            goalDeadline: item.goalDeadline?.toDate ? item.goalDeadline.toDate().toISOString() : item.goalDeadline,
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

/* --- Funções já existentes --- */
export async function saveTransactionItem(query: Query, item: TransactionItem) {
  const payload = { title: item.title, amount: item.value, type: item.type, date: item.date }
  if (item.id) {
    const docRef = doc(db, query.path, item.id)
    await updateDoc(docRef, payload)
  } else {
    await addDoc(query, payload)
  }
}

export async function saveSubscriptionItem(query: Query, item: SubscriptionItem) {
  const payload = { name: item.name, value: item.value, subscriptionType: item.subscriptionType, nextBilling: item.nextBilling }
  if (item.id) {
    const docRef = doc(db, query.path, item.id)
    await updateDoc(docRef, payload)
  } else {
    await addDoc(query, payload)
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
      payload.type = "expense"
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

/* --- NOVA FUNÇÃO: BUSCAR TODOS OS DADOS --- */
export async function getAllTransactions(userId: string) {
  try {
    const q = collection(db, "transactions")
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(q)

    const allData = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) => item.userId === userId) // filtra pelo usuário se necessário

    return allData
  } catch (err) {
    console.error("Erro ao buscar todas as transações:", err)
    return []
  }
}
