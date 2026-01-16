"use client";

import { Input } from "@/src/components/ui/Input";
import { SelectComponent } from "@/src/components/ui/Select";
import { useAuth } from "@/src/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import TermsModal from "@/src/components/modal/TermsModal";

export default function AuthPage() {
  const {
    mode,
    form,
    loading,
    error,
    toggleMode,
    handleChange,
    handleSubmit,
    handleGoogleAuth,
  } = useAuth();

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register" && !agreedToTerms) return;
    await handleSubmit();
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full bg-[#111] flex flex-row"
      >
        <div className={`hidden lg:block lg:w-1/2 h-full relative overflow-hidden transition-all duration-700 ease-in-out ${mode === "login" ? "order-1" : "order-2"}`}>
          <Image
            src="/img/praia.jpg"
            alt="Fundo"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none mb-2">
              Controle Total <br /> <span className="text-blue-500">Na palma da mão.</span>
            </h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Finanças Inteligentes</p>
          </div>
        </div>

        <div className={`w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-8 md:p-12 lg:p-20 bg-[#111] ${mode === "login" ? "order-2" : "order-1"}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
              transition={{ duration: 0.4 }}
              className="max-w-md w-full flex flex-col justify-center h-full" 
            >
              <div className="mb-8">
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  {mode === "login" ? "Entrar" : "Criar Conta"}
                </h1>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                  {mode === "login" ? "Seja bem-vindo de volta" : "Comece a gerenciar seu futuro"}
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black p-4 rounded-lg mb-6 text-center uppercase">
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-5">
                {mode === "register" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="NOME" placeholder="Nome" value={form.firstName || ""} onChange={(v) => handleChange("firstName", v)} required />
                    <Input label="SOBRENOME" placeholder="Sobrenome" value={form.lastName || ""} onChange={(v) => handleChange("lastName", v)} required />
                  </div>
                )}

                <Input label="EMAIL" type="email" placeholder="seu@email.com" value={form.email} onChange={(v) => handleChange("email", v)} required />
                <Input label="SENHA" type="password" placeholder="••••••••" value={form.password} onChange={(v) => handleChange("password", v)} required showPasswordToggle />

                {mode === "register" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="DIA SALÁRIO" type="number" value={form.paymentdate ? String(form.paymentdate) : ""} onChange={(v) => handleChange("paymentdate", Number(v))} required />
                      <Input label="SALÁRIO" type="money" value={form.salary ? String(form.salary) : ""} onChange={(v) => handleChange("salary", Number(v))} required />
                    </div>
                    <SelectComponent 
                      label="FREQUÊNCIA" 
                      value={form.paymentOption} 
                      onChange={(v) => handleChange("paymentOption", v)} 
                      options={[{ id: "1", name: "Mensal" }, { id: "2", name: "Quinzena" }]} 
                    />
                    <div className="flex items-start gap-3 py-2">
                      <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600" />
                      <label htmlFor="terms" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                        Eu concordo com os <button type="button" onClick={() => setShowTermsModal(true)} className="text-blue-500 underline">Termos & Condições</button>
                      </label>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading || (mode === "register" && !agreedToTerms)}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-blue-600/20"
                >
                  {loading ? "Processando..." : mode === "login" ? "Acessar Plataforma" : "Criar minha conta"}
                </button>
              </form>

              <div className="space-y-6 mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="px-2 bg-[#111] text-gray-600">ou continuar com</span></div>
                </div>

                <button
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 py-3.5 px-4 rounded-lg transition-colors disabled:opacity-50 hover:cursor-pointer"
                >
                  <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">Acessar com Google</span>
                </button>
              </div>

              <div className="text-center mt-10">
                <button
                  onClick={toggleMode}
                  className="text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  {mode === "login" ? "Não tem uma conta ainda? " : "Já possui uma conta? "}
                  <span className="text-blue-500 ml-1 underline underline-offset-4">{mode === "login" ? "Registrar-se" : "Fazer Login"}</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
}