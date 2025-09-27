import { useState } from "react"
import  CardItem  from "./CardItem"
import { ArrowLeft, ArrowRight, Edit, X } from "lucide-react"
import { toast } from "react-toastify"

interface CardsSectionProps {
  cardsList: any[]
  selectedCardId: string | null
  setSelectedCardId: (id: string | null) => void
  onAddCard: () => void  
  onEditCard: (card: any) => void
}

export default function CardsSection({ cardsList, selectedCardId, setSelectedCardId, onAddCard, onEditCard }: CardsSectionProps) {

  const handlePrev = () => {
    if (!selectedCardId) return
    const idx = cardsList.findIndex(c => c.id === selectedCardId)
    const prevIndex = (idx - 1 + cardsList.length) % cardsList.length
    setSelectedCardId(cardsList[prevIndex].id)
  }

  const handleNext = () => {
    if (!selectedCardId) return
    const idx = cardsList.findIndex(c => c.id === selectedCardId)
    const nextIndex = (idx + 1) % cardsList.length
    setSelectedCardId(cardsList[nextIndex].id)
  }

  return (
    <div className="bg-[#1E1F24] rounded-2xl p-6 shadow-sm border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">Carteiras</h3>
       <button
        onClick={() => {
          if (cardsList.length >= 5) {
            toast.error("Você pode adicionar no máximo 5 cartões.")
            return
          }
          onAddCard()
        }}
        className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition"
      >
        + Adicionar
      </button>
      </div>

      {/* Lista de cartões */}
      {cardsList.length === 0 ? (
        <p className="text-gray-500 text-sm">Nenhum cartão adicionado ainda</p>
      ) : (
        <div className="relative w-full flex justify-center items-start">
          {!selectedCardId ? (
            <div className="relative w-64 h-64">
              {cardsList.slice().reverse().map((card, index) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className="absolute left-0 w-full cursor-pointer transition-transform duration-300 hover:-translate-y-7"
                  style={{ top: `${index * 30}px`, zIndex: index }}
                >
                  <CardItem {...card} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="transition-all duration-500 flex justify-center">
              <CardItem {...cardsList.find(c => c.id === selectedCardId)!} index={0} />
            </div>
          )}

          {/* Botões voltar, editar e navegação */}
          {selectedCardId && (
            <>
              <button
                onClick={() => setSelectedCardId(null)}
                className="absolute top-2 left-1 w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
              >
                <X size={18} />
              </button>
             <button
              onClick={() => onEditCard(cardsList.find(c => c.id === selectedCardId))}
              className="absolute top-2 right-1 w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
            >
              <Edit size={18} />
            </button>

              {cardsList.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition"
                  >
                    <ArrowRight size={20} />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
