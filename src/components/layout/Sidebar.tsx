'use client'

import { useRouter, usePathname } from 'next/navigation'
import React from 'react'
import { clsx } from 'clsx'
import { useAuth } from '@/src/context/AuthContext'
import { 
  LayoutDashboard, 
  Target, 
  LogOut, 
  Wallet
} from 'lucide-react' // Padronizando com Lucide como nos outros componentes

const Sidebar: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/auth')
  }

  const navItems = [
    {
      icon: LayoutDashboard,
      path: '/home',
      activeColor: 'text-violet-500',
      activeBg: 'bg-violet-500/10'
    },
    {
      icon: Target,
      path: '/metas',
      activeColor: 'text-emerald-500',
      activeBg: 'bg-emerald-500/10'
    }
  ]

  const isActive = (path: string) => 
    pathname === path || (path === '/home' && pathname === '/')

  return (
    <aside className="fixed top-0 left-0 h-screen w-20 flex flex-col justify-between items-center py-8 bg-[#111113] border-r border-white/[0.04] z-50">
      
      {/* Logo Section */}
      <div className="flex flex-col items-center gap-1 group cursor-default">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500">
           <Wallet className="w-6 h-6 text-black" strokeWidth={2.5} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-tighter text-white/40 leading-none">Zero</span>
        <span className="text-[10px] font-black uppercase tracking-tighter text-white/40 leading-none">Contas</span>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col items-center gap-8">
        {navItems.map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="relative group p-4 outline-none transition-all"
            >
              {/* Indicador de Seleção Lateral */}
              {active && (
                <div className={clsx(
                  "absolute left-[-20px] top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full shadow-[0_0_15px]",
                  item.path === '/home' ? "bg-violet-500 shadow-violet-500/50" : "bg-emerald-500 shadow-emerald-500/50"
                )} />
              )}

              <Icon 
                className={clsx(
                  "w-6 h-6 transition-all duration-300 relative z-10",
                  active 
                    ? `${item.activeColor} scale-110` 
                    : "text-gray-500 group-hover:text-gray-300 group-hover:scale-110"
                )}
                strokeWidth={active ? 2.5 : 2}
              />

              {/* Glow de fundo no Hover/Active */}
              <div className={clsx(
                "absolute inset-0 rounded-2xl transition-all duration-500 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100",
                active ? `${item.activeBg} scale-100 opacity-100` : "bg-white/[0.03]"
              )} />
            </button>
          )
        })}
      </nav>

      {/* Logout Section */}
      <div className="w-full px-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-4 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 group active:scale-90"
        >
          <LogOut className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar