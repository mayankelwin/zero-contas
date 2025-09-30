import { CreditCard, Zap, Search } from "lucide-react"
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
  return (
    <div className="p-4 sm:p-6 border-b border-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Título e contador */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-600/20 rounded-lg flex items-center justify-center">
            <CreditCard className="text-violet-400" size={20} />
          </div>
          {/* Mostra texto apenas em sm+ */}
          <div className="hidden sm:block">
            <h3 className="text-md font-semibold text-white">Meus Cartões</h3>
            <p className="text-sm text-gray-400">
              {filteredCount} de {cardsList.length} cartão
              {cardsList.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          {/* Pesquisa - desaparece em xs */}
          <div className="relative hidden">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar cartão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 w-full sm:w-48"
            />
          </div>

          {/* Filtro */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "bank" | "limit" | "usage")}
              className="hidden sm:block px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
            >
              <option value="bank">Ordenar por Banco</option>
              <option value="limit">Maior Limite</option>
              <option value="usage">Maior Utilização</option>
            </select>
            {/* Ícone para xs */}
            <button className="sm:hidden p-2 bg-gray-800 rounded-xl text-white">
              <CreditCard size={16} />
            </button>
          </div>

          {/* Botão adicionar */}
          <button
            onClick={() => {
              if (cardsList.length >= 5) {
                toast.error("Você pode adicionar no máximo 5 cartões.")
                return
              }
              onAddCard()
            }}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-violet-500/25"
          >
            <Zap size={16} />
            <span className="hidden sm:inline">Adicionar Cartão</span>
          </button>
        </div>
      </div>
    </div>
  )
}
