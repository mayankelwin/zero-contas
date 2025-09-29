import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
      sans: ['var(--font-montserrat)', 'sans-serif'],
      orbitron: ['var(--font-orbitron)', 'sans-serif'],
    },
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
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '50%': { transform: 'translateX(2px)' },
          '75%': { transform: 'translateX(-2px)' },
        },
      },
      animation: {
        shake: 'shake 0.3s ease-in-out',
      },
    },
  },
  darkMode: "class", // permite alternar light/dark manualmente
  plugins: [],
};

export default config;
