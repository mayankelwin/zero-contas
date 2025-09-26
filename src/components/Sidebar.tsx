'use client'

import { HomeIcon, ArrowRightOnRectangleIcon, StarIcon } from '@heroicons/react/24/outline'
import { useRouter, usePathname } from 'next/navigation'
import React from 'react'
import clsx from 'clsx'
import { useAuth } from '@/src/context/AuthContext'

const Sidebar: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/auth')
  }

  // Função para verificar se o ícone está ativo
  const isActive = (path: string) => pathname === path

  return (
    <aside className="w-16 sm:w-20 h-screen flex flex-col justify-between items-center py-6 shadow-md bg-[#1E1F24]">
      {/* Topo vazio ou logotipo futuro */}
      <div />

      {/* Ícones centrais */}
      <div className="flex flex-col items-center space-y-6">
        {/* Home */}
        <button
          onClick={() => router.push('/home')}
          className={clsx(
            'p-3 rounded-full transition-colors duration-200 hover:cursor-pointer',
            isActive('/home') || isActive('/') ? 'bg-violet-500' : 'hover:bg-gray-300'
          )}
        >
          <HomeIcon
            className={clsx(
              'h-6 w-6',
              isActive('/home') || isActive('/') ? 'text-white' : 'text-gray-700'
            )}
          />
        </button>

        {/* Metas */}
        <button
          onClick={() => router.push('/metas')}
          className={clsx(
            'p-3 rounded-full transition-colors duration-200 hover:cursor-pointer',
            isActive('/metas') ? 'bg-orange-500' : 'hover:bg-gray-300'
          )}
        >
          <StarIcon
            className={clsx(
              'h-6 w-6',
              isActive('/metas') ? 'text-white' : 'text-gray-700'
            )}
          />
        </button>

        {/* Outros ícones fictícios */}
        {/* <div className="w-6 h-6 bg-gray-400 rounded-full" />
        <div className="w-6 h-6 bg-gray-400 rounded-full" />
        <div className="w-6 h-6 bg-gray-400 rounded-full" /> */}
      </div>

      {/* Botão de logout no rodapé */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleLogout}
          className="p-3 rounded-full hover:bg-gray-300 transition-colors hover:cursor-pointer"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
