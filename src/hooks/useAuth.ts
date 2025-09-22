import { useState } from "react";
import { useRouter } from "next/navigation"; // <--- import do App Router
import { login, register, loginWithGoogle } from './../lib/auth';

export type AuthMode = "login" | "register";

interface AuthForm {
  username: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<AuthForm>({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // hook do App Router

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setForm({ username: "", email: "", password: "" });
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      let user = null;
      if (mode === "login") {
        user = await login(form.email, form.password);
        console.log("Usuário logado:", user);
      } else {
        user = await register(form.email, form.password, form.username);
        console.log("Usuário registrado:", user);
      }

      // Redireciona para home se o login/registro tiver sucesso
      if (user) router.push('/home');

      return user;
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await loginWithGoogle();
      console.log("Usuário logado com Google:", user);

      if (user) router.push('/home');
      return user;
    } catch (err: any) {
      setError(err.message || "Erro no login com Google");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    mode,
    form,
    loading,
    error,
    toggleMode,
    handleChange,
    handleSubmit,
    handleGoogleAuth,
  };
};
