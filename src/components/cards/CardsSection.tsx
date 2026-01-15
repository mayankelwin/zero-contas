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
    <div className="bg-[#161618] rounded-2xl border border-white/[0.03] transition-all duration-500 overflow-hidden">
      
      {!selectedCardId && !isMobile && cardsList.length > 0 && (
        <div className="pt-6 px-6">
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

      {cardsList.length === 0 ? (
        <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center group">
          <div className="relative mb-4">
            <div className="relative w-16 h-16 bg-white/[0.03] border border-white/[0.05] rounded-2xl flex items-center justify-center text-gray-600 group-hover:text-white transition-colors duration-500">
              <Wallet size={28} strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="space-y-1 mb-6">
            <h3 className="text-lg font-bold text-white tracking-tight italic uppercase">
              Sem Ativos
            </h3>
            <p className="text-[10px] text-gray-500 max-w-[200px] mx-auto uppercase tracking-widest font-black opacity-50">
              Adicione cartões para iniciar o monitoramento
            </p>
          </div>

          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-all active:scale-95"
          >
            <Plus size={14} strokeWidth={3} />
            Novo Cartão
          </button>
        </div>
      ) : (
        <div className="relative">
          {!selectedCardId && !isMobile && (
            <div className="pb-6">
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

          {(selectedCardId || isMobile) && selectedCard && (
            <div className="w-full px-4 sm:px-6 py-4">
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