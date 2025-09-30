"use client"

import { useState } from "react"
import { X, User, Mail, Calendar, DollarSign, Globe, MapPin } from "lucide-react"

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
    // Aqui você implementaria a lógica para salvar as alterações
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
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
            <p className="text-gray-500 mt-1">{customer.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">First seen</span>
                </div>
                <p className="text-gray-900 font-semibold">{customer.firstSeen}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">First purchase</span>
                </div>
                <p className="text-gray-900 font-semibold">{customer.firstPurchase}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                  <DollarSign size={16} />
                  <span className="text-sm font-medium">Revenue</span>
                </div>
                <p className="text-gray-900 font-semibold">{customer.revenue}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                  <DollarSign size={16} />
                  <span className="text-sm font-medium">MRR</span>
                </div>
                <p className="text-gray-900 font-semibold">{customer.mrr}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Name Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User size={18} className="text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Name</h3>
                </div>
                <div className="space-y-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {customer.name.split(' ').map((namePart, index) => (
                        <p key={index} className="text-gray-700">• {namePart}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mail size={18} className="text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Email address</h3>
                </div>
                <div className="space-y-2">
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="space-y-1">
                      {customer.email.split(', ').map((email, index) => (
                        <p key={index} className="text-gray-700">• {email}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Country Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={18} className="text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Country</h3>
                </div>
                <div className="space-y-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700">• {customer.country}</p>
                  )}
                </div>
              </div>

              {/* Username Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={18} className="text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Username</h3>
                </div>
                <div className="space-y-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      {formData.username.map((username, index) => (
                        <input
                          key={index}
                          type="text"
                          value={username}
                          onChange={(e) => {
                            const newUsernames = [...formData.username]
                            newUsernames[index] = e.target.value
                            setFormData({...formData, username: newUsernames})
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {customer.username.map((username, index) => (
                        <p key={index} className="text-gray-700">• {username}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Customer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook para usar o modal
export function useCustomerModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

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
