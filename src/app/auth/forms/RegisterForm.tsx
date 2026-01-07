import { Input } from "@/src/components/ui/Input";
import { SelectComponent } from "@/src/components/ui/Select";
import TermsModal from "@/src/components/modal/TermsModal";
import { motion } from "framer-motion";
import { useState } from "react";

interface RegisterFormProps {
  form: any;
  loading: boolean;
  error: string | null;
  handleChange: (name: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  handleGoogleAuth: () => void;
  toggleMode: () => void;
  agreedToTerms: boolean;
  setAgreedToTerms: (val: boolean) => void;
}

export function RegisterForm({
  form,
  loading,
  error,
  handleChange,
  onSubmit,
  handleGoogleAuth,
  toggleMode,
  agreedToTerms,
  setAgreedToTerms,
}: RegisterFormProps) {
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 w-full"
    >
      <div className="space-y-2">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Criar uma conta</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Primeiro nome" value={form.firstName || ""} onChange={(v) => handleChange("firstName", v)} required icon={null} />
          <Input label="Sobrenome" value={form.lastName || ""} onChange={(v) => handleChange("lastName", v)} required icon={null} />
          <Input label="E-mail" type="email" value={form.email} onChange={(v) => handleChange("email", v)} required icon={null} />
          <Input label="Senha" type="password" value={form.password} onChange={(v) => handleChange("password", v)} required icon={null} showPasswordToggle />
          <Input label="Dia do salário" type="number" value={form.paymentdate} onChange={(v) => handleChange("paymentdate", Number(v))} required icon={null} />
          <SelectComponent
            label="Frequência"
            value={form.paymentOption}
            onChange={(v) => handleChange("paymentOption", v)}
            options={[
              { id: "1", name: "5º dia útil (Mensal)" },
              { id: "2", name: "Quinzena (15 dias)" },
            ]}
            required
          />
          <div className="md:col-span-2">
             <Input label="Salário" type="money" value={form.salary} onChange={(v) => handleChange("salary", Number(v))} required icon={null} />
          </div>

          <div className="flex items-start gap-3 col-span-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
              Eu concordo com os{" "}
              <button type="button" onClick={() => setShowTermsModal(true)} className="font-semibold text-blue-600 underline">
                Termos & Condições
              </button>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !agreedToTerms}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 col-span-2"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-gray-900 text-gray-500">ou</span></div>
        </div>

        <button onClick={handleGoogleAuth} className="flex w-full items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg">
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
          <span className="text-sm font-medium">Google</span>
        </button>

        <p className="text-gray-600 dark:text-gray-400">
          Já tem uma conta?{" "}
          <button onClick={toggleMode} className="text-blue-600 hover:underline font-medium">Entrar</button>
        </p>
      </div>
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </motion.div>
  );
}