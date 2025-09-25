"use client"

import {
  Tv,
  Film,
  CreditCard,
  ShoppingBag,
  Music,
} from "lucide-react"
import { JSX } from "react"

const ICONS_MAP: Record<string, JSX.Element> = {
  spotify: <Music className="text-green-500" size={20} />,
  netflix: <Tv className="text-red-500" size={20} />, // substituto
  amazon: <ShoppingBag className="text-yellow-500" size={20} />,
  disney: <Film className="text-blue-400" size={20} />,
  apple: <CreditCard className="text-gray-500" size={20} />,
}

const subscriptions = [
  { id: 1, name: "Spotify", value: 19.9, nextBilling: "2025-10-01" },
  { id: 2, name: "Netflix", value: 39.9, nextBilling: "2025-10-10" },
  { id: 3, name: "Amazon Prime", value: 25.5, nextBilling: "2025-10-15" },
  { id: 4, name: "Disney+", value: 34.99, nextBilling: "2025-10-18" },
  { id: 5, name: "Hulu", value: 22.99, nextBilling: "2025-10-20" },
]

function getIcon(name: string) {
  const key = name.toLowerCase()
  return ICONS_MAP[key] ?? <CreditCard className="text-gray-400" size={20} />
}

export default function SubscriptionsCard() {
  return (
    <div className="bg-[#3A3F33] text-white rounded-xl shadow-md p-6 col-span-1 font-montserrat">
      <h3 className="text-base font-bold uppercase tracking-wider mb-4">
        Assinaturas
      </h3>

      <ul className="divide-y divide-gray-700">
        {subscriptions.map((sub) => (
          <li key={sub.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2E332B] rounded-full">
                {getIcon(sub.name)}
              </div>
              <div>
                <p className="text-sm font-semibold">{sub.name}</p>
                <p className="text-xs text-gray-400">Próx.: {sub.nextBilling}</p>
              </div>
            </div>
            <div>
              <p className="text-red-400 font-bold text-sm">
                - R$ {sub.value.toFixed(2)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
