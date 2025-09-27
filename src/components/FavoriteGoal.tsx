import { formatCurrency } from "@/src/utils/formatCurrency"

interface FavoriteGoalProps {
  goal: any
  onOpenModal: (goal: any) => void
}

export default function FavoriteGoal({ goal, onOpenModal }: FavoriteGoalProps) {
  const percent = Math.min((goal.savedAmount / goal.goalValue) * 100, 100)

  return (
    <div className="mt-6 bg-[#1E1F24] p-6 rounded-3xl shadow-md w-full flex flex-col gap-4 border border-[#3B3C44]">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">{goal.goalName}</h3>
        <p className="text-gray-300 font-medium">
          {`${formatCurrency(goal.savedAmount)} / ${formatCurrency(goal.goalValue)}`}
        </p>
      </div>
      <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden mt-2">
        <div
          className="h-full bg-purple-700 rounded-full transition-all duration-700 ease-in-out"
          style={{ width: `${percent}%` }}
        />
        <span className="absolute right-2 top-0 text-xs font-medium text-gray-200">{`${Math.floor(percent)}%`}</span>
      </div>
      <button
        onClick={() => onOpenModal(goal)}
        className="mt-4 px-5 py-2 bg-gray-600 text-gray-100 font-semibold rounded-xl shadow-sm hover:bg-gray-500 transition-all"
      >
        Adicionar / Remover
      </button>
    </div>
  )
}
