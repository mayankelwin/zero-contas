import { Input } from "@/src/components/ui/Input";
import { motion } from "framer-motion";
import { FormEvent } from "react";

interface LoginFormProps {
  form: any; 
  loading: boolean;
  error: string | null;
  handleChange: (name: any, value: any) => void; 
  onSubmit: (e: FormEvent) => Promise<void> | void;
  handleGoogleAuth: () => Promise<void> | void;
  toggleMode: () => void;
}

export function LoginForm({
  form,
  loading,
  error,
  handleChange,
  onSubmit,
  handleGoogleAuth,
  toggleMode,
}: LoginFormProps) {
  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 w-full"
    >
      <div className="space-y-8">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Entrar</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            type="email"
            placeholder="Seu e-mail"
            value={form.email}
            onChange={(v) => handleChange("email", v)}
            required
            icon={null}
          />

          <Input
            type="password"
            placeholder="Sua senha"
            value={form.password}
            onChange={(v) => handleChange("password", v)}
            required
            icon={null}
            showPasswordToggle
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 hover:cursor-pointer"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* ... restante do componente (divisor e botão Google) ... */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">ou</span>
          </div>
        </div>

        <button
          onClick={handleGoogleAuth}
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 py-3 px-4 rounded-lg transition-colors"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
          <span className="font-medium text-gray-700 dark:text-gray-200">Entrar com Google</span>
        </button>

        <p className="text-gray-600 dark:text-gray-400">
          Não tem conta?{" "}
          <button type="button" onClick={toggleMode} className="text-blue-600 hover:underline font-medium">
            Registrar
          </button>
        </p>
      </div>
    </motion.div>
  );
}