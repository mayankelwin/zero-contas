
"use client"
import React from "react"

interface FinanceCardProps {
  label: string
  value: string
  subText?: string
  icon?: React.ReactNode
  gradient?: string
  color?: "red" | "orange" | "green"
  textColor?: string
}

export function FinanceCard({ label, value, subText, icon, gradient, color, textColor }: FinanceCardProps) {
  let bgColor = gradient
    ? `bg-gradient-to-r ${gradient}`
    : color === "red"
    ? "bg-gradient-to-r from-red-500/10 to-rose-500/10"
    : color === "orange"
    ? "bg-gradient-to-r from-orange-500/10 to-amber-500/10"
    : "bg-gradient-to-r from-green-500/10 to-emerald-500/10"

  let borderColor =
    color === "red" ? "border-red-500/20" : color === "orange" ? "border-orange-500/20" : "border-green-500/20"

  return (
    <div className={`border rounded-2xl p-4 ${bgColor} ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm">{label}</p>
          <p className={`text-2xl font-bold ${textColor || "text-white"}`}>{value}</p>
        </div>
        {icon && <div className="p-3 bg-white/10 rounded-xl">{icon}</div>}
      </div>
      {subText && <p className="text-gray-400 text-xs mt-1">{subText}</p>}
    </div>
  )
}
