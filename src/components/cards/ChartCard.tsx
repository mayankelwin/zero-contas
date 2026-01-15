"use client"

import React from "react"
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts"
import { cn } from "../../lib/utils"

type ChartType = "area" | "bar" | "pie"

interface ChartCardProps {
  title: string
  subtitle?: string
  chartType: ChartType
  data: any[]
  dataKey: string 
  categoryKey: string 
  className?: string
  color?: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      // Tooltip agora com o fundo #161618 para consistência
      <div className="bg-[#161618] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-md ring-1 ring-white/5">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-white">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

export default function ChartCard({ title, subtitle, chartType, data, dataKey, categoryKey, className, color = "#fff" }: ChartCardProps) {
  
  const isValidData = Array.isArray(data) && data.length > 0;

  const renderChart = () => {
    if (!isValidData) return null;

    switch (chartType) {
      case "area":
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`colorGradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey={categoryKey} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={3}
              fillOpacity={1} 
              fill={`url(#colorGradient-${title.replace(/\s+/g, '')})`} 
              animationDuration={2000}
            />
          </AreaChart>
        )

      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey={categoryKey} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar 
              dataKey={dataKey} 
              fill={color} 
              radius={[6, 6, 0, 0]} 
              barSize={30}
              animationDuration={1500}
            />
          </BarChart>
        )

      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              innerRadius={80}
              outerRadius={110}
              paddingAngle={8}
              dataKey={dataKey}
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? color : `rgba(255,255,255,${0.1 - index * 0.02})`} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        )
      default:
        return null;
    }
  }

  return (
    <div className={cn(
      // CORREÇÃO: bg-[#161618] e borda white/[0.03] para igualar aos outros cards
      "bg-[#161618] border border-white/[0.03] rounded-[2.5rem] p-8 flex flex-col group transition-all duration-500 hover:border-white/10 shadow-2xl",
      className
    )}>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "w-1.5 h-1.5 rounded-full transition-colors",
            isValidData ? "bg-white/20 group-hover:bg-white" : "bg-white/5 animate-pulse"
          )} />
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{title}</h3>
        </div>
        {subtitle && <p className="text-[11px] text-gray-600 font-semibold italic ml-3.5">{subtitle}</p>}
      </div>

      <div className="flex-1 min-h-[300px] w-full flex items-center justify-center">
        {isValidData ? (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-white/5 border-t-white/20 rounded-full animate-spin" />
            <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">Sincronizando Dados</span>
          </div>
        )}
      </div>
    </div>
  )
}