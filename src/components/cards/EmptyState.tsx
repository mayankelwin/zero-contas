"use client"

import { Search } from "lucide-react"

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
      <p className="text-gray-400 text-lg">Nenhum cartão encontrado</p>
      <p className="text-sm text-gray-500 mt-2">
        Tente ajustar os termos da busca ou filtros
      </p>
    </div>
  )
}
