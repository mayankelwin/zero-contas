import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { login, register, loginWithGoogle } from "./../lib/auth"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"

export type AuthMode = "login" | "register"

interface AuthForm {
  username: string
  email: string
  password: string
}

export const useAuth = () => {
  const [mode, setMode] = useState<AuthMode>("login")
  const [form, setForm] = useState<AuthForm>({ username: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null) // <- Aqui

  const router = useRouter()

  // Escuta mudanças no usuário autenticado
  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })

    return () => unsubscribe()
  }, [])

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login")
    setForm({ username: "", email: "", password: "" })
    setError(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      let userCredential = null
      if (mode === "login") {
        userCredential = await login(form.email, form.password)
      } else {
        userCredential = await register(form.email, form.password, form.username)
      }

      if (userCredential) {
        setUser(userCredential) // <- Atualiza estado
        router.push("/home")
      }

      return userCredential
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro")
      console.error(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError(null)

    try {
      const userCredential = await loginWithGoogle()

      if (userCredential) {
        setUser(userCredential) // <- Atualiza estado
        router.push("/home")
      }

      return userCredential
    } catch (err: any) {
      setError(err.message || "Erro no login com Google")
      console.error(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    mode,
    form,
    user, // <- RETORNANDO O USER AQUI!
    loading,
    error,
    toggleMode,
    handleChange,
    handleSubmit,
    handleGoogleAuth,
  }
}
