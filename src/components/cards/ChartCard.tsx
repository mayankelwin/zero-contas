"use client"

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
} from "chart.js"

import { Doughnut, Bar, Line } from "react-chartjs-2"
import { cn } from "../../lib/utils"

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
)

type ChartType = "doughnut" | "bar" | "line"

interface ChartCardProps {
  title: string
  chartType: ChartType
  data: any
  className?: string
}

export default function ChartCard({ title, chartType, data, className }: ChartCardProps) {
  const renderChart = () => {
    switch (chartType) {
      case "doughnut":
        return <Doughnut data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      case "bar":
        return <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      case "line":
        return <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        `
        bg-[#1E1F24]
        text-white
        rounded-2xl
        shadow-sm
        border border-gray-800
        p-5 sm:p-6
        transition-all
        hover:border-gray-700
      `,
        className
      )}
    >
      <h3 className="text-sm font-medium text-gray-400 mb-4">{title}</h3>
      <div className="h-[220px] lg:h-[280px]">{renderChart()}</div>
    </div>
  )
}
