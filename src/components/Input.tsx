
export function Input({ label, type = "text", value, onChange, required = false, icon }: any) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <div className="relative">
        {icon && <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={`w-full bg-[#2E2F3B] border border-gray-600 rounded-xl px-3 py-2 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition`}
        />
      </div>
    </div>
  )
}