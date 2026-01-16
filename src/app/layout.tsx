import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import { Montserrat } from "next/font/google"
import { ToastContainer } from 'react-toastify'

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
    <html className={`${montserrat.variable}`}>
      <body className="relative">
        <div className="">
          <AuthProvider>{children}
            <ToastContainer 
              position="top-right" 
              autoClose={3000} 
              hideProgressBar={false} 
              newestOnTop 
              closeOnClick 
              rtl={false} 
              pauseOnFocusLoss 
              draggable 
              pauseOnHover
            />
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}
