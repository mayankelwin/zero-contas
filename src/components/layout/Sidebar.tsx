"use client"

import { useRouter, usePathname } from 'next/navigation'
import React, { useCallback, memo } from 'react'
import { clsx } from 'clsx'
import { useAuth } from '@/src/context/AuthContext'
import { 
  LayoutDashboard, 
  Target, 
  LogOut, 
  Wallet,
  Settings,
  PieChart,
  Sparkles
} from 'lucide-react'

const Sidebar: React.FC = memo(() => {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()

  const handleLogout = useCallback(async () => {
    await logout()
    router.push('/auth')
  }, [logout, router])

  const navItems = [
    { icon: LayoutDashboard, path: '/home', label: 'Overview' },
    { icon: PieChart, path: '/relatorios', label: 'Estratégia' },
    { icon: Target, path: '/metas', label: 'Objetivos' },
    { icon: Settings, path: '/perfil', label: 'Parâmetros' },
  ]

  const isActive = (path: string) => 
    pathname === path || (path === '/home' && pathname === '/')

  return (
    <aside className="fixed top-0 left-0 h-screen w-24 flex flex-col justify-between items-center py-10 bg-[#080809] border-r border-white/[0.04] z-50 transition-all duration-500">
      
      {/* Logo Moderno */}
      <div className="relative group cursor-pointer" onClick={() => router.push('/home')}>
        <div className="absolute inset-0 bg-white opacity-0 blur-2xl group-hover:opacity-20 transition-opacity duration-700" />
        <div className="relative w-14 h-14 rounded-3xl bg-white flex items-center justify-center transition-all duration-700 group-hover:rounded-[1.5rem] group-active:scale-90 shadow-2xl">
           <Wallet className="w-7 h-7 text-black" strokeWidth={2.5} />
        </div>
      </div>

      {/* Navegação Elite */}
      <nav className="flex flex-col items-center gap-6 p-2 bg-white/[0.02] border border-white/[0.05] rounded-[3rem] backdrop-blur-xl shadow-2xl">
        {navItems.map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="relative group w-14 h-14 flex items-center justify-center outline-none transition-all duration-500"
            >
              {active && (
                <div className="absolute left-[-8px] w-1 h-6 bg-white rounded-full shadow-[0_0_20px_#fff] animate-in slide-in-from-left-2 duration-700" />
              )}

              <Icon 
                className={clsx(
                  "w-5 h-5 transition-all duration-500 relative z-10",
                  active 
                    ? "text-white scale-110" 
                    : "text-white/20 group-hover:text-emerald-500 group-hover:scale-110"
                )}
                strokeWidth={active ? 2.5 : 1.5}
              />

              <div className={clsx(
                "absolute inset-0 rounded-2xl transition-all duration-700",
                active ? "bg-white/10 opacity-100" : "bg-white/[0.01] scale-50 opacity-0 group-hover:opacity-100 group-hover:scale-100"
              )} />
              
              {/* Tooltip Premium */}
              <div className="absolute left-20 px-4 py-2 bg-black/90 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-x-2 transition-all duration-500 whitespace-nowrap z-[60] backdrop-blur-md">
                 {item.label}
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="flex flex-col items-center gap-6">
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-inner">
           <Sparkles size={14} className="text-white/10 animate-pulse" strokeWidth={1} />
        </div>
        
        <button
          onClick={handleLogout}
          className="w-14 h-14 flex items-center justify-center rounded-3xl text-white/10 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-700 group active:scale-90"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
        </button>

        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
      </div>
    </aside>
  )
})

export default Sidebar