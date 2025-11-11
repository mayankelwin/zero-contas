"use client"
import { User, Briefcase, MapPin, Edit3 } from "lucide-react"

interface UserCardProps {
  userProfile: any
  onEdit: () => void
}

export function UserCard({ userProfile, onEdit }: UserCardProps) {
  return (
    <div className="bg-[#1E1F24] rounded-3xl p-8 border border-gray-700/50 shadow-2xl text-center">
      {/* Avatar */}
      <div className="relative inline-block mb-6">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 p-1">
          <img
            src={userProfile?.profileImage ?? "/avatar.png"}
            alt={userProfile?.name || "Usuário"}
            className="w-full h-full rounded-full object-cover border-4 border-[#1E1F24]"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-green-400/80 rounded-full p-2 shadow-lg">
          <User size={16} className="text-white" />
        </div>
      </div>

      {/* Info */}
      <h2 className="text-2xl font-bold text-white mb-2">{userProfile.name}</h2>
      <div className="flex items-center justify-center gap-2 text-violet-400 mb-2">
        <Briefcase size={16} />
        <span className="font-semibold">{userProfile.role}</span>
      </div>
      <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
        <MapPin size={14} />
        <span className="text-sm">{userProfile.location}</span>
      </div>

      <button
        onClick={onEdit}
        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-3 transition-transform duration-300  shadow-lg"
      >
        <Edit3 size={18} />
        Editar Perfil
      </button>
    </div>
  )
}
