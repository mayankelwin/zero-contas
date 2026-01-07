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
    <div className="relative group/container px-2">
      
      {/* Gradientes de Máscara para suavizar as bordas do scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#161618] to-transparent z-10 pointer-events-none opacity-0 group-hover/container:opacity-100 transition-opacity duration-500" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#161618] to-transparent z-10 pointer-events-none opacity-0 group-hover/container:opacity-100 transition-opacity duration-500" />

      {/* Botão scroll left - Estilo Glass */}
      {showLeftScroll && (
        <button
          onClick={scrollLeft}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/5 hover:bg-white text-gray-400 hover:text-black rounded-full transition-all duration-300 shadow-2xl backdrop-blur-md border border-white/10 active:scale-90"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
      )}

      {/* Botão scroll right - Estilo Glass */}
      {showRightScroll && (
        <button
          onClick={scrollRight}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/5 hover:bg-white text-gray-400 hover:text-black rounded-full transition-all duration-300 shadow-2xl backdrop-blur-md border border-white/10 active:scale-90"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      )}

      {/* Lista de cartões */}
      <div
        ref={scrollContainerRef}
        className="flex gap-8 pb-10 pt-4 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing px-12"
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
            className="flex-shrink-0 transition-all duration-500 hover:translate-y-[-8px] group relative"
          >
            {/* Sombra sutil projetada abaixo do cartão no hover */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative select-none pointer-events-none sm:pointer-events-auto">
              <CardItem {...card} index={index} />
            </div>
            
            {/* Overlay sutil de brilho no hover do cartão */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Indicador visual de scroll (opcional) */}
      <div className="flex justify-center gap-1 mt-2 mb-6">
         <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-white/20 w-1/3 rounded-full" />
         </div>
      </div>
    </div>
  )
}