import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../lib/firebase"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  defaultType: "income" | "expense" | "subscription" | "goal"
}

const incomeCategories = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Presente",
  "Outros",
]

const expenseCategories = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Saúde",
  "Educação",
  "Outros",
]

const subscriptionTypes = [
  "Filmes Streaming",
  "Cursos",
  "Telefone",
  "Internet",
  "Outros",
]

export default function AddTransactionModal({ isOpen, onClose, defaultType }: AddTransactionModalProps) {
  const { user } = useAuth()

  // Tipo geral: income, expense, subscription ou goal
  const [type, setType] = useState<"income" | "expense" | "subscription" | "goal">(defaultType)

  // Campos comuns
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState("")

  // Campos assinaturas
  const [subscriptionName, setSubscriptionName] = useState("")
  const [subscriptionType, setSubscriptionType] = useState("")

  // Campos metas
  const [goalName, setGoalName] = useState("")
  const [goalValue, setGoalValue] = useState("")
  const [goalDeadline, setGoalDeadline] = useState("")

  // Resetar campos ao mudar tipo
  useEffect(() => {
    setType(defaultType)

    setAmount("")
    setCategory("")
    setDate("")

    setSubscriptionName("")
    setSubscriptionType("")

    setGoalName("")
    setGoalValue("")
    setGoalDeadline("")
  }, [defaultType])

  // Também limpa campos específicos ao mudar o tipo manualmente
  useEffect(() => {
    setAmount("")
    setCategory("")
    setDate("")

    setSubscriptionName("")
    setSubscriptionType("")

    setGoalName("")
    setGoalValue("")
    setGoalDeadline("")
  }, [type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    let data: any = {
      type,
      userId: user.uid,
      createdAt: new Date(),
    }

    switch (type) {
      case "income":
      case "expense":
        data = {
          ...data,
          amount: parseFloat(amount),
          category,
          createdAt: new Date(date),
        }
        break

      case "subscription":
        data = {
          ...data,
          subscriptionName,
          subscriptionType,
          amount: parseFloat(amount),
          createdAt: new Date(date),
        }
        break

      case "goal":
        data = {
          ...data,
          goalName,
          goalValue: parseFloat(goalValue),
          goalDeadline: new Date(goalDeadline),
        }
        break
    }

    await addDoc(collection(db, "transactions"), data)

    onClose()

    // Limpa tudo depois de salvar
    setAmount("")
    setCategory("")
    setDate("")
    setSubscriptionName("")
    setSubscriptionType("")
    setGoalName("")
    setGoalValue("")
    setGoalDeadline("")
  }

  if (!isOpen) return null

  const categories = type === "income" ? incomeCategories : expenseCategories

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {type === "income" && "Adicionar Receita"}
          {type === "expense" && "Adicionar Despesa"}
          {type === "subscription" && "Adicionar Assinatura"}
          {type === "goal" && "Adicionar Meta"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Seletor de tipo */}
          <div>
            <label htmlFor="type" className="block font-medium mb-1 text-gray-700">
              Tipo
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
              <option value="subscription">Assinatura</option>
              <option value="goal">Meta</option>
            </select>
          </div>

          {/* Campos específicos para receita e despesa */}
          {(type === "income" || type === "expense") && (
            <>
              <div>
                <label htmlFor="amount" className="block font-medium mb-1 text-black">
                  Valor
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 1000.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label htmlFor="category" className="block font-medium mb-1 text-black">
                  Categoria
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="" disabled>
                    Selecione a categoria
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block font-medium mb-1 text-black">
                  Data
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </>
          )}

          {/* Campos para assinatura */}
          {type === "subscription" && (
            <>
              <div>
                <label htmlFor="subscriptionName" className="block font-medium mb-1 text-black">
                  Nome da Assinatura
                </label>
                <input
                  id="subscriptionName"
                  type="text"
                  placeholder="Ex: Netflix"
                  value={subscriptionName}
                  onChange={(e) => setSubscriptionName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label htmlFor="subscriptionType" className="block font-medium mb-1 text-black">
                  Tipo de Assinatura
                </label>
                <select
                  id="subscriptionType"
                  value={subscriptionType}
                  onChange={(e) => setSubscriptionType(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="" disabled>
                    Selecione o tipo
                  </option>
                  {subscriptionTypes.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="amount" className="block font-medium mb-1 text-black">
                  Valor Mensal
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 29.90"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label htmlFor="date" className="block font-medium mb-1 text-black">
                  Data da Assinatura
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </>
          )}

          {/* Campos para metas */}
          {type === "goal" && (
            <>
              <div>
                <label htmlFor="goalName" className="block font-medium mb-1 text-black">
                  Nome da Meta
                </label>
                <input
                  id="goalName"
                  type="text"
                  placeholder="Ex: Comprar um carro"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label htmlFor="goalValue" className="block font-medium mb-1 text-black">
                  Valor da Meta
                </label>
                <input
                  id="goalValue"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 25000.00"
                  value={goalValue}
                  onChange={(e) => setGoalValue(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label htmlFor="goalDeadline" className="block font-medium mb-1 text-black">
                  Até Quando Deseja Realizar
                </label>
                <input
                  id="goalDeadline"
                  type="date"
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-gray-400 text-black hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
