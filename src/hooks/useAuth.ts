import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { login, register, loginWithGoogle } from "./../lib/auth"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { createUserProfile } from "../lib/createUserProfile"
import { toast } from "react-toastify"
import { FirebaseError } from "firebase/app"

export type AuthMode = "login" | "register"

interface AuthForm {
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
  salary: number
  paymentdate: number,
  paymentOption: string 
}

export const useAuth = () => {
  const [mode, setMode] = useState<AuthMode>("login")
  const [form, setForm] = useState<AuthForm>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    salary: 0,
    paymentdate: 0,
    paymentOption: "" 
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userLoaded, setUserLoaded] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setUserLoaded(true)
    })

    return () => unsubscribe()
  }, [])

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login")
    setForm({ 
      username: "", 
      firstName: "",
      lastName: "", 
      email: "", 
      password: "", 
      salary: 0, 
      paymentdate: 0,
      paymentOption: "",
     })
    setError(null)
  }

  const handleChange = (name: keyof AuthForm, value: string | number | Date | null) => {
  setForm(prevForm => {
    const updatedForm = { ...prevForm, [name]: value };

    // Atualiza o username automaticamente se for firstName ou lastName
    if (name === "firstName" || name === "lastName") {
      updatedForm.username = `${updatedForm.firstName} ${updatedForm.lastName}`.trim();
    }

    return updatedForm;
  });
};


  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      let userCredential = null;

      if (mode === "login") {
        userCredential = await login(form.email, form.password);
        toast.success(`Login realizado com sucesso, ${form.firstName || "usuário"}!`);
      } else {
        userCredential = await register(form.email, form.password, form.username, form.salary);

        if (userCredential) {
          await createUserProfile(userCredential, {
            email: form.email,
            username: form.username,
            firstName: form.firstName,
            lastName: form.lastName,
            salary: form.salary,
            paymentdate: form.paymentdate,
            paymentOption: form.paymentOption,
            planStatus: "inactive",
            role: "free",
            createdAt: new Date()
          });
          toast.success(`Conta criada com sucesso, ${form.firstName}!`);
        }
      }

      if (userCredential) {
        await router.push("/home");
        setLoading(false);
      } else {
        setLoading(false); 
      }

      return userCredential;

    } catch (err: any) {
      console.error(err);

      let message = "Ocorreu um erro inesperado.";

      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/email-already-in-use":
            message = "Este e-mail já está em uso. Faça login ou use outro e-mail.";
            break;
          case "auth/invalid-email":
            message = "E-mail inválido.";
            break;
          case "auth/weak-password":
            message = "Senha muito fraca. Use ao menos 6 caracteres.";
            break;
        }
      } else if (err.message) {
        message = err.message;
      }

      toast.error(message);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError(null)

    try {
      const userCredential = await loginWithGoogle()

      if (userCredential) {
        await createUserProfile(userCredential)
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

  const authValue = useMemo(() => ({
    mode,
    form,
    user,
    loading,
    error,
    userLoaded,
    toggleMode,
    handleChange,
    handleSubmit,
    handleGoogleAuth,
  }), [mode, form, user, loading, error, userLoaded])

  return authValue
}