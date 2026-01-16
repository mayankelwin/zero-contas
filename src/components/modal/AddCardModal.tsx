"use client"

import { useState, useEffect, FormEvent } from "react"
import { banks } from "@/src/data/banks"
import { brands } from "@/src/data/brands"
import { X, CreditCard, Trash2, Save, Info } from "lucide-react"

interface Bank {
  name: string
  color: string
}

interface CardData {
  id?: string 
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
  const [bank, setBank] = useState<Bank>(banks[0])
  const [brand, setBrand] = useState<string>(brands[0].name)
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [interestRate, setInterestRate] = useState<number | "">("")
  const [creditLimit, setCreditLimit] = useState<number>(5000)
  const [billingDay, setBillingDay] = useState<number>(1)

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
    } else {
      setBank(banks[0])
      setBrand(brands[0].name)
      setCardName("")
      setCardNumber("")
      setInterestRate("")
      setCreditLimit(5000)
      setBillingDay(1)
    }
  }, [editData, isOpen])

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
      interestRate: Number(interestRate) || 0,
      creditLimit: creditLimit || 0,
      billingDay: billingDay || 1,
      createdAt: editData?.createdAt ?? new Date().toISOString(),
      usedCredit: editData?.usedCredit ?? 0,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-md transition-all">
      <div className="bg-[#161618] text-white rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-6xl relative border border-white/[0.05] overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 hover:bg-white/10 p-2 rounded-full transition-all z-50 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="w-full lg:w-[45%] p-10 bg-gradient-to-b from-white/[0.02] to-transparent flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/[0.05]">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
              <CreditCard size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{editData ? "Editar Detalhes" : "Novo Cartão"}</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Visualização em tempo real</p>
            </div>
          </div>

          <div
            className="aspect-[1.58/1] w-full rounded-[2rem] p-8 relative overflow-hidden shadow-2xl transition-all duration-700 ease-out flex flex-col justify-between group"
            style={{ 
              background: bank.color 
                ? `linear-gradient(135deg, ${bank.color} 0%, ${bank.color}dd 100%)`
                : "linear-gradient(135deg, #27272a 0%, #09090b 100%)"
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start">
                <span className="font-black text-2xl tracking-tighter opacity-90">{bank.name}</span>
                <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10">
                  {brand}
                </div>
              </div>
              
              <div className="mt-auto mb-8">
                <div className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold mb-1">Número do Cartão</div>
                <div className="text-2xl tracking-[0.15em] font-mono font-medium">
                  •••• •••• •••• {cardNumber || "0000"}
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">Titular</div>
                  <div className="text-sm font-bold tracking-wide uppercase">{cardName || "Nome no Cartão"}</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">Limite</div>
                  <div className="text-lg font-black">R$ {creditLimit?.toLocaleString('pt-BR')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.03]">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Taxa de Juros</p>
              <p className="text-lg font-bold text-red-400">{interestRate || 0}% <span className="text-[10px] text-gray-600 font-medium">/mês</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.03]">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Dia de Fechamento</p>
              <p className="text-lg font-bold text-violet-400">{billingDay}</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[55%] p-10 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Identificação do Cartão</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:bg-white/[0.05] transition-all"
                  placeholder="Ex: Nubank Platinum"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Últimos 4 Dígitos</label>
                <input
                  type="text"
                  maxLength={4}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 text-white font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-center text-lg tracking-widest"
                  placeholder="0000"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Dia do Vencimento</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={billingDay}
                  onChange={(e) => setBillingDay(Number(e.target.value))}
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Instituição</label>
                <select
                  value={bank.name}
                  onChange={(e) => setBank(banks.find(b => b.name === e.target.value)!)}
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all appearance-none cursor-pointer"
                >
                  {banks.map(b => (
                    <option key={b.name} value={b.name} className="bg-[#1E1F24]">{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Bandeira</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all appearance-none cursor-pointer"
                >
                  {brands.map(b => (
                    <option key={b.name} value={b.name} className="bg-[#1E1F24]">{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Limite (R$)</label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(Number(e.target.value))}
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-bold"
                  placeholder="5000"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Juros Mensal (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  placeholder="4.50"
                  required
                />
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 bg-white hover:bg-gray-200 text-black py-4 rounded-[1.25rem] font-black transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-white/5"
              >
                <Save size={18} />
                {editData ? "SALVAR ALTERAÇÕES" : "CRIAR CARTÃO"}
              </button>

              {editData && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="px-6 py-4 rounded-[1.25rem] bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all border border-red-500/20 flex items-center justify-center gap-2 font-bold"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            
            <p className="text-[10px] text-center text-gray-600 font-medium">
              * Suas informações são armazenadas localmente com segurança.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}