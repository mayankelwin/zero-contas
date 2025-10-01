"use client"
import { User, Mail, MapPin, Calendar } from "lucide-react"
import { InfoItem } from "./InfoItem"

export function BioSection({ profile }: { profile: any }) {
  return (
    <div className="bg-[#1E1F24] rounded-3xl p-8 border border-gray-700/50 space-y-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <User className="text-violet-400" size={24} />
        Informações Pessoais
      </h3>
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
        <h4 className="text-white font-semibold mb-3">Bio</h4>
        <p className="text-gray-300 text-sm leading-relaxed">{profile.bio}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <InfoItem icon={Mail} label="Email" value={profile.email} />
        <InfoItem icon={MapPin} label="Localização" value={profile.location} />
        <InfoItem icon={Calendar} label="Membro desde" value={profile.joinDate} />
      </div>
    </div>
  )
}
