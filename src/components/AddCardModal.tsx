"use client"

import { useState, useEffect, FormEvent } from "react"
import { banks } from "@/src/data/banks"
import { brands } from "@/src/data/brands"
import { X } from "lucide-react"

interface CardData {
  bank: string
  color: string
  cardName: string
  brand: string
  cardNumber: string
  interestRate: number
  creditLimit: number
  createdAt: string
  usedCredit: number
  billingDay: number
}

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CardData) => void
  editData?: CardData | null
  onDelete?: () => void
}

export default function AddCardModal({ isOpen, onClose, onSubmit, editData, onDelete }: AddCardModalProps) {
  const [bank, setBank] = useState(banks[0])
  const [brand, setBrand] = useState(brands[0].name)
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [interestRate, setInterestRate] = useState(2.5)
  const [creditLimit, setCreditLimit] = useState(5000)
  const [billingDay, setBillingDay] = useState(1)

  useEffect(() => {
    if (editData) {
      const selectedBank = banks.find(b => b.name === editData.bank)
      if (selectedBank) setBank(selectedBank)
      setBrand(editData.brand)
      setCardName(editData.cardName)
      setCardNumber(editData.cardNumber)
      setInterestRate(editData.interestRate)
      setCreditLimit(editData.creditLimit)
      setBillingDay(editData.billingDay ?? 1)
    }
  }, [editData])

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^\d{4}$/.test(cardNumber)) {
      alert("Digite apenas os 4 últimos dígitos do cartão.")
      return
    }

    onSubmit({
        bank: bank.name,
        color: bank.color,
        cardName,
        brand,
        cardNumber,
        interestRate: interestRate ?? 0, 
        creditLimit: creditLimit ?? 0,     
        billingDay: billingDay ?? 1,
        createdAt: editData?.createdAt ?? new Date().toISOString(),
        usedCredit: editData?.usedCredit ?? 0,
      })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1F24] text-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 hover:bg-gray-700 p-2 rounded-full transition">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">{editData ? "Editar Cartão" : "Adicionar Cartão"}</h2>

        {/* Cartão visual */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ backgroundColor: bank.color || "#4c1d95" }}
        >
          <div className="flex justify-between mb-4">
            <span className="font-semibold">{bank.name}</span>
            <span className="font-semibold">{brand}</span>
          </div>
          <div className="text-xl tracking-widest mb-2">
            **** **** **** {cardNumber || "0000"}
          </div>
          <div className="flex justify-between text-sm">
            <span>{cardName || "Nome do titular"}</span>
            <span>Dia da Fatura: {billingDay}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">Nome do Cartão</label>
            <input
              type="text"
              value={cardName || ""}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Últimos 4 dígitos</label>
            <input
              type="text"
              maxLength={4}
              value={cardNumber || ""}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
              className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />

          </div>

          <div>
            <label className="text-sm text-gray-300">Banco</label>
            <select
              value={bank.name}
              onChange={(e) => setBank(banks.find(b => b.name === e.target.value)!)}
              className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {banks.map(b => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300">Bandeira</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {brands.map(b => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          
        </form>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
          <div>
            <label className="text-sm text-gray-300">Juros ao mês (%)</label>
            <input
              type="number"
              value={interestRate ?? 0}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
              min={0}
              step={0.1}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Limite de crédito</label>
            <input
              type="number"
              value={creditLimit ?? 0}
              onChange={(e) => setCreditLimit(Number(e.target.value))}
              className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
              min={0}
              step={100}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Dia da fatura</label>
            <input
              type="number"
              value={billingDay ?? 1}
              onChange={(e) => setBillingDay(Math.min(Math.max(Number(e.target.value), 1), 31))}
              className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
              min={1}
              max={31}
              required
            />
          </div>
          </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={handleSubmit}
            className="w-full bg-violet-600 hover:bg-violet-500 py-2 rounded-xl font-semibold transition"
          >
            {editData ? "Atualizar" : "Adicionar"}
          </button>

          {editData && onDelete && (
            <button
              onClick={onDelete}
              className="w-full bg-red-600 hover:bg-red-500 py-2 rounded-xl font-semibold transition"
            >
              Excluir
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
