'use client'

import { useState, FormEvent } from "react"
import { DollarSign, X } from "lucide-react"
import { Input } from "./Input"
import formatCurrency from "../data/formatCurrency"

interface AddAndRemoveModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FormData & { type: "Add" | "Remove" }) => void
}

interface FormData {
  amount: string
}

export default function AddRemoveModal({
  isOpen,
  onClose,
  onSubmit,
}: AddAndRemoveModalProps) {
  const [type, setType] = useState<"Add" | "Remove">("Add")
  const [formData, setFormData] = useState<FormData>({ amount: "" })
  const [rawAmount, setRawAmount] = useState("")

  if (!isOpen) return null

    const handleChange = (value: string) => {
    // remove tudo que não for número
    const onlyNumbers = value.replace(/\D/g, "")
    setRawAmount(onlyNumbers)
  }

  const formattedAmount = rawAmount
    ? (Number(rawAmount) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : "R$ 0,00"

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // aqui envia o valor correto em reais
    const amountNumber = Number(rawAmount) / 100
    onSubmit({ type, amount: amountNumber.toString() })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-[#1E1F24]/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1E1F24] text-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto p-6 relative animate-slideUp">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700 transition">
          <X size={24} />
        </button>

        {/* Dynamic Money Card */}
        <div className={`flex items-center justify-between p-4 rounded-xl mb-6 transition-all duration-300 ${type === "Add" ? "bg-green-600/20" : "bg-red-600/20"}`}>
          <div className="flex items-center gap-3">
            <DollarSign size={28} className={type === "Add" ? "text-green-500" : "text-red-500"} />
            <div>
              <p className="text-sm opacity-80">Total {type === "Add" ? "Receita" : "Despesa"}</p>
              <p className="text-2xl font-bold">{formData.amount ? formatCurrency(formData.amount) : "R$ 0,00"}</p>
            </div>
          </div>
          <div className="text-xs text-gray-300 opacity-80">Atualize o valor no campo abaixo</div>
        </div>

        {/* Type Selector Buttons */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {["Add", "Remove"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t as "Add" | "Remove")}
              className={`px-5 py-2 rounded-full font-medium transition shadow-md ${
                type === t ? "bg-blue-600 text-white scale-105 shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {t === "Add" ? "Adicionar" : "Remover"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Valor"
            type="text"
            value={formattedAmount}
            onChange={(v) => handleChange(v)}
            required
            icon={<DollarSign />}
          />

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
