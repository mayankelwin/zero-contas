"use client"

import React, { useState, useEffect, useCallback, memo } from "react"
import { Wallet, Plus, Sparkles } from "lucide-react"
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

const CardsSection = memo(function CardsSection({
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
  
  const handleAddNew = useCallback(() => {
    setSelectedCardId(null)
    setTimeout(() => onAddCard(), 10)
  }, [onAddCard, setSelectedCardId])

  return (
    <div className="bg-[#0f0f11]/50 backdrop-blur-md rounded-[3rem] border border-white/[0.04] transition-all duration-700 overflow-hidden shadow-2xl">
      
      {!selectedCardId && !isMobile && cardsList.length > 0 && (
        <div className="pt-10 px-10">
          <div className="mb-8 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Sparkles size={14} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic leading-none">Minha Exposição Financeira</p>
          </div>
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
        <div className="p-12 sm:p-24 text-center flex flex-col items-center justify-center group">
          <div className="relative mb-6">
            <div className="relative w-20 h-20 bg-white/[0.02] border border-white/[0.05] rounded-3xl flex items-center justify-center text-white/10 group-hover:text-emerald-500 group-hover:border-emerald-500/20 transition-all duration-700">
              <Wallet size={32} strokeWidth={1} />
            </div>
            <div className="absolute -inset-4 bg-emerald-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="space-y-2 mb-8">
            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">
              Nenhum Ativo <span className="text-white/10 not-italic">Vinculado</span>
            </h3>
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] max-w-[250px] mx-auto leading-relaxed">
              Inicie sua gestão conectando cartões ou contas personalizadas.
            </p>
          </div>

          <button 
            onClick={handleAddNew}
            className="flex items-center gap-4 px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all active:scale-95 shadow-xl"
          >
            <Plus size={16} strokeWidth={3} />
            Configurar Primeiro Ativo
          </button>
        </div>
      ) : (
        <div className="relative">
          {!selectedCardId && !isMobile && (
            <div className="pb-10">
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
            <div className="w-full px-4 sm:px-10 py-10">
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
})

export default CardsSection