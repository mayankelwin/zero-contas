import { useState, useRef, useEffect, useCallback } from "react"
import { LucideEye, LucideEyeClosed } from "lucide-react"

interface InputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  type?: "text" | "email" | "password" | "number" | "tel" | "money" 
  icon?: React.ReactNode
  required?: boolean
  placeholder?: string
  disabled?: boolean
  error?: string
  success?: boolean
  variant?: "default" | "filled" | "outlined"
  size?: "sm" | "md" | "lg"
  showPasswordToggle?: boolean 
  allowNegative?: boolean 
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
  size = "md",
  showPasswordToggle = false,
  allowNegative = false,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsFilled(!!value)
  }, [value])

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "money") {
      const onlyNumbers = e.target.value.replace(/\D/g, "");
      const val = onlyNumbers ? parseInt(onlyNumbers) : 0;
      onChange(String(val)); 
    }
    else if (type === "number") {
      let val = e.target.value

      if (!allowNegative && val.startsWith("-")) {
        val = val.replace("-", "")
      }

      onChange(val)
    } 
    else {
      onChange(e.target.value)
    }
  }

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg"
  }

  const variantClasses = {
    default: "bg-gray-800/10 border-gray-600 focus:bg-gray-700/30",
    filled: "bg-gray-700/10 border-gray-500 focus:bg-gray-600/30",
    outlined: "bg-transparent border-gray-500 focus:bg-gray-800/20"
  }

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

  const inputType = showPasswordToggle && showPassword ? "text" : type
    function formatCentsToCurrency(value: number) {
      return (value / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    }

  function parseCurrencyToCents(value: string) {
    const numeric = value.replace(/\D/g, "")
    return Number(numeric || "0")
  }

  return (
    <div className="w-full space-y-2 relative">
      {label && (
        <label 
          className={`block text-sm font-medium transition-all duration-300
            ${error ? "text-red-400" : success ? "text-green-400" : "text-gray-300"}
            ${isFocused || isFilled ? "translate-x-1 scale-105" : ""}
          `}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div 
            className={`absolute top-1/2 left-4 -translate-y-1/2 z-10 ${iconColor} ${isFocused ? "scale-110" : ""} ${disabled ? "opacity-50" : ""}`}
          >
            {icon}
          </div>
        )}

        <input
          ref={inputRef}
          type={inputType}
          value={type === "money" ? formatCentsToCurrency(Number(value)) : value}
          onChange={(e) => {
            if (type === "money") {
              const cents = parseCurrencyToCents(e.target.value)
              onChange(String(cents)) 
            } else {
              handleInputChange(e)
            }}}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 placeholder-gray-400 text-white backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${stateClasses}
            ${icon ? "pl-12 pr-12" : "px-4"}
            transform-gpu
            ${isFocused ? "scale-[1.02]" : "scale-100"}
          `}
        />

        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <LucideEye /> : <LucideEyeClosed />}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm animate-fadeIn">
          <div className="w-1 h-1 bg-red-400 rounded-full" />
          <span>{error}</span>
        </div>
      )}

      {success && !error && (
        <div className="flex items-center gap-2 text-green-400 text-sm animate-fadeIn">
          <div className="w-1 h-1 bg-green-400 rounded-full" />
          <span>Campo válido!</span>
        </div>
      )}
    </div>
  )
}
