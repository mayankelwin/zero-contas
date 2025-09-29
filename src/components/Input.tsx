import { useState, useRef, useEffect } from "react"

interface InputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  type?: "text" | "email" | "password" | "number" | "tel"
  icon?: React.ReactNode
  required?: boolean
  placeholder?: string
  disabled?: boolean
  error?: string
  success?: boolean
  variant?: "default" | "filled" | "outlined"
  size?: "sm" | "md" | "lg"
}

export function Input({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  required = false, 
  icon, 
  placeholder,
  disabled = false,
  error,
  success = false,
  variant = "default",
  size = "md"
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Atualiza estado de preenchimento quando o valor muda
  useEffect(() => {
    setIsFilled(!!value)
  }, [value])

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  // Tamanhos
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg"
  }

  // Variantes
  const variantClasses = {
    default: "bg-gray-800/50 border-gray-600 focus:bg-gray-700/30",
    filled: "bg-gray-700/50 border-gray-500 focus:bg-gray-600/30",
    outlined: "bg-transparent border-gray-500 focus:bg-gray-800/20"
  }

  // Estados
  const stateClasses = error 
    ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
    : success 
    ? "border-green-500 focus:ring-green-500/20 focus:border-green-500"
    : isFocused 
    ? "border-blue-500 focus:ring-blue-500/20 focus:border-blue-500 shadow-lg shadow-blue-500/10"
    : "border-gray-600 focus:ring-blue-500/20 focus:border-blue-500"

  const iconColor = error 
    ? "text-red-400" 
    : success 
    ? "text-green-400"
    : isFocused 
    ? "text-blue-400"
    : "text-gray-400"

  return (
    <div className="w-full space-y-2">
      {/* Label animado */}
      {label && (
        <label 
          className={`
            block text-sm font-medium transition-all duration-300
            ${error ? "text-red-400" : success ? "text-green-400" : "text-gray-300"}
            ${isFocused || isFilled ? "translate-x-1 scale-105" : ""}
          `}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Container do input */}
      <div className="relative group">
        {/* Ícone */}
        {icon && (
          <div 
            className={`
              absolute top-1/2 left-4 -translate-y-1/2 
              transition-all duration-300 z-10
              ${iconColor}
              ${isFocused ? "scale-110" : ""}
              ${disabled ? "opacity-50" : ""}
            `}
          >
            {icon}
          </div>
        )}

        {/* Input principal */}
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full rounded-2xl border-2
            transition-all duration-300
            focus:outline-none focus:ring-4
            placeholder-gray-400 text-white
            backdrop-blur-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${stateClasses}
            ${icon ? "pl-12 pr-4" : "px-4"}
            
            /* Efeitos de hover */
            ${!disabled && !isFocused && `
              hover:border-gray-500 
              hover:shadow-lg hover:shadow-gray-500/5
            `}
            
            /* Animações suaves */
            transform-gpu
            ${isFocused ? "scale-[1.02]" : "scale-100"}
          `}
        />

        {/* Efeito de brilho no foco */}
        {isFocused && !error && !success && (
          <div 
            className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl -z-10 animate-pulse"
            style={{
              transform: 'scale(1.05)',
              transition: 'all 0.3s ease'
            }}
          />
        )}

        {/* Indicador de loading (opcional) */}
        {disabled && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm animate-fadeIn">
          <div className="w-1 h-1 bg-red-400 rounded-full" />
          <span>{error}</span>
        </div>
      )}

      {/* Mensagem de sucesso */}
      {success && !error && (
        <div className="flex items-center gap-2 text-green-400 text-sm animate-fadeIn">
          <div className="w-1 h-1 bg-green-400 rounded-full" />
          <span>Campo válido!</span>
        </div>
      )}

      {/* Contador de caracteres (opcional para alguns casos) */}
      {type === "text" && value.length > 0 && (
        <div className="flex justify-between text-xs text-gray-400">
          <span>{value.length} caracteres</span>
          {value.length > 50 && (
            <span className="text-yellow-400">⚠️ Muito longo</span>
          )}
        </div>
      )}
    </div>
  )
}

// 🔥 EXTRA: Componente de Input com máscara para moeda
interface CurrencyInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  value: string
  onChange: (value: string) => void
}

export function CurrencyInput({ value, onChange, ...props }: CurrencyInputProps) {
  const formatCurrency = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Formata como moeda brasileira
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(numbers) / 100)

    return formatted
  }

  const handleChange = (rawValue: string) => {
    // Remove formatação para salvar apenas números
    const numbers = rawValue.replace(/\D/g, '')
    onChange(numbers)
  }

  return (
    <Input
      {...props}
      value={formatCurrency(value)}
      onChange={handleChange}
      type="text"
      icon={<DollarSign size={18} />}
    />
  )
}

// 🔥 EXTRA: Componente de Input de busca
export function SearchInput(props: InputProps) {
  return (
    <Input
      {...props}
      icon={<Search size={18} />}
      placeholder={props.placeholder || "Buscar..."}
      variant="outlined"
    />
  )
}

// Ícones auxiliares (importar do lucide-react)
function DollarSign(props: any) { return <div>💰</div> } // Substituir pelo ícone real
function Search(props: any) { return <div>🔍</div> } // Substituir pelo ícone real