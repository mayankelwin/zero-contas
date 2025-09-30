export function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#1A1A1A]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-full border-4 border-violet-600 border-t-transparent animate-spin"></div>
        <p className="text-gray-400 text-lg animate-pulse">
          Carregando...
        </p>
      </div>
    </div>
  )
}
