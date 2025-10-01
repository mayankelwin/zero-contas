"use client"
import React from "react"

export function SummaryItem({ label, value, color }: { label: string; value: number; color: "green" | "blue" }) {
  let textColor = color === "green" ? "text-green-400" : "text-blue-400"
  return (
    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
      <span className="text-gray-300">{label}</span>
      <span className={`font-bold ${textColor}`}>{value}</span>
    </div>
  )
}
