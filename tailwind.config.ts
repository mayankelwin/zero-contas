import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F0EEE2", // fundo claro
          dark: "#1E1E1E",    // fundo escuro (exemplo)
        },
        text: {
          DEFAULT: "#1C1C1C", // texto padrão
          light: "#FFFFFF",   // texto claro (dark mode)
        },
        primary: {
          DEFAULT: "#2563EB", // azul principal
          hover: "#1D4ED8",
        },
        border: {
          DEFAULT: "#D6D3CE",
          dark: "#333333",
        },
      },
    },
  },
  darkMode: "class", // permite alternar light/dark manualmente
  plugins: [],
};

export default config;
