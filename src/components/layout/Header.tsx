'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useCallback } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import { useRouter } from 'next/navigation'
import { LogOut, User, Command } from 'lucide-react'

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const userName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Agente'

  const handlePerfil = useCallback(() => {
    if (!user) return
    router.push('/perfil')
  }, [user, router])

  const handleLogout = useCallback(async () => {
    await logout()
    router.push('/auth')
  }, [logout, router])

  return (
    <header className="flex justify-between items-center px-8 py-6 w-full bg-transparent">
      
      <div className="flex-1 max-w-xl relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Command size={14} className="text-white/20 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="EXECUTAR BUSCA GLOBAL..."
          className="w-full bg-white/[0.03] border border-white/[0.05] pl-12 pr-4 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] text-white placeholder:text-white/10 outline-none focus:bg-white/[0.06] focus:border-white/20 transition-all uppercase"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 opacity-20 group-focus-within:opacity-50 transition-opacity">
          <span className="text-[9px] font-black border border-white/20 px-1.5 py-0.5 rounded">ALT</span>
          <span className="text-[9px] font-black border border-white/20 px-1.5 py-0.5 rounded">K</span>
        </div>
      </div>

      <div className="flex items-center gap-8 ml-8">
        
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">
            {userName}
          </span>
          <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest opacity-60">
            Sessão Ativa
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePerfil}
            className="relative group p-1 rounded-full"
          >
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            
            <div className="relative w-11 h-11 rounded-full bg-[#111111] border-2 border-white/5 group-hover:border-white/20 overflow-hidden transition-all">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <User size={20} />
                </div>
              )}
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-white/20 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all group"
            title="Encerrar Sessão"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header