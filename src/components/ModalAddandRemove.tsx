import BaseModal from "./BaseModal"
import { Input } from "./Input"
import { DollarSign } from "lucide-react"
import { useForm } from "../hooks/useForm"
import { formatCurrency } from "../utils/formatCurrency"

interface AddAndRemoveModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  defaultType?: "income" | "expense"
}

export default function AddAndRemoveModal({
  isOpen,
  onClose,
  onSave,
  defaultType = "income",
}: AddAndRemoveModalProps) {
  const { formData, handleChange, resetForm } = useForm({
    transactionName: "",
    amount: "",
    transactionType: defaultType, 
    date: "",
  })

  const handleSubmit = () => {
    onSave(formData)
    resetForm()
    onClose()
  }

  function formatCurrencyForInput(value: string) {
    if (!value) return ""
    // Transforma em número e divide por 100 para centavos
    const numberValue = parseFloat(value) / 100
    return numberValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar Transação"
      onSubmit={handleSubmit}
    >
      {/* Selector de Adicionar / Retirar */}
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          className={`flex-1 px-5 py-2 rounded-xl font-semibold transition-all ${
            formData.transactionType === "income"
              ? "bg-green-600 text-white shadow-lg"
              : "bg-gray-600 text-gray-100 hover:bg-gray-500"
          }`}
          onClick={() => handleChange("transactionType", "income")}
        >
          Adicionar
        </button>
        <button
          type="button"
          className={`flex-1 px-5 py-2 rounded-xl font-semibold transition-all ${
            formData.transactionType === "expense"
              ? "bg-red-600 text-white shadow-lg"
              : "bg-gray-600 text-gray-100 hover:bg-gray-500"
          }`}
          onClick={() => handleChange("transactionType", "expense")}
        >
          Retirar
        </button>
      </div>

      <Input
        label="Valor"
        type="text"
        value={formData.amount ? formatCurrencyForInput(formData.amount) : ""}
         onChange={(v) => {
          const onlyNumbers = v.replace(/\D/g, "")
          handleChange("amount", onlyNumbers)
        }}
        required
        icon={<DollarSign />}
      />

      <Input
        label="Descrição"
        value={formData.transactionName}
        onChange={(v) => handleChange("transactionName", v)}
        required
        icon={null}
      />
    </BaseModal>
  )
}
