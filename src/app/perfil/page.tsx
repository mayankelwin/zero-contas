"use client"

import Header from "@/src/components/layout/Header"
import Sidebar from "@/src/components/layout/Sidebar"

import { collection, query, where } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { getTransactionIcon, getSubscriptionIcon } from "@/src/utils/icons"
import { useHomeLogic } from "../home/useHomeLogic"
import { useInfosGeral } from "@/src/hooks/useInfosGeral"

export default function PerfilPage() {
  const {
    user,
    loading,
  } = useHomeLogic()
  const {
    balance,
    expanse,
    expensefixes,
    goals,
    subcriptions,
  } = useInfosGeral()

  if (loading || !user) {
    return <div className="p-8">Carregando...</div>
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 ml-16 sm:ml-20">
        <Header />

        <div className="p-6 space-y-6">
          {/* Seção do Perfil */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Foto e Nome */}
            <div className="bg-zinc-900 rounded-lg p-6 flex flex-col items-center text-center">
              <img
                src="/avatar.png" 
                alt="Maria Fernanda"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-semibold text-white">{user.displayName}</h2>
              <span className="text-green-400 text-sm mt-1">Premium User</span>
            </div>

            {/* Detalhes do Perfil */}
           <div className="bg-zinc-900 rounded-lg p-6 md:col-span-2">
              <h3 className="text-white text-lg font-semibold mb-4">Bio & other details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
                <div><strong>Saldo total:</strong> R$ {balance.toFixed(2)}</div>
                <div><strong>Despesas total:</strong> R$ {expanse.toFixed(2)}</div>
                <div><strong>Despesas fixas:</strong> R$ {expensefixes.toFixed(2)}</div>
                <div><strong>Metas completas:</strong> {goals}</div>
                <div><strong>Nº de assinaturas:</strong> {subcriptions}</div>
              </div>
            </div>
          </section>

          {/* Redes Sociais */}
          <section className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Social Media</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white text-2xl hover:text-red-500"><i className="fab fa-youtube"></i></a>
              <a href="#" className="text-white text-2xl hover:text-pink-500"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white text-2xl hover:text-gray-100"><i className="fab fa-tiktok"></i></a>
            </div>
          </section>

          {/* Produções (placeholder) */}
          <section className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">My Productions</h3>
            <p className="text-gray-400 text-sm">No productions added yet.</p>
          </section>
        </div>

         
      </main>
    </div>
  )
}
