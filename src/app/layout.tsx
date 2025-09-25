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
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
