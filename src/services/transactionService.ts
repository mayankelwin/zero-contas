import { db } from "@/src/lib/firebase"
import { addDoc, collection } from "firebase/firestore"

export type TransactionKind = "balance" | "income" | "expense" | "fixedExpense" | "goal"

interface CommonData {
  userId: string
  title?: string
  amount?: number
  date?: string
}

interface BalanceData extends CommonData {
  source: string
}

interface IncomeData extends CommonData {
  source: string
}

interface ExpenseData extends CommonData {
  category: string
  card?: string
  installments?: number
}

interface FixedExpenseData extends CommonData {
  subscriptionType: string
}

interface GoalData extends CommonData {
  goalName: string
  goalValue: number
  goalDeadline: string | null
}

type TransactionData = BalanceData | ExpenseData | FixedExpenseData | GoalData | IncomeData

export async function createTransaction(type: TransactionKind, formData: TransactionData) {
  const base = {
    userId: formData.userId,
    createdAt: new Date().toISOString(),
  }

  switch (type) {
    case "balance":
      return addDoc(collection(db, "transactions"), {
        ...base,
        type: "balance",
        title: formData.title,
        amount: formData.amount,
        category: (formData as ExpenseData).category,
        source: (formData as BalanceData).source,
        date: formData.date,
      })

    case "income":
      return addDoc(collection(db, "transactions"), {
        ...base,
        type: "income",
        title: formData.title,
        amount: formData.amount,
        category: (formData as ExpenseData).category,
        source: (formData as IncomeData).source,
        date: formData.date,
      })

    case "expense":
      return addDoc(collection(db, "transactions"), {
        ...base,
        type: "expense",
        title: formData.title,
        amount: formData.amount,
        category: (formData as ExpenseData).category,
        card: (formData as ExpenseData).card,
        installments: (formData as ExpenseData).installments,
        date: formData.date,
      })

    case "fixedExpense":
      return addDoc(collection(db, "transactions"), {
        ...base,
        type: "fixedExpense",
        title: formData.title,
        amount: formData.amount,
        subscriptionType: (formData as FixedExpenseData).subscriptionType,
        date: formData.date,
      })

    case "goal":
      return addDoc(collection(db, "goals"), {
        ...base,
        goalName: (formData as GoalData).goalName,
        goalValue: (formData as GoalData).goalValue,
        goalDeadline: (formData as GoalData).goalDeadline,
      })

    default:
      throw new Error(`Tipo de transação inválido: ${type}`)
  }
}
