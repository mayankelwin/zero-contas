"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { useHomeLogic } from "../home/useHomeLogic"
import { useInfosGeral } from "@/src/hooks/transactions/useInfosGeral"
import { formatCurrency } from "@/src/utils/formatCurrency"

import Sidebar from "@/src/components/layout/Sidebar"
import { LoadingPage } from "@/src/components/ui/Loading"
import ProfileModal, { useProfileModal } from "@/src/components/modal/CustomerModal"

import { 
  User,
  Settings, 
  ShieldCheck, 
  ArrowUpRight, 
  Fingerprint, 
  Globe, 
  Wallet
} from "lucide-react"

export default function PerfilPage() {
  const { user, loading } = useHomeLogic()
  const { isModalOpen, openModal, closeModal } = useProfileModal()
  const { balance, summary } = useInfosGeral()
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    if (!user) return
    const fetchUserData = async () => {
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)
      const data = docSnap?.data() || {}
      setUserProfile({
        name: user.displayName || data.displayName || "Usuário",
        email: user.email || data.email || "",
        role: data.role || "Membro Platinum",
        location: data.location || "São Paulo, BR",
        bio: data.bio || "Gestão inteligente de patrimônio e ativos digitais.",
        joinDate: data.joinDate || "2024",
      })
    }
    fetchUserData()
  }, [user])

  if (loading || !user || !userProfile) return <LoadingPage />

  return (
    <div className="flex h-screen text-white selection:bg-white selection:text-black">
      <Sidebar />
      
      <main className="flex-1 ml-16 sm:ml-20 overflow-y-auto">

        <div className="max-w-[1400px] mx-auto p-6 lg:p-12">
          
          <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
            
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-tr from-white/20 via-white/5 to-transparent rounded-full blur-md opacity-50"></div>
              <div className="relative w-44 h-44 rounded-full border-2 p-2 ">
                <div className="w-full h-full rounded-full bg-[#161618] flex items-center justify-center overflow-hidden border border-white/5">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  ) : (
                    <User size={60} className="text-white/10" />
                  )}
                </div>
              </div>
              <button 
                onClick={() => openModal()}
                className="absolute bottom-4 right-4 bg-white text-black p-2.5 rounded-2xl  hover:rotate-90 transition-all duration-500 shadow-2xl"
              >
                <Settings size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                    ID: {user.uid.slice(0, 8)}
                  </span>
                  <div className="h-[1px] w-12 bg-white/10"></div>
                  <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">
                    <ShieldCheck size={12} /> Verificado
                  </span>
                </div>
                <h1 className="text-6xl font-black tracking-tighter leading-none mb-4 uppercase">
                  {userProfile.name.split(' ')[0]} <br/>
                  <span className="text-white/20">{userProfile.name.split(' ')[1] || 'User'}</span>
                </h1>
              </div>

              <div className="flex flex-wrap gap-8 py-6 border-y border-white/[0.03]">
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="bg-[#161618] rounded-2xl p-10 border border-white/[0.03] space-y-8">
                <div className="space-y-2">
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Biografia</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    {userProfile.bio}
                  </p>
                </div>

                <div className="space-y-4 pt-8 border-t border-white/[0.03]">
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Segurança do Terminal</h3>
                  <div className="grid gap-3">
                    <button className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/5 transition-all group">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Digital Fingerprint</span>
                      <Fingerprint size={16} className="text-white/20" />
                    </button>
                    <button className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/5 transition-all group">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Global Node Access</span>
                      <Globe size={16} className="text-white/20" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 space-y-8">
              
              <div className="relative overflow-hidden bg-white rounded-2xl p-12 text-black">
                <div className="absolute top-0 right-0 p-8">
                  <Wallet size={40} className="text-black/15" strokeWidth={3} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                  <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40">Patrimônio Gerenciado</p>
                    <h2 className="text-6xl font-black tracking-tighter leading-none">
                      {formatCurrency(balance)}
                    </h2>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-xl mb-1">
                      <ArrowUpRight size={24} strokeWidth={3} /> 12.5%
                    </div>
                    <p className="text-[10px] font-black uppercase text-black/30 tracking-widest">Performance Global</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#161618] rounded-2xl p-8 border border-white/[0.03] flex justify-between items-center group hover:bg-[#1c1c1e] transition-all">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Cashflow Mensal</p>
                    <p className="text-2xl font-black tracking-tighter">{formatCurrency(summary.income)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20 group-hover:text-white group-hover:border-white/20 transition-all">
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                <div className="bg-[#161618] rounded-2xl  p-8 border border-white/[0.03] flex justify-between items-center group hover:bg-[#1c1c1e] transition-all">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Custos de Operação</p>
                    <p className="text-2xl font-black tracking-tighter">{formatCurrency(summary.expenses + summary.fixedExpenses)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl  bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20 group-hover:text-red-400 group-hover:border-red-400/20 transition-all">
                    <ArrowUpRight size={20} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/[0.05]">
                <div className="flex items-center gap-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                  <span className="hover:text-white cursor-pointer transition-colors">Documentação API</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Logs de Acesso</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Termos</span>
                </div>
                <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">
                  Zero Contas Engine v2.0.4
                </p>
              </div>
            </div>
          </div>
        </div>
        <ProfileModal isOpen={isModalOpen} onClose={closeModal} uid={user.uid} />
      </main>
    </div>
  )
}