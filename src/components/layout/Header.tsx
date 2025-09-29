'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useCallback } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import { useRouter } from 'next/navigation'

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  // Pode pegar o displayName ou email do usuário
  const userName = user?.displayName || user?.email || 'Usuário'

  const handlePerfil = useCallback(() => {
    if (!user) return
    router.push('/perfil')
  }, [user, router])

  const handleLogout = useCallback(async () => {
    await logout()
    router.push('/auth')
  }, [logout, router])

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-sm w-full">
      {/* Campo de busca */}
      <div className="w-full max-w-md relative">
        {/* Exemplo de input de busca, se quiser usar */}
        <input
          type="text"
          placeholder="Buscar..."
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      </div>

      {/* Perfil */}
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-700 font-medium">{userName}</span>
        <button
          onClick={handlePerfil}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Perfil
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Sair
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-400" />
      </div>
    </header>
  )
}

export default Header
