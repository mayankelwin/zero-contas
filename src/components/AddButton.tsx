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
        bg-orange-500 hover:bg-orange-600
        text-white
        rounded-full shadow-lg
        flex items-center justify-center
        transition-colors
        z-50
      "
    >
      <PlusIcon className="w-8 h-8" />
    </button>
  )
}

export default AddButton
