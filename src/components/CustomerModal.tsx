"use client"

import { useEffect, useState } from "react"
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  MapPin,
  Lock,
  Camera,
  ClosedCaption,
  ArrowLeft,
} from "lucide-react"
import { Input } from "./Input"
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { formatCurrency } from '@/src/utils/formatCurrency';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"


interface ProfileModalProps {
  isOpen?: boolean
  onClose?: () => void
  uid: string
}

export default function ProfileModal({ isOpen = false, onClose = () => {}, uid }: ProfileModalProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [originalData, setOriginalData] = useState<any>(null);
  
  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    paymentOption: "",
    paymentdate: 0,
    planStatus: "",
    salary: 0,
    jobTitle: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    if (!isOpen || !uid) return;

      const fetchUser = async () => {
        const docRef = doc(db, "users", uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            role: data.role || "",
            paymentOption: data.paymentOption || "",
            paymentdate: data.paymentdate || 0,
            planStatus: data.planStatus || "",
            salary: data.salary || 0,
            jobTitle: data.jobTitle || "",
            newPassword: "",
            confirmPassword: ""
          })
          setOriginalData({ ...data })
          if (data.profileImage) setProfileImage(data.profileImage) 
        }
      }

      fetchUser()
    }, [isOpen, uid])


  if (!isOpen) return null

  const handleSave = async () => {
    try {
      if (!uid) throw new Error("Usuário não definido")

      const docRef = doc(db, "users", uid)

      let imageUrl = profileImage

      // Se o usuário escolheu uma nova imagem, faz upload
      if (uploadedFile) {
        const storage = getStorage()
        const storageRef = ref(storage, `profileImages/${uid}/${uploadedFile.name}`)
        await uploadBytes(storageRef, uploadedFile)
        imageUrl = await getDownloadURL(storageRef)
      }

      const dataToUpdate: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        paymentOption: formData.paymentOption,
        paymentdate: formData.paymentdate,
        salary: formData.salary,
        jobTitle: formData.jobTitle,
        ...(imageUrl && { profileImage: imageUrl }) // só salva se tiver URL
      }

      await updateDoc(docRef, dataToUpdate)

      alert("Perfil atualizado com sucesso!")
      setIsEditing(false)
      setShowPasswordFields(false)
      setUploadedFile(null)
      setFormData(prev => ({ ...prev, newPassword: "", confirmPassword: "" }))
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      alert("Erro ao atualizar perfil!")
    }
  }

  const handleCancel = () => {
    if (originalData) setFormData({ ...originalData, newPassword: "", confirmPassword: "" });
    setIsEditing(false)
    setShowPasswordFields(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedFile(file)

    const previewUrl = URL.createObjectURL(file)
    setProfileImage(previewUrl)
  }

  const triggerImageUpload = () => {
    document.getElementById('profile-image-upload')?.click()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 text-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-neutral-700">
          <div className="flex gap-4 items-center">
            {/* Avatar Section */}
            <div className="relative">
             {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                  <User size={32} className="text-gray-400" />
                </div>
              )}

              <button
                onClick={triggerImageUpload}
                className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 hover:bg-blue-700 transition-colors"
              >
                <Camera className="text-white w-3 h-3" />
              </button>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-1">Meu perfil</h2>
              <p className="text-gray-300"> {formData.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* aba de perfil e plano da assinatura do SaaS */}
        <div className="px-6 py-4 border-b border-neutral-700 bg-neutral-800">
          <h3 className="text-sm font-semibold text-gray-300">Info</h3>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Name */}
            <div>
              {isEditing ? (
                <>
                <div className="grid grid-cols-2 gap-3 justify-center">
                <div className="">
                <Label title="Name" />
                  <Input
                    value={formData.firstName}
                    onChange={(val) => setFormData({ ...formData, firstName: val })}
                    placeholder="First Name"
                    icon={<User size={18} />}
                  />
                </div>
                  <div>
                  <Label title="Sobrenome" />
                  <Input
                    value={formData.lastName}
                    onChange={(val) => setFormData({ ...formData, lastName: val })}
                    placeholder="Last Name"
                    icon={<User size={18} />}
                  />
                  </div>
                  </div>
                </>
              ) : (
              <div className=" grid grid-cols-2 gap-6">
                <div> 
                  <Label title="Name" />
                  <p className="text-gray-300">• {formData.firstName} {formData.lastName}</p>
                </div>

                <div> 
                  <Label title="E-Mail" />
                <p className="text-gray-300"> {formData.email}</p>
                </div>
              </div>
              )}
            </div>
          <div className=" grid grid-cols-2 gap-6">
            {/* Job Title */}
            <div>
              <Label title="Cargo do Trabalho" />
              {isEditing ? (
                <Input
                  value={formData.jobTitle}
                  onChange={(val) => setFormData({ ...formData, jobTitle: val })}
                  placeholder="Cargo"
                  icon={<Briefcase size={18} />}
                />
              ) : (
                <p className="text-gray-300">• {formData.jobTitle}</p>
              )}
            </div>

            {/* Salary */}
            <div>
              <Label title="Renda Mensal" />
              {isEditing ? (
                <Input
                  type="money"
                  value={formData.salary}
                  onChange={(val) => setFormData({ ...formData, salary: Number(val) })}
                  placeholder="adicione seu ultimo salario aqui"
                  icon={<Briefcase size={18} />}
                />

              ) : (
                <p className="text-gray-300">{formatCurrency(formData.salary)}</p>
              )}
            </div>
          </div>

            {/* Password Section */}
            <div>
              <div className="flex items-center gap-2 ">
                {!showPasswordFields && isEditing && (
                  <>
                  <Label title="Senha" />
                  <button
                    onClick={() => setShowPasswordFields(true)}
                    className="text-sm justify-center text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Alterar a senha
                  </button>
                  </>
                )}
              </div>

              {showPasswordFields && isEditing && (
                <div className="space-y-3">
                  <Label title="Nova senha" />
                   <button
                    onClick={() => setShowPasswordFields(false)}
                    className="text-sm text-center justify-center text-blue-400 hover:text-blue-300 transition-colors flex gap-2"
                  >
                    <ArrowLeft />
                    Voltar
                  </button>
                  <Input
                    type="password"
                    value={formData.newPassword}
                    onChange={(val) => setFormData({ ...formData, newPassword: val })}
                    placeholder="Nova senha"
                    icon={<Lock size={18} />}
                    showPasswordToggle
                  />
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(val) => setFormData({ ...formData, confirmPassword: val })}
                    placeholder="Repita a senha"
                    icon={<Lock size={18} />}
                    showPasswordToggle
                  />
                </div>
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
                className="px-4 py-2 text-gray-300 border border-gray-600 rounded-md hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Reusable label component
function Label({ title }: { title: string }) {
  return (
    <h3 className="text-sm font-semibold text-white mb-2 ">{title}
    </h3>
  )
}

// Hook para modal
export function useProfileModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<any>(null)

  const openModal = (profile: any) => {
    setSelectedProfile(profile)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProfile(null)
  }

  return {
    isModalOpen,
    selectedProfile,
    openModal,
    closeModal
  }
}