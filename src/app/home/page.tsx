"use client"

import Header from "@/src/components/layout/Header"
import Sidebar from "@/src/components/layout/Sidebar"
import DashboardSummary from "@/src/components/ui/DashboardSummary"
import ChartCard from "@/src/components/cards/ChartCard"
import AddTransactionModal from "@/src/components/modal/addTransaction/AddTransactionModal"
import CardGlobal from "@/src/components/cards/TransactionsCards"

import { collection} from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { useHomeLogic } from "./useHomeLogic"
import { getTransactionIcon, getSubscriptionIcon } from "@/src/utils/icons"
import AddButtonWithMenu from "@/src/components/button/AddButton"
import { LoadingPage } from "@/src/components/ui/Loading"

export default function HomePage() {
  const {
    user,
    loading,
    isModalOpen,
    transactionType,
    reloadFlag,
    categoryChartData,
    spendingData,
    handleSelectType,
    handleCloseModal,
  } = useHomeLogic()

 if (loading || !user) return <LoadingPage />

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 ml-16 sm:ml-20">
        <Header />

        <div className="p-6 space-y-6">
          <div className="justify-between align-center flex w-1f">
          <h2 className="text-2xl font-semibold text-white">Bem vindo, {user.displayName}!</h2>
            {/* <button
              onClick={handleDeleteAllData}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Apagar Todos os Dados (Teste)
            </button> */}
          </div>

          <DashboardSummary reloadFlag={reloadFlag} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Gastos por categoria" chartType="doughnut" data={categoryChartData} />
            <ChartCard title="Resumo por categoria" chartType="bar" data={spendingData} />
          </div>

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

        <div className="fixed bottom-8 right-8">
          <AddButtonWithMenu onSelect={handleSelectType} />
        </div>

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
