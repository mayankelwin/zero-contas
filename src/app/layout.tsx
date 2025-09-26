import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import { Orbitron, Montserrat } from "next/font/google"

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
})

export const metadata = {
  title: "Seu SaaS Financeiro",
  description: "Gerencie sua vida financeira com metas, gastos e controle.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${orbitron.variable} ${montserrat.variable}`}>
      <body className="relative">
        {/* Faixa de homologação */}
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-2 font-semibold z-50 shadow-md">
           Ambiente de Homologação - Apenas para testes 
        </div>

        {/* Conteúdo principal com padding para não ficar escondido atrás da faixa */}
        <div className="pt-10">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  )
}
