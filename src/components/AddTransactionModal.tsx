"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../lib/firebase"
import { X, DollarSign, CreditCard, Gift, Book, Film, Smartphone, Wifi, Target } from "lucide-react"
import { Input } from "./Input"
import { Select } from "./Select"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  defaultType: "income" | "expense" | "subscription" | "goal"
}

const incomeCategories = [
  { name: "Salário", icon: <DollarSign size={20} /> },
  { name: "Freelance", icon: <CreditCard size={20} /> },
  { name: "Investimentos", icon: <Gift size={20} /> },
  { name: "Presente", icon: <Gift size={20} /> },
  { name: "Outros", icon: <DollarSign size={20} /> },
]

const expenseCategories = [
  { name: "Alimentação", icon: <Gift size={20} /> },
  { name: "Transporte", icon: <CreditCard size={20} /> },
  { name: "Moradia", icon: <Book size={20} /> },
  { name: "Lazer", icon: <Film size={20} /> },
  { name: "Saúde", icon: <Gift size={20} /> },
  { name: "Educação", icon: <Book size={20} /> },
  { name: "Outros", icon: <DollarSign size={20} /> },
]

const subscriptionTypes = [
  { name: "Filmes Streaming", icon: <Film size={20} /> },
  { name: "Cursos", icon: <Book size={20} /> },
  { name: "Telefone", icon: <Smartphone size={20} /> },
  { name: "Internet", icon: <Wifi size={20} /> },
  { name: "Outros", icon: <DollarSign size={20} /> },
]

export default function AddTransactionModal({ isOpen, onClose, defaultType }: AddTransactionModalProps) {
  const { user } = useAuth()
  const [type, setType] = useState(defaultType)
  const [loading, setLoading] = useState(false)
  const [rawAmount, setRawAmount] = useState("")  
  const [rawGoalValue, setRawGoalValue] = useState("")

  const [formData, setFormData] = useState({
    transactionName: "",
    amount: "",
    category: "",
    date: "",
    subscriptionName: "",
    subscriptionType: "",
    goalName: "",
    goalValue: "",
    goalDeadline: "",
  })

  useEffect(() => {
    setType(defaultType)
    setFormData({
      transactionName: "",
      amount: "",
      category: "",
      date: "",
      subscriptionName: "",
      subscriptionType: "",
      goalName: "",
      goalValue: "",
      goalDeadline: "",
    })
  }, [defaultType])
  const handleAmountChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "")
    setRawAmount(onlyNumbers)
    setFormData(prev => ({ ...prev, amount: onlyNumbers }))
  }

  const handleGoalValueChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "")
    setRawGoalValue(onlyNumbers)
    setFormData(prev => ({ ...prev, goalValue: onlyNumbers }))
  }

  const formatCurrencyForDisplay = (value: string) => {
    if (!value) return ""
    return (Number(value) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }
    const handleChange = (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!user) return

  setLoading(true)
  try {
    let data: any = { userId: user.uid }

   switch (type) {
      case "income":
      case "expense":
        data = {
          ...data,
          title: formData.transactionName,
          amount: Number(rawAmount) / 100,
          type,
          category: formData.category,
          date: formData.date ? formData.date : new Date().toISOString()
        }
        await addDoc(collection(db, "transactions"), data)
        break

      case "subscription":
        data = {
          ...data,
          title: formData.subscriptionName,
          value: Number(rawAmount) / 100,
          type: "subscription", // 🔹 tipo próprio
          subscriptionType: formData.subscriptionType,
          category: formData.subscriptionType,
          date: formData.date ? formData.date : new Date().toISOString()
        }
        await addDoc(collection(db, "subscriptions"), data)
        break

        case "goal":
          data = {
            ...data,
            goalName: formData.goalName,
            goalValue: Number(rawGoalValue) / 100,
            goalDeadline: formData.goalDeadline ? new Date(formData.goalDeadline).toISOString() : null,
          }
          await addDoc(collection(db, "goals"), data)
          break
      }
        onClose()
      } catch (err) {
        console.error("Erro ao salvar:", err)
      } finally {
        setLoading(false)
      }
    }


  if (!isOpen) return null

  const categories = type === "income" ? incomeCategories : expenseCategories
  const formattedAmount = formData.amount ? parseFloat(formData.amount).toFixed(2) : "0.00"

  return (
    <div className="fixed inset-0 bg-[#1E1F24]/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1E1F24] text-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto p-6 relative animate-slideUp">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700 transition">
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-center">{type === "income" ? "Receita" : type === "expense" ? "Despesa" : type === "subscription" ? "Assinatura" : "Meta"}</h2>

        {/* Type Selector Buttons */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {["income", "expense", "subscription", "goal"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t as any)}
              className={`px-5 py-2 rounded-full font-medium transition shadow-md ${
                type === t ? "bg-blue-600 text-white scale-105 shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {t === "income" ? "Receita" : t === "expense" ? "Despesa" : t === "subscription" ? "Assinatura" : "Meta"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Receita/Despesa */}
          {(type === "income" || type === "expense") && (
            <>
              <Input label="Nome" value={formData.transactionName} onChange={(v) => handleChange("transactionName", v)} required icon={<CreditCard />} />
              <Input
                label="Valor"
                type="text"
                value={formatCurrencyForDisplay(rawAmount)}
                onChange={(v) => handleAmountChange(v)}
                required
                icon={<DollarSign />}
              />
              <Select label="Categoria" value={formData.category} onChange={(v) => handleChange("category", v)} options={categories} placeholder="Selecione a categoria" />
              <Input label="Data" type="date" value={formData.date} onChange={(v) => handleChange("date", v)} required />
            </>
          )}

          {/* Assinatura */}
          {type === "subscription" && (
            <>
              <Input label="Nome da Assinatura" value={formData.subscriptionName} onChange={(v) => handleChange("subscriptionName", v)} required icon={<CreditCard />} />
              <Select label="Tipo de Assinatura" value={formData.subscriptionType} onChange={(v) => handleChange("subscriptionType", v)} options={subscriptionTypes} placeholder="Selecione o tipo" />
              <Input label="Valor Mensal" type="number" value={formData.amount} onChange={(v) => handleChange("amount", v)} required icon={<DollarSign />} />
              <Input label="Data da Assinatura" type="date" value={formData.date} onChange={(v) => handleChange("date", v)} required />
            </>
          )}

          {/* Meta */}
          {type === "goal" && (
            <>
              <Input label="Nome da Meta" value={formData.goalName} onChange={(v) => handleChange("goalName", v)} required icon={<Target />} />
              <Input
                label="Valor da Meta"
                type="text"
                value={formatCurrencyForDisplay(rawGoalValue)}
                onChange={(v) => handleGoalValueChange(v)}
                required
                icon={<DollarSign />}
              />
              <Input label="Prazo Final" type="date" value={formData.goalDeadline} onChange={(v) => handleChange("goalDeadline", v)} required />
            </>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl border border-gray-500 text-gray-300 hover:bg-gray-700 transition">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



