"use client"

import React, { useState, useRef, useEffect } from "react"
import { Plus } from "lucide-react"
import { DollarSign, CreditCard, Target, Archive } from "lucide-react"
import { clsx } from "clsx"

type TransactionType = "income" | "expense" | "goal" | "fixedExpense"

interface Option {
  label: string
  type: TransactionType
  icon: React.ReactNode
}

interface AddButtonWithMenuProps {
  onSelect: (type: TransactionType) => void
}

export default function AddButtonWithMenu({ onSelect }: AddButtonWithMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const options: Option[] = [
    { label: "Receita", type: "income", icon: <DollarSign size={18} /> },
    { label: "Despesa", type: "expense", icon: <CreditCard size={18} /> },
    { label: "Assinatura", type: "fixedExpense", icon: <Archive size={18} /> },
    { label: "Meta", type: "goal", icon: <Target size={18} /> },
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (type: TransactionType) => {
    onSelect(type)
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-8 right-8 z-[100]" ref={menuRef}>
      <div
        className={clsx(
          "absolute bottom-20 right-0 w-52 py-2 mb-2 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] origin-bottom-right",
          isOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        )}
      >
        <div className="bg-[#161618] border border-white/[0.08] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl">
          {options.map(({ label, type, icon }) => (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className="w-full flex items-center gap-3 px-6 py-4 text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all duration-200 group"
              type="button"
            >
              <div className="text-gray-500 group-hover:text-white transition-colors">
                {icon}
              </div>
              <span className="text-xs font-black uppercase tracking-[0.1em]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-90",
          isOpen 
            ? "bg-[#2A2A2E] text-white rotate-0" 
            : "bg-white text-black hover:bg-gray-200"
        )}
        aria-label="Adicionar transação"
      >
        <Plus
          className={clsx(
            "w-8 h-8 transition-transform duration-500 ease-in-out",
            isOpen ? "rotate-[135deg]" : "rotate-0"
          )}
          strokeWidth={2.5}
        />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] -z-10 transition-opacity" />
      )}
    </div>
  )
}