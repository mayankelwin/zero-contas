"use client";

import { useAuth } from "@/src/hooks/useAuth"; 
import { useState } from "react";

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
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background dark:bg-background-dark transition-colors">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-lg p-8 border border-border dark:border-border-dark">
        <h1 className="text-2xl font-bold text-center mb-4 text-text dark:text-text-light">
          {mode === "login" ? "Entrar" : "Registrar"}
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "register" && (
            <input
              type="text"
              name="username"
              placeholder="Nome de usuário"
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />

         <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Senha"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              {showPassword ? (
                // Olho fechado moderno
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0112 19c-5.52 0-10-4.48-10-10 0-2.21.72-4.25 1.94-5.94" />
                  <path d="M1 1l22 22" />
                  <path d="M9.88 9.88a3 3 0 014.24 4.24" />
                </svg>
              ) : (
                // Olho aberto moderno
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-2 font-medium transition-colors disabled:opacity-50 hover:cursor-pointer"
          >
            {loading
              ? mode === "login"
                ? "Entrando..."
                : "Registrando..."
              : mode === "login"
              ? "Entrar"
              : "Registrar"}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></div>
          <span className="text-sm text-gray-500">ou</span>
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></div>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg border hover:cursor-pointer border-gray-300 dark:border-gray-600 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {mode === "login" ? "Entrar com Google" : "Registrar com Google"}
          </span>
        </button>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button
            onClick={toggleMode}
            className="text-blue-600 hover:underline font-medium hover:cursor-pointer"
          >
            {mode === "login" ? "Registrar" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}
