import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import { Orbitron, Montserrat } from "next/font/google"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
})

export const metadata = {
  title: "Zero Contas",
  description: "Gerencie sua vida financeira com metas, gastos e controle.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable}`}>
      <body className="relative">
        {/* Faixa de homologação */}
        <div className="fixed  w-full bg-red-600 opacity-50 text-white text-center  font-semibold z-100 shadow-md">
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
