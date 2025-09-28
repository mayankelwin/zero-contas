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

  const isActive = (path: string) => pathname === path

  return (
    <aside className="fixed top-0 left-0 h-screen w-20 sm:w-20 flex flex-col justify-between items-center py-6 shadow-md bg-[#1E1F24] z-50">
      {/* Topo: logo ou espaço */}
      <div className="flex flex-col items-center text-bold">
        <p className='text-sm text-bold'>Zero</p>
        <p className='text-sm text-bold'>Contas</p>
      </div>

      {/* Ícones centrais */}
      <div className="flex flex-col items-center space-y-6">
        <button
          onClick={() => router.push('/home')}
          className={clsx(
            'p-3 rounded-full transition-colors duration-200 hover:cursor-pointer',
            isActive('/home') || isActive('/') ? 'bg-violet-500' : 'hover:bg-gray-700'
          )}
        >
          <HomeIcon
            className={clsx(
              'h-6 w-6 transition-colors',
              isActive('/home') || isActive('/') ? 'text-white' : 'text-gray-400'
            )}
          />
        </button>

        <button
          onClick={() => router.push('/metas')}
          className={clsx(
            'p-3 rounded-full transition-colors duration-200 hover:cursor-pointer',
            isActive('/metas') ? 'bg-orange-500' : 'hover:bg-gray-700'
          )}
        >
          <StarIcon
            className={clsx(
              'h-6 w-6 transition-colors',
              isActive('/metas') ? 'text-white' : 'text-gray-400'
            )}
          />
        </button>
      </div>

      {/* Rodapé: logout */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleLogout}
          className="p-3 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
