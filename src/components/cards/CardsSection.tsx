"use client"

import { useState, useEffect } from "react"
import { Wallet, Plus } from "lucide-react"
import CardDetails from "./CardDetails"
import EmptyState from "./EmptyState"
import CardsCarousel from "./CardsCarousel"
import { useCardsLogic } from "./useCardsLogic"
import CardsHeader from "./CardsHeader"

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
  onViewReport,
}: CardsSectionProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile && !selectedCardId && cardsList.length > 0) {
      setSelectedCardId(cardsList[0].id)
    }
  }, [isMobile, selectedCardId, cardsList, setSelectedCardId])

  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filteredAndSortedCards,
    scrollContainerRef,
    showLeftScroll,
    showRightScroll,
    handlePrev,
    handleNext,
    setIsDragging,
    isAnimating,
    handleCardClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    selectedCard,
    handleCardSelect,
    scrollLeft,
    scrollRight,
  } = useCardsLogic(cardsList, selectedCardId, setSelectedCardId)
  
  const handleAddNew = () => {
    setSelectedCardId(null); 
    setTimeout(() => {
      onAddCard(); 
    }, 10);
  };
  return (
    <div className="bg-[#161618] rounded-[2.5rem] border border-white/[0.03] shadow-2xl transition-all duration-500 overflow-hidden">
      
      {/* Header integrado com estilo minimalista */}
      {!selectedCardId && !isMobile && cardsList.length > 0 && (
        <div className="pt-8 px-8">
          <CardsHeader
            cardsList={cardsList}
            filteredCount={filteredAndSortedCards.length}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onAddCard={handleAddNew}
          />
        </div>
      )}

      {/* Conteúdo Principal */}
      {cardsList.length === 0 ? (
        <div className="p-12 sm:p-20 text-center flex flex-col items-center justify-center group">
          <div className="relative mb-8">
            {/* Círculos decorativos de fundo */}
            <div className="absolute inset-0 bg-white/[0.02] rounded-full scale-150 blur-xl" />
            <div className="relative w-24 h-24 bg-white/[0.03] border border-white/[0.05] rounded-[2rem] flex items-center justify-center text-gray-600 group-hover:text-white transition-colors duration-500">
              <Wallet size={40} strokeWidth={1.2} />
            </div>
          </div>
          
          <div className="space-y-2 mb-8">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Nenhum cartão cadastrado
            </h3>
            <p className="text-sm text-gray-500 max-w-[240px] mx-auto leading-relaxed">
              Adicione seus cartões de crédito ou débito para uma gestão completa.
            </p>
          </div>

          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-white/5"
          >
            Novo Cartão
          </button>
        </div>
      ) : (
        <div className="relative pb-8">
          {/* Grid View / Carousel */}
          {!selectedCardId && !isMobile && (
            <div className="mt-4">
              {filteredAndSortedCards.length === 0 ? (
                <EmptyState />
              ) : (
                <CardsCarousel
                  cards={filteredAndSortedCards}
                  scrollLeft={scrollLeft}
                  scrollRight={scrollRight}
                  showLeftScroll={showLeftScroll}
                  showRightScroll={showRightScroll}
                  scrollContainerRef={scrollContainerRef}
                  handleMouseDown={handleMouseDown}
                  handleMouseMove={handleMouseMove}
                  handleMouseUp={handleMouseUp}
                  setIsDragging={setIsDragging}
                  handleCardClick={handleCardClick}
                />
              )}
            </div>
          )}

          {/* Details View */}
          {(selectedCardId || isMobile) && selectedCard && (
            <div className="w-full px-4 sm:px-10 py-6">
              <CardDetails
                card={selectedCard}
                onEdit={onEditCard}
                onViewReport={onViewReport}
                onBack={() => setSelectedCardId(null)}
                handlePrev={handlePrev}
                handleNext={handleNext}
                canNavigate={filteredAndSortedCards.length > 1}
                isAnimating={isAnimating}
                currentIndex={filteredAndSortedCards.findIndex(c => c.id === selectedCardId)}
                totalCards={filteredAndSortedCards.length}
                onSelectCard={handleCardSelect}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}