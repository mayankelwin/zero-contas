"use client"

import { useState, useEffect, FormEvent } from "react"
import { banks } from "@/src/data/banks"
import { brands } from "@/src/data/brands"
import { X, CreditCard } from "lucide-react"

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
  const [interestRate, setInterestRate] = useState("")
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
      bank: bank?.name ?? "Banco",
      color: bank?.color ?? "#555555",
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
    <div className="fixed inset-0 bg-black/70 h-full flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#1E1F24] text-white rounded-2xl shadow-2xl w-full max-w-6xl relative border border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 hover:bg-gray-700 p-2 rounded-full transition z-10"
        >
          <X size={20} />
        </button>

        {/* Layout para desktop */}
        <div className="hidden lg:flex">
          {/* Lado Esquerdo - Cartão Grande */}
          <div className="w-2/3 p-8 bg-gradient-to-br from-gray-900 to-gray-800 border-r border-gray-700 flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <CreditCard className="text-violet-400" size={28} />
              <h2 className="text-2xl font-bold">{editData ? "Editar Cartão" : "Adicionar Cartão"}</h2>
            </div>

            {/* Cartão visual grande */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden shadow-2xl flex-1 min-h-[320px]"
              style={{ 
                background: bank.color 
                  ? `linear-gradient(135deg, ${bank.color} 0%, ${bank.color}dd 100%)`
                  : "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)"
              }}
            >
              {/* Elementos decorativos */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/15 rounded-full -ml-8 -mb-8"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/15 rounded-full"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xl">{bank.name}</span>
                  <div className="bg-white/20 px-3 py-2 rounded-lg text-base font-semibold">
                    {brand}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-white/80 mb-2">Titular do cartão</div>
                    <div className="text-xl font-medium tracking-wide">
                      {cardName || "NOME DO TITULAR"}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-white/80 mb-2">Número do cartão</div>
                    <div className="text-xl tracking-widest font-medium">
                      **** **** **** {cardNumber || "0000"}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <div className="text-sm text-white/80">Limite disponível</div>
                    <div className="text-lg font-bold">
                      R$ {creditLimit?.toLocaleString('pt-BR') || "0,00"}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-sm text-white/80">Dia da Fatura</div>
                    <div className="text-xl font-bold">{billingDay}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações adicionais abaixo do cartão */}
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400 text-base">Juros ao mês</span>
                <span className="font-semibold text-red-400 text-lg">
                  {interestRate}%
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400 text-base">Status</span>
                <span className="font-semibold text-green-400 text-lg">
                  {editData ? "Ativo" : "Novo"}
                </span>
              </div>
            </div>
          </div>

          {/* Lado Direito - Formulário */}
          <div className="w-3/5 p-8">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-sm text-gray-300 block mb-2">Nome do Cartão *</label>
                    <input
                      type="text"
                      value={cardName || ""}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-lg"
                      placeholder="Ex: Cartão Principal"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 block mb-2">Últimos 4 dígitos *</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={cardNumber || ""}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                      className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-lg"
                      placeholder="0000"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 block mb-2">Dia da fatura *</label>
                    <input
                      type="number"
                      value={billingDay ?? 1}
                      onChange={(e) => setBillingDay(Math.min(Math.max(Number(e.target.value), 1), 31))}
                      className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-lg"
                      min={1}
                      max={31}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 block mb-2">Banco *</label>
                    <select
                      value={bank.name}
                      onChange={(e) => setBank(banks.find(b => b.name === e.target.value)!)}
                      className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-lg"
                    >
                      {banks.map(b => (
                        <option key={b.name} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 block mb-2">Bandeira *</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-lg"
                    >
                      {brands.map(b => (
                        <option key={b.name} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="text-sm text-gray-300 block mb-2">Juros ao mês (%) *</label>
                    <input
                      type="number"
                      value={interestRate ?? 0}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-lg"
                      min={0}
                      step={0.1}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 block mb-2">Limite de crédito *</label>
                    <input
                      type="number"
                      value={creditLimit ?? 0}
                      onChange={(e) => setCreditLimit(Number(e.target.value))}
                      className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-lg"
                      min={0}
                      step={100}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Botões na parte inferior */}
              <div className="mt-8 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-500 py-4 rounded-xl font-semibold transition shadow-lg hover:shadow-violet-500/20 text-lg"
                >
                  {editData ? "Atualizar Cartão" : "Adicionar Cartão"}
                </button>

                {editData && onDelete && (
                  <button
                    type="button"
                    onClick={onDelete}
                    className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 py-4 rounded-xl font-semibold transition border border-red-500/30 text-lg"
                  >
                    Excluir Cartão
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Layout para mobile */}
        <div className="lg:hidden p-6">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="text-violet-400" size={24} />
            <h2 className="text-2xl font-bold">{editData ? "Editar Cartão" : "Adicionar Cartão"}</h2>
          </div>

          {/* Cartão em cima para mobile */}
          <div
            className="rounded-2xl p-5 mb-6 relative overflow-hidden shadow-lg"
            style={{ 
              background: bank.color 
                ? `linear-gradient(135deg, ${bank.color} 0%, ${bank.color}dd 100%)`
                : "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)"
            }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-6 -mb-6"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className="font-bold text-lg">{bank.name}</span>
                <div className="bg-white/20 px-2 py-1 rounded-md text-sm font-semibold">
                  {brand}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-xs text-white/80 mb-1">Titular do cartão</div>
                <div className="text-lg font-medium tracking-wide">
                  {cardName || "NOME DO TITULAR"}
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs text-white/80 mb-1">Número do cartão</div>
                  <div className="text-lg tracking-widest font-medium">
                    **** **** **** {cardNumber || "0000"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/80">Dia da Fatura</div>
                  <div className="text-lg font-bold">{billingDay}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário em baixo para mobile */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 block mb-2">Nome do Cartão *</label>
                <input
                  type="text"
                  value={cardName || ""}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="Ex: Cartão Principal"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 block mb-2">Últimos 4 dígitos *</label>
                <input
                  type="text"
                  maxLength={4}
                  value={cardNumber || ""}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="0000"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Banco *</label>
                  <select
                    value={bank.name}
                    onChange={(e) => setBank(banks.find(b => b.name === e.target.value)!)}
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  >
                    {banks.map(b => (
                      <option key={b.name} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-2">Bandeira *</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  >
                    {brands.map(b => (
                      <option key={b.name} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Juros ao mês (%) *</label>
                  <input
                    type="number"
                    value={interestRate ?? 0}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                    min={0}
                    step={0.1}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-2">Limite de crédito *</label>
                  <input
                    type="number"
                    value={creditLimit ?? 0}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                    min={0}
                    step={100}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 block mb-2">Dia da fatura *</label>
                <input
                  type="number"
                  value={billingDay ?? 1}
                  onChange={(e) => setBillingDay(Math.min(Math.max(Number(e.target.value), 1), 31))}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  min={1}
                  max={31}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-500 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-violet-500/20"
              >
                {editData ? "Atualizar Cartão" : "Adicionar Cartão"}
              </button>

              {editData && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 py-3 rounded-xl font-semibold transition border border-red-500/30"
                >
                  Excluir Cartão
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}