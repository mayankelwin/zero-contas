import { banks } from "@/src/data/banks"
import { brands } from "@/src/data/brands"


interface CardItemProps {
  bank: string
  cardName: string
  brand: string
  cardNumber: string
  index?: number
  billingDay: number
}

// Função simples para clarear ou escurecer a cor
function lightenDarkenColor(col: string, amt: number) {
  let usePound = false
  let color = col
  if (color[0] === "#") {
    color = color.slice(1)
    usePound = true
  }

  const num = parseInt(color,16)
  let r = (num >> 16) + amt
  let g = ((num >> 8) & 0x00FF) + amt
  let b = (num & 0x0000FF) + amt

  r = Math.max(Math.min(255,r),0)
  g = Math.max(Math.min(255,g),0)
  b = Math.max(Math.min(255,b),0)

  return (usePound?"#":"") + (r.toString(16).padStart(2,"0")) + (g.toString(16).padStart(2,"0")) + (b.toString(16).padStart(2,"0"))
}

export default function CardItem({ bank, cardName, brand, cardNumber, index = 0, billingDay }: CardItemProps) {
  const bankInfo = banks.find(b => b.name.toLowerCase() === bank.toLowerCase())
  const color1 = bankInfo?.color ?? "#555555"
  const color2 = bankInfo ? lightenDarkenColor(color1, 30) : "#777777" 

  const gradientStyle = { 
    background: `linear-gradient(135deg, ${color1}, ${color2})`,
    border: "2px solid white", 
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)" 
  }

  return (
    <div
      className="relative rounded-2xl p-5 w-72 h-44 flex flex-col justify-between text-white"
      style={gradientStyle}
    >
      {/* Topo */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{bank}</h3>
        <span className="text-sm opacity-90">{brand}</span>
      </div>

      {/* Meio */}
      <div>
        <p className="text-sm opacity-80">{cardName}</p>
      </div>

      {/* Rodapé */}
      <div className="flex justify-between items-center">
        <p className="text-sm tracking-widest font-mono">
          •••• •••• •••• •••• {cardNumber?.slice(-4) ?? "0000"}
        </p>
        <div className="flex justify-between text-sm">
            <span className="text-sm tracking-widest font-mono">
              Dia da Fatura: {billingDay}
              </span>
          </div>
      </div>
    </div>
  )
}
