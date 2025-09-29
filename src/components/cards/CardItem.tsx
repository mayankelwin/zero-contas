import { banks } from "@/src/data/banks"

interface CardItemProps {
  bank: string
  cardName: string
  brand: string
  cardNumber: string
  index?: number
  billingDay: number
}

export default function CardItem({ bank, cardName, brand, cardNumber, index = 0, billingDay }: CardItemProps) {
  const safeBank = bank ?? "Banco"
  const bankInfo = banks.find(b => b.name.toLowerCase() === (bank ?? "Banco").toLowerCase())
  const color1 = bankInfo?.color ?? "#555555"
  const color2 = `${color1}` 

  const gradientStyle = { 
    background: `linear-gradient(135deg, ${color1}, ${color2})`,
    border: "2px solid rgba(255,255,255,0.2)", 
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)" 
  }

  return (
    <div
      className="relative rounded-2xl p-5 w-72 h-44 flex flex-col justify-between text-white overflow-hidden "
      style={gradientStyle}
    >
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full -mr-12 -mt-12"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/15 rounded-full -ml-8 -mb-8"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/15 rounded-full"></div>
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
          •••• •••• •••• {cardNumber?.slice(-4) ?? "0000"}
        </p>
        <span className="text-sm opacity-90">
          Fatura: {billingDay}
        </span>
      </div>
    </div>
  )
}