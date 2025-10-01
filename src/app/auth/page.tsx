"use client";

import { Input } from "@/src/components/Input";
import { SelectComponent } from "@/src/components/Select";
import { useAuth } from "@/src/hooks/useAuth"; 
import { Calendar, Check } from "lucide-react";
import DatePicker from "react-datepicker";
import { useState } from "react";
import Image from "next/image";

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register" && !agreedToTerms) return;
    await handleSubmit();
  };


  return (
    <div className="flex transition-all w-full h-full duration-500 p-10 justify-center items-center">
    <div className={`flex w-full h-200 transition-all duration-500  ${
        mode === "login" ? "flex-row" : "flex-row-reverse"
      }`}>
        
      {/* Lado da Imagem */}
      <div className="w-1/2 hidden lg:flex rounded-2xl relative overflow-hidden bg-gray-900">
      
          <div className="w-full hidden lg:flex relative">
            <Image
              src="/img/praia.jpg"
              alt="Imagem de fundo"
              fill
              className="object-cover w-full h-full opacity-70"
              priority
            />
        </div>
      </div>

      {/* Lado do Formulário */}
      <div className="w-full lg:w-1/2 rounded-2xl flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          {mode === "login" ? (
            /* FORMULÁRIO DE LOGIN */
            <div className="space-y-8">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Entrar</h1>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <form onSubmit={onSubmit} className="space-y-6">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Seu e-mail"
                    value={form.email}
                    onChange={(v) => handleChange("email", v)}
                    required
                    icon={null}
                  />

                  <Input
                    type="password"
                    name="password"
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

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">ou</span>
                  </div>
                </div>

                <div className="space-y-3">

                  <button
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 py-3 px-4 rounded-lg transition-colors disabled:opacity-50 hover:cursor-pointer"
                  >
                      <img
                      src="https://www.svgrepo.com/show/355037/google.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      Entrar com Google
                    </span>
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    Não tem conta?{" "}
                    <button
                      onClick={toggleMode}
                      className="text-blue-600 hover:underline font-medium hover:cursor-pointer"
                    >
                      Registrar
                    </button>
                  </p>
              </div>
            ) : (
              /* FORMULÁRIO DE REGISTRO */
              <div className="space-y-2">
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Criar uma conta
                  </h1>
                  
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <form onSubmit={onSubmit} className="space-y-6 gap-2 grid grid-cols-2">
                  <Input
                    label="Primeiro nome"
                    type="text"
                    name="firstName"
                    value={form.firstName || ""}
                    onChange={(v) => handleChange("firstName", v)}
                    placeholder="Primeiro nome"
                    required
                    icon={null}
                  />
                  <Input
                    label="Sobrenome"
                    type="text"
                    name="lastName"
                    value={form.lastName || ""}
                    onChange={(v) => handleChange("lastName", v)}
                    placeholder="Sobrenome"
                    required
                    icon={null}
                  />
                  <Input
                    label="E-mail"
                    type="email"
                    name="email"
                    placeholder="Seu e-mail"
                    value={form.email}
                    onChange={(v) => handleChange("email", v)}
                    required
                    icon={null}
                  />
                  <Input
                    label="Senha"
                    type="password"
                    name="password"
                    placeholder="Crie uma senha"
                    value={form.password}
                    onChange={(v) => handleChange("password", v)}
                    required
                    icon={null}
                    showPasswordToggle
                  />
                  <Input
                    label="Dia do salário"
                    type="number"
                    name="paymentdate"
                    placeholderText="Digite apenas o dia"
                    value={form.paymentdate}
                    onChange={(v) => handleChange("paymentdate", Number(v))}
                    required
                    icon={null}
                  />
                  <SelectComponent
                    label="Frequência de pagamento"
                    value={form.paymentOption}
                    onChange={(v) => handleChange("paymentOption", v)}
                    options={[
                      { id: "1", name: "5º dia útil do mês (Mensal)" },
                      { id: "2", name: "Quinzena (recebe a cada 15 dias)" }
                    ]}
                    placeholder="Selecione a frequência"
                    required
                  />
                  <Input
                    label="Salário"
                    type="money"
                    name="salary"
                    value={form.salary}
                    onChange={(v) => handleChange("salary", Number(v))}
                    placeholder="Seu salário"
                    required
                    icon={null}
                  />

                  {/* Checkbox */}
                  <div className="flex items-start gap-3 w-full col-span-2">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                    <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                      Eu concordo com os <span className="font-semibold">Termos & Condições</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !agreedToTerms}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 hover:cursor-pointer col-span-2"
                  >
                    {loading ? "Criando conta..." : "Criar conta"}
                  </button>
                </form>


                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">ou registre-se com</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 py-3 px-4 rounded-lg transition-colors disabled:opacity-50 hover:cursor-pointer"
                >
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Google</span>
                </button>

              <p className="text-gray-600 dark:text-gray-400">
                  Já tem uma conta?{" "}
                  <button
                    onClick={toggleMode}
                    className="text-blue-600 hover:underline font-medium hover:cursor-pointer"
                  >
                    Entrar
                  </button>
                </p>
            </div>
          )}
        </div>
      </div>
    </div>

    </div>
  );
}