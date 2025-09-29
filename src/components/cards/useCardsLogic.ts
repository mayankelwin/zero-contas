import { useState, useEffect, useRef, useMemo } from "react"

export function useCardsLogic(
  cardsList: any[],
  selectedCardId: string | null,
  setSelectedCardId: (id: string | null) => void
) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"bank" | "limit" | "usage">("bank")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(false)
  const lastScrollCheckRef = useRef<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 })

  // Filtrar e ordenar cartões
  const filteredAndSortedCards = useMemo(() => {
    return cardsList
      .filter(
        (card) =>
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

  // Configurar scroll horizontal
  const checkScrollButtons = useRef(() => {
    const now = Date.now()
    if (now - lastScrollCheckRef.current < 100) return

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
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true })
      setTimeout(() => checkScrollButtons.current(), 100)
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll)
      }
    }
  }, [cardsList, filteredAndSortedCards.length])

  useEffect(() => {
    const handleResize = () => {
      checkScrollButtons.current()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handlePrev = () => {
    if (!selectedCardId || isAnimating) return
    setIsAnimating(true)
    const idx = cardsList.findIndex((c) => c.id === selectedCardId)
    const prevIndex = (idx - 1 + cardsList.length) % cardsList.length
    setSelectedCardId(cardsList[prevIndex].id)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleNext = () => {
    if (!selectedCardId || isAnimating) return
    setIsAnimating(true)
    const idx = cardsList.findIndex((c) => c.id === selectedCardId)
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
        behavior: "smooth",
      })
      setTimeout(() => checkScrollButtons.current(), 400)
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      })
      setTimeout(() => checkScrollButtons.current(), 400)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollContainerRef.current) {
      setIsDragging(true)
      dragStartRef.current = {
        x: e.clientX,
        scrollLeft: scrollContainerRef.current.scrollLeft,
      }
    }
  }

  const handleCardClick = (cardId: string) => {
    if (!isDragging && !isAnimating) {
      handleCardSelect(cardId)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    const deltaX = e.clientX - dragStartRef.current.x
    scrollContainerRef.current.scrollLeft =
      dragStartRef.current.scrollLeft - deltaX
  }

  const handleMouseUp = (e: React.MouseEvent, cardId: string) => {
    if (!isDragging) {
      handleCardSelect(cardId)
    }
    setIsDragging(false)
  }

  const selectedCard = selectedCardId
    ? cardsList.find((c) => c.id === selectedCardId)
    : null

  const usedPercentage = selectedCard
    ? (selectedCard.usedCredit / selectedCard.creditLimit) * 100
    : 0

  return {
    // Busca e ordenação
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filteredAndSortedCards,

    // Scroll
    scrollContainerRef,
    showLeftScroll,
    showRightScroll,
    scrollLeft,
    scrollRight,
    checkScrollButtons,

    // Cartões selecionados
    selectedCard,
    selectedCardId,
    usedPercentage,
    handleCardSelect,
    handlePrev,
    handleNext,

    // Drag
    isDragging,
    setIsDragging,
    dragStartRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCardClick,

    // Animação
    isAnimating,
    setIsAnimating,
  }
}
