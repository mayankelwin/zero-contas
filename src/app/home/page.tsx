'use client'

import Header from "@/src/components/Header"
import Sidebar from "@/src/components/Sidebar"
import { useAuth } from "@/src/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardSummary from "@/src/components/DashboardSummary"
import SpendingChart from "@/src/components/ChartCard"
import TransactionsCard from "@/src/components/TransactionsCard"
import SubscriptionsCard from "@/src/components/SubscriptionsCard"
import AddTransactionModal from "@/src/components/AddTransactionModal"
import AddButton from "@/src/components/AddButton"
import AddButtonMenu from "@/src/components/AddButtonMenu"
import ChartCard from "@/src/components/ChartCard"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<"income" | "expense" | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const handleSelectType = (type: "income" | "expense") => {
    setTransactionType(type)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTransactionType(null)
  }

  const spendingData = {
  labels: ["Alimentação", "Transporte", "Lazer", "Outros"],
  datasets: [
    {
      label: "Gastos (R$)",
      data: [450, 300, 200, 100],
      backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"],
      borderWidth: 1,
    },
  ],
}

  if (loading || !user) return <div className="p-8">Carregando...</div>

  return (
    <div className="flex h-screen relative">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="p-6 space-y-6">
          <DashboardSummary />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard title="Gastos por categoria" chartType="doughnut" data={spendingData} />
            <TransactionsCard />
            <SubscriptionsCard />
          </div>
           {/* Botão flutuante com menu */}
          <div className="fixed bottom-8 right-8">
            <div className="relative">
              <AddButton onClick={() => setIsMenuOpen((prev) => !prev)} />
              {isMenuOpen && (
                <AddButtonMenu
                  onSelect={handleSelectType}
                  onClose={() => setIsMenuOpen(false)}
                />
              )}
            </div>
          </div>

          {transactionType && (
            <AddTransactionModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              defaultType={transactionType}
            />
          )}

        </div>
      </main>
    </div>
  )
}
