"use client"

import { ChevronLeft, ChevronRight, MousePointer2 } from "lucide-react"
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
    <div className="relative group/container px-0">
      
      {/* Botões de Navegação Ultra-Slim */}
      <div className="absolute top-0 right-12 flex gap-2 z-20">
         {showLeftScroll && (
          <button
            onClick={scrollLeft}
            className="w-8 h-8 flex items-center justify-center bg-white/[0.02] border border-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all rounded-lg active:scale-90"
          >
            <ChevronLeft size={16} />
          </button>
        )}
        {showRightScroll && (
          <button
            onClick={scrollRight}
            className="w-8 h-8 flex items-center justify-center bg-white/[0.02] border border-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all rounded-lg active:scale-90"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Container de Scroll com Máscara de Opacidade */}
      <div
        ref={scrollContainerRef}
        style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
        className="flex gap-6 pb-8 pt-10 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing px-12"
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
            className="flex-shrink-0 transition-all duration-700 hover:scale-[1.02] group relative"
          >
            {/* Glossy Overlay sutil fixo */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
            
            <div className="relative select-none pointer-events-none sm:pointer-events-auto">
              <CardItem {...card} index={index} />
            </div>

            {/* Label de Interação no Hover */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:bottom-2 transition-all duration-500 z-20 pointer-events-none">
              <span className="flex items-center gap-2 px-3 py-1 bg-white text-black text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl">
                <MousePointer2 size={10} />
                Detalhes
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer do Carrossel: Minimalista */}
      <div className="flex items-center justify-between px-12 mt-2">
        <div className="flex gap-1.5">
          {cards.map((_, i) => (
            <div 
              key={i} 
              className={`h-[2px] transition-all duration-500 rounded-full ${i === 0 ? 'w-8 bg-white/40' : 'w-2 bg-white/5'}`}
            />
          ))}
        </div>
        
        <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em]">
          Leia mais sobre gerenciamento de cartões em nossa seção de ajuda
        </span>
      </div>
    </div>
  )
}