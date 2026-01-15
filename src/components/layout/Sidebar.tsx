'use client'

import { useRouter, usePathname } from 'next/navigation'
import React from 'react'
import { clsx } from 'clsx'
import { useAuth } from '@/src/context/AuthContext'
import { 
  LayoutDashboard, 
  Target, 
  LogOut, 
  Wallet,
  Settings,
  PieChart
} from 'lucide-react'

const Sidebar: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/auth')
  }

  const navItems = [
    { icon: LayoutDashboard, path: '/home', label: 'Início' },
    { icon: PieChart, path: '/relatorios', label: 'Análise' },
    { icon: Target, path: '/metas', label: 'Metas' },
    { icon: Settings, path: '/perfil', label: 'Ajustes' },
  ]

  const isActive = (path: string) => 
    pathname === path || (path === '/home' && pathname === '/')

  return (
    <aside className="fixed top-0 left-0 h-screen w-20 flex flex-col justify-between items-center py-8 bg-[#0a0a0a] border-r border-white/[0.02] z-50">
      
      <div className="relative group cursor-pointer" onClick={() => router.push('/home')}>
        <div className="absolute inset-0 bg-white opacity-0 blur-xl group-hover:opacity-20 transition-opacity duration-700" />
        <div className="relative w-12 h-12 rounded-2xl bg-white flex items-center justify-center transition-transform duration-500 group-hover:scale-90 group-active:scale-75">
           <Wallet className="w-6 h-6 text-black" strokeWidth={2.5} />
        </div>
      </div>

      <nav className="flex flex-col items-center gap-4 bg-white/[0.02] border border-white/[0.05] p-2 rounded-[2rem] backdrop-blur-md">
        {navItems.map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              title={item.label}
              className="relative group w-12 h-12 flex items-center justify-center outline-none transition-all"
            >
              {active && (
                <div className="absolute -left-1 w-1 h-4 bg-white rounded-full shadow-[0_0_10px_#fff]" />
              )}

              <Icon 
                className={clsx(
                  "w-5 h-5 transition-all duration-500 relative z-10",
                  active 
                    ? "text-white scale-110" 
                    : "text-white/20 group-hover:text-white/60 group-hover:scale-110"
                )}
                strokeWidth={active ? 2.5 : 1.5}
              />

              <div className={clsx(
                "absolute inset-0 rounded-xl transition-all duration-500 opacity-0 group-hover:opacity-100",
                active ? "bg-white/10 opacity-100" : "bg-white/[0.02] scale-50 group-hover:scale-100"
              )} />
            </button>
          )
        })}
      </nav>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleLogout}
          className="w-12 h-12 flex items-center justify-center rounded-2xl text-white/10 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-500 group active:scale-75"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:rotate-12" />
        </button>

        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
      </div>
    </aside>
  )
}

export default Sidebar