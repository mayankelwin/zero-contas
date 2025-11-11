"use client"

import React, { useState } from "react"
import { PlusIcon } from "@heroicons/react/24/solid"
import { DollarSign, CreditCard, Target, Archive } from "lucide-react"

interface Props {
  onSelect: (type: "income" | "expense" | "goal" | "fixedExpense") => void
}

export default function AddButtonWithMenu({ onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const options = [
    { label: "Receita", type: "income", icon: <DollarSign size={20} /> },
    { label: "Despesa", type: "expense", icon: <CreditCard size={20} /> },
    { label: "Assinatura", type: "fixedExpense", icon: <Archive size={20} /> },
    { label: "Meta", type: "goal", icon: <Target size={20} /> },
  ]

  function handleSelect(type: typeof options[number]["type"]) {
    onSelect(type)
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-16 h-16 bg-violet-500 hover:bg-violet-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-violet-400"
        aria-label="Adicionar"
      >
        <PlusIcon
          style={{ willChange: "transform" }}
          className={`w-10 h-10 transition-transform ${isOpen ? "rotate-45" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-56 bg-gray-800 rounded-lg shadow-lg py-2 flex flex-col space-y-2 animate-fadeIn">
          {options.map(({ label, type, icon }) => (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-violet-600 rounded-md transition-colors"
              aria-label={label}
              type="button"
            >
              <span className="text-cyan-400">{icon}</span>
              <span className="font-semibold">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
