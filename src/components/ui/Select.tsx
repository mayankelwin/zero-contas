import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, Check } from "lucide-react"

interface SelectOption {
  id: string
  name: string
  icon?: React.ReactNode
  description?: string
  disabled?: boolean
}

interface SelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  success?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "filled" | "outlined"
  searchable?: boolean
}

export function SelectComponent({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Selecione uma opção",
  required = false,
  disabled = false,
  error,
  success = false,
  size = "md",
  variant = "default",
  searchable = false
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const selectRef = useRef<HTMLDivElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)

  // Filtra opções baseado na busca
  const filteredOptions = searchable 
    ? options.filter(opt => 
        opt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  // Opção selecionada atual
  const selectedOption = options.find(opt => opt.name === value)

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Navegação com teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setHighlightedIndex(prev => 
            Math.min(prev + 1, filteredOptions.length - 1)
          )
          break
        case "ArrowUp":
          event.preventDefault()
          setHighlightedIndex(prev => Math.max(prev - 1, 0))
          break
        case "Enter":
          event.preventDefault()
          if (filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].name)
          }
          break
        case "Escape":
          setIsOpen(false)
          setSearchTerm("")
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredOptions, highlightedIndex])

  // Scroll para opção destacada
  useEffect(() => {
    if (isOpen && listboxRef.current) {
      const highlightedElement = listboxRef.current.children[highlightedIndex] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" })
      }
    }
  }, [highlightedIndex, isOpen])

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    setIsOpen(false)
    setSearchTerm("")
    setHighlightedIndex(0)
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setHighlightedIndex(0)
      if (!isOpen && searchable) {
        setTimeout(() => {
          const searchInput = document.getElementById("select-search")
          searchInput?.focus()
        }, 100)
      }
    }
  }

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
    ? "border-red-500 focus:ring-red-500/20" 
    : success 
    ? "border-green-500 focus:ring-green-500/20"
    : isOpen 
    ? "border-blue-500 focus:ring-blue-500/20 shadow-lg shadow-blue-500/10"
    : "border-gray-600 focus:ring-blue-500/20"

  const iconColor = error 
    ? "text-red-400" 
    : success 
    ? "text-green-400"
    : isOpen 
    ? "text-blue-400"
    : "text-gray-400"

  return (
    <div className="w-full space-y-2">
      {/* Label */}
      {label && (
        <label 
          className={`
            block text-sm font-medium transition-all duration-300
            ${error ? "text-red-400" : success ? "text-green-400" : "text-gray-300"}
            ${disabled ? "opacity-50" : ""}
          `}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Container principal */}
      <div ref={selectRef} className="relative">
        {/* Botão de toggle */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`
            w-full rounded-2xl border-2 text-left
            transition-all duration-300
            focus:outline-none focus:ring-4
            backdrop-blur-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${stateClasses}
            ${disabled ? "" : "hover:border-gray-500 hover:shadow-lg hover:shadow-gray-500/5"}
            ${isOpen ? "scale-[1.02] rounded-b-none border-b-0" : "scale-100"}
            flex items-center justify-between
          `}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {selectedOption?.icon && (
              <div className={`transition-colors duration-300 ${iconColor}`}>
                {selectedOption.icon}
              </div>
            )}
            <span className={`truncate ${!value ? "text-gray-400" : "text-white"}`}>
              {selectedOption ? selectedOption.name : placeholder}
            </span>
          </div>
          
          <div className={`transition-transform duration-300 ${iconColor}`}>
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div 
            className={`
              absolute top-full left-0 right-0 z-50
              bg-gray-800 border-2 border-blue-500 border-t-0
              rounded-b-2xl shadow-2xl shadow-black/30
              backdrop-blur-xl max-h-64 overflow-hidden
              animate-slideDown
            `}
          >
            {/* Campo de busca */}
            {searchable && (
              <div className="p-3 border-b border-gray-600">
                <input
                  id="select-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setHighlightedIndex(0)
                  }}
                  placeholder="Buscar..."
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Lista de opções */}
            <ul 
              ref={listboxRef}
              className="overflow-y-auto max-h-48 custom-scrollbar"
            >
              {filteredOptions.length === 0 ? (
                <li className="px-4 py-3 text-gray-400 text-center">
                  Nenhuma opção encontrada
                </li>
              ) : (
                filteredOptions.map((option, index) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => !option.disabled && handleSelect(option.name)}
                      disabled={option.disabled}
                      className={`
                        w-full px-4 py-3 text-left transition-all duration-200
                        flex items-center gap-3
                        ${option.disabled 
                          ? "opacity-50 cursor-not-allowed text-gray-500" 
                          : "hover:bg-blue-500/20 cursor-pointer"
                        }
                        ${option.name === value 
                          ? "bg-blue-500/30 text-blue-300" 
                          : "text-white"
                        }
                        ${index === highlightedIndex && !option.disabled
                          ? "bg-gray-700/50"
                          : ""
                        }
                        border-b border-gray-700/50 last:border-b-0
                      `}
                    >
                      {/* Ícone */}
                      {option.icon && (
                        <div className={`
                          transition-colors duration-300
                          ${option.name === value ? "text-blue-400" : "text-gray-400"}
                        `}>
                          {option.icon}
                        </div>
                      )}

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${option.disabled ? "text-gray-400" : ""}`}>
                          {option.name}
                        </div>
                        {option.description && (
                          <div className="text-sm text-gray-400 mt-1">
                            {option.description}
                          </div>
                        )}
                      </div>

                      {/* Checkmark para opção selecionada */}
                      {option.name === value && (
                        <Check size={16} className="text-blue-400 flex-shrink-0" />
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {/* Efeito de brilho no foco */}
        {isOpen && !error && (
          <div 
            className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl -z-10 animate-pulse"
            style={{ transform: 'scale(1.05)' }}
          />
        )}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm animate-fadeIn">
          <div className="w-1 h-1 bg-red-400 rounded-full" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

// 🔥 EXTRA: Select com grupos
interface SelectGroup {
  label: string
  options: SelectOption[]
}

interface GroupedSelectProps extends Omit<SelectProps, 'options'> {
  groups: SelectGroup[]
}

export function GroupedSelect({ groups, ...props }: GroupedSelectProps) {
  const allOptions = groups.flatMap(group => group.options)

  return (
    <Select 
      {...props}
      options={allOptions}
    />
  )
}

// 🔥 EXTRA: Select múltiplo
interface MultiSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  value: string[]
  onChange: (value: string[]) => void
}

export function MultiSelect({ value, onChange, ...props }: MultiSelectProps) {
  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      <Select 
        {...props}
        value=""
        onChange={() => {}}
      />
      
      {/* Tags das opções selecionadas */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map(selectedValue => {
            const option = props.options.find(opt => opt.name === selectedValue)
            return (
              <div
                key={selectedValue}
                className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
              >
                {option?.icon}
                <span>{option?.name}</span>
                <button
                  onClick={() => handleToggle(selectedValue)}
                  className="hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Estilos customizados para scrollbar
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`

// Adicionar estilos ao documento
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style")
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}