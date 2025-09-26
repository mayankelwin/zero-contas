'use client'

import Header from "@/src/components/Header"
import Sidebar from "@/src/components/Sidebar"
import { useAuth } from "@/src/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import DashboardSummary from "@/src/components/DashboardSummary"
import ChartCard from "@/src/components/ChartCard"
import AddTransactionModal from "@/src/components/AddTransactionModal"
import AddButton from "@/src/components/AddButton"
import AddButtonMenu from "@/src/components/AddButtonMenu"
import CardGlobal from "@/src/components/CardComponent"
import { ArrowDownLeft, ArrowUpRight, CreditCard, Film, Music, ShoppingBag, ShoppingCart, Tv, Wallet } from "lucide-react"
import { useCategoryChartData } from "@/src/hooks/useCategoryChartData"
import { getDocs, deleteDoc, doc } from "firebase/firestore"
import { toast } from "react-toastify"
interface CardItem {
  id: string
  title?: string
  name?: string
  amount?: number
  type?: "income" | "expense"
  value?: number
  subscriptionType?: string
  date?: string
  nextBilling?: string
}

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<"income" | "expense" | null>(null)
  const categoryChartData = useCategoryChartData()
  const [reloadFlag, setReloadFlag] = useState(0)
  const [summaryData, setSummaryData] = useState({
    income: 0,
    expenses: 0,
    fixedExpenses: 0,
  })


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

  // --- FETCH SUMMARY FROM FIREBASE ---
  useEffect(() => {
    if (!user) return

    const q = query(collection(db, "transactions"), where("userId", "==", user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let income = 0
      let expenses = 0
      let fixedExpenses = 0

      snapshot.forEach((doc) => {
        const data = doc.data()
        const amount = Number(data.amount ?? 0)
        switch (data.type) {
        case "income":
          income += amount
          break
        case "expense":
          expenses += amount
          break
        case "fixedExpense":
          fixedExpenses += amount
          break
        case "goalIncome":
          break
      }

      })

      setSummaryData({ income, expenses, fixedExpenses })
    })

    return () => unsubscribe()
  }, [user])

  // --- Prepare chart data dynamically ---
  const spendingData = {
    labels: ["Receitas", "Despesas", "Despesas Fixas"],
    datasets: [
      {
        label: "Valores (R$)",
        data: [
          summaryData.income,
          summaryData.expenses,
          summaryData.fixedExpenses,
        ],
        backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
        borderWidth: 1,
      },
    ]
  }
    // Função de teste para apagar todos os dados do usuário
   const handleDeleteAllData = async () => {
    if (!user) return
    if (!confirm("Deseja realmente apagar todos os dados? Isso não pode ser desfeito.")) return

    try {
      // Transações
      const transactionsSnapshot = await getDocs(query(collection(db, "transactions"), where("userId", "==", user.uid)))
      for (const docSnap of transactionsSnapshot.docs) {
        await deleteDoc(doc(db, "transactions", docSnap.id))
      }

      // Assinaturas
      const subscriptionsSnapshot = await getDocs(query(collection(db, "subscriptions"), where("userId", "==", user.uid)))
      for (const docSnap of subscriptionsSnapshot.docs) {
        await deleteDoc(doc(db, "subscriptions", docSnap.id))
      }

      // Metas
      const goalsSnapshot = await getDocs(query(collection(db, "goals"), where("userId", "==", user.uid)))
      for (const docSnap of goalsSnapshot.docs) {
        await deleteDoc(doc(db, "goals", docSnap.id))
      }

      toast.dismiss()
      toast.success("Todos os dados foram apagados com sucesso!")
      setReloadFlag((prev) => prev + 1) 
    } catch (err) {
      toast.error("Ocorreu um erro ao apagar os dados.")
      console.error("Erro ao apagar dados:", err)
    }
  }

  const getTransactionIcon = (item: any) => {
    if ((item.amount ?? 0) > 0) return <ArrowUpRight className="text-green-400" size={18} />
    if (/mercado/i.test(item.title ?? "")) return <ShoppingCart className="text-red-400" size={18} />
    if (/netflix/i.test(item.title ?? "")) return <Film className="text-red-400" size={18} />
    return <ArrowDownLeft className="text-red-400" size={18} />
  }

  const ICONS_MAP: Record<string, JSX.Element> = {
    spotify: <Music className="text-green-500" size={18} />,
    netflix: <Tv className="text-red-500" size={18} />,
    amazon: <ShoppingBag className="text-yellow-500" size={18} />,
    disney: <Film className="text-blue-400" size={18} />,
    apple: <CreditCard className="text-gray-500" size={18} />,
  }

  const getSubscriptionIcon = (item: any) => {
    const key = (item.name ?? "").toLowerCase()
    return ICONS_MAP[key] ?? <CreditCard className="text-gray-400" size={18} />
  }

  const formatSubscriptionValue = (item: CardItem) =>
    item.value !== undefined ? `- R$ ${item.value.toFixed(2)}` : "- R$ 0.00"

  if (loading || !user) return <div className="p-8">Carregando...</div>

  return (
    <div className="flex h-screen relative">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="p-6 space-y-6">
          {/* 1. Resumo geral */}
          <DashboardSummary />
          <div className="flex justify-end mb-4">
            <button
              onClick={handleDeleteAllData}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Apagar Todos os Dados (Teste)
            </button>
          </div>
          {/* 2. Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Gastos por categoria" chartType="doughnut" data={categoryChartData} />
            <ChartCard title="Resumo por categoria" chartType="bar" data={categoryChartData} />
          </div>

          {/* 3 e 4: Transações e Assinaturas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <CardGlobal
            title="Transações Recentes"
            firebaseQuery={query(collection(db, "transactions"), where("userId", "==", user.uid))}
            getIcon={getTransactionIcon}
            reloadFlag={reloadFlag}
          />
          <CardGlobal
            cardType="subscription"
            title="Despesas fixas"
            firebaseQuery={query(collection(db, "subscriptions"), where("userId", "==", user.uid))}
            getIcon={getSubscriptionIcon}
            formatValue={formatSubscriptionValue}
            reloadFlag={reloadFlag}
          />
          </div>
        </div>

        {/* Botão flutuante */}
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
