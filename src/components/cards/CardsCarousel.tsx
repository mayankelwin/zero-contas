"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import CardItem from "./CardItem"

interface CardsCarouselProps {
  cards: any[]
  scrollLeft: () => void
  scrollRight: () => void
  showLeftScroll: boolean
  showRightScroll: boolean
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  handleMouseDown: (e: React.MouseEvent) => void
  handleMouseMove: (e: React.MouseEvent) => void
  handleMouseUp: (e: React.MouseEvent, cardId: string) => void
  setIsDragging: (val: boolean) => void
  handleCardClick: (cardId: string) => void
}

export default function CardsCarousel({
  cards,
  scrollLeft,
  scrollRight,
  showLeftScroll,
  showRightScroll,
  scrollContainerRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  setIsDragging,
  handleCardClick
}: CardsCarouselProps) {
  return (
    <div className="relative group/container">
      {/* Botão scroll left */}
      {showLeftScroll && (
        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-gray-900/90 hover:bg-gray-800/90 text-white rounded-2xl transition-all duration-300 hover:scale-110 shadow-2xl backdrop-blur-sm border border-gray-700 hover:border-violet-500/50 group/button"
        >
          <ChevronLeft size={24} className="group-hover/button:text-violet-400 transition-colors duration-300" />
        </button>
      )}

      {/* Botão scroll right */}
      {showRightScroll && (
        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-gray-900/90 hover:bg-gray-800/90 text-white rounded-2xl transition-all duration-300 hover:scale-110 shadow-2xl backdrop-blur-sm border border-gray-700 hover:border-violet-500/50 group/button"
        >
          <ChevronRight size={24} className="group-hover/button:text-violet-400 transition-colors duration-300" />
        </button>
      )}

      {/* Lista de cartões */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 pb-8 overflow-x-auto container-cartoes hide-scrollbar cursor-grab active:cursor-grabbing"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsDragging(false)}
        onMouseUp={() => setIsDragging(false)}
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            onMouseUp={(e) => handleMouseUp(e, card.id)}
            className="cursor-pointer transform transition-all duration-500 hover:scale-80 hover:-translate-y-2 group relative flex-shrink-0 select-none"
            style={{ padding: "8px" }}
          >
            <div className="relative">
              <CardItem {...card} index={index} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
