"use client"

import { X } from "lucide-react"

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit?: () => void
  submitLabel?: string
  loading?: boolean
  showActions?: boolean
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Salvar",
  loading = false,
  showActions = true,
}: BaseModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-[#1E1F24]/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1E1F24] text-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto p-6 relative animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>

        {children}

        {showActions && (
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-gray-500 text-gray-300 hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onSubmit}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Salvando..." : submitLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
