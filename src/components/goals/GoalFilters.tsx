"use client"

import React, { memo } from "react"
import { Search, Filter, LayoutGrid, List } from "lucide-react"
import { cn } from "@/src/lib/utils"

interface GoalFiltersProps {
  search: string
  setSearch: (val: string) => void
  statusFilter: string
  setStatusFilter: (val: any) => void
}

const GoalFilters = memo(function GoalFilters({ 
  search, 
  setSearch, 
  statusFilter, 
  setStatusFilter 
}: GoalFiltersProps) {
  
  const filters = [
    { id: "all", label: "Todos" },
    { id: "active", label: "Ativos" },
    { id: "finished", label: "Concluídos" }
  ]

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.01] border border-white/[0.03] p-4 rounded-[2rem]">
      <div className="relative flex-1 w-full group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-emerald-500 transition-colors">
          <Search size={16} strokeWidth={3} />
        </div>
        <input 
          type="text" 
          placeholder="BUSCAR OBJETIVO..."
          className="w-full bg-white/[0.02] border border-white/5 pl-12 pr-4 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase text-white placeholder:text-white/10 outline-none focus:border-white/20 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setStatusFilter(filter.id)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
              statusFilter === filter.id 
                ? "bg-white text-black shadow-lg" 
                : "text-white/20 hover:text-white/60 hover:bg-white/[0.03]"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
})

export default GoalFilters
