import { useState, useEffect } from "react"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { Target, Sparkles, Trophy, Star, Zap, Heart } from "lucide-react"

interface FavoriteGoalProps {
  goal: any
  onOpenModal: (goal: any) => void
}

// Frases motivacionais aleatórias
const motivationalPhrases = [
  "🌟 Cada passo te aproxima do seu sonho!",
  "💪 Você está mais perto do que imagina!",
  "🚀 Continue assim, o sucesso é inevitável!",
  "🎯 Foco e determinação são suas armas!",
  "🔥 Incrível! Seu progresso inspira!",
  "💎 Pequenos passos levam a grandes conquistas!",
  "🌈 Seu futuro self agradece esse esforço!",
  "⚡ A persistência transforma sonhos em realidade!",
  "🏆 Você está construindo seu legado!",
  "✨ A jornada é tão importante quanto o destino!",
  "💖 Seu comprometimento é admirável!",
  "🎉 Celebre cada conquista, por menor que seja!"
]

// Ícones para diferentes níveis de progresso
const getProgressIcon = (percent: number) => {
  if (percent >= 100) return <Trophy className="w-6 h-6 text-yellow-400" />
  if (percent >= 80) return <Sparkles className="w-6 h-6 text-purple-400" />
  if (percent >= 50) return <Star className="w-6 h-6 text-yellow-400" />
  if (percent >= 25) return <Zap className="w-6 h-6 text-blue-400" />
  return <Heart className="w-6 h-6 text-pink-400" />
}

// Cores da barra baseado no progresso
const getProgressColor = (percent: number) => {
  if (percent >= 100) return "bg-gradient-to-r from-green-400 to-green-600"
  if (percent >= 80) return "bg-gradient-to-r from-yellow-500 to-yellow-700"
  if (percent >= 50) return "bg-gradient-to-r from-blue-500 to-blue-700"
  if (percent >= 25) return "bg-gradient-to-r from-violet-500 to-violet-700"
  return "bg-gradient-to-r from-purple-500 to-purple-700"
}

// Efeitos especiais baseado no progresso
const getProgressEffect = (percent: number) => {
  if (percent >= 100) return "shadow-lg shadow-yellow-400/50"
  if (percent >= 80) return "shadow-lg shadow-purple-400/50"
  if (percent >= 50) return "shadow-lg shadow-green-400/30"
  return ""
}

export default function FavoriteGoal({ goal, onOpenModal }: FavoriteGoalProps) {
  const [displayPercent, setDisplayPercent] = useState(0)
  const [animatedValue, setAnimatedValue] = useState(0)
  const [currentPhrase, setCurrentPhrase] = useState("")
  const [isCelebrating, setIsCelebrating] = useState(false)

  const actualPercent = Math.min((goal.savedAmount / goal.goalValue) * 100, 100)
  const isGoalCompleted = actualPercent >= 100

  // Animação da barra de progresso
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayPercent(actualPercent)
    }, 100)

    return () => clearTimeout(timer)
  }, [actualPercent])

  // Animação do valor salvo
  useEffect(() => {
    let start = 0
    const end = goal.savedAmount
    const duration = 1500
    const incrementTime = 30

    const timer = setInterval(() => {
      start += end / (duration / incrementTime)
      if (start >= end) {
        setAnimatedValue(end)
        clearInterval(timer)
      } else {
        setAnimatedValue(start)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [goal.savedAmount])

  // Frase motivacional aleatória
  useEffect(() => {
    const randomPhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]
    setCurrentPhrase(randomPhrase)
  }, [goal.savedAmount])

  // Efeito de celebração quando completar a meta
  useEffect(() => {
    if (isGoalCompleted && !isCelebrating) {
      setIsCelebrating(true)
      const timer = setTimeout(() => setIsCelebrating(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isGoalCompleted])

  return (
    <div className={`mt-6 bg-[#1E1F24] p-6 rounded-3xl shadow-2xl w-full flex flex-col gap-4 border border-[#3B3C44] hover:border-[#4C4D55] transition-all duration-500 hover:shadow-2xl  ${
      isCelebrating ? 'animate-pulse shadow-yellow-400/30' : ''
    }`}>
      
      {/* Header com ícone animado */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl  transition-all duration-500 ${
            isCelebrating ? 'animate-bounce' : ''
          }`}>
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white  bg-clip-text text-transparent">
            {goal.goalName}
          </h3>
          {/* Frase motivacional - só mostra se não estiver completado */}
          {!isGoalCompleted && (
            <div className="text-center ml-6">
              <p className="text-sm font-medium text-gray-300 animate-pulse">
                {currentPhrase}
              </p>
            </div>
          )}
        </div>
        {getProgressIcon(displayPercent)}
      </div>

      {/* Barra de progresso com animação */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">
              {formatCurrency(Math.floor(animatedValue))}
            </span>
            <span className="text-xs text-green-400 font-semibold animate-pulse">
              ↑
            </span>
          </div>
          <span className="text-sm text-gray-400">
            de {formatCurrency(goal.goalValue)}
          </span>
        </div>

        <div className="relative h-6 bg-gray-700 rounded-2xl overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-2xl transition-all duration-1000 ease-out ${getProgressColor(actualPercent)} ${getProgressEffect(actualPercent)}`}
            style={{ width: `${displayPercent}%` }}
          />
          
          {/* Marcadores de progresso */}
          <div className="absolute inset-0 flex justify-between items-center px-2">
            {[25, 50, 75, 100].map((marker) => (
              <div
                key={marker}
                className={`w-1 h-3 rounded-full ${
                  displayPercent >= marker ? 'bg-white/80' : 'bg-gray-500/50'
                } transition-all duration-500`}
              />
            ))}
          </div>

          {/* Percentual animado */}
          <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-bold ${
            isGoalCompleted ? 'text-yellow-300 animate-pulse' : 'text-white'
          } transition-all duration-500`}>
            {Math.floor(displayPercent)}%
          </span>
        </div>
      </div>

      {/* Botão - APENAS SE A META NÃO ESTIVER COMPLETADA */}
      {!isGoalCompleted && (
        <button
          onClick={() => onOpenModal(goal)}
          className="mt-2 px-6 py-3 bg-gradient-to-r bg-violet-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:cursor-pointer hover:shadow-2xl hover:shadow-purple-500/25 active:scale-95 group"
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 group-hover:animate-spin" />
            Adicionar / Remover
            <Sparkles className="w-4 h-4 group-hover:animate-spin" />
          </span>
        </button>
      )}

      {/* Mensagem especial quando completar - MAIS DESTACADA */}
      {isGoalCompleted && (
        <div className="text-center mt-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
            <span className="text-2xl font-bold text-yellow-400 animate-pulse">
              🎉 Parabéns! 🎉
            </span>
            <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
          </div>
          <p className="text-lg font-semibold text-green-400">
            Meta "{goal.goalName}" conquistada!
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Você alcançou {formatCurrency(goal.savedAmount)} de {formatCurrency(goal.goalValue)}
          </p>
        </div>
      )}

      {/* Indicador visual de progresso - ESCONDIDO QUANDO COMPLETO */}
      {!isGoalCompleted && (
        <div className="flex justify-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((dot) => (
            <div
              key={dot}
              className={`w-1 h-1 rounded-full transition-all duration-500 ${
                displayPercent >= (dot * 20) ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}