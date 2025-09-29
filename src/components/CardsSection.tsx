import { useState, useEffect, useRef, useMemo } from "react"
import CardItem from "./CardItem"
import { ArrowLeft, ArrowRight, Edit, X, BarChart3, CreditCard, Zap, ArrowLeftFromLine, Search, ChevronRight, ChevronLeft } from "lucide-react"
import { toast } from "react-toastify"

interface CardsSectionProps {
  cardsList: any[]
  selectedCardId: string | null
  setSelectedCardId: (id: string | null) => void
  onAddCard: () => void  
  onEditCard: (card: any) => void
  onViewReport?: (card: any) => void
}

export default function CardsSection({ 
  cardsList, 
  selectedCardId, 
  setSelectedCardId, 
  onAddCard, 
  onEditCard,
  onViewReport 
}: CardsSectionProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"bank" | "limit" | "usage">("bank")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftScroll, setShowLeftScroll] = useState(false) 
  const [showRightScroll, setShowRightScroll] = useState(false)
  const lastScrollCheckRef = useRef<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 })

  // Filtrar e ordenar cartões - MOVIDO PARA CIMA
  const filteredAndSortedCards = useMemo(() => {
    return cardsList
      .filter(card => 
        card.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.cardName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "bank":
            return a.bank.localeCompare(b.bank)
          case "limit":
            return b.creditLimit - a.creditLimit
          case "usage":
            const usageA = (a.usedCredit / a.creditLimit) * 100
            const usageB = (b.usedCredit / b.creditLimit) * 100
            return usageB - usageA
          default:
            return 0
        }
      })
  }, [cardsList, searchTerm, sortBy])

  // Configurar scroll horizontal - CORRIGIDO
  const checkScrollButtons = useRef(() => {
    const now = Date.now()
    if (now - lastScrollCheckRef.current < 100) return // Debounce
    
    lastScrollCheckRef.current = now
    
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      const isAtStart = scrollLeft <= 10
      const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10
      
      setShowLeftScroll(!isAtStart)
      setShowRightScroll(!isAtEnd)
    }
  })

  useEffect(() => {
    const handleScroll = () => {
      checkScrollButtons.current()
    }

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
      // Verificação inicial
      setTimeout(() => checkScrollButtons.current(), 100)
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, [cardsList, filteredAndSortedCards.length]) // Agora filteredAndSortedCards está definida

  // Verificar scroll também quando a janela redimensiona
  useEffect(() => {
    const handleResize = () => {
      checkScrollButtons.current()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePrev = () => {
    if (!selectedCardId || isAnimating) return
    setIsAnimating(true)
    const idx = cardsList.findIndex(c => c.id === selectedCardId)
    const prevIndex = (idx - 1 + cardsList.length) % cardsList.length
    setSelectedCardId(cardsList[prevIndex].id)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleNext = () => {
    if (!selectedCardId || isAnimating) return
    setIsAnimating(true)
    const idx = cardsList.findIndex(c => c.id === selectedCardId)
    const nextIndex = (idx + 1) % cardsList.length
    setSelectedCardId(cardsList[nextIndex].id)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleCardSelect = (cardId: string) => {
    if (isAnimating) return
    setIsAnimating(true)
    setSelectedCardId(cardId)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ 
        left: -300, 
        behavior: 'smooth' 
      })
      setTimeout(() => checkScrollButtons.current(), 400)
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ 
        left: 300, 
        behavior: 'smooth' 
      })
      setTimeout(() => checkScrollButtons.current(), 400)
    }
  }

  // Prevenir clique acidental ao arrastar
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollContainerRef.current) {
      setIsDragging(true)
      dragStartRef.current = {
        x: e.clientX,
        scrollLeft: scrollContainerRef.current.scrollLeft
      }
    }
  }

  // Função de clique direto para garantir que funcione
  const handleCardClick = (cardId: string) => {
    if (!isDragging && !isAnimating) {
      handleCardSelect(cardId)
    }
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    
    const deltaX = e.clientX - dragStartRef.current.x
    scrollContainerRef.current.scrollLeft = dragStartRef.current.scrollLeft - deltaX
  }

  const handleMouseUp = (e: React.MouseEvent, cardId: string) => {
    if (!isDragging) {
      handleCardSelect(cardId)
    }
    setIsDragging(false)
  }

  const selectedCard = selectedCardId ? cardsList.find(c => c.id === selectedCardId) : null
  const usedPercentage = selectedCard ? (selectedCard.usedCredit / selectedCard.creditLimit) * 100 : 0

  return (
    <div className="bg-[#1E1F24] rounded-2xl shadow-lg border border-gray-800 transition-all duration-300 overflow-hidden">
      {/* Header - Só aparece quando nenhum cartão está selecionado */}
      {!selectedCardId && (
        <div className="p-6 border-b border-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-600/20 rounded-lg">
                <CreditCard className="text-violet-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Meus Cartões</h3>
                <p className="text-sm text-gray-400">
                  {filteredAndSortedCards.length} de {cardsList.length} cartão{cardsList.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Barra de pesquisa */}
              <div className="relative">
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
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
              >
                <option value="bank">Ordenar por Banco</option>
                <option value="limit">Maior Limite</option>
                <option value="usage">Maior Utilização</option>
              </select>

              <button
                onClick={() => {
                  if (cardsList.length >= 5) {
                    toast.error("Você pode adicionar no máximo 5 cartões.")
                    return
                  }
                  onAddCard()
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-violet-500/25 whitespace-nowrap"
              >
                <Zap size={16} />
                Adicionar Cartão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      {cardsList.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-48 h-48 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <img src="/Wallet-bro.svg" alt="Cartão" className="h-32 w-32 opacity-70" />
          </div>
          <p className="text-gray-400 mb-2 text-lg">Nenhum cartão cadastrado</p>
          <p className="text-sm text-gray-500">Adicione seu primeiro cartão para começar</p>
        </div>
      ) : (
        <div className="relative">

          {/* Vista em lista (quando nenhum cartão está selecionado) */}
          {!selectedCardId && (
            <div className="p-4 sm:p-6">

              {/* Mensagem quando não há resultados na busca */}
              {filteredAndSortedCards.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Nenhum cartão encontrado</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Tente ajustar os termos da busca ou filtros
                  </p>
                </div>
              ) : (
                <div className="relative group/container">
                  {/* Botões de navegação */}
                  {showLeftScroll && (
                    <button
                      onClick={scrollLeft}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-gray-900/90 hover:bg-gray-800/90 text-white rounded-2xl transition-all duration-300 hover:scale-110 shadow-2xl backdrop-blur-sm border border-gray-700 hover:border-violet-500/50 group/button"
                    >
                      <ChevronLeft size={24} className="group-hover/button:text-violet-400 transition-colors duration-300" />
                    </button>
                  )}
                  
                  {showRightScroll && (
                    <button
                      onClick={scrollRight}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-gray-900/90 hover:bg-gray-800/90 text-white rounded-2xl transition-all duration-300 hover:scale-110 shadow-2xl backdrop-blur-sm border border-gray-700 hover:border-violet-500/50 group/button"
                    >
                      <ChevronRight size={24} className="group-hover/button:text-violet-400 transition-colors duration-300" />
                    </button>
                  )}

                  <div 
                    ref={scrollContainerRef}
                    className="flex gap-6 pb-8 overflow-x-auto container-cartoes hide-scrollbar cursor-grab active:cursor-grabbing"
                    tabIndex={0}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setIsDragging(false)}
                    onMouseUp={() => setIsDragging(false)}
                  >
                    {filteredAndSortedCards.map((card, index) => {
                      const cardUsage = (card.usedCredit / card.creditLimit) * 100
                      
                      return (
                        <div
                          key={card.id}
                          onClick={() => handleCardClick(card.id)}
                          onMouseUp={(e) => handleMouseUp(e, card.id)}
                          className="cursor-pointer transform transition-all duration-500 hover:scale-80 hover:-translate-y-2 group relative flex-shrink-0 select-none"
                          style={{ padding: '8px' }}
                        >
                          <div className="relative">
                            <CardItem {...card} index={index} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                 
                </div>
              )}
            </div>
          )}
          
          {/* Vista detalhada (quando um cartão está selecionado) */}
          {selectedCardId && selectedCard && (
            <div className={`min-h-[500px] transition-all`}>
              {/* Header do cartão selecionado */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCardId(null)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-all duration-300 hover:bg-gray-800 rounded-xl"
                  >
                    <ArrowLeftFromLine size={16} />
                    Voltar
                  </button>
                  
                  <h3 className="text-lg font-semibold text-white">Detalhes do Cartão</h3>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditCard(selectedCard)}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:bg-gray-800 rounded-lg"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Conteúdo principal */}
              <div className="p-6">
                {/* Cartão no topo */}
                <div className="flex justify-center mb-8">
                  <div className="">
                    <CardItem {...selectedCard} />
                  </div>
                </div>

                {/* Navegação entre cartões */}
                {cardsList.length > 1 && (
                  <div className="flex justify-center items-center gap-6 mb-8">
                    <button
                      onClick={handlePrev}
                      className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isAnimating}
                    >
                      <ArrowLeft size={20} />
                    </button>
                    
                    <div className="flex gap-2">
                      {cardsList.map((card, index) => (
                        <button
                          key={card.id}
                          onClick={() => handleCardSelect(card.id)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            card.id === selectedCardId 
                              ? 'bg-violet-500 w-8' 
                              : 'bg-gray-600 hover:bg-gray-500'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <button
                      onClick={handleNext}
                      className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isAnimating}
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                )}

                {/* Detalhes do Cartão*/}
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                  <div className="space-y-6">
                    {/* Informações principais */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Limite Total</p>
                          <p className="text-xl font-bold text-white">
                            R$ {selectedCard.creditLimit?.toLocaleString('pt-BR')}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Crédito Usado</p>
                          <p className="text-xl font-bold text-red-400">
                            R$ {selectedCard.usedCredit?.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Disponível</p>
                          <p className="text-xl font-bold text-green-400">
                            R$ {(selectedCard.creditLimit - selectedCard.usedCredit)?.toLocaleString('pt-BR')}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Taxa de Juros</p>
                          <p className="text-xl font-bold text-yellow-400">
                            {selectedCard.interestRate}% ao mês
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progresso do Limite */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Utilização do Limite</span>
                        <span className="font-semibold text-white">{usedPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${
                            usedPercentage > 80 ? 'bg-red-500' : 
                            usedPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(usedPercentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>R$ 0</span>
                        <span>R$ {selectedCard.creditLimit?.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>

                    {/* Ações do Cartão */}
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => onEditCard(selectedCard)}
                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all duration-300 hover:scale-105 font-semibold"
                      >
                        <Edit size={18} />
                        Editar Cartão
                      </button>
                      
                      {onViewReport && (
                        <button
                          onClick={() => onViewReport(selectedCard)}
                          className="flex-1 flex items-center justify-center gap-3 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all duration-300 hover:scale-105 font-semibold"
                        >
                          <BarChart3 size={18} />
                          Ver Relatório
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}