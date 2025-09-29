"use client"

import Header from "@/src/components/layout/Header"
import Sidebar from "@/src/components/layout/Sidebar"
import DashboardSummary from "@/src/components/DashboardSummary"
import ChartCard from "@/src/components/ChartCard"
import AddTransactionModal from "@/src/components/AddTransactionModal"
import CardGlobal from "@/src/components/TransactionsCards"

import { collection, query, where } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { useHomeLogic } from "./useHomeLogic"
import { getTransactionIcon, getSubscriptionIcon } from "@/src/utils/icons"
import AddButtonWithMenu from "@/src/components/AddButton"

export default function HomePage() {
  const {
    user,
    loading,
    isMenuOpen,
    setIsMenuOpen,
    isModalOpen,
    transactionType,
    reloadFlag,
    categoryChartData,
    spendingData,
    handleSelectType,
    handleCloseModal,
    handleDeleteAllData,
  } = useHomeLogic()

  if (loading || !user) {
    return <div className="p-8">Carregando...</div>
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 ml-16 sm:ml-20">
        <Header />

        <div className="p-6 space-y-6">
          {/* Resumo */}
          <h2 className="text-2xl font-semibold text-white">Bem vindo, {user.displayName}!</h2>
          <DashboardSummary reloadFlag={reloadFlag} />

          <div className="flex justify-end mb-4">
            <button
              onClick={handleDeleteAllData}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Apagar Todos os Dados (Teste)
            </button>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Gastos por categoria" chartType="doughnut" data={categoryChartData} />
            <ChartCard title="Resumo por categoria" chartType="bar" data={spendingData} />
          </div>

          {/* Transações e Assinaturas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardGlobal
              title="Transações Recentes"
              firebaseQuery={collection(db, "users", user.uid, "transactions")}
              getIcon={getTransactionIcon} 
              reloadFlag={reloadFlag}
            />

            <CardGlobal
              cardType="subscription"
              title="Despesas fixas"
              firebaseQuery={collection(db, "users", user.uid, "subscriptions")}
              getIcon={getSubscriptionIcon}
              reloadFlag={reloadFlag}
            />
          </div>
        </div>

        {/* Botão flutuante */}
        <div className="fixed bottom-8 right-8">
          <AddButtonWithMenu onSelect={handleSelectType} />
        </div>

        {/* Modal */}
        {transactionType && (
          <AddTransactionModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            defaultType={transactionType}
          />
        )}
      </main>
    </div>
  )
}
