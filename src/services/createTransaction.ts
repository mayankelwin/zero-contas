import { db } from "@/src/lib/firebase"
import { addDoc, collection, DocumentReference } from "firebase/firestore"

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

function validateData(type: TransactionKind, data: TransactionData) {
  if (!data.userId) throw new Error("userId é obrigatório")
  if (["balance", "income", "expense", "fixedExpense"].includes(type) && (data.amount === undefined || data.amount === null)) {
    throw new Error("amount é obrigatório para esse tipo de transação")
  }

  switch (type) {
    case "balance":
    case "income":
      if (!("source" in data)) throw new Error("source é obrigatório para balance/income")
      break
    case "expense":
      if (!("category" in data)) throw new Error("category é obrigatório para expense")
      break
    case "fixedExpense":
      if (!("subscriptionType" in data)) throw new Error("subscriptionType é obrigatório para fixedExpense")
      break
    case "goal":
      if (!("goalName" in data) || !("goalValue" in data)) throw new Error("goalName e goalValue são obrigatórios para goal")
      break
  }
}

export async function createTransaction(type: TransactionKind, formData: TransactionData): Promise<DocumentReference> {
  validateData(type, formData)

  const { userId } = formData
  const base = {
    createdAt: new Date().toISOString(),
    userId,
  }

  const userTransactionsRef = (sub: string) => collection(db, "users", userId, sub)

  switch (type) {
    case "balance":
      return addDoc(userTransactionsRef("transactions"), {
        ...base,
        type: "balance",
        title: formData.title,
        amount: formData.amount,
        source: (formData as BalanceData).source,
        category: "Salario",
        date: formData.date,
      })

    case "income":
      return addDoc(userTransactionsRef("transactions"), {
        ...base,
        type: "income",
        title: formData.title,
        amount: formData.amount,
        source: (formData as IncomeData).source,
        category: (formData as any).category,
        date: formData.date,
      })

    case "expense":
      return addDoc(userTransactionsRef("transactions"), {
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
      return addDoc(userTransactionsRef("transactions"), {
        ...base,
        type: "fixedExpense",
        title: formData.title,
        amount: formData.amount,
        subscriptionType: (formData as FixedExpenseData).subscriptionType,
        date: formData.date,
      })

    case "goal":
      return addDoc(userTransactionsRef("goals"), {
        ...base,
        goalName: (formData as GoalData).goalName,
        goalValue: (formData as GoalData).goalValue,
        goalDeadline: (formData as GoalData).goalDeadline,
      })

    default:
      throw new Error(`Tipo de transação inválido: ${type}`)
  }
}
