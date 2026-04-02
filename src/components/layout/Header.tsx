'use client'

import React, { useCallback, memo } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import { useRouter } from 'next/navigation'
import { LogOut, User, Search, Fingerprint } from 'lucide-react'
import { cn } from "@/src/lib/utils"

const Header: React.FC = memo(() => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const userName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Member'

  const handlePerfil = useCallback(() => {
    if (!user) return
    router.push('/perfil')
  }, [user, router])

  const handleLogout = useCallback(async () => {
    await logout()
    router.push('/auth')
  }, [logout, router])

  return (
    <header className="flex justify-between items-center px-10 py-8 w-full bg-transparent animate-in fade-in slide-in-from-top-2 duration-1000">
      
      {/* Global Command Center */}
      <div className="flex-1 max-w-2xl relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-white/10 group-focus-within:text-emerald-500 transition-colors">
          <Search size={14} strokeWidth={3} />
        </div>
        <input
          type="text"
          placeholder="PESQUISAR NO ECOSSISTEMA..."
          className="w-full bg-[#0f0f11]/40 border border-white/[0.04] pl-16 pr-8 py-4 rounded-[1.5rem] text-[10px] font-black tracking-[0.4em] text-white placeholder:text-white/10 outline-none focus:border-white/10 focus:bg-white/[0.02] transition-all uppercase italic shadow-2xl"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 opacity-10 group-focus-within:opacity-40 transition-opacity">
          <span className="text-[10px] font-black border border-white/20 px-2 py-1 rounded-lg">⌘</span>
          <span className="text-[10px] font-black border border-white/20 px-2 py-1 rounded-lg">K</span>
        </div>
      </div>

      <div className="flex items-center gap-10 ml-12">
        
        {/* Perfil & Identidade */}
        <div className="hidden lg:flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
             <Fingerprint size={10} className="text-emerald-500" />
             <span className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic">
               ID: {userName}
             </span>
          </div>
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">
            Status: Elite Membership
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handlePerfil}
            className="relative group p-0.5 rounded-full ring-2 ring-transparent hover:ring-white/10 transition-all duration-700"
          >
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-all duration-700" />
            
            <div className="relative w-12 h-12 rounded-full bg-[#0f0f11] border border-white/[0.05] group-hover:border-white/20 overflow-hidden shadow-2xl transition-all">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Perfil" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/10 group-hover:text-white transition-colors">
                  <User size={18} strokeWidth={1.5} />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#080809] shadow-lg" />
          </button>

          <div className="h-8 w-px bg-white/[0.03] mx-2" />

          <button
            onClick={handleLogout}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-white/10 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/10 transition-all group active:scale-90"
            title="Sincronizar & Sair"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  )
})

export default Header