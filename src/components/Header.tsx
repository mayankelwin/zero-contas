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
