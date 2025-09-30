"use client"

import Header from "@/src/components/layout/Header"
import Sidebar from "@/src/components/layout/Sidebar"
import { LoadingPage } from "@/src/components/Loading"
import CustomerModal, { useCustomerModal } from "@/src/components/CustomerModal"
import { useHomeLogic } from "../home/useHomeLogic"
import { useInfosGeral } from "@/src/hooks/useInfosGeral"
import { useState } from "react"
import { Edit3, Mail, MapPin, Briefcase, Calendar, DollarSign, PieChart, Target, CreditCard, User } from "lucide-react"

// Dados de exemplo para modal
const exampleCustomer = {
  name: "Maria Fernanda",
  email: "maria.fernanda@email.com, maria.profissional@email.com",
  firstSeen: "15 Jan. 2024",
  firstPurchase: "20 Jan. 2024",
  revenue: "$2,450.00",
  mrr: "$204.17",
  country: "Brazil",
  username: ["mariafernanda", "mariaf_dev"]
}

export default function PerfilPage() {
  const { user, loading } = useHomeLogic()
  const { balance, expanse, expensefixes, goals, subcriptions } = useInfosGeral()
  const { isModalOpen, openModal, closeModal } = useCustomerModal()

  const [userProfile, setUserProfile] = useState({
    name: user?.displayName || "Maria Fernanda",
    email: user?.email || "maria.fernanda@email.com",
    role: "Software Engineer",
    location: "São Paulo, SP",
    bio: "Desenvolvedora Full Stack com experiência em React, Node.js e TypeScript. Apaixonada por criar soluções inovadoras e eficientes.",
    joinDate: "Janeiro 2024",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python"],
    stats: { projects: 12, completed: 8, inProgress: 4 }
  })

  if (loading || !user) return <LoadingPage />

  // Cálculos financeiros
  const totalExpenses = expanse + expensefixes
  const netBalance = balance - totalExpenses
  const savingsRate = balance > 0 ? ((balance - totalExpenses) / balance) * 100 : 0

  return (
    <div className="flex h-screen bg-[#1A1A1A]">
      <Sidebar />
      <main className="flex-1 ml-16 sm:ml-20 overflow-auto">
        <Header />

        <div className="p-6 space-y-8">
          {/* Cabeçalho do Perfil */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">
              Meu Perfil
            </h1>
            <p className="text-gray-400 text-lg">
              Gerencie suas informações pessoais e profissionais
            </p>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Coluna Esquerda - Informações Pessoais */}
            <div className="space-y-8">
              {/* Card do Usuário */}
              <div className="bg-[#1E1F24] rounded-3xl p-8 border border-gray-700/50 shadow-2xl text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 p-1">
                    <img
                      src="/avatar.png"
                      alt={userProfile.name}
                      className="w-full h-full rounded-full object-cover border-4 border-[#1E1F24]"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-400/80 rounded-full p-2 shadow-lg">
                    <User size={16} className="text-white" />
                  </div>
                </div>

                {/* Informações */}
                <h2 className="text-2xl font-bold text-white mb-2">{userProfile.name}</h2>
                <div className="flex items-center justify-center gap-2 text-violet-400 mb-2">
                  <Briefcase size={16} />
                  <span className="font-semibold">{userProfile.role}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
                  <MapPin size={14} />
                  <span className="text-sm">{userProfile.location}</span>
                </div>

                <button
                  onClick={() => openModal(exampleCustomer)}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-3 transition-transform duration-300 hover:scale-105 shadow-lg"
                >
                  <Edit3 size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  Editar Perfil
                </button>
              </div>

              {/* Estatísticas */}
              <div className="bg-[#1E1F24] rounded-3xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <Target className="text-green-400" size={20} />
                  Estatísticas
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
                    <span className="text-gray-300">Projetos Concluídos</span>
                    <span className="text-green-400 font-bold text-lg">{userProfile.stats.completed}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
                    <span className="text-gray-300">Projetos em Andamento</span>
                    <span className="text-blue-400 font-bold text-lg">{userProfile.stats.inProgress}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
                    <span className="text-gray-300">Membro desde</span>
                    <span className="text-yellow-400 font-bold text-lg">{userProfile.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Central - Informações Profissionais */}
            <div className="space-y-8">
              {/* Bio */}
              <div className="bg-[#1E1F24] rounded-3xl p-8 border border-gray-700/50 space-y-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <User className="text-violet-400" size={24} />
                  Informações Pessoais
                </h3>
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <h4 className="text-white font-semibold mb-3">Bio</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{userProfile.bio}</p>
                </div>

                {/* Contato */}
                <div className="grid grid-cols-1 gap-4">
                  <InfoItem icon={Mail} label="Email" value={userProfile.email} />
                  <InfoItem icon={MapPin} label="Localização" value={userProfile.location} />
                  <InfoItem icon={Calendar} label="Membro desde" value={userProfile.joinDate} />
                </div>
              </div>

              {/* Habilidades */}
              <div className="bg-[#1E1F24] rounded-3xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <Target className="text-blue-400" size={20} />
                  Habilidades
                </h3>
                <div className="flex flex-wrap gap-3">
                  {userProfile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className={`px-4 py-2 rounded-2xl text-sm font-medium ${
                        i === 0
                          ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna Direita - Financeiro */}
            <div className="space-y-8">
              {/* Dashboard Financeiro */}
              <div className="bg-[#1E1F24] rounded-3xl p-8 border border-gray-700/50 space-y-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <PieChart className="text-violet-400" size={24} />
                  Dashboard Financeiro
                </h3>

                {/* Saldo Total */}
                <FinanceCard
                  label="Saldo Total"
                  value={`R$ ${balance.toFixed(2)}`}
                  icon={<DollarSign className="text-green-400" size={24} />}
                  gradient="from-green-500/10 to-emerald-500/10"
                />

                {/* Despesas */}
                <div className="grid grid-cols-2 gap-4">
                  <FinanceCard label="Despesas Variáveis" value={`R$ ${expanse.toFixed(2)}`} color="red" />
                  <FinanceCard label="Despesas Fixas" value={`R$ ${expensefixes.toFixed(2)}`} color="orange" />
                </div>

                {/* Resultado Líquido */}
                <FinanceCard
                  label="Resultado Líquido"
                  value={`R$ ${netBalance.toFixed(2)}`}
                  subText={
                    savingsRate >= 0
                      ? `Taxa de economia: ${savingsRate.toFixed(1)}%`
                      : `Déficit: ${Math.abs(savingsRate).toFixed(1)}%`
                  }
                  gradient={netBalance >= 0 ? "from-green-500/10 to-emerald-500/10" : "from-red-500/10 to-rose-500/10"}
                  textColor={netBalance >= 0 ? "text-green-400" : "text-red-400"}
                />
              </div>

              {/* Metas e Assinaturas */}
              <div className="bg-[#1E1F24] rounded-3xl p-6 border border-gray-700/50 space-y-4">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <CreditCard className="text-blue-400" size={20} />
                  Resumo
                </h3>
                <div className="space-y-2">
                  <SummaryItem label="Metas Definidas" value={goals} color="green" />
                  <SummaryItem label="Assinaturas Ativas" value={subcriptions} color="blue" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        <CustomerModal isOpen={isModalOpen} onClose={closeModal} customer={exampleCustomer} />
      </main>
    </div>
  )
}

// Componente para itens de informação
function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-xl">
      <Icon className="text-blue-400" size={20} />
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  )
}

// Componente para cards financeiros
function FinanceCard({
  label,
  value,
  subText,
  icon,
  gradient,
  color,
  textColor
}: {
  label: string
  value: string
  subText?: string
  icon?: React.ReactNode
  gradient?: string
  color?: "red" | "orange" | "green"
  textColor?: string
}) {
  let bgColor = gradient ? `bg-gradient-to-r ${gradient}` : color === "red" ? "from-red-500/10 to-rose-500/10" : color === "orange" ? "from-orange-500/10 to-amber-500/10" : "from-green-500/10 to-emerald-500/10"
  let borderColor = color === "red" ? "border-red-500/20" : color === "orange" ? "border-orange-500/20" : "border-green-500/20"

  return (
    <div className={`border rounded-2xl p-4 ${bgColor} border ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm">{label}</p>
          <p className={`text-2xl font-bold ${textColor || "text-white"}`}>{value}</p>
        </div>
        {icon && <div className="p-3 bg-white/10 rounded-xl">{icon}</div>}
      </div>
      {subText && <p className="text-gray-400 text-xs mt-1">{subText}</p>}
    </div>
  )
}

// Componente para resumo de metas/assinaturas
function SummaryItem({ label, value, color }: { label: string; value: number; color: "green" | "blue" }) {
  let textColor = color === "green" ? "text-green-400" : "text-blue-400"
  return (
    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
      <span className="text-gray-300">{label}</span>
      <span className={`font-bold ${textColor}`}>{value}</span>
    </div>
  )
}
