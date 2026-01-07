"use client"

import BaseModal from "./BaseModal"
import { Input } from "../ui/Input"
import { DollarSign, MessageSquare, ArrowUpCircle, ArrowDownCircle, CheckCircle2 } from "lucide-react"
import { useForm } from "@/src/hooks/useForm"

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
    date: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = () => {
    onSave(formData)
    resetForm()
    onClose()
  }

  function formatCurrencyForInput(value: string) {
    if (!value) return ""
    const numberValue = parseFloat(value) / 100
    return numberValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajuste de Meta"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-6 py-2">
        
        <div className="bg-white/[0.03] p-1.5 rounded-[1.25rem] border border-white/[0.05] flex relative overflow-hidden">
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.75rem)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-xl ${
              formData.transactionType === "income" 
                ? "left-1.5 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                : "left-[calc(50%+0.35rem)] bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
            }`}
          />
          
          <button
            type="button"
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
              formData.transactionType === "income" ? "text-white" : "text-gray-500 hover:text-gray-300"
            }`}
            onClick={() => handleChange("transactionType", "income")}
          >
            <ArrowUpCircle size={16} strokeWidth={2.5} />
            ADICIONAR
          </button>
          
          <button
            type="button"
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
              formData.transactionType === "expense" ? "text-white" : "text-gray-500 hover:text-gray-300"
            }`}
            onClick={() => handleChange("transactionType", "expense")}
          >
            <ArrowDownCircle size={16} strokeWidth={2.5} />
            RETIRAR
          </button>
        </div>

        <div className="relative group">
          <Input
            label="Quanto vamos movimentar?"
            type="text"
            value={formData.amount ? formatCurrencyForInput(formData.amount) : ""}
            onChange={(v) => {
              const onlyNumbers = v.replace(/\D/g, "")
              handleChange("amount", onlyNumbers)
            }}
            required
            icon={<DollarSign className={formData.transactionType === 'income' ? 'text-emerald-400' : 'text-red-400'} />}
          />
          <div className="h-[1px] w-full bg-white/10 group-focus-within:bg-gradient-to-r group-focus-within:from-transparent group-focus-within:via-white/40 group-focus-within:to-transparent transition-all duration-700" />
        </div>

        <Input
          label="Motivo / Descrição"
          placeholder="Ex: Economia do mês"
          value={formData.transactionName}
          onChange={(v) => handleChange("transactionName", v)}
          required
          icon={<MessageSquare size={18} className="text-gray-500" />}
        />

        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <CheckCircle2 size={14} className="text-violet-400" />
          <p className="text-[10px] text-gray-500 font-medium">
            Esta transação será refletida no seu saldo de metas e no histórico geral.
          </p>
        </div>
      </div>
    </BaseModal>
  )
}