"use client"
import React from "react"

export function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-xl">
      <Icon className="text-blue-400" size={20} />
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  )
}
