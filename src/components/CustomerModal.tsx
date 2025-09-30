"use client"

import { useState } from "react"
import {
  X,
  User,
  Mail,
  Calendar,
  DollarSign,
  Globe,
  MapPin,
  CheckCircle,
} from "lucide-react"

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customer: {
    name: string
    email: string
    firstSeen: string
    firstPurchase: string
    revenue: string
    mrr: string
    country: string
    username: string[]
  }
}

export default function CustomerModal({ isOpen, onClose, customer }: CustomerModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
    country: customer.country,
    username: customer.username
  })

  if (!isOpen) return null

  const handleSave = () => {
    console.log("Dados salvos:", formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: customer.name,
      email: customer.email,
      country: customer.country,
      username: customer.username
    })
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 text-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-neutral-700">
          {/* Avatar + info */}
          <div className="flex gap-4">
            <div className="relative">
              <img
                src="/avatar.png" // Coloque o caminho correto da imagem
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
                <CheckCircle className="text-blue-500 w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold">{customer.name}</h2>
                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                  Subscribed
                </span>
              </div>
              <p className="text-sm text-gray-400">{customer.email}</p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2">
            <button className="text-sm border border-gray-600 px-3 py-1 rounded-md hover:bg-neutral-800">
              Archive
            </button>
            <button className="text-sm border border-gray-600 px-3 py-1 rounded-md hover:bg-neutral-800">
              View orders
            </button>
            <button
              onClick={onClose}
              className="ml-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "First seen", value: customer.firstSeen },
              { label: "First purchase", value: customer.firstPurchase },
              { label: "Revenue", value: customer.revenue },
              { label: "MRR", value: customer.mrr },
            ].map(({ label, value }, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-400 mb-1 text-sm">
                  <Calendar size={16} />
                  <span className="font-medium">{label}</span>
                </div>
                <p className="text-white font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <Label icon={<User size={18} />} title="Name" />
              {isEditing ? (
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-dark"
                />
              ) : (
                <p className="text-gray-300">• {customer.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label icon={<Mail size={18} />} title="Email address" />
              {isEditing ? (
                <input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-dark"
                />
              ) : (
                <p className="text-gray-300">• {customer.email}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <Label icon={<MapPin size={18} />} title="Country" />
              {isEditing ? (
                <input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="input-dark"
                />
              ) : (
                <p className="text-gray-300">• {customer.country}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <Label icon={<Globe size={18} />} title="Username" />
              {isEditing ? (
                formData.username.map((username, index) => (
                  <input
                    key={index}
                    value={username}
                    onChange={(e) => {
                      const newUsernames = [...formData.username]
                      newUsernames[index] = e.target.value
                      setFormData({ ...formData, username: newUsernames })
                    }}
                    className="input-dark mb-2"
                  />
                ))
              ) : (
                formData.username.map((username, index) => (
                  <p key={index} className="text-gray-300">• {username}</p>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-neutral-700 bg-neutral-800">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-300 border border-gray-600 rounded-md hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Customer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Reusable label component
function Label({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <h3 className="text-sm font-semibold text-white">{title}</h3>
    </div>
  )
}

// Tailwind input class (dark)
const inputClass =
  "input-dark w-full px-3 py-2 bg-neutral-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

// Hook para modal
export function useCustomerModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  const openModal = (customer: any) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCustomer(null)
  }

  return {
    isModalOpen,
    selectedCustomer,
    openModal,
    closeModal
  }
}
