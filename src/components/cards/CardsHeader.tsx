"use client"

import { CreditCard, Plus, Search, ChevronDown } from "lucide-react"
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
  
  // Função para garantir que estamos criando um NOVO cartão
  const handleAddClick = () => {
    if (cardsList.length >= 5) {
      toast.error("Limite máximo de 5 cartões atingido.")
      return
    }
    // Chama a função passada por props
    onAddCard()
  }

  return (
    <div className="pb-6 mb-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Lado Esquerdo: Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-gray-400">
            <CreditCard size={22} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Meus Cartões</h3>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {filteredCount} de {cardsList.length} Ativos
            </p>
          </div>
        </div>

        {/* Lado Direito: Filtros e Botão */}
        <div className="flex items-center gap-3">
          
          {/* Dropdown de Ordenação Neutro */}
          <div className="relative hidden sm:block">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-white/[0.03] border border-white/[0.05] text-xs font-bold text-gray-400 hover:text-white px-4 py-2.5 pr-10 rounded-xl outline-none cursor-pointer transition-all"
            >
              <option value="bank">Banco</option>
              <option value="limit">Limite</option>
              <option value="usage">Uso</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
          </div>

          {/* Botão Adicionar - Padrão Branco Neutro */}
          <button
            onClick={handleAddClick}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-200 text-black text-xs font-extrabold rounded-xl transition-all active:scale-95 shadow-lg shadow-white/5"
          >
            <Plus size={16} strokeWidth={3} />
            ADICIONAR
          </button>
        </div>
      </div>

      {/* Barra de Pesquisa Minimalista (Opcional - pode habilitar se precisar) */}
      <div className="mt-6 relative group hidden md:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" size={16} />
        <input
          type="text"
          placeholder="Pesquisar por banco ou apelido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-white/10 focus:bg-white/[0.04] transition-all"
        />
      </div>
    </div>
  )
}