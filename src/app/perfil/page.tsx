"use client"

import Header from "@/src/components/layout/Header"
import Sidebar from "@/src/components/layout/Sidebar"
import { LoadingPage } from "@/src/components/Loading"
import useCustomerModal, { useProfileModal } from "@/src/components/CustomerModal"
import { useHomeLogic } from "../home/useHomeLogic"
import { useInfosGeral } from "@/src/hooks/transactions/useInfosGeral"
import { useEffect, useState } from "react"
import { Edit3, Mail, MapPin, Briefcase, Calendar, DollarSign, PieChart, CreditCard, User } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { formatCurrency } from "@/src/utils/formatCurrency"
import ProfileModal from "@/src/components/CustomerModal"

// Componentes reutilizáveis
import { InfoItem } from "@/src/components/perfil/InfoItem"
import { FinanceCard } from "@/src/components/perfil/FinanceCard"
import { SummaryItem } from "@/src/components/perfil/SummaryItem"
import { BioSection } from "@/src/components/perfil/BioSection"
import { UserCard } from "@/src/components/perfil/UserCard"
import { FinanceDashboard } from "@/src/components/perfil/FinanceDashboard"

// Exemplo de perfil para modal
const exampleProfile = {
  firstName: "Right",
  lastName: "test",
  email: "123@example.com",
  department: "Sales",
  jobTitle: "Senior SE",
  location: "Chennai",
  salary: "5000"
}

export default function PerfilPage() {
  const { user, loading } = useHomeLogic()
  const { isModalOpen, openModal, closeModal } = useProfileModal()
  const { balance, summary, goals, subcriptions } = useInfosGeral()

  const [userProfile, setUserProfile] = useState<any>(null)

  // Buscar dados extras do usuário no Firestore
  useEffect(() => {
    if (!user) return

    const fetchUserData = async () => {
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        setUserProfile({
          name: user.displayName || data.displayName || "Usuário",
          email: user.email || data.email || "",
          role: data.role || "Sem cargo definido",
          location: data.location || "Não informado",
          bio: data.bio || "",
          joinDate: data.joinDate || "Não informado",
          skills: data.skills || [],
          stats: data.stats || { projects: 0, completed: 0, inProgress: 0 },
        })
      } else {
        setUserProfile({
          name: user.displayName || "Usuário",
          email: user.email || "",
          role: "Sem cargo definido",
          location: "Não informado",
          bio: "",
          joinDate: "Não informado",
          skills: [],
          stats: { projects: 0, completed: 0, inProgress: 0 },
        })
      }
    }

    fetchUserData()
  }, [user])

  if (loading || !user || !userProfile) return <LoadingPage />

  const totalExpenses = summary.expenses + summary.fixedExpenses
  const netBalance = balance - totalExpenses
  const savingsRate = balance > 0 ? ((balance - totalExpenses) / balance) * 100 : 0

  return (
    <div className="flex h-screen bg-[#1A1A1A]">
      <Sidebar />
      <main className="flex-1 ml-16 sm:ml-20 overflow-auto">
        <Header />

        <div className="p-6 space-y-8 ">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">
              Meu Perfil
            </h1>
            <p className="text-gray-400 text-lg">
              Gerencie suas informações pessoais e profissionais
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UserCard userProfile={userProfile} onEdit={() => openModal(exampleProfile)}/>
            <BioSection profile={userProfile} />
            <FinanceDashboard balance={balance} summary={summary} goals={goals} subcriptions={subcriptions} />
            
          </div>
        </div>

        {/* Modal */}
        <ProfileModal isOpen={isModalOpen} onClose={closeModal} uid={user.uid} />
      </main>
    </div>
  )
}
