'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useAuth } from '@/src/context/AuthContext'

const Header: React.FC = () => {
  const { user } = useAuth()

  // Pode pegar o displayName ou email do usuário
  const userName = user?.displayName || user?.email || 'Usuário'

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-sm w-full">
      {/* Campo de busca */}
      <div className="w-full max-w-md relative">
        <input
          type="text"
          placeholder="Pesquisar nome do livro, autor e edição..."
          className="w-full pl-10 pr-4 py-2 placeholder-gray-500 text-sm text-gray-800 focus:outline-none"
        />
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
      </div>

      {/* Perfil */}
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-700 font-medium">{userName}</span>
        <div className="w-8 h-8 rounded-full bg-gray-400" />
      </div>
    </header>
  )
}

export default Header
