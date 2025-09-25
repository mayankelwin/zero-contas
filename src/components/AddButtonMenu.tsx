"use client"

import { DollarSign, CreditCard, Target, Archive } from "lucide-react"

interface AddButtonMenuProps {
  onSelect: (type: "income" | "expense" | "goal" | "subscription") => void
  onClose: () => void
}

export default function AddButtonMenu({ onSelect, onClose }: AddButtonMenuProps) {
  const options = [
    { label: "Receita", type: "income", icon: <DollarSign size={18} /> },
    { label: "Despesa", type: "expense", icon: <CreditCard size={18} /> },
    { label: "Meta", type: "goal", icon: <Target size={18} /> },
    { label: "Assinatura", type: "subscription", icon: <Archive size={18} /> },
  ]

  return (
    <div className="absolute bottom-20 right-0 bg-[#2E2E2E] shadow-xl rounded-lg p-3 w-56 z-50 border border-gray-700 animate-fadeIn">
      {options.map(({ label, type, icon }) => (
        <button
          key={type}
          onClick={() => {
            onSelect(type as any)
            onClose()
          }}
          className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 rounded-md transition-colors"
          aria-label={label}
          type="button"
        >
          <span className="text-cyan-400">{icon}</span>
          <span className="font-medium">{label}</span>
        </button>
      ))}
    </div>
  )
}
