"use client"

import { CreditCard, Plus, Search, SlidersHorizontal } from "lucide-react"
import { toast } from "react-toastify"

interface CardsHeaderProps {
  cardsList: any[]
  filteredCount: number
  searchTerm: string
  setSearchTerm: (val: string) => void
  sortBy: "bank" | "limit" | "usage"
  setSortBy: React.Dispatch<React.SetStateAction<"bank" | "limit" | "usage">>
  onAddCard: () => void
}

export default function CardsHeader({
  cardsList,
  filteredCount,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  onAddCard,
}: CardsHeaderProps) {
  
  const handleAddClick = () => {
    if (cardsList.length >= 5) {
      toast.error("LIMITE DE 5 ATIVOS ATINGIDO")
      return
    }
    onAddCard()
  }

  return (
    <div className="space-y-6 pb-6 border-b border-white/[0.03]">
      <div className="flex items-end justify-between gap-4">
        
        {/* Lado Esquerdo: Identidade do Bloco */}
        <div className="flex items-center gap-4">
          <div className="relative group hidden sm:block">
            <div className="absolute inset-0 bg-white/5 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="relative w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/20 transition-all">
              <CreditCard size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Gestão de Ativos</h3>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">
              Meus <span className="text-white/40 not-italic">Cartões</span>
            </h2>
          </div>
        </div>

        {/* Lado Direito: Ações rápidas */}
        <div className="flex items-center gap-2">
          {/* Status Counter Slim */}
          <div className="hidden lg:flex items-center px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] mr-2">
            <span className="text-[9px] font-black text-white/40 tracking-widest uppercase">
              {filteredCount} / {cardsList.length}
            </span>
          </div>

          <button
            onClick={handleAddClick}
            className="group flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg transition-all active:scale-95 hover:bg-emerald-400"
          >
            <Plus size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-[10px] font-black uppercase tracking-widest">Novo</span>
          </button>
        </div>
      </div>

      {/* Barra de Ferramentas: Pesquisa e Filtro Integrados */}
      <div className="flex items-center gap-3 h-10">
        <div className="relative flex-1 h-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-white/40 transition-colors" size={14} />
          <input
            type="text"
            placeholder="LOCALIZAR ATIVO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full bg-white/[0.02] border border-white/[0.05] rounded-lg pl-10 pr-4 text-[11px] font-medium text-white placeholder:text-white/10 outline-none focus:bg-white/[0.04] focus:border-white/10 transition-all tracking-wider"
          />
        </div>

        {/* Dropdown de Ordenação Estilizado */}
        <div className="relative h-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
            <SlidersHorizontal size={12} />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-full appearance-none bg-white/[0.02] border border-white/[0.05] text-[10px] font-black text-white/40 hover:text-white pl-9 pr-8 rounded-lg outline-none cursor-pointer transition-all uppercase tracking-widest"
          >
            <option value="bank" className="bg-[#161618]">Banco</option>
            <option value="limit" className="bg-[#161618]">Limite</option>
            <option value="usage" className="bg-[#161618]">Uso</option>
          </select>
        </div>
      </div>
    </div>
  )
}