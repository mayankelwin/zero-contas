import { useState, useEffect } from "react"
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
    isDragging,
    setIsDragging,
    isAnimating,
    setIsAnimating,
    handleCardClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    selectedCard,
    handleCardSelect,
    scrollLeft,
    scrollRight,
  } = useCardsLogic(cardsList, selectedCardId, setSelectedCardId)

  return (
    <div className="bg-[#1E1F24] rounded-2xl shadow-lg border border-gray-800 transition-all duration-300 overflow-hidden">
      {/* Header - só em desktop */}
      {!selectedCardId && !isMobile && (
        <CardsHeader
          cardsList={cardsList}
          filteredCount={filteredAndSortedCards.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onAddCard={onAddCard}
        />
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
          {/* Em mobile sempre mostrar o cartão selecionado, se houver */}
          {!selectedCardId && !isMobile && (
            filteredAndSortedCards.length === 0 ? (
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
            )
          )}

          {(selectedCardId || isMobile) && selectedCard && (
            <div className="w-full px-4 sm:px-6">
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
