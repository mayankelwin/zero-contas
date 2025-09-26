'use client'

import React from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'

interface AddButtonProps {
  onClick: () => void
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-6
        w-16 h-16
        bg-violet-500 hover:bg-violet-600
        text-white
        rounded-full shadow-lg
        flex items-center justify-center
        transition-colors
        z-50
        hover:cursor-pointer
      "
    >
      <PlusIcon className="w-10 h-10" />
    </button>
  )
}

export default AddButton
