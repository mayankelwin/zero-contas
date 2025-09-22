'use client'

import Header from "@/src/components/Header";
import Sidebar from "@/src/components/Sidebar";
import AddButton from "@/src/components/AddButton";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading || !user) return <div className="p-8">Carregando...</div>

  const handleAddBook = () => {
    router.push('/add')
    console.log("Adicionar novo livro")
  }

  return (
    <div className="flex h-screen relative">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="p-6">
          {/* Conteúdo da Home / livros */}
        </div>
      </main>

      {/* Botão de adicionar livro fixo */}
      <AddButton onClick={handleAddBook} />
    </div>
  )
}
