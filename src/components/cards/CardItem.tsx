"use client"

import React, { memo } from "react"
import { banks } from "@/src/data/banks"
import { cn } from "@/src/lib/utils"
import { Sparkles } from "lucide-react"

interface CardItemProps {
  bank: string
  cardName: string
  brand: string
  cardNumber: string
  billingDay: number
}

const CardItem = memo(function CardItem({ bank, cardName, brand, cardNumber, billingDay }: CardItemProps) {
  const bankInfo = banks.find(b => b.name.toLowerCase() === (bank ?? "Banco").toLowerCase())
  const baseColor = bankInfo?.color ?? "#1E293B"

  return (
    <div className="relative w-80 h-48 rounded-[2rem] p-8 overflow-hidden group shadow-2xl transition-all duration-700 hover:scale-[1.02]">
      {/* Camada de Cor de Fundo */}
      <div 
        className="absolute inset-0 transition-colors duration-700" 
        style={{ backgroundColor: baseColor }}
      />
      
      {/* Textura de Vidro e Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/40" />
      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Brilho de Borda Moderno */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      {/* Conteúdo do Cartão */}
      <div className="relative z-10 h-full flex flex-col justify-between text-white">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <Sparkles size={10} className="text-white/40" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40 italic">Premium Asset</span>
             </div>
             <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none">{bank || "BANCO"}</h3>
          </div>
          <div className="px-3 py-1 bg-black/20 rounded-full border border-white/10 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-widest">{brand || "VISA"}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
             <p className="text-[10px] font-bold text-white/60 tracking-widest uppercase">{cardName || "CREDIT CARD"}</p>
             <p className="text-lg font-mono tracking-[0.25em] text-white leading-none">
               •••• {cardNumber?.slice(-4) || "0000"}
             </p>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <div className="flex flex-col">
               <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Billing Day</span>
               <span className="text-[10px] font-bold text-white uppercase italic">{billingDay || 10}</span>
            </div>
            <div className="w-8 h-6 bg-white/10 rounded border border-white/10 flex items-center justify-center">
               <div className="w-4 h-3 bg-white/20 rounded-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Glossy Overlay */}
      <div className="absolute -inset-full h-[200%] w-[200%] rotate-45 translate-x-[-110%] group-hover:translate-x-[110%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-[1200ms] ease-in-out pointer-events-none" />
    </div>
  )
})

export default CardItem