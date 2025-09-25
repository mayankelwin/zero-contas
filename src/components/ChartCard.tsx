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
import { cn } from "../lib/utils"

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
        return <Doughnut data={data} />
      case "bar":
        return <Bar data={data} />
      case "line":
        return <Line data={data} />
      default:
        return null
    }
  }

  return (
    <div
      className={cn(`
        bg-[#3A3F33] 
        text-white 
        rounded-xl 
        shadow-md 
        p-6 
        transition 
        transform 
        hover:scale-[1.02] 
        hover:shadow-lg 
        hover:animate-shake 
        font-montserrat 
      `, className)}
    >
      <h3 className="text-md font-semibold mb-4 tracking-wide">{title}</h3>
      <div className="h-[220px]">{renderChart()}</div>
    </div>
  )
}
