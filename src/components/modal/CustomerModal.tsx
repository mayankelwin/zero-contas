"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import {
  X, User, Briefcase, Lock, Camera, 
  ArrowLeft, ShieldCheck, Wallet, Save, Edit3
} from "lucide-react"
import { Input } from "../ui/Input"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { formatCurrency } from '@/src/utils/formatCurrency'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  role: string
  jobTitle: string
  salary: number
  profileImage?: string
  newPassword?: string
  confirmPassword?: string
}

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
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    salary: 0,
    jobTitle: "",
    newPassword: "",
    confirmPassword: ""
  })

  const fetchUser = useCallback(async () => {
    if (!uid) return
    setLoading(true)
    try {
      const docRef = doc(db, "users", uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        
        const fullName = data.name || ""
        const nameParts = fullName.split(" ")
        const fName = nameParts[0] || ""
        const lName = nameParts.slice(1).join(" ") || ""

        setFormData({
          firstName: fName,
          lastName: lName,
          email: data.email || "",
          role: data.role || "free",
          salary: data.salaryConfig?.amount || 0,
          jobTitle: data.jobTitle || "",
          newPassword: "",
          confirmPassword: ""
        })
        
        if (data.profileImage) setProfileImage(data.profileImage)
      }
    } catch (error) {
      console.error("Erro ao buscar dados do Firebase:", error)
    } finally {
      setLoading(false)
    }
  }, [uid])

  useEffect(() => {
    if (isOpen && uid) {
      fetchUser()
    }
  }, [isOpen, uid, fetchUser])

  if (!isOpen) return null

  const handleSave = async () => {
    setLoading(true)
    try {
      const docRef = doc(db, "users", uid)
      let imageUrl = profileImage

      if (uploadedFile) {
        const storage = getStorage()
        const storageRef = ref(storage, `profileImages/${uid}/${Date.now()}_${uploadedFile.name}`)
        await uploadBytes(storageRef, uploadedFile)
        imageUrl = await getDownloadURL(storageRef)
      }

      const dataToUpdate = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        role: formData.role,
        "salaryConfig.amount": Number(formData.salary),
        jobTitle: formData.jobTitle,
        profileImage: imageUrl
      }

      await updateDoc(docRef, dataToUpdate)
      setIsEditing(false)
      setUploadedFile(null)
      alert("Terminal de Identidade Atualizado.")
    } catch (error) {
      console.error("Erro ao salvar:", error)
      alert("Erro ao sincronizar dados.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setProfileImage(URL.createObjectURL(file))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-500">
      <div className="bg-[#0a0a0a] border border-white/10 text-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]">
        
        <div className="relative p-10 border-b border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-transparent">
          <div className="flex justify-between items-center">
            <div className="flex gap-8 items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-[#161618] border border-white/10 overflow-hidden shadow-2xl">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                        <User size={40} className="text-white/10" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-white text-black p-2.5 rounded-2xl hover:scale-110 active:scale-90 transition-all shadow-xl"
                  >
                    <Camera size={16} strokeWidth={3} />
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3">
                  <ShieldCheck size={12} /> {formData.role || "User"} Account
                </span>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
                  Core <span className="text-white/20 tracking-normal not-italic font-medium">Settings</span>
                </h2>
              </div>
            </div>

            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors group">
              <X size={24} className="text-white/20 group-hover:text-white" />
            </button>
          </div>
        </div>

        <div className="p-10 space-y-10 overflow-y-auto max-h-[55vh] custom-scrollbar">
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-4">
              <Label title="Nome de Registro" />
              {isEditing ? (
                <Input
                  value={formData.firstName}
                  onChange={(val) => setFormData({ ...formData, firstName: val })}
                  placeholder="Nome"
                />
              ) : (
                <p className="text-xl font-black tracking-tight">{formData.firstName || "---"}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label title="Sobrenome" />
              {isEditing ? (
                <Input
                  value={formData.lastName}
                  onChange={(val) => setFormData({ ...formData, lastName: val })}
                  placeholder="Sobrenome"
                />
              ) : (
                <p className="text-xl font-black tracking-tight">{formData.lastName || "---"}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/[0.03]">
            <div className="space-y-4">
              <Label title="Designação / Cargo" />
              {isEditing ? (
                <Input
                  value={formData.jobTitle}
                  onChange={(val) => setFormData({ ...formData, jobTitle: val })}
                  placeholder="Cargo"
                  icon={<Briefcase size={16} />}
                />
              ) : (
                <p className="text-xs font-black uppercase tracking-widest text-white/40">{formData.jobTitle || "Not Assigned"}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label title="Compensação Mensal" />
              {isEditing ? (
                <Input
                  type="money"
                  value={formData.salary.toString()} 
                  onChange={(val) => setFormData({ ...formData, salary: Number(val) })}
                  icon={<Wallet size={16} />}
                />
              ) : (
                <p className="text-lg font-black text-emerald-500 tabular-nums">{formatCurrency(formData.salary)}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="pt-10 border-t border-white/[0.03] space-y-6">
              {!showPasswordFields ? (
                <button
                  onClick={() => setShowPasswordFields(true)}
                  className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10">
                    <Lock size={14} />
                  </div>
                  Redefinir Chaves de Acesso
                </button>
              ) : (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-end">
                    <Label title="Novas Credenciais" />
                    <button 
                        onClick={() => setShowPasswordFields(false)} 
                        className="text-[9px] font-black uppercase tracking-widest text-red-500/50 hover:text-red-500 transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft size={12} /> Abortar
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <Input
                      type="password"
                      value={formData.newPassword || ""}
                      onChange={(val) => setFormData({ ...formData, newPassword: val })}
                      placeholder="Nova Senha"
                      showPasswordToggle
                    />
                    <Input
                      type="password"
                      value={formData.confirmPassword || ""}
                      onChange={(val) => setFormData({ ...formData, confirmPassword: val })}
                      placeholder="Confirmar"
                      showPasswordToggle
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer do Modal */}
        <div className="p-10 bg-white/[0.02] border-t border-white/[0.05] flex justify-end items-center gap-6">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                disabled={loading}
                onClick={handleSave}
                className="px-10 py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all duration-300 flex items-center gap-3 disabled:opacity-50"
              >
                {loading ? "Processando..." : <><Save size={16} strokeWidth={3} /> Sincronizar Dados</>}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-10 py-4 bg-[#161618] border border-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:border-white transition-all flex items-center gap-3"
            >
              <Edit3 size={16} /> Liberar Edição
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Label({ title }: { title: string }) {
  return (
    <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">{title}</h3>
  )
}

export function useProfileModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    isModalOpen,
    openModal,
    closeModal
  };
}